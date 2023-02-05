var character_sprite;
var images = {};
var players = {};

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
}

function draw_upper_buffer() {
    upperBuffer.background(images['forest_bg']);
}

function draw_lower_buffer() {
    lowerBuffer.background('rgba(255, 255, 255, 0.25)');
    lowerBuffer.textSize(14);
    lowerBuffer.text("Chat log:", 0, 48);

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
        image(lowerBuffer, 1, 1);
        image(upperBuffer, 1, 100);
        drawSprites();

        for (let player in players) {
            players[player]['label'] = text(
                players[player]['name'],
                players[player]['x'],
                players[player]['y']
            );
            if (mouseIsPressed) {
                rctl1X = mouseX;
                rctl1Y = mouseY;
                checkCollision(rctl1X, rctl1Y, 48, 48, players[player]['x'] - 24, players[player]['y'] - 24, 48, 48);
                // var collision = checkCollision(rctl1X, rctl1Y, 48, 48, players[player]['x'] - 24, players[player]['y'] - 24, 48, 48);
                // console.log(collision)
                // if (collision) {
                //     fill(255, 0, 0);
                // } else {
                //     fill(0, 255, 0);
                // }
                // rect(rctl1X, rctl1Y, 48, 48);
                // rect(players[player]['x'] - 24, players[player]['y'] - 24, 48, 48);
            }
        };
        // layoutSkills()
    }
}

function checkCollision(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    // store the locations of each rectangles outer borders 
    var top1 = r1y - r1h / 2;
    var bottom1 = r1y + r1h / 2;
    var right1 = r1x + r1w / 2;
    var left1 = r1x - r1w / 2;
    var top2 = r2y - r2h / 2;
    var bottom2 = r2y + r2h / 2;
    var right2 = r2x + r2w / 2;
    var left2 = r2x - r2w / 2;

    if (top1 > bottom2 || bottom1 < top2 || right1 < left2 || left1 > right2) {
        return false;
    } else {
        return true;
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