export async function profileFunction(){
    document.getElementById("myContent").innerHTML =
        await fetch("/BlogFrontend/views/profile.html").then((data) => data.text())

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
            fillingProfile(json)
        }
    })
}

function fillingProfile(data){
    $("#exampleInputUserName").val(data.fullName)
    $("#exampleInputBirthDate").val(data.birthDate)
    $("#exampleInputPhone").val(data.phoneNumber)
    $("#exampleInputEmail").val(data.email)

    let gen = data.gender === "Male"? 0 : 1
    $(`#exampleInputGender option:eq(${gen})`).attr('selected', 'selected');
}

/*function UpdateNavBar(data){
    $("nav .navbar-authorized").css('display', 'block');
    $("nav .navbar-unauthorized").css('display', 'none');
    $(".account-name").text(data.email)
}*/