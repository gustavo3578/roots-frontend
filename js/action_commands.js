
function move(player, param){
    var options = {
        'up': (x, y) => {return [x, y - 48]},
        'down': (x, y) => {return [x, y + 48]},
        'left': (x, y) => {return [x - 48, y]},
        'right': (x, y) => {return [x + 48, y]},
        'u': (x, y) => {return [x, y - 48]},
        'd': (x, y) => {return [x, y + 48]},
        'l': (x, y) => {return [x - 48, y]},
        'r': (x, y) => {return [x + 48, y]},
    }
    console.log(players)
    if (param in options) {
        var x = players[player]['x'];
        var y = players[player]['y'];
        var new_position = options[param](x, y);

        if (new_position[0] > upperBuffer.width - 28){
            new_position[0] = upperBuffer.width - 28;
        }
        else if (new_position[0] < 28){
            new_position[0] = 28;
        };
        if (new_position[1] > upperBuffer.height - 28){
            new_position[1] = upperBuffer.height - 28;
        }
        else if (new_position[1] < 28){
            new_position[1] = 28;
        };
        update_position(player, new_position[0], new_position[1]);
    }
}
