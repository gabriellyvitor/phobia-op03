function closeHud(){
    var $a = $('.proprietary_ui')
    $a.remove()
    loading_ambient_light()
}

// Ter um spawn de spotlhigth
// -> Espera x segundo até começar a piscar por y frequência


var tracking_lights = [

]


function spawn_spotlight({x, y, z}, life_time, frequence, id) {
    //console.log(tracking_lights)
    let id_of_new_light = `new_light-${id !== undefined ? id : tracking_lights.length}`;
    tracking_lights.push(id_of_new_light);
    var $scene = $('#'+id);

    // Criando a luz inicialmente
    var new_light_structure = `
        <a-light id="${id_of_new_light}" 
          type="point" 
          angle="15" 
          color="#856d41"
          position="${x} ${y} ${z}"
          distance="2"
          intensity="2"
        ></a-light>
    `;
    $scene.append(new_light_structure);

    let $light = $("#" + id_of_new_light);
    let increasing = true;  
    let intensity = 2;
    let pauseTime = 300; // tempo de pausa em cada extremo (ms)

    let interval;

    function updateLight() {
        if (increasing) {
            intensity += 0.1;
            if (intensity >= 4) {
                intensity = 4;
                increasing = false;
                pauseAtExtreme();
            }
        } else {
            intensity -= 0.1;
            if (intensity <= 2) {
                intensity = 2;
                increasing = true;
                pauseAtExtreme();
            }
        }
        $light.attr('intensity', `${intensity}`);
    }

    function pauseAtExtreme() {
        clearInterval(interval);
        setTimeout(() => {
            interval = setInterval(updateLight, frequence);
        }, pauseTime);
    }

    // Inicia a oscilação
    interval = setInterval(updateLight, frequence);

    // Remove a luz após o tempo de vida
    setTimeout(() => {
        clearInterval(interval);
        if ($light){
            $light.remove();
        }else{
            window.alert("Eita")
        }
        
        tracking_lights.pop();
    }, life_time);
}





var prinpal_light_props = {
    position:{
        x:0,
        y:10,
        z:0
    },
    intensity:30,
    distance:30

}

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

function set_prinpal_light_distance(value){
    $prinpal_light.attr('distance', `${Math.max(10,Math.min(100,value))}`)
}

function set_prinpal_light_position(prinpal_light_position){
    $prinpal_light.attr('position', `${prinpal_light_position.x} ${prinpal_light_position.y} ${prinpal_light_position.z}`)
}

function loading_ambient_light(){
    set_prinpal_light()
    set_prinpal_light_position(prinpal_light_props.position)
    set_prinpal_light_intensity(prinpal_light_props.intensity)
    set_prinpal_light_distance(prinpal_light_props.distance)
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
    console.log(value)
}

function tetseImport(){
    window.alert("oi")
}

export {
    set_vignette_size,
    set_vignette_strength,
    set_prinpal_light_distance,
    spawn_spotlight
}