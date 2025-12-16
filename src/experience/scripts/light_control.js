// Manter a posição do prinpal_light
// Desenhar uma esfera de luz ao intorno desse prinpal_light
// Ter uma função para controla o quão extensa é essa esfera
// Ter uma função para controla o quão iluminado é essa esfera


// -- Duas luzes: Luz principa ( Segue o prinpal_light ) Luz ambiente ( Fixa )


function closeHud(){
    var $a = $('.proprietary_ui')
    $a.remove()
    loading_ambient_light()
}

// Ter um spawn de spotlhigth
// -> Espera x segundo até começar a piscar por y frequência


var prinpal_light_position = {
    x:0,
    y:10,
    z:0
}

var prinpal_light_intensity = 30

var $prinpal_light = null

function set_prinpal_light(){
    if($prinpal_light != null){
        return
    }
    $prinpal_light = $("#prinpal_light")
}


function set_prinpal_light_intensity(value){
    $prinpal_light.attr('intensity', `${Math.max(1,Math.min(30,value))}`)
}

function set_prinpal_light_position(prinpal_light_position){
    $prinpal_light.attr('position', `${prinpal_light_position.x} ${prinpal_light_position.y} ${prinpal_light_position.z}`)
}

function loading_ambient_light(){
    set_prinpal_light()
    set_prinpal_light_position(prinpal_light_position)
    set_prinpal_light_intensity(prinpal_light_intensity)
    //console.log($prinpal_light)
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



function tetseImport(){
    window.alert("oi")
}