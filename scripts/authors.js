import {getDate} from "./getDate.js";

export async function authorsFunction(){
    document.getElementById("myContent").innerHTML =
        await fetch("/views/authors.html").then((data) => data.text())

    fetch('https://blog.kreosoft.space/api/author/list', {
        method: 'GET'
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            let authorTemplate = $(".author")
            let popularAuthors = []

            for (let author of json) {
                popularAuthors.push(author)
                if (popularAuthors.length > 3) {
                    popularAuthors.sort((a, b) => b.posts - a.posts || b.likes - a.likes)
                    popularAuthors.pop()
                }
            }

            for (let author of json){
                let authorCard = createAuthors(author, authorTemplate)

                if (author === popularAuthors[0]){
                    authorCard.find(".imgPlace").removeClass("d-none").attr("src", "/views/images/1nt.png")
                } else if (author === popularAuthors[1]){
                    authorCard.find(".imgPlace").removeClass("d-none").attr("src", "/views/images/2nt.png")
                } else if (author === popularAuthors[2]){
                    authorCard.find(".imgPlace").removeClass("d-none").attr("src", "/views/images/3nt.png")
                }

                $("#authors").append(authorCard)
            }
        }
    })
}

function createAuthors(data, authorTemplate){
    let authorCard = authorTemplate.clone()
    authorCard.removeClass('d-none')

    if (data.gender === "Male"){
        authorCard.find(".imgAuthors").attr('src', "/views/images/man.png")
    } else {
        authorCard.find(".imgAuthors").attr('src', "/views/images/woman.png")
    }

    authorCard.find(".authorName").text(data.fullName)
    authorCard.find(".createAuthorDate").text("Создан: " + getDate(data.created))
    authorCard.find(".postCount").text("Постов: " + data.posts)
    authorCard.find(".likeCount").text("Лайков: " + data.likes)
    if (data.birthDate) authorCard.find(".birthAuthorDate").text("Дата рождения: " + getDate(data.birthDate))

    authorCard.click(function (){
        history.pushState({}, "", `/?author=${data.fullName}&page=1&size=5`)
        location.reload()
    })

    return authorCard
}