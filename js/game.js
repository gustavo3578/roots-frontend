let bg;
let player_img;
let sprite;

function setup() {
    createCanvas(960, 960);
    draw_back_img();
    player();
}

function draw() {
    background(bg);
    drawSprites();
}

function preload() {
    bg = loadImage('https://i.ibb.co/b680fpt/Map002.png');
    sprite = loadImage('https://raw.githubusercontent.com/brunolcarli/Goblins-Client/master/static/img/goblins/goblin.png');
}

function draw_back_img() {
    bg;
}

function player() {
    player_img = createSprite(0, 0, 48, 48);
    player_img.addImage(sprite);
}