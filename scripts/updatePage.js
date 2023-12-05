import {logoutFunction} from "./logout.js";

export async function UpdatePage(){
    fetch('https://blog.kreosoft.space/api/account/profile', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            UpdateAuthorized(json)
        } else {
            UpdateUnauthorized()
        }
    })
}

function UpdateAuthorized(data){
    $(".account-name").text(data.email)
    $(".authorized").removeClass("d-none")
    $(".unauthorized").addClass("d-none")
    logoutFunction()
}

function UpdateUnauthorized(){
    $(".authorized").addClass("d-none")
    $(".unauthorized").removeClass("d-none")
}