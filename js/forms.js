function sign_up(){
    let newUsername = document.getElementById("newUserName").value;
    let newUserPass = document.getElementById("newUserPass").value;
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

function send_login_request(){
    var email = document.getElementById("email_input").value
    var pwd = document.getElementById("password_input").value

    login_mutation(email, pwd);

    if (localStorage.getItem('logged') == true){
        window.location.href = "screens/character.html";
    }
}