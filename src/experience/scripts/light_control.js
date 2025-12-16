// Manter a posição do player
// Desenhar uma esfera de luz ao intorno desse player
// Ter uma função para controla o quão extensa é essa esfera
// Ter uma função para controla o quão iluminado é essa esfera



// Ter um spawn de spotlhigth
// -> Espera x segundo até começar a piscar por y frequência




var player_position = {
    x:1,
    y:1,
    z:1
}

function set_player_position(){
    
}

function loading_ambient_light(){
    console.log($("#player").children())
}





// vignette controll 

var vignette_obg = null

function get_vignette_obg(){
    if( vignette_obg != null)
        return vignette_obg

    vignette_obg = $('#vignette')
    console.log(vignette_obg)
}

function set_vignette_size(value) {
    if (!vignette_obg) {
        get_vignette_obg();
    }
    value = Math.max(10, Math.min(100, value));

    vignette_obg.css("--v-size", value + "%");
}

function set_vignette_strength(value) {
    if (!vignette_obg) {
        get_vignette_obg();
    }
    value = Math.max(0, Math.min(1, value));

    vignette_obg.css("--v-strength", value);
}