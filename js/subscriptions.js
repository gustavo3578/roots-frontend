

function spriteshift(cx, cy, nx, ny, class_type) {
  let sprite_key = 'character_' + class_type;
  if (nx > cx) { return sprite_key + '_right' }
  if (nx < cx) { return sprite_key + '_left' }
  if (ny > cy) { return sprite_key + '_down' }
  if (ny < cy) { return sprite_key + '_up' }
  return sprite_key + '_down'
}


function onCharacterEvent(data) {
  let valid_events = {
    'character_movement': onCharacterMovement,
    'character_login': onCharacterLogIn,
    'character_logout': onCharacterLogout,
    'enemy_spawn': onEnemySpawn,
    'enemy_movement': onEnemyMovement
  }
  let event_type = data['onCharacterEvent']['characterEvent']['eventType'];
  let event_data = data['onCharacterEvent']['characterEvent']['data'];
  if (event_type in valid_events) {
    valid_events[event_type](event_data);
  }
}


function onCharacterMovement(data) {
  console.log(data)
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
    players[player_id]['sprite'].remove();
    players[player_id]['sprite'] = createImg(
      images[sprite_key],
      data['name']
    ),
    players[player_id]['sprite'].elt.id = player_id;
    players[player_id]['sprite'].elt.class_type = 'player';
    players[player_id]['sprite'].position(data["x"], data["y"]);
    players[player_id]['sprite'].mouseClicked(TargetCallback);
    players[player_id]['hud'].position(data['x']-64, data['y']-18);
    players[player_id]['hud_label'].position(data['x'], data['y']-22);
    // players[player_id]['hud'].hide();
    // players[player_id]['hud_label'].hide();
  }
}


function onEnemyMovement(data) {
  let enemy_id = data['enemy_id'];
  if (enemy_id in enemies) {
    // let enemy_name = data['enemy_name'];
    enemies[enemy_id]['x'] = data["position_x"];
    enemies[enemy_id]['y'] = data["position_y"];
    enemies[enemy_id]['sprite'].position(data['position_x'], data['position_y']);
    enemies[enemy_id]['hud'].position(data['position_x'], data['position_y']-16);
    enemies[enemy_id]['hud_label'].position(data['position_x'], data['position_y']-20);
  }
}


function onNewChatMessage(data) {
  let payload = data['onNewChatMessage'];
  console.log("payload", payload)
  chat_logs = chat_logs.concat([payload]);
  if (chat_logs.length > 5) {
    chat_logs.shift();
  }
}


function onEnemySpawn(data){
  let current_area = localStorage.getItem('char_location');
  if (current_area != data['area']){
    return;
  }
  let enemy_id = data['enemy_id'];
  let enemy_data = {
    'id': enemy_id,
    "x": data["position_x"],
    "y": data["position_y"],
    'name': data['enemy_name'],
    'area': data['area'],
    "sprite": createImg(
      images[data['enemy_name']+'_down'],
      data['enemy_name']
    ),
  };

  enemy_data['sprite'].elt.id = enemy_id;
  enemy_data['sprite'].elt.class_type = 'enemy';
  enemy_data['sprite'].position(data["position_x"], data["position_y"]);
  enemy_data['sprite'].mouseClicked(TargetCallback);

  enemy_data['hud'] = createElement("progress", 'TGT');
  enemy_data['hud'].elt.id = data['enemy_name'] + ':' + enemy_id;
  enemy_data['hud'].elt.value = 100;
  enemy_data['hud'].elt.max = 100;
  enemy_data['hud_label'] = createElement('label', data['enemy_name']);
  enemy_data['hud_label'].elt.for = enemy_data['hud'].elt.id;
  enemy_data['hud'].position(data['position_x']-64, data['position_y']-16);
  enemy_data['hud_label'].position(data['position_x'], data['position_y']-20);
  enemy_data['hud'].hide();
  enemy_data['hud_label'].hide();

  enemies[enemy_id] = enemy_data;
}


function onCharacterLogIn(data) {
  if (data['map_area'] != localStorage.getItem('char_location')){
    return;
  }

  let player_id = data['id'];
  let player_data = {
    "x": data["x"],
    "y": data["y"],
    'name': data['name'],
    "sprite": createImg(
      images['character_' + data['classType'] + '_down'],
      data['name']
    ),
    'class_type': data['classType'],
    'map_area': data['map_area']
  };
  player_data['sprite'].elt.id = player_id;
  player_data['sprite'].elt.class_type = 'player';
  player_data['sprite'].position(data["position_x"], data["position_y"]);
  player_data['sprite'].mouseClicked(TargetCallback);

  player_data['hud'] = createElement("progress", 'TGT');
  player_data['hud'].elt.id = data['name'] + ':' + player_id;
  player_data['hud'].elt.value = 100;
  player_data['hud'].elt.max = 100;
  player_data['hud_label'] = createElement('label', data['name']);
  player_data['hud_label'].elt.for = player_data['hud'].elt.id;
  player_data['hud'].position(data['position_x']-64, data['position_y']-18);
  player_data['hud_label'].position(data['position_x'], data['position_y']-22);
  player_data['hud'].hide();
  player_data['hud_label'].hide();
  players[player_id] = player_data;
}


function onCharacterLogout(data) {
  let player_id = data['id'];
  if (player_id in players){
    let player_sprite = players[player_id].sprite;
    removeSprite(player_sprite);
    delete players[player_id];
    drawSprites();
  }
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
  webSocket.onmessage = function (event) {
    data = JSON.parse(event.data);
    operation = Object.keys(data['payload']['data'])[0];
    package_id = data['id'].toString();
    if (operation in valid_operations) {
      valid_operations[operation](data['payload']['data']);
    }
  };

  webSocket.onopen = function () {
    console.log('Connected.');
    // Subscribe to channels
    console.log('Subscribing to channels...');
    webSocket.send(JSON.stringify({
      type: GQL.START,
      id: `${client_id}__character_event`,
      payload: { "query": `subscription chevt{ onCharacterEvent{ characterEvent{ eventType data } }}` }
    }));
    console.log('Subscribed to character events channel');

    webSocket.send(JSON.stringify({
      type: GQL.START,
      id: `${client_id}__message`,
      payload: { "query": `subscription{onNewChatMessage(chatroom: "global"){sender text id}}` }
    }));
    console.log('Subscribed to messages channel');

    console.log('Subscriptions completed!');
  };
}
