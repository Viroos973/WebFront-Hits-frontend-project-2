import {editProfileFunction} from "./editProfile.js"

export async function profileFunction(){
    fetch('https://blog.kreosoft.space/api/account/profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            editProfileFunction(json)
        } else {
            UpdateNavBar()
        }
    })
}

function UpdateNavBar(){
    $("nav .navbar-authorized").css('display', 'none');
    $("nav .navbar-unauthorized").css('display', 'block');
}