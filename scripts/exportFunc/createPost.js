import {getDate} from "./getDate.js";

export function createBasicPost(post, template) {
    let postCard = template.clone()
    postCard.removeAttr("id")
    postCard.removeClass("d-none")

    if (post.communityName)
        postCard.find("#user-text").text(post.author + " - " + getDate(post.createTime) + " в сообществе '" + post.communityName + "'")
    else
        postCard.find("#user-text").text(post.author + " - " + getDate(post.createTime))

    postCard.find("#post-title").text(post.title)

    if (post.image){
        postCard.find(".img-fluid").attr("src", post.image)
        postCard.find(".imgInDiv").removeClass('d-none')
    }

    fillingDescription(post.description, postCard)
    postCard.find("#tags-text").text(post.tags.map(tag => "#" + tag.name + " "))
    postCard.find("#time-text").text("Время чтения: " + post.readingTime + " мин")
    fillingAddress(post.addressId, postCard)
    postCard.find(".count-comments").text(post.commentsCount)
    postCard.find(".count-like").text(post.likes)
    if(post.hasLike) postCard.find("#hasLike").removeClass("far").addClass("fas")

    postCard.find("#addOrDeleteLike").click(function (){
        let likeIcon = this.querySelector('i')
        if (likeIcon.classList.contains('far')) {
            addLikeFunction(post, postCard, likeIcon, postCard.find(".count-like").text())
        } else {
            deleteLikeFunction(post, postCard, likeIcon, postCard.find(".count-like").text())
        }
    })

    postCard.find("#post-title").click(function (){
        history.pushState({}, "", `/post/${post.id}`)
        location.reload()
    })

    postCard.find("#text-comments").click(function (){
        history.pushState({}, "", `/post/${post.id}/comment`)
        location.reload()
    })

    return postCard;
}

async function fillingAddress(addressId, postCard){
    if (addressId !== null)
        await fetch(`https://blog.kreosoft.space/api/address/chain?objectGuid=${addressId}`, {
            method: 'GET'
        }).then((response) => {
            if (response.ok){
                return response.json()
            }
        }).then((json) => {
            if (json !== undefined) {
                let chain = ""
                for (let address of json){
                    chain += " " + address.text
                }
                postCard.find("#address-text").append(chain).removeClass('d-none')
            }
        })
}

function fillingDescription(text, postCard){
    if (text.length > 500 && !(postCard.find("#specificPostCarts").length > 0)){
        let shortText = text.substring(0, 500) + "..."
        postCard.find("#post-text").text(shortText).append(`<a href="#" id="read-more">Читать дальше</a>`)
        postCard.find("#read-more").click(function (event){
            event.preventDefault()
            postCard.find("#post-text").text(text)
        })
    } else {
        postCard.find("#post-text").text(text)
    }
}

async function addLikeFunction(post, postCard, likeIcon, countLike){
    fetch(`https://blog.kreosoft.space/api/post/${post.id}/like`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then((response) => {
        if (response.ok){
            likeIcon.classList.remove('far');
            likeIcon.classList.add('fas');
            postCard.find(".count-like").text(parseInt(countLike) + 1)
        }
    })
}

async function deleteLikeFunction(post, postCard, likeIcon, countLike){
    fetch(`https://blog.kreosoft.space/api/post/${post.id}/like`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then((response) => {
        if (response.ok){
            likeIcon.classList.remove('fas');
            likeIcon.classList.add('far');
            postCard.find(".count-like").text(parseInt(countLike) - 1)
        }
    })
}