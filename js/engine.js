var character_sprite;
var images = {};
var players = {};

// Canvas frames
var upperBuffer;  // game
var lowerBuffer;  // chat window


// function spriteshift(cx, cy, nx, ny, class_type){
//     var sprite_key = 'character_' + class_type;
//     if (nx > cx){ return sprite_key + '_right' }
//     if (nx < cx){ return sprite_key + '_left' }
//     if (ny > cy){ return sprite_key + '_down' }
//     if (ny < cy){ return sprite_key + '_up' }
//     return sprite_key + '_down';
// }


function set_players(data) {
    data = data['characters'];
    players = {};  // resets the list
    for (let i = 0; i < data.length; i++) {
        if (data[i]['isLogged'] == true) {
            character_sprite = createSprite(
                data[i]['positionX'],
                data[i]['positionY'],
                40, 40, 'static'
            );
            
            character_sprite.addImage(images['character_' + data[i]['classType'] + '_down']);
            let player_data = {
                "name": data[i]['name'],
                "x": data[i]['positionX'],
                "y": data[i]['positionY'],
                "sprite": character_sprite,
                "id": data[i]['id'],
                'class_type': data[i]['classType']
            }
            players[data[i]['id']] = player_data;
        }
    }
}


function get_players(map_area) {
    query_logged_characters(map_area).then((data) => {
        set_players(data);
    });
};


function preload() {
    // DPS Sprites
    images['character_dps_right'] = loadImage('https://i.ibb.co/sVqB43r/direita.png')
    images['character_dps_left'] = loadImage('https://i.ibb.co/GR0wjNp/esquerda4.png')
    images['character_dps_up'] = loadImage('https://i.ibb.co/VHKpw1v/tras1.png')
    images['character_dps_down'] = loadImage('https://i.ibb.co/VDGt9dQ/frente1.png')

    // SUPPORTER Sprites
    images['character_supporter_right'] = loadImage('https://i.ibb.co/M1GXc66/direita.png')
    images['character_supporter_left'] = loadImage('https://i.ibb.co/DrH5QsQ/esquerda.png')
    images['character_supporter_up'] = loadImage('https://i.ibb.co/pbV23dS/tras.png')
    images['character_supporter_down'] = loadImage('https://i.ibb.co/PYnKjDP/frente.png')

    // TANKER Sprites
    images['character_tanker_right'] = loadImage('https://i.ibb.co/gdjBG4X/direita.png')
    images['character_tanker_left'] = loadImage('https://i.ibb.co/bKJbbNg/esquerda.png')
    images['character_tanker_up'] = loadImage('https://i.ibb.co/H48JGNj/tras1.png')
    images['character_tanker_down'] = loadImage('https://i.ibb.co/gJXnLzC/frente1.png')

    // ENEMY Sprites

    // Background areas sprites
    images['forest_bg'] = loadImage('https://i.postimg.cc/nhKGBvtK/Map002480.png');
    console.log('images loaded');
}


function draw_upper_buffer() {
    /*
    Draws the play screen.
    */
    upperBuffer.background(images['forest_bg']);
}


function draw_lower_buffer() {
    /*
    Write messages (draw text) on chat log.
    */
    lowerBuffer.background('rgba(255, 255, 255, 0.25)');
    lowerBuffer.textSize(14);
    lowerBuffer.text("Chat log:", 0, 10);

    let ty = 25;
    var name;
    var msg;

    for (let i = 0; i < chat_logs.length; i++) {
        name = chat_logs[i]['sender'];
        msg = chat_logs[i]['text'];
        lowerBuffer.text(`${name}: ${msg}`, 0, ty);
        ty = ty + 18;
    };
}


function setup() {
    var login_status = localStorage.getItem('logged');
    console.log(login_status);
    if (login_status) {
        console.log('Logged in!');
        let size_x = localStorage.getItem('map_size_x');
        let size_y = localStorage.getItem('map_size_y');
        createCanvas(size_x, size_y);
        upperBuffer = createGraphics(size_x, size_y);
        lowerBuffer = createGraphics(size_x, 200);
        get_players(localStorage.getItem('char_location'));
    }
    else {
        alert('Not logged!');
        window.location.href = "../index.html";
    }
}


function draw() {
    var login_status = localStorage.getItem('logged');
    if (login_status){
        clear();
        draw_upper_buffer();
        draw_lower_buffer();
        image(lowerBuffer, 0, 0);
        image(upperBuffer, 0, 100);
        drawSprites();

        // Add player name as sprite label
        for (let player in players) {
            players[player]['label'] = text(
                players[player]['name'],
                players[player]['x'] - 15,
                players[player]['y'] - 18
            );
        };
    }
}



function start_game() {
    let char_id = document.querySelector('input[name="select_char"]:checked').value;
    console.log('>>>>', char_id)
    let area_location = document.getElementById(char_id).getAttribute('value');
    localStorage.setItem('char_location', area_location);
    var input_data = `{ id: \\\"${char_id}\\\"}`;
    var token = localStorage.getItem('token');
    character_login_mutation(input_data, `JWT ${token}`).then(data => {
        if (!data['characterLogin']['logStatus']) {
            alert('Failed to log in');
            return;
        }
        map_area_data_query(area_location).then(data => {
            localStorage.setItem('map_size_x', data['mapArea']['sizeX']);
            localStorage.setItem('map_size_y', data['mapArea']['sizeY']);
        })
        
        localStorage.setItem('char_id', char_id);
        window.location.href = 'game.html';
    });
}
