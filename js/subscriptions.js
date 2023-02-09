

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
    'enemy_movement': onEnemyMovement,
    // 'character_use_skill': onCharacterUseSkill,
    'target_damaged': onTargetDamaged,
    'target_knockout': onTargetKnockout,
    'character_exp_gain': onExpUp

  }
  let event_type = data['onCharacterEvent']['characterEvent']['eventType'];
  let event_data = data['onCharacterEvent']['characterEvent']['data'];
  if (event_type in valid_events) {
    valid_events[event_type](event_data);
  }
}


// function onCharacterUseSkill(data){
// console.log(data);
// }


function onExpUp(data){
  if (
      data['area'] != localStorage.getItem('char_location')
      ||
      data['skill_user_id'] != localStorage.getItem('char_id')
    ){
    return;
  }
  players[data['skill_user_id']]['lv'] = data['lv'];
  let log_message = `${players[data['skill_user_id']]['name']} has earned ${data['exp']} EXP`;
  InjectMessageInChat(0, 'Sys', log_message);
}


function onTargetDamaged(data){
  if (data['area'] != localStorage.getItem('char_location')){
    return;
  }
  console.log(data)
  let damage = data['damage'];
  let attacker;
  let defender = data['target_name'];

  attacker = players[data['skill_user_id']]['name'];

  if (data['classType'] == 'enemy'){
    enemies[data['target_id']]['hud'].elt.value = data['target_hp'];
  }
  else {
    players[data['target_id']]['hud'].elt.value = data['target_hp'];
  }
  
  localStorage.setItem('current_sp', data['skill_user_sp']);

  if (localStorage.getItem('char_id') == data['target_id']){
    localStorage.setItem('current_hp', data['target_hp']);
  }

  let attack_log = `${attacker} used ${data['skill_name']} at ${defender}`;
  let damage_log = `${defender} has taken ${damage} damage`;
  InjectMessageInChat(0, 'Sys', attack_log);
  InjectMessageInChat(0, 'Sys', damage_log);

}

function onTargetKnockout(data){
  if (data['area'] != localStorage.getItem('char_location')){
    return;
  }
  let target_name;

  if (data['classType'] == 'enemy'){
    target_name = enemies[data['target_id']];
    enemies[data['target_id']]['sprite'].remove();
    enemies[data['target_id']]['hud'].remove();
    enemies[data['target_id']]['hud_label'].remove();
    delete enemies['target_id'];
  }
  else {
    target_name = players[data['target_id']];
    players[data['target_id']]['sprite'].remove();
    players[data['target_id']]['sprite'] = createImg(
      images['ko_character'],
      target_name
    );
    players[data['target_id']]['sprite'].elt.id = data['target_id'];
    players[data['target_id']]['sprite'].elt.class_type = 'player';
    players[data['target_id']]['sprite'].position(players[data['target_id']]['x'], players[data['target_id']]['y']);
    players[data['target_id']]['sprite'].mouseClicked(TargetCallback);
  }
  let log_message = `[K.O] ${data['target_name']} has fallen`;
  InjectMessageInChat(0, 'Sys', log_message);
}


function onCharacterMovement(data) {
  if (data['map_area'] != localStorage.getItem('char_location')){
    return;
  }
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
      players[player_id]['name']
    ),
    players[player_id]['sprite'].elt.id = player_id;
    players[player_id]['sprite'].elt.class_type = 'player';
    players[player_id]['sprite'].position(data["x"], data["y"]);
    players[player_id]['sprite'].mouseClicked(TargetCallback);
    players[player_id]['hud'].position(data['x']-64, data['y']-18);
    players[player_id]['hud_label'].position(data['x'], data['y']-22);
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
    'lv': data['lv'],
    'max_hp': data['max_hp'],
    'current_hp': data['current_hp'],
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
  enemy_data['hud'].elt.value = data['current_hp'];
  enemy_data['hud'].elt.max = data['max_hp'];
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
    'lv': data['lv'],
    'max_hp': data['max_hp'],
    'current_hp': data['current_hp'],
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
  player_data['hud'].elt.value = data['current_hp'];
  player_data['hud'].elt.max = data['max_hp'];
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
    let player_sprite = players[player_id]['sprite'];
    player_sprite.remove();
    delete players[player_id];
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
