var upperBuffer;
var lowerBuffer;
var character_sprite;
var enemy_sprite;
var images = {};
var players = {};
var enemies = {};

let targeting = false;
let target = null;
let target_class_type = null;



function TargetCallback() {
    // Enemy class type target
    if (this.elt.class_type == 'enemy' && this.elt.id in enemies){
        targeting = true;
        // If already targeting an enemy
        if (target != this.elt.id && target != null){
            // untarget current targeted enemy
            if (target_class_type == 'enemy'){
                // enemies[target]['sprite'].elt.border = '';
                enemies[target]['hud'].hide();
                enemies[target]['hud_label'].hide();
            }
            else {
                // players[target]['sprite'].elt.border = '';
                players[target]['hud'].hide();
                players[target]['hud_label'].hide();
            }
            target_class_type = 'enemy';

            // refresh target variable with new target id
            target = this.elt.id;

            // Targets the new target enemy
            // this.elt.border = '5px solid #555';
            enemies[target]['hud'].show();
            enemies[target]['hud_label'].show();

        }
        else {
            target = this.elt.id;
            // this.elt.border = '5px solid #555';
            enemies[target]['hud'].show();
            enemies[target]['hud_label'].show();
            target_class_type = 'enemy';
        }
    }
    // player target
    else if (this.elt.id in players && this.elt.class_type == 'player'){
        targeting = true;
        // If already targeting a player
        if (target != this.elt.id && target != null){
            // untarget current target
            if (target_class_type == 'enemy'){
                // enemies[target]['sprite'].elt.border = '';
                enemies[target]['hud'].hide();
                enemies[target]['hud_label'].hide();
            }
            else {
                // players[target]['sprite'].elt.border = '';
                players[target]['hud'].hide();
                players[target]['hud_label'].hide();
            }
            target_class_type = 'player';

            // refresh target variable with new target id
            target = this.elt.id;

            // Targets the new target player
            // this.elt.border = '5px solid #555';
            players[target]['hud'].show();
            players[target]['hud_label'].show();
        }
        else {
            target = this.elt.id;
            // this.elt.border = '5px solid #555';
            players[target]['hud'].show();
            players[target]['hud_label'].show();
            target_class_type = 'player';
        }
    }
}


function set_spawned_enemies(data){
    data = data['enemiesSpawned'];
    let current_area = localStorage.getItem('char_location');
    enemies = {};
    for (let i = 0; i < data.length; i++) {
        if (data[i]['isKo'] == false && data[i]['areaLocation'] == current_area){
            let enemy_data = {
                "lv": data[i]['lv'],
                "name": data[i]['name'],
                "x": data[i]['positionX'],
                "y": data[i]['positionY'],
                "sprite": createImg(
                    images[data[i]['name'] + '_down'],
                    data[i]['name']
                ),
                "id": data[i]['id'],
                'class_type': data[i]['classType'],
                "is_ko": data[i]['isKo'],
                'current_hp': data[i]['currentHp'],
                "area": data[i]['areaLocation']
            }
            enemy_data['sprite'].elt.id = data[i]['id'];
            enemy_data['sprite'].elt.class_type = data[i]['classType'];
            enemy_data['sprite'].position(data[i]['positionX'], data[i]['positionY']);
            enemy_data['sprite'].mouseClicked(TargetCallback);

            enemy_data['hud'] = createElement("progress", 'TGT');
            enemy_data['hud'].elt.id = data[i]['name'] + ':' + data[i]['id'];
            enemy_data['hud'].elt.value = 100;
            enemy_data['hud'].elt.max = 100;
            enemy_data['hud'].position(data[i]['positionX']-54, data[i]['positionY']-16);
            enemy_data['hud_label'] = createElement('label', data[i]['name']);
            enemy_data['hud_label'].elt.for = enemy_data['hud'].elt.id;
            enemy_data['hud_label'].position(data[i]['positionX'], data[i]['positionY']-20);
            enemy_data['hud'].hide();
            enemy_data['hud_label'].hide();

            enemies[data[i]['id']] = enemy_data;
        }
    }
}


function set_players(data) {
    data = data['characters'];
    players = {};
    for (let i = 0; i < data.length; i++) {
        if (data[i]['isLogged'] == true) {
            let player_data = {
                "name": data[i]['name'],
                "x": data[i]['positionX'],
                "y": data[i]['positionY'],
                "sprite": createImg(
                    images['character_' + data[i]['classType'] + '_down'],
                    data[i]['name']
                ),
                "id": data[i]['id'],
                'class_type': data[i]['classType'],
            }
            player_data['sprite'].elt.id = data[i]['id'];
            player_data['sprite'].elt.class_type = 'player';
            player_data['sprite'].position(data[i]['positionX'], data[i]['positionY']);
            player_data['sprite'].mouseClicked(TargetCallback);

            player_data['hud'] = createElement("progress", 'TGT');
            player_data['hud'].elt.id = data[i]['name'] + ':' + data[i]['id'];
            player_data['hud'].elt.value = 100;
            player_data['hud'].elt.max = 100;
            player_data['hud_label'] = createElement('label', data[i]['name']);
            player_data['hud_label'].elt.for = player_data['hud'].elt.id ;
            player_data['hud'].position(data[i]['positionX']-64, data[i]['positionY']-18);
            player_data['hud_label'].position(data[i]['positionX'], data[i]['positionY']-22);
            player_data['hud'].hide();
            player_data['hud_label'].hide();

            players[data[i]['id']] = player_data;
        }
    }
}


function get_players(map_area) {
    query_logged_characters(map_area).then((data) => {
        set_players(data);
    });
};


function draw_upper_buffer() {
    upperBuffer.background(images['forest_bg']);
}


function ListMessage() {
    var name;
    var msg;
    var idMessage;

    for (let i = 0; i < chat_logs.length; i++) {
        name = chat_logs[i]['sender'];
        msg = chat_logs[i]['text'];
        idMessage = chat_logs[i]['id'];

        $(`#${idMessage}`).remove();
        InjectMessageInChat(idMessage, name, msg)

    };
}


function InjectMessageInChat(idMessage, name, msg) {
    console.log("msg", msg)
    var html = $(`<li class="list-group-item" id="${idMessage}">${name}: ${msg}</li>`)
    $("#ulMessage").append(html[0])
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


function MountedLayoutChat() {
    const canvas = $("#defaultCanvas0")
    $("#chat").css("height", `${canvas.outerHeight()}`).css("display", 'block').css("border-radius", '0px')

}


function preload() {
    // DPS Sprites
    images['character_dps_right'] = 'https://i.ibb.co/sVqB43r/direita.png';
    images['character_dps_left'] = 'https://i.ibb.co/GR0wjNp/esquerda4.png';
    images['character_dps_up'] = 'https://i.ibb.co/VHKpw1v/tras1.png';
    images['character_dps_down'] = 'https://i.ibb.co/VDGt9dQ/frente1.png';

    // SUPPORTER Sprites
    images['character_supporter_right'] = 'https://i.ibb.co/M1GXc66/direita.png';
    images['character_supporter_left'] = 'https://i.ibb.co/DrH5QsQ/esquerda.png';
    images['character_supporter_up'] = 'https://i.ibb.co/pbV23dS/tras.png';
    images['character_supporter_down'] = 'https://i.ibb.co/PYnKjDP/frente.png';

    // TANKER Sprites
    images['character_tanker_right'] = 'https://i.ibb.co/gdjBG4X/direita.png';
    images['character_tanker_left'] = 'https://i.ibb.co/bKJbbNg/esquerda.png';
    images['character_tanker_up'] = 'https://i.ibb.co/H48JGNj/tras1.png';
    images['character_tanker_down'] = 'https://i.ibb.co/gJXnLzC/frente1.png';

    // ENEMY Sprites

    // Spider
    images['spider_down'] = 'https://i.ibb.co/ZBTNVvk/spider-front.png';

    // Wolf
    // TODO: Change this wolf_down to wolf_right when a wolf_down is added
    images['wolf_down'] = 'https://i.ibb.co/93X6k6s/wolf-right.png';

    // Goblin
    images['goblin_down'] = 'https://raw.githubusercontent.com/brunolcarli/Goblins-Client/master/static/img/goblins/goblin.png';

    // Background area sprites
    images['forest_bg'] = loadImage('https://i.postimg.cc/nhKGBvtK/Map002480.png');
}


function setup() {
    var login_status = localStorage.getItem('logged');
    if (login_status) {
        let size_x = localStorage.getItem('map_size_x');
        let size_y = localStorage.getItem('map_size_y');
        var canva = createCanvas(size_x, size_y);
        canva.parent('sketch-holder');
        upperBuffer = createGraphics(size_x, size_y);
        get_players(localStorage.getItem('char_location'));
        MountedLayoutSkill()
        MountedLayoutChat()
        spawned_enemy_query(localStorage.getItem('char_location')).then(data => {
            set_spawned_enemies(data);
        });
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
        $("#skills").css("height", `${canvas.outerHeight()}`).css("display", 'block')
        skillsPlayer.forEach(x => {
            var html = $(
                `<button type="button" class="btn btn-outline-dark" data-toggle="tooltip" data-html="true" data-placement="bottom"
                title="<span class='badge badge-danger'>Power: ${x.power}</span> <span class='badge badge-info'>Range: ${x.range}</span> <span class='badge badge-warning'>Cost: ${x.spCost}</span>"
                ">${x.name}</button>`);

            $("#skills").children()[0].append(html[0])
        });
    }
}


function render_hud(){
    
    // HP BAR
    hp_hud = createElement('progress', 'HP');
    hp_hud.elt.value = 100;
    hp_hud.elt.max = 100;
    hp_hud.elt.id = 'HP_HUD';
    hp_hud.position(20, 26);
    hp_label = createElement('label', 'HP');
    hp_label.elt.for = 'HP_HUD';
    hp_label.position(2, 26);

    // SP BAR
    sp_hud = createElement('progress', 'SP');
    sp_hud.elt.value = 100;
    sp_hud.elt.max = 100;
    sp_hud.elt.id = 'SP_HUD';
    sp_hud.position(20, 62);
    sp_label = createElement('label', 'SP');
    sp_label.elt.for = 'SP_HUD';
    sp_label.position(2, 62);
}


function draw() {
    var login_status = localStorage.getItem('logged');
    if (login_status) {
        clear();
        draw_upper_buffer();
        image(upperBuffer, 0, 0);
        drawSprites();

        // draw hud
        render_hud();

        // draw player names
        for (let player in players) {
            players[player]['label'] = text(
                players[player]['name'],
                players[player]['x'],
                players[player]['y'] - 10
            );
        };

        // check mouse selection

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
        });
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