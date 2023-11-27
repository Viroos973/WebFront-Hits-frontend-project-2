import {Validate} from "./validationForm.js";

export async function loginFunction(){
    document.getElementById("myContent").innerHTML =
        await fetch("/BlogFrontend/views/login.html").then((data) => data.text())

    Validate();

    $("#form-login").submit(function (event) {
        event.preventDefault()
        const data = GetParams()

        fetch('https://blog.kreosoft.space/api/account/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((response) => {
            if (!response.ok){
                $("#form-login .error-mes").css('display', 'block')
            } else {
                return response.json()
            }
        }).then((json) => {
            if (json !== undefined) {
                console.log(json)
                UpdateNavBar(data)
            }
        })
    })
}

function GetParams(){
    let email = $("#exampleInputEmail").val()
    let password = $("#exampleInputPassword").val()
    return {
        'email': email,
        'password': password
    }
}

function UpdateNavBar(data){
    $("nav .navbar-authorized").css('display', 'block');
    $("nav .navbar-unauthorized").css('display', 'none');
    $(".account-name").text(data.email)
}

loginFunction()