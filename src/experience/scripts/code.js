var popups = ["warning", "logo", "info"];
var start = false;
var popupsInfo = {
    "warning": {
        "title": "Avisos",
        "icon": `<img src="../../assets/images/warning.png" alt="warning Icon" class="card-icon">`,
        "buttonAction": "changeCard()",
        "text": `<p>Olá! Este é um aviso importante.</p>
                 <p>Este aplicativo é destinado a pessoas com fobia de altura (acrofobia) e pode causar desconforto ou ansiedade em alguns usuários.</p>
                 <p>Se você se sentir desconfortável ou ansioso em qualquer momento durante o uso deste aplicativo, por favor, pare imediatamente e remova o dispositivo.</p>
                 <p>Recomendamos que você utilize este aplicativo em um ambiente seguro e confortável, preferencialmente com a supervisão de um profissional de saúde mental.</p>
                 <p>Se você tiver alguma dúvida ou preocupação, consulte um profissional de saúde mental antes de usar este aplicativo.</p>
                 <p>Obrigado por sua compreensão e cuidado.</p>`
    },
    "logo": {
        "title": "",
        "icon": `
            <video id="logoVideo"
                muted
                loop
                autoplay
                playsinline
                width="500">
                <source src="../../assets/videos/logo.mp4" type="video/mp4">
            </video>
        `,
        "buttonAction": "changeCard()",
        "text": ""
    },
    "info": {
        "title": "Bem-vindo ao Phobia VR",
        "icon": `<img src="../../assets/images/info.png" alt="info Icon" class="card-icon">`,
        "buttonAction": "startExperience()",
        "text": `<p>Este aplicativo foi desenvolvido para ajudar pessoas com aracnofobia a enfrentar e superar seus medos em um ambiente seguro e controlado.</p>
                    <p>Utilizando a tecnologia de realidade virtual, você será imerso em cenários que simulam situações envolvendo aranhas, permitindo que você confronte seus medos de forma gradual e progressiva.</p>
                    <p>Recomendamos que você utilize este aplicativo em um ambiente confortável e seguro, preferencialmente com a supervisão de um profissional de saúde mental.</p>
                    <p>Lembre-se de que o objetivo deste aplicativo é ajudá-lo a superar seus medos, e não causar desconforto ou ansiedade. Se em algum momento você se sentir desconfortável, pare imediatamente e remova o dispositivo.</p>
                    <p>Obrigado por escolher o Phobia VR como uma ferramenta para enfrentar seus medos. Esperamos que esta experiência seja útil e benéfica para você.</p>`
    }
};

function addCard(){
    var popupId = popups.shift();
    var popup = popupsInfo[popupId];
    var cardHtml = `<h1 class="card-title">${popup.title}</h1>
                    ${popup.icon}
                    <div class="card-text">${popup.text}</div>
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