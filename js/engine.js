let goblin;
let images = {};
let players = {};


// Canvas frames
var upperBuffer;  // game
var lowerBuffer;  // chat window


function set_players(data) {
    players = {};  // resets the list
    for (let i = 0; i < data.length; i++) {
        if (data[i]['logged'] == true) {
            goblin = createSprite(
                data[i]['location']["x"],
                data[i]['location']["y"],
                40, 40);
            goblin.addImage(images['goblin_default']);
            let player_data = {
                "x": data[i]['location']["x"],
                "y": data[i]['location']["y"],
                "sprite": goblin
            }
            players[data[i]['name']] = player_data;
        }
    }
}


function get_players() {
    query_logged_characters().then((data) => {
        set_players(data);
    });
};


function preload() {
    images['goblin_default'] = loadImage('https://raw.githubusercontent.com/brunolcarli/Goblins-Client/master/static/img/goblins/goblin.png');
    images['forest_bg'] = loadImage('https://i.ibb.co/b680fpt/Map002.png');
    console.log('images loaded');
}


function draw_upper_buffer() {
    /*
    Draws the play screen.
    */
    // upperBuffer.background('rgba(0,255,0, 0.25)');
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
        createCanvas(1968, 2744);
        upperBuffer = createGraphics(1968, 2744);
        lowerBuffer = createGraphics(1968, 200);
        get_players();
        console.log(players);
    }
    else {
        alert('Not logged!');
        window.location.href = "../index.html";
    }
}


function draw() {
    var login_status = localStorage.getItem('logged');
    if (login_status) {
        draw_upper_buffer();
        draw_lower_buffer();
        image(lowerBuffer, 0, 0);
        image(upperBuffer, 0, 100);
        // background('rgba(0,255,0, 0.25)');
        drawSprites();

        // Add player name as sprite label
        for (let player in players) {

            players[player]['label'] = text(
                player,
                players[player]['x'] - 15,
                players[player]['y'] - 18
            );
        };
    }
}


function start_game() {
    var char_name = document.querySelector('input[name="select_char"]:checked').value;
    var input_data = `{ characterName: \\\"${char_name}\\\" `;
    input_data += `mapArea: FOREST `;
    input_data += `serverReference: \\\"server1\\\" }`;
    var token = localStorage.getItem('token');
    character_login_mutation(input_data, `JWT ${token}`).then(data => {
        if (!data['characterLogin']['logStatus']['logged']) {
            alert('Failed to log in');
            return;
        }
        localStorage.setItem('char_name', data['characterLogin']['logStatus']['charName']);
        window.location.href = 'game.html';
    });
}
