
function handle_action(player, input) {
    var commands = {
        "move": move
    }
    var cmd = input.split(" ")[0];
    var param = input.split(" ")[1];
    if (cmd in commands) {
        commands[cmd](player, param)
    }
}


function handle_combat(player, input) {
    console.log("Not implemented");
}


function handle_say(player, input) {
    send_chat_command(player, input.trim());
}

function keyPressed() {
    var user = localStorage.getItem('char_name');
    switch (key) {
        case 'ArrowLeft':
        case 'a':
            handle_action(user, 'move left');
            break;

        case 'ArrowRight':
        case 'd':
            handle_action(user, 'move right');
            break;

        case 'ArrowUp':
        case 'w':
            handle_action(user, 'move up');
            break;

        case 'ArrowDown':
        case 's':
            handle_action(user, 'move down');
            break;

        default:
            break;
    }
    clear();
}

function send_message() {
    var message_input = document.getElementById('message_input').value;
    var user = localStorage.getItem('char_name');
    handle_say(user, message_input);
}

