AFRAME.registerComponent("spider-cinematic-controller", {
  schema: {
    spawn_type: { type: "string", default: "web" },
    drop_height: { type: "number", default: 10 },
    trigger_radius: { type: "number", default: 8 },
    stay_height: { type: "bool", default: false },
  },

  init: function () {
    this.isBusy = true;
    this.isAlive = true;

    const currentPos = this.el.object3D.position;
    this.currentPos = currentPos;
    this.finalPos = { x: currentPos.x, y: currentPos.y, z: currentPos.z };

    this.setupInitialState();

    this.el.addEventListener("model-loaded", () => {
      // Small delay to ensure animations are registered
      setTimeout(() => {
        this.startSpawnSequence();
      }, 100);
    });

  },

  setupInitialState: function () {
    this.el.setAttribute("visible", "false");

    if (this.data.spawn_type === "web") {
      this.el.object3D.position.set(
        this.finalPos.x,
        this.currentPos.y + this.data.drop_height,
        this.finalPos.z
      );
    } else if (this.data.spawn_type === "hole") {
      this.el.object3D.position.set(
        this.finalPos.x,
        this.currentPos.y - this.data.drop_height,
        this.finalPos.z
      );
      this.el.object3D.rotation.x = 0;
    }
  },

  startSpawnSequence: function () {
    console.log(`Iniciando spawn tipo: ${this.data.spawn_type}`);

    if (this.data.spawn_type === "web") {
      this.sequenceWebDrop();
    } else if (this.data.spawn_type === "hole") {
      this.sequenceHole();
    } else {
      this.el.setAttribute("visible", "true");
      this.playAnimation("Idle");
      this.isBusy = false;
    }
  },

  // =================================================================
  // WEB DROP
  // =================================================================
  sequenceWebDrop: function () {
    const webEl = document.createElement("a-cylinder");
    webEl.setAttribute("color", "#FFFFFF");
    webEl.setAttribute("opacity", "0.5");
    webEl.setAttribute("radius", "0.02");
    webEl.setAttribute("height", this.data.drop_height*1.5);

    const webY = this.data.drop_height + this.data.drop_height / 2;
    webEl.setAttribute(
      "position",
      `${this.finalPos.x} ${webY} ${this.finalPos.z}`
    );

    this.el.sceneEl.appendChild(webEl);

    this.el.setAttribute("visible", "true");
    this.playDropSpawnAnimation();

    const dur = 3000;

    this.el.setAttribute("animation__drop", {
      property: "position",
      to: `${this.finalPos.x} ${this.finalPos.y} ${this.finalPos.z}`,
      dur: dur,
      easing: "linear",
    });

    if (this.data.stay_height == false) {
      console.log(this.data.stay_height);
      // setTimeout(() => {
      //   this.el.setAttribute("animation__flip", {
      //     property: "rotation",
      //     to: "0 0 0",
      //     dur: 500,
      //     easing: "easeOutQuad",
      //   });
      // }, dur - 600);
    }

    setTimeout(() => {
      webEl.parentNode.removeChild(webEl);
      this.isBusy = false;
    }, dur);
  },

  playDropSpawnAnimation: function () {
  this.el.removeAttribute("animation-mixer");
  this.lookAtCamera();
  this.el.setAttribute("animation-mixer", {
    clip: "sequenceWebDrop",
    loop: "once",
    clampWhenFinished: true,
    crossFadeDuration: 0.2
  });
},

  // =================================================================
  // LÓGICA DO BURACO (HOLE)
  // =================================================================
  sequenceHole: function () {
    // 1. Cria o Buraco Dinamicamente
    const holeEl = document.createElement("a-circle");
    holeEl.setAttribute("color", "#000");
    holeEl.setAttribute("radius", "1.5");
    holeEl.setAttribute("rotation", "-90 0 0");
    holeEl.setAttribute(
      "position",
      `${this.finalPos.x} 0.02 ${this.finalPos.z}`
    );
    holeEl.setAttribute("scale", "0 0 0");

    this.el.sceneEl.appendChild(holeEl);

    holeEl.setAttribute("animation", {
      property: "scale",
      to: "1 1 1",
      dur: 1000,
      easing: "easeOutBack",
    });

    setTimeout(() => {
      this.el.setAttribute("visible", "true");
      this.playAnimation("Idle");

      this.el.setAttribute("animation__rise", {
        property: "position",
        to: `${this.finalPos.x} 0 ${this.finalPos.z}`,
        dur: 1500,
        easing: "easeOutQuad",
      });
    }, 800);

    setTimeout(() => {
      holeEl.setAttribute("animation__close", {
        property: "scale",
        to: "0 0 0",
        dur: 500,
        easing: "easeInBack",
      });

      this.isBusy = false;

      setTimeout(() => {
        if (holeEl.parentNode) holeEl.parentNode.removeChild(holeEl);
      }, 600);
    }, 2500);
  },

  // =================================================================
  // MORTE E EXPLOSÃO
  // =================================================================
  triggerDeath: function (pos) {
    if (!this.isAlive) return;
    this.isAlive = false;
    this.isBusy = true;

    this.playAnimation("Death");

    setTimeout(() => {
      this.createExplosion(pos || this.el.object3D.position);

      this.el.setAttribute("animation__die", {
        property: "scale",
        to: "0.001 0.001 0.001",
        dur: 500,
        easing: "easeInBack",
      });

      setTimeout(() => {
        this.el.setAttribute("visible", "false");
      }, 500);
    }, 200);
  },

  createExplosion: function (pos) {
    const scene = this.el.sceneEl;
    const colors = ["#222", "#444", "#000"];

    for (let i = 0; i < 100; i++) {
      const p = document.createElement("a-sphere");
      p.setAttribute("position", pos);
      p.setAttribute("radius", Math.random() * 0.02 + 0.05);
      p.setAttribute(
        "color",
        colors[Math.floor(Math.random() * colors.length)]
      );
      p.setAttribute("transparent", true);
      p.setAttribute("opacity", 0.8);

      const destX = pos.x + (Math.random() - 0.5) * 2;
      const destY = pos.y + (Math.random() - 0.5) * 2;
      const destZ = pos.z + (Math.random() - 0.5) * 2;

      p.setAttribute("animation__move", {
        property: "position",
        to: `${destX} ${destY} ${destZ}`,
        dur: 1000,
        easing: "easeOutQuad",
      });

      p.setAttribute("animation__fade", {
        property: "opacity",
        to: 0,
        dur: 1000,
      });

      scene.appendChild(p);
      setTimeout(() => p.parentNode.removeChild(p), 1100);
    }
  },

  playAnimation: function (clipName) {
    this.el.removeAttribute("animation-mixer");
    let loop = "repeat";
    let clamp = false;

    if (clipName === "Attack") loop = "once";
    if (clipName === "Death") {
      loop = "once";
      clamp = true;
    }

    this.el.setAttribute("animation-mixer", {
      clip: clipName,
      loop: loop,
      clampWhenFinished: clamp,
      crossFadeDuration: 0.4,
    });
  },

  lookAtCamera: function () {
    const camera = this.el.sceneEl.camera;
    if (!camera) return;

    const spiderPos = new THREE.Vector3();
    const cameraPos = new THREE.Vector3();

    this.el.object3D.getWorldPosition(spiderPos);
    camera.getWorldPosition(cameraPos);

    const dir = cameraPos.sub(spiderPos);
    const angle = Math.atan2(dir.x, dir.z);

    this.el.object3D.rotation.y = -(180-angle);
  },

});
