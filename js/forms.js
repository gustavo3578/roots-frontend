function send_login_request(){
    var user_email = document.getElementById("email_input").value
    var pwd = document.getElementById("password_input").value

    login_mutation(user_email, pwd);

    if (localStorage.getItem('logged') == true){
        window.location.href = "pages/game.html";
    }
}


function send_logout_request(){
    let token = localStorage.getItem('token');
    let char_name = localStorage.getItem('char_name');
    let input_data = `{characterName: \\\"${char_name}\\\"}`;
    character_logout_mutation(input_data, `JWT ${token}`);
    logout_mutation(user);
}


function sign_up(){
    let newUsername = document.getElementById("newUserName").value;
    let newUserPass = document.getElementById("newUserPassword").value;
    let newUserEmail = document.getElementById("newUserEmail").value;

    if (newUsername == null || newUsername == "", newUserPass == null || newUserPass == "", newUserEmail == null || newUserEmail == "") {
        alert("Please Fill All Required Field");
        return false;
    } else {
        new_user_sign_up(newUsername, newUserPass, newUserEmail).then(data => {
            window.location.href = "../index.html";
        });
    }
}


function send_create_character_request(){
    let token = localStorage.getItem('token');
    let char_name = document.getElementById('char-name-creation').value;
    let char_class = document.getElementById('char-class-select').value;
    let username = localStorage.getItem('username');
    let user_email = localStorage.getItem('email');
    let input_data = `{name: \\\"${char_name}\\\" characterClass: ${char_class} username: \\\"${username}\\\" email: \\\"${user_email}\\\"}`;
    create_char_mutation(input_data, token).then(data => {
        if ('errors' in data){
            alert('An error ocurred');
        } else {
            window.location.href = 'character.html';
        }
    });   
}
