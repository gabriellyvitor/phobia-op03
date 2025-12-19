import { set_prinpal_light_distance, set_vignette_size, set_vignette_strength, spawn_spotlight } from "./light_control.js";

var popups = ["warning", "logo", "info"];
var popupsInfo = {
    "warning": {
        "image": `<img src="../../assets/images/warning.jpeg" alt="warning Icon" class="card-image">`,
        "buttonAction": "changeCard()"
    },
    "logo": {
        "image": `
            <video id="logoVideo"
                muted
                loop
                autoplay
                playsinline
                width="700">
                <source src="../../assets/videos/logo.mp4" type="video/mp4">
            </video>
        `,
        "buttonAction": "changeCard()",
    },
    "info": {
        "image": `<img src="../../assets/images/welcome.jpeg" alt="info Icon" class="card-image">`,
        "buttonAction": "startExperience()",
    }
};

var start = false;
let timerInterval = null;
let remainingTime = 180;
var difficulty = 0;
var won = false


var size_vig = 70;
let blinkTimeout = null;
let blinkingEnabled = false;

var spawnTime = [6000, 10000];

function startTimer() {
    set_vignette_strength(100);
    set_vignette_size(size_vig);

    startRandomBlinking();

    const timerEl = document.getElementById("experience-timer");
    const textEl = document.getElementById("timer-text");

    timerEl.classList.remove("hide");
    remainingTime = 180;

    updateTimerText(textEl, remainingTime);

    // Initial state
    timerEl.classList.add("easy-box", "shake-easy");
    textEl.classList.add("easy-text");

    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerText(textEl, remainingTime);

        if (remainingTime <= 120 && difficulty === 0) {
            difficulty = 1;
            spawnTime = [4000, 8000];

            textEl.classList.replace("easy-text", "medium-text");
            timerEl.classList.replace("easy-box", "medium-box");

            timerEl.classList.remove("shake-easy");
            timerEl.classList.add("shake-medium");

            size_vig = 50;
            set_vignette_size(size_vig);
        } 
        else if (remainingTime <= 60 && difficulty === 1) {
            spawnTime = [2000, 5000];
            difficulty = 2;

            textEl.classList.replace("medium-text", "hard-text");
            timerEl.classList.replace("medium-box", "hard-box");

            timerEl.classList.remove("shake-medium");
            timerEl.classList.add("shake-hard");

            size_vig = 20;
            set_vignette_size(size_vig);
        }

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;

            timerEl.classList.remove("shake-easy", "shake-medium", "shake-hard");
            textEl.textContent = "00:00";
            won = true;
            gameOver();
        }
    }, 1000);
}

function updateTimerText(el, seconds) {

    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    el.textContent = `${min}:${sec}`;
}

function startRandomBlinking() {
    blinkingEnabled = true;

    function scheduleNextBlink() {
        if (!blinkingEnabled) return;

        // Random delay between 3–8 seconds
        const delay = Math.random() * 5000 + 3000;

        blinkTimeout = setTimeout(() => {
            blinkOnce();
            scheduleNextBlink();
        }, delay);
    }

    scheduleNextBlink();
}

function animateVignette(from, to, duration, onComplete) {
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Ease in-out (creepy smooth)
        const eased = t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;

        const current = from + (to - from) * eased;
        set_vignette_size(current);

        if (t < 1) {
            requestAnimationFrame(update);
        } else if (onComplete) {
            onComplete();
        }
    }

    requestAnimationFrame(update);
}

function blinkOnce() {
    const baseSize = size_vig;

    const minSize = Math.random() < 0.4 ? 0 : Math.random() * 8 + 2;

    const closeDuration = Math.random() * 120 + 80;
    const openDuration  = Math.random() * 180 + 120;

    animateVignette(baseSize, minSize, closeDuration, () => {
        animateVignette(minSize, baseSize, openDuration);
    });
}

function stopRandomBlinking() {
    blinkingEnabled = false;
    clearTimeout(blinkTimeout);
    blinkTimeout = null;
}

function addCard(){
    var popupId = popups.shift();
    var popup = popupsInfo[popupId];
    var cardHtml = `${popup.image}
                    <button class="btn" onclick="${popup.buttonAction}">
                      <img src="../../assets/images/arrow.png" alt="Enter VR Icon" class="button-icon">
                    </button>`;
    $('#hud').append(`<div class="card zoom-in" id="${popupId}">${cardHtml}</div>`);

    const video = document.getElementById('logoVideo');
    if (video) {
        video.play().catch(err => {
            console.warn("Video autoplay blocked:", err);
        });
    }
}

function changeCard(){
    const $card = $('.card');
    let confirmSound = document.querySelector("#confirm_mixer");
    confirmSound.components.sound.playSound();

    $card.removeClass('zoom-in').addClass('zoom-out');

    setTimeout(() => {
        confirmSound.components.sound.stopSound();
    },2000);
    setTimeout(() => {
        $card.remove();
        addCard();
    }, 500);
}

function startExperience(){
    const $card = $('.card');

    let confirmSound = document.querySelector("#confirm_mixer");
    let ambientSound = document.querySelector("#ambient_mixer");
    confirmSound.components.sound.playSound();

    $card.removeClass('zoom-in').addClass('zoom-out');

    setTimeout(() => {
        confirmSound.components.sound.stopSound();
        ambientSound.components.sound.playSound();
    },2000);
    setTimeout(() => {
        $card.remove();
        $('.proprietary_ui').remove();
        startTimer();
    }, 500);
    start = true;
}

document.addEventListener("DOMContentLoaded", function () {
    addCard();
    window.changeCard = changeCard;
    window.startExperience = startExperience;
});

let spiderTimeout = null;
let spiderEntity = {};
const spiderModel = "../../assets/animations/idle/Giant_Spider_idle.glb";
const spiderLookDuration = 20000;
let spiderNumber = 0;
let spawnPoints = [{
        "name": "floor",
        "pos": {
            x: [-2.75, 2.75],
            z: [-4.75, 4.75],
            y: 0
        },
        "rot": {
            x: 0,
            y: [0, 360],
            z: 0
        },
        "constant": "y"
    },
    {
        "name": "left_wall",
        "pos": {
            x: -3,
            z: [-4.75, 4.75],
            y: [0.25, 2.75]
        },
        "rot": {
            x: [0, 360],
            y: 0,
            z: -90
        },
        "constant": "x"
    },
    {
        "name": "right_wall",
        "pos": {
            x: 3,
            z: [-4.75, 4.75],
            y: [0.25, 2.75]
        },
        "rot": {
            x: [0, 360],
            y: 0,
            z: 90
        },
        "constant": "x"
    },
    {
        "name": "back_wall",
        "pos": {
            x: [-2.75, 2.75],
            z: 5,
            y: [0.25, 2.75]
        },
        "rot": {
            x: 90,
            y: 0,
            z: [0, 360]
        },
        "constant": "z"
    },
    {
        "name": "front_wall",
        "pos": {
            x: [-2.75, 2.75],
            z: -5,
            y: [0.25, 2.75]
        },
        "rot": {
            x: -90,
            y: 0,
            z: [0, 360]
        },
        "constant": "z"
    },
    {
        "name": "ceiling",
        "pos": {
            x: [-2.75, 2.75],
            z: [-4.75, 4.75],
            y: 3
        },
        "rot": {
            x: 180,
            y: [0, 360],
            z: 0
        },
        "constant": "y"
    }
];
function spawnSpider() {
    if (!start) return;
    const player = document.getElementById("player");
    const playerPos = new THREE.Vector3();
    player.object3D.getWorldPosition(playerPos);

    const direction = new THREE.Vector3();
    player.object3D.getWorldDirection(direction);

    const scene = document.querySelector("a-scene");
    let x, y, z;
    let rot_x, rot_y, rot_z;
    let spiderPos = new THREE.Vector3();
    let dot = -1;

    let spiderSpawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];

    // Helper to check collision with existing entities (except a-plane)
    function isColliding(pos, radius = 0.5) {
        const entities = scene.querySelectorAll("a-entity:not(a-plane)");
        for (let entity of entities) {
            if (!entity.object3D) continue;
            const entityPos = new THREE.Vector3();
            entity.object3D.getWorldPosition(entityPos);
            if (pos.distanceTo(entityPos) < radius) {
                return true;
            }
        }
        return false;
    }

    let attempts = 0;
    do {
        if (spiderSpawnPoint.constant === "x") {
            x = spiderSpawnPoint.pos.x;
            z = Math.random() * (spiderSpawnPoint.pos.z[1] - spiderSpawnPoint.pos.z[0]) + spiderSpawnPoint.pos.z[0];
            y = Math.random() * (spiderSpawnPoint.pos.y[1] - spiderSpawnPoint.pos.y[0]) + spiderSpawnPoint.pos.y[0];

            rot_x = Math.random() * (spiderSpawnPoint.rot.x[1] - spiderSpawnPoint.rot.x[0]) + spiderSpawnPoint.rot.x[0];
            rot_y = spiderSpawnPoint.rot.y;
            rot_z = spiderSpawnPoint.rot.z;
        } else if (spiderSpawnPoint.constant === "z") {
            z = spiderSpawnPoint.pos.z;
            x = Math.random() * (spiderSpawnPoint.pos.x[1] - spiderSpawnPoint.pos.x[0]) + spiderSpawnPoint.pos.x[0];
            y = Math.random() * (spiderSpawnPoint.pos.y[1] - spiderSpawnPoint.pos.y[0]) + spiderSpawnPoint.pos.y[0];

            rot_x = spiderSpawnPoint.rot.x;
            rot_y = spiderSpawnPoint.rot.y;
            rot_z = Math.random() * (spiderSpawnPoint.rot.z[1] - spiderSpawnPoint.rot.z[0]) + spiderSpawnPoint.rot.z[0];
        } else if (spiderSpawnPoint.constant === "y") {
            y = spiderSpawnPoint.pos.y;
            x = Math.random() * (spiderSpawnPoint.pos.x[1] - spiderSpawnPoint.pos.x[0]) + spiderSpawnPoint.pos.x[0];
            z = Math.random() * (spiderSpawnPoint.pos.z[1] - spiderSpawnPoint.pos.z[0]) + spiderSpawnPoint.pos.z[0];

            rot_x = spiderSpawnPoint.rot.x;
            rot_y = Math.random() * (spiderSpawnPoint.rot.y[1] - spiderSpawnPoint.rot.y[0]) + spiderSpawnPoint.rot.y[0];
            rot_z = spiderSpawnPoint.rot.z;
        }
        spiderPos.set(x, y, z);

        const vectorToSpider = spiderPos.clone().sub(playerPos).normalize();
        dot = direction.dot(vectorToSpider);
        attempts++;

        // Avoid infinite loops
        if (attempts > 200) {
            console.warn("Could not find a valid spider spawn point after 200 attempts.");
            break;
        }
    } while (dot < -0.55 || isColliding(spiderPos));

    let spiderId = `spider-${spiderNumber++}`;
    spiderEntity[spiderId] = document.createElement("a-entity");
    spiderEntity[spiderId].setAttribute("gltf-model", spiderModel);
    spiderEntity[spiderId].setAttribute("position", `${x} ${y} ${z}`);
    spiderEntity[spiderId].setAttribute("rotation", `${rot_x} ${rot_y} ${rot_z}`);
    spiderEntity[spiderId].setAttribute("scale", "0.01 0.01 0.01");
    spiderEntity[spiderId].setAttribute("id", spiderId);
    spiderEntity[spiderId].setAttribute("animation-mixer", {
        src: "*",
        loop: "repeat",
        timeScale: 1
    });
    spiderEntity[spiderId].setAttribute("sound", "src: #spawned; autoplay: true; volume: 0.2, positional: true; distanceModel: linear; maxDistance: 10; refDistance: 1");
    spiderEntity[spiderId].setAttribute('spider-cinematic-controller', {
        spawn_type: 'web'
    });

    let explodeSound = document.createElement("a-entity");
    explodeSound.setAttribute("id", `explode-${spiderId}`);
    explodeSound.setAttribute("sound", {
        src: "#explode",
        autoplay: false
    });
    scene.appendChild(spiderEntity[spiderId]);
    scene.appendChild(explodeSound);

    const indicator = document.createElement("canvas");
    indicator.width = 64;
    indicator.height = 64;
    indicator.style.position = "absolute";
    indicator.style.pointerEvents = "none";
    document.body.appendChild(indicator);
    const ctx = indicator.getContext("2d");

    console.log("Spider spawned");

    let lookedAt = false;
    let lookStartTime = null;
    const lookDuration = 2000; // 2s
    const spiderCheckInterval = setInterval(() => {
        if (!spiderEntity[spiderId]) {
            clearInterval(spiderCheckInterval);
            document.body.removeChild(indicator);
            return;
        }

        const spiderPos = new THREE.Vector3();
        const playerPos = new THREE.Vector3();
        spiderEntity[spiderId].object3D.getWorldPosition(spiderPos);
        player.object3D.getWorldPosition(playerPos);

        const direction = new THREE.Vector3();
        player.object3D.getWorldDirection(direction);

        const vectorToSpider = spiderPos.clone().sub(playerPos).normalize();
        const dot = direction.dot(vectorToSpider);
        if(!scene.querySelector(`#new_light-${spiderId}`)){
                spawn_spotlight(spiderPos, 1000, 20, spiderId);
        }

        if (dot < -0.85) {
            if (!lookStartTime) lookStartTime = performance.now();
            const elapsed = performance.now() - lookStartTime;

            const progress = Math.min(elapsed / lookDuration, 1);
            drawSector(ctx, indicator.width, indicator.height, progress);

            const spiderScreenPos = spiderEntity[spiderId].object3D.position.clone();
            const camera = scene.camera;
            const vector = spiderScreenPos.project(camera);
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth - indicator.width / 2;
            const y = (-vector.y * 0.5 + 0.5) * window.innerHeight - indicator.height / 2;
            indicator.style.left = `${x}px`;
            indicator.style.top = `${y}px`;

            if (elapsed >= lookDuration) {
                lookedAt = true;
                const spiderController = spiderEntity[spiderId].components['spider-cinematic-controller'];
                if (spiderController) {
                    spiderController.triggerDeath(spiderPos);
                    setTimeout(() => {
                        removeSpider(spiderId);
                    }, 2000);
                } else {
                    // fallback: remove spider immediately if controller not found
                    removeSpider(spiderId);
                }
                removeSpider(spiderId);
                clearInterval(spiderCheckInterval);
                document.body.removeChild(indicator);
                explodeSound.components.sound.playSound();
                setTimeout(() => {
                    explodeSound.parentNode.removeChild(explodeSound);
                }, 2000);
            }
        } else {
            // Reset if player looks away
            lookStartTime = null;
            ctx.clearRect(0, 0, indicator.width, indicator.height);
        }
    }, 100);

    setTimeout(() => {
        if (!lookedAt && spiderEntity[spiderId]) {
            clearInterval(timerInterval);
            timerInterval = null;

            const timerEl = document.getElementById("experience-timer");
            const textEl = document.getElementById("timer-text");
            timerEl.classList.remove("shake-easy", "shake-medium", "shake-hard");
            textEl.textContent = "00:00";
            if(difficulty === 0){
                textEl.classList.replace("easy-text", "hard-text");
                timerEl.classList.replace("easy-box", "hard-box");
            } else if(difficulty ===1){
                textEl.classList.replace("medium-text", "hard-text");
                timerEl.classList.replace("medium-box", "hard-box");
            }

            clearInterval(spiderCheckInterval);
            gameOver();
            document.body.removeChild(indicator);
        }
    }, spiderLookDuration);
}

function drawSector(ctx, width, height, progress) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.arc(width / 2, height / 2, width / 2, -Math.PI / 2, -Math.PI / 2 + progress * 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

function removeSpider(id) {
    if (spiderEntity[id]) {
        spiderEntity[id].parentNode.removeChild(spiderEntity[id]);
        delete spiderEntity[id];
    }
}

function scheduleNextSpider() {
    const delay = Math.random() * (spawnTime[1] - spawnTime[0]) + spawnTime[0];
    spiderTimeout = setTimeout(() => {
        spawnSpider();
        scheduleNextSpider();
    }, delay);
}

function stopSpiders() {
    clearTimeout(spiderTimeout);
    for(let i of Object.keys(spiderEntity)){
        removeSpider(i);
    }
}

// Simple game over function
function gameOver() {
    if(!won){alert("Game Over! You didn't look at the spider in time.");}
    else{alert("Congratulations! You survived the experience.");}
    stopTimer();
    stopSpiders();
    stopRandomBlinking();
}
const originalStartExperience = startExperience;
startExperience = function () {
    originalStartExperience();
    scheduleNextSpider();
}

// Helper to stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

export { startExperience, changeCard, startTimer, stopSpiders };
