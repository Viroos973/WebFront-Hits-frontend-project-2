import {Validate} from "./validationForm.js";

export async function editProfileFunction(data){
    document.getElementById("myContent").innerHTML =
        await fetch("/BlogFrontend/views/profile.html").then((data) => data.text())

    GiveParams(data)

    $("#ChangeProfile").on("click",function () {
        UpdateFormForChanges()
        Validate()
    })

    $("#CancelChange").on("click", function (){
        GiveParams(data)
        UpdateForm()
        $("#form-profile .error-mes").css('display', 'none');
        $("#exampleInputEmail-error, #exampleInputUserName-error").remove();
    })

    $("#form-profile").submit(function (event){
        event.preventDefault()
        const dataAfterChanges = GetParams()

        fetch('https://blog.kreosoft.space/api/account/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(dataAfterChanges)
        }).then((response) => {
            if (!response.ok){
                $("#form-profile .error-mes").css('display', 'block');
            } else {
                UpdateForm()
                $("#form-profile .error-mes").css('display', 'none');
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
    return {
        "email": email,
        "fullName": userName,
        "birthDate": (birthDate === "")? null : birthDate,
        "gender": gender,
        "phoneNumber": (phoneNumber === "")? null : phoneNumber
    }
}

function GiveParams(data){
    $("#exampleInputUserName").val(data.fullName)
    $("#exampleInputPhone").val(data.phoneNumber)
    $("#exampleInputEmail").val(data.email)

    let date = data.birthDate === null? null : data.birthDate.substring(0, data.birthDate.indexOf("T"))
    $("#exampleInputBirthDate").val(date)

    let gen = data.gender === "Male"? 0 : 1
    $(`#exampleInputGender option:eq(${gen})`).attr('selected', 'selected')
}

function UpdateFormForChanges(){
    $("#exampleInputUserName").removeClass("form-control-plaintext").addClass("form-control").removeAttr("readonly")
    $("#exampleInputBirthDate").removeClass("form-control-plaintext").addClass("form-control").removeAttr("readonly")
    $("#exampleInputPhone").removeClass("form-control-plaintext").addClass("form-control").removeAttr("readonly")
    $("#exampleInputEmail").removeClass("form-control-plaintext").addClass("form-control").removeAttr("readonly")
    $("#exampleInputGender").removeAttr("disabled")
    $("#ChangeProfile").css('display', 'none')
    $("#CancelChange").css('display', 'block')
    $("#SaveChange").css('display', 'block')
}

function UpdateForm(){
    $("#exampleInputUserName").removeClass("form-control").addClass("form-control-plaintext").attr("readonly", "readonly")
    $("#exampleInputBirthDate").removeClass("form-control").addClass("form-control-plaintext").attr("readonly", "readonly")
    $("#exampleInputPhone").removeClass("form-control").addClass("form-control-plaintext").attr("readonly", "readonly")
    $("#exampleInputEmail").removeClass("form-control").addClass("form-control-plaintext").attr("readonly", "readonly")
    $("#exampleInputGender").attr("disabled", "disabled");
    $("#ChangeProfile").css('display', 'block')
    $("#CancelChange").css('display', 'none')
    $("#SaveChange").css('display', 'none')
}