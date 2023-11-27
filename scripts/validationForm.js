export function Validate(){
    $("form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            loginPassword: "required"
        },
        messages: {
            email: {
                required: "Введите email",
                email: "Введите корректный email"
            },
            loginPassword: "Введите пароль"
        }
    })
}