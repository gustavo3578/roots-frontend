let character_sprite;
let images = {};
let players = {};

// Canvas frames
var upperBuffer;  // game
var lowerBuffer;  // chat window

function preload() {
    images['character_default'] = loadImage('https://raw.githubusercontent.com/brunolcarli/Goblins-Client/master/static/img/goblins/goblin.png');
    images['forest_bg'] = loadImage('https://i.postimg.cc/nhKGBvtK/Map002480.png');
}

function draw_upper_buffer() {
    upperBuffer.background(images['forest_bg']);
}

function draw_lower_buffer() {
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
    if (login_status) {

        //#region Variables
        let size_x = localStorage.getItem('map_size_x');
        let size_y = localStorage.getItem('map_size_y');
        //#endregion

        //#region Canvas 
        var canva = createCanvas(size_x, size_y);
        canva.parent('sketch-holder');
        //#endregion

        //#region Buffers

        upperBuffer = createGraphics(size_x, size_y);
        lowerBuffer = createGraphics(size_x, 200);
        //#endregion

        get_players(localStorage.getItem('char_location'));
        MountedLayoutSkill()
    }
    else {
        alert('Not logged!');
        window.location.href = "../index.html";
    }
}

function get_players(map_area) {
    query_logged_characters(map_area).then((data) => {
        set_players(data);
    });
};

function set_players(data) {
    data = data['characters'];
    players = {};
    for (let i = 0; i < data.length; i++) {
        if (data[i]['isLogged'] == true) {
            character_sprite = createSprite(
                data[i]['positionX'],
                data[i]['positionY'],
                40, 40, 'static'
            );
            character_sprite.addImage(images['character_default']);
            let player_data = {
                "name": data[i]['name'],
                "x": data[i]['positionX'],
                "y": data[i]['positionY'],
                "sprite": character_sprite,
                "id": data[i]['id']
            }
            players[data[i]['id']] = player_data;
        }
    }
}

function MountedLayoutSkill() {
    const skillsPlayer = JSON.parse(localStorage.getItem('skills'))
    if (skillsPlayer != undefined) {
        const canvas = $("#defaultCanvas0")
        $("#skills").css("width", `${canvas.outerWidth()}`).css("display", 'block')
        skillsPlayer.forEach(x => {
            console.log(x)
            var html = $(
                `<button type="button" class="btn btn-outline-dark" data-toggle="tooltip" data-html="true" data-placement="bottom"
                title="<span class='badge badge-danger'>Power: ${x.power}</span> <span class='badge badge-info'>Range: ${x.range}</span> <span class='badge badge-warning'>Cost: ${x.spCost}</span>"
                ">${x.name}</button>`);

            $("#skills").children()[0].append(html[0])
        });
    }
}

function draw() {
    var login_status = localStorage.getItem('logged');
    if (login_status) {
        clear();
        draw_upper_buffer();
        draw_lower_buffer();
        image(lowerBuffer, 0, 48);
        image(upperBuffer, 0, 100);
        drawSprites();

        for (let player in players) {
            players[player]['label'] = text(
                players[player]['name'],
                players[player]['x'] - 15,
                players[player]['y'] - 18
            );
        };
        // layoutSkills()
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
        map_area_data_query(area_location).then(data => {
            localStorage.setItem('map_size_x', data['mapArea']['sizeX']);
            localStorage.setItem('map_size_y', data['mapArea']['sizeY']);
            localStorage.setItem('char_id', char_id);
        })
        getSkill(char_id).then(data => {
            if ('errors' in data) {
                alert('An error ocurred');
            } else {
                localStorage.setItem("skills", JSON.stringify(data['character']['skills']));
                window.location.href = 'game.html';
            }
        })
    });
}