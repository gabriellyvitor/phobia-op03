var popups = ["warning", "logo", "info"];
var start = false;
var popupsInfo = {
    "warning": {
        "image": `<img src="../../assets/images/warning.jpg" alt="warning Icon" class="card-image">`,
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
        "image": `<img src="../../assets/images/welcome.jpg" alt="info Icon" class="card-image">`,
        "buttonAction": "startExperience()",
    }
};

function addCard(){
    var popupId = popups.shift();
    var popup = popupsInfo[popupId];
    var cardHtml = `${popup.image}
                    <button class="close-btn" onclick="${popup.buttonAction}">
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

    $card.removeClass('zoom-in').addClass('zoom-out');

    setTimeout(() => {
        $card.remove();
        addCard();
    }, 500);
}

function startExperience(){
    const $card = $('.card');

    $card.removeClass('zoom-in').addClass('zoom-out');

    setTimeout(() => {
        $card.remove();
        $('.proprietary_ui').remove();
    }, 250);
    start = true;
}

document.addEventListener("DOMContentLoaded", function () {
    addCard();
});