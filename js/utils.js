

function fill_characters_panel(data){
    document.getElementById('chars_panel').innerHTML = '<div class="row" id="chars_panel">'
    for (index in data){
        console.log(data[index]);
        var character = data[index];
        // <img src="${character['sprite']}" class="img-circle"></img>
        document.getElementById('chars_panel').innerHTML += `
        <div class="col-sm-4" name="select_char">
            <input type="radio" name="select_char" value="${character['id']}">
            <label id="${character['id']}" for="${character['name']}" value="${character['areaLocation']}">${character['name']}</label><br>
            <div class="image-box">
                <table>
                    <tr>
                        <th>Class: </th>
                        <th>${character["classType"]}</th>
                    </tr>
                    <tr>
                        <th>Name: </th>
                        <th>${character["name"]}</th>
                    </tr>
                    <tr>
                        <th>Lv: </th>
                        <th>${character["lv"]}</th>
                    </tr>
                </table>
            </div>
        </div>
        `;
    }
    document.getElementById('chars_panel').innerHTML += '</div>'
}
