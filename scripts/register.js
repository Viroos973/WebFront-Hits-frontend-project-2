import {Validate} from "./validationForm.js";

export async function registrationFunction(){
    document.getElementById("myContent").innerHTML =
        await fetch("/BlogFrontend/views/register.html").then((data) => data.text())

    Validate();

    $("#form-registration").submit(function (event){
        event.preventDefault()
        const data = GetParams()

        fetch('https://blog.kreosoft.space/api/account/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((response) => {
            if (!response.ok){
                $("#form-registration .error-mes").css('display', 'block');
            } else {
                return response.json()
            }
        }).then((json) => {
            if (json !== undefined) {
                localStorage.setItem('token', json['token'])
                UpdateNavBar(data)
            }
        })
    })
}

function GetParams(){
    let userName = $("#exampleInputUserName").val()
    let birthDate = $("#exampleInputBirthDate").val()
    let gender = parseInt($("#exampleInputGender").val())
    let phoneNumber = $("#exampleInputPhone").val()
    let email = $("#exampleInputEmail").val()
    let password = $("#exampleInputPassword").val()
    return {
        "fullName": userName,
        "password": password,
        "email": email,
        "birthDate": (birthDate === "")? null : birthDate,
        "gender": gender,
        "phoneNumber": (phoneNumber === "")? null : phoneNumber
    }
}

function UpdateNavBar(data){
    $("nav .navbar-authorized").css('display', 'block');
    $("nav .navbar-unauthorized").css('display', 'none');
    $(".account-name").text(data.email)
}