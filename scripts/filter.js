
export async function filterFunction(){
    document.getElementById("myContent").innerHTML =
        await fetch("/views/filter.html").then((data) => data.text())

    fetch('https://blog.kreosoft.space/api/tag', {
        method: 'GET'
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            for (let i = 0; i < json.length; i++){
                $("#searchByTags").append('<option value="' + i + '">' + json[i].name + '</option>');
            }
        }
    })

    fetch('https://blog.kreosoft.space/api/post', {
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
            $(`#postsOnPage`).empty()
            for (let i = 0; i < json.posts.length; i++){
                $("#postsOnPage").append(createBasicPost(json.posts[i], $("#postCarts")))
            }
        }
    })

    /*$("#form-filter").submit(function (event){
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
    })*/
}

function createBasicPost(post, template) {
    let postCard = template.clone()
    postCard.removeAttr("id")
    postCard.removeClass("d-none")

    if (post.communityName)
        postCard.find("#user-text").text(post.author + " - " + post.createTime.substring(0, post.createTime.indexOf("T"))
            + " " + post.createTime.substring(post.createTime.indexOf("T") + 1, post.createTime.indexOf("T") + 6)
            + " в сообществе '" + post.communityName + "'")
    else
        postCard.find("#user-text").text(post.author + " - " + post.createTime.substring(0, post.createTime.indexOf("T"))
            + " " + post.createTime.substring(post.createTime.indexOf("T") + 1, post.createTime.indexOf("T") + 6))

    postCard.find(".card-title").text(post.title)
    postCard.find(".img-fluid").attr("src", post.image)
    postCard.find("#post-text").text(post.description)
    postCard.find("#tags-text").text(post.tags.map(tag => "#" + tag.name + " "))
    postCard.find("#time-text").text("Время чтения: " + post.readingTime + " мин")
    return postCard;
}