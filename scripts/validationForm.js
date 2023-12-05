export function Validate(){
    $("form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            loginPassword: "required",
            username: "required",
            registerPassword: {
                required: true,
                minlength: 6
            },
            textCom: "required"
        },
        messages: {
            email: {
                required: "Введите email",
                email: "Введите корректный email"
            },
            loginPassword: "Введите пароль",
            username: "Введите ФИО",
            registerPassword: {
                required: "Введите пароль",
                minlength: "Минимальная длина пароля 6 символов"
            },
            textCom: "Введите комментарий"
        }
    })

    $("#exampleInputPhone").mask("+7 (999) 999-99-99");
}