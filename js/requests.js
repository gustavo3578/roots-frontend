// const server_host = 'http://localhost:11000/graphql/';
const server_host = "https://ggj23server.brunolcarli.repl.co/graphql/";


function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
};


function json(response) {
    return response.json()
};


function get_request_options(payload){
    /* Returns the request method, headers, content... */
    return {
      method: 'POST',
      headers: {
        cookie: 'csrftoken=pgrjljBkHdbd9hySxmJaFUlewPM1IdYJ09nZstz9N6bCf8pfuctT4ftl2girhj6t',
        'Content-Type': 'application/json'
      },
      body: payload
    };
};

function new_user_sign_up(username, password, email){
    var payload = `{"query":"mutation{signUp(input: {username: \\\"${username}\\\" password: \\\"${password}\\\" email: \\\"${email}\\\"}){user {username}}}"}`;
    console.log(payload);
    return fetch(server_host, {
        "method": "POST",
        "headers": {
            "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
            "Content-Type": "application/json",
        },
        "body":payload
    })
    .then(json)
    .then(data => {
        console.log(data);
        alert("Username registered!!!");
        return data;
        // window.location.href = "pages/character.html";
    })
    .catch(err => {
        console.error(err);
    });
};

function login_mutation(email, password){
    return fetch(server_host, {
        "method": "POST",
        "headers": {
            "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
            "Content-Type": "application/json",
        },
        "body": `
        {\"query\":\"mutation{\\n  logIn(input: {email: \\\"${email}\\\" password: \\\"${password}\\\"}){\\n    token\\n  }\\n}\\n\"}`
    })
    .then(json)
    .then(data => {
        if("errors" in data) {
            alert(data["errors"][0]["message"]);
            return;
        }
        localStorage.setItem('logged', true);
        localStorage.setItem('token', data['data']['logIn']['token']);
        localStorage.setItem('user', email);
        window.location.href = "../screens/signup.html";
    })
    .catch(err => {
        console.error(err);
    });
};