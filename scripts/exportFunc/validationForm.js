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
            textCom: {
                required: true,
                maxlength: 1000
            },
            namePost: {
                required: true,
                minlength: 5,
                maxlength: 1000
            },
            readingTimePost: "required",
            tagsPost: "required",
            textPost: {
                required: true,
                minlength: 5,
                maxlength: 5000
            },
            imgPost: {
                maxlength: 1000,
                url: true
            }
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
            textCom: {
                required: "Введите комментарий",
                maxlength: "Максимальная длина комментария 1000 символов"
            },
            namePost: {
                required: "Введите название поста",
                minlength: "Минимальная длина названия 5 символов",
                maxlength: "Максимальная длина названия 1000 символов"
            },
            readingTimePost: "Введите время чтения поста",
            tagsPost: "Выберите хотя бы 1 тэг",
            textPost: {
                required: "Введите текст поста",
                minlength: "Минимальная длина текста 5 сиволов",
                maxlength: "Максимальная длина текста 5000 сиволов"
            },
            imgPost: {
                maxlength: "Максимальная длина url картинки 1000 символов",
                url: "Введите коректную ссылку"
            }
        }
    })

    $("#exampleInputPhone").mask("+7 (999) 999-99-99");
}