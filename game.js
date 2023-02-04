let bg;
let player_img;
let sprite;

function setup() {
    createCanvas(960, 960);
    draw_back_img();
    //player();
}

function draw() {
    background(bg);
}

function preload() {
    bg = loadImage('https://i.ibb.co/b680fpt/Map002.png');
    player_img = loadImage('https://raw.githubusercontent.com/brunolcarli/Goblins-Client/master/static/img/goblins/goblin.png');
}

function draw_back_img() {
    bg;
}

function player() {
    sprite = new Sprite(player_img, 0, 0, 48, 48, 0);
}