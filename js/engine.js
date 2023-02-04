let charcter_sprite;
let images = {};
let players = {};
let menu = dropdown();
// Canvas frames
var upperBuffer;  // game
var lowerBuffer;  // chat window



function set_players(data) {
    data = data['characters'];
    players = {};  // resets the list
    for (let i = 0; i < data.length; i++) {
        if (data[i]['isLogged'] == true) {
            character_sprite = createSprite(
                data[i]['positionX'],
                data[i]['positionY'],
                40, 40, 'static');
                character_sprite.addImage(images['character_default']);
            let player_data = {
                "name": data[i]['name'],
                "x": data[i]['positionX'],
                "y": data[i]['positionY'],
                "sprite": character_sprite,
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
    images['character_default'] = loadImage('https://raw.githubusercontent.com/brunolcarli/Goblins-Client/master/static/img/goblins/goblin.png');
    images['forest_bg'] = loadImage('https://i.ibb.co/b680fpt/Map002.png');
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
    textAlign(CENTER);
  background(200);
  sel = createSelect();
  sel.position(1180, 190);
  sel.option('pear');
  sel.option('kiwi');
  sel.option('grape');
  sel.selected('kiwi');
  sel.changed(mySelectEvent);
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
    let area_location = document.getElementById(char_id).getAttribute('value');
    localStorage.setItem('char_location', area_location);
    var input_data = `{ id: \\\"${char_id}\\\"}`;
    var token = localStorage.getItem('token');
    character_login_mutation(input_data, `JWT ${token}`).then(data => {
        if (!data['characterLogin']['logStatus']) {
            alert('Failed to log in');
            return;
        }
        localStorage.setItem('map_size_x', data['mapArea']['sizeX']);
        localStorage.setItem('map_size_y', data['mapArea']['sizeY']);
        localStorage.setItem('char_id', char_id);
        window.location.href = 'game.html';
    });
}
