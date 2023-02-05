

function spriteshift(cx, cy, nx, ny, class_type){
    let sprite_key = 'character_' + class_type;
    if (nx > cx){ return sprite_key + '_right' }
    if (nx < cx){ return sprite_key + '_left' }
    if (ny > cy){ return sprite_key + '_down' }
    if (ny < cy){ return sprite_key + '_up' }
    return sprite_key + '_down' 
}


function onCharacterEvent(data){
  let valid_events = {
    'character_movement': onCharacterMovement,
    'character_login': onCharacterLogIn,
    'character_logout': onCharacterLogout
  }
  let event_type = data['onCharacterEvent']['characterEvent']['eventType'];
  let event_data = data['onCharacterEvent']['characterEvent']['data'];
  if (event_type in valid_events){
      valid_events[event_type](event_data);
  }
}


function onCharacterMovement(data){
  let player_id = data['id'];
  if (player_id in players) {
      let sprite_key = spriteshift(
        players[player_id]['x'],
        players[player_id]['y'],
        data["x"],
        data["y"],
        players[player_id]['class_type']
      );
      players[player_id]['x'] = data["x"];
      players[player_id]['y'] = data["y"];
      players[player_id]['sprite'].addImage(images[sprite_key]);
      players[player_id]['sprite'].position.x = data["x"];
      players[player_id]['sprite'].position.y = data["y"];
      drawSprites();
  }
}


function onNewChatMessage(data){
  let payload = data['onNewChatMessage'];
  chat_logs = chat_logs.concat([payload]);
  if (chat_logs.length > 5) {
      chat_logs.shift();
  }
}


function onCharacterLogIn(data){
  let player_id = data['id'];
  let character_img = createSprite(data["x"], data["y"], 40, 40, 'static');
  character_img.addImage(images['character_' + data['classType'] + '_down']);
  let player_data = {
      "x": data["x"],
      "y": data["y"],
      'name': data['name'],
      "sprite": character_img,
      'class_type': data['class_type']
  };
  players[player_id] = player_data;
  drawSprites();
}


function onCharacterLogout(data){
  let player_id = data['id'];
  let player_sprite = players[player_id].sprite;
  removeSprite(player_sprite);
  delete players[player_id];
  drawSprites();
}


function graphql_subscribe() {
    const client_id = 'client__' + Math.random().toString(16).substr(2, 8);
    const subscription_url = 'wss://ggj23server.brunolcarli.repl.co/subscriptions/';

    const GQL = {
        CONNECTION_INIT: 'connection_init',
        CONNECTION_ACK: 'connection_ack',
        CONNECTION_ERROR: 'connection_error',
        CONNECTION_KEEP_ALIVE: 'ka',
        START: 'start',
        STOP: 'stop',
        CONNECTION_TERMINATE: 'connection_terminate',
        DATA: 'data',
        ERROR: 'error',
        COMPLETE: 'complete'
      };
      const valid_operations = {        
        'onCharacterEvent': onCharacterEvent,
        'onNewChatMessage': onNewChatMessage
      };

      
      console.log('Connecting to broadcaster...');
      const webSocket = new WebSocket(subscription_url, "graphql-ws");
      webSocket.onmessage = function(event) {
        data = JSON.parse(event.data);
        operation = Object.keys(data['payload']['data'])[0];
        package_id = data['id'].toString();
        if (operation in valid_operations){
          valid_operations[operation](data['payload']['data']);
        }
      };

      webSocket.onopen = function(){
        console.log('Connected.');
        // Subscribe to channels
        console.log('Subscribing to channels...');
        webSocket.send(JSON.stringify({
          type: GQL.START,
          id: `${client_id}__character_event`,
          payload: {"query": `subscription chevt{ onCharacterEvent{ characterEvent{ eventType data } }}`}
        }));
        console.log('Subscribed to character events channel');

        webSocket.send(JSON.stringify({
          type: GQL.START,
          id: `${client_id}__message`,
          payload: {"query": `subscription{onNewChatMessage(chatroom: "global"){sender text}}`}
        }));
        console.log('Subscribed to messages channel');

        console.log('Subscriptions completed!');
      };
}
