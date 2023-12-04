import {createBasicPost} from "./createPost.js";

export async function getPostFunc(postId){
    document.getElementById("myContent").innerHTML =
        await fetch("/views/specificPost.html").then((data) => data.text())

    fetch(`https://blog.kreosoft.space/api/post/${postId}`, {
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
            let post = $("#postCarts")
            post.replaceWith(createBasicPost(json, post))
            fillingComments(json.comments)
        }
    })
}

async function fillingComments(comments){
    let commentCard = $("#commentCarts")
    let rootComment = $(".rootComment")
    let subComment = $(".subComment")

    if (comments.length !== 0){
        commentCard.removeClass('d-none')
    }

    for (let com of comments){
        fetch(`https://blog.kreosoft.space/api/comment/${com.id}/tree`, {
            method: 'GET'
        }).then((response) => {
            if (response.ok){
                return response.json()
            }
        }).then((json) => {
            if (json !== undefined) {
                commentCard.find("#commentList").append(createCommentCard([com, json], rootComment, subComment))
            }
        })
    }
}

function createCommentCard(commentElem, rootTemplate, subCommentTemplate){
    let userId = null
    let rootFilling = commentElem[0]
    let rootCard = fillingCommentElem(rootTemplate, rootFilling, userId)

    let subCommentFilling = commentElem[1]

    for (let subCom of subCommentFilling){
        let subCommentCard = fillingCommentElem(subCommentTemplate, subCom, userId)
        rootCard.find(".sub-comments").append(subCommentCard)
    }

    if (subCommentFilling.length !== 0)
    {
        rootCard.find(".open-sub-comment").removeClass('d-none')
        rootCard.find(".open-sub-comment").click(function (){
            $(this).find('.sub-comments').removeClass('d-none');
        })
    }

    return rootCard
}

function fillingCommentElem(comment, commentFilling, userId){
    let commentCard = comment.clone()
    commentCard.removeClass('d-none')

    if (userId === commentFilling.authorId){
        commentCard.find(".myComment").removeClass('d-none')
    }

    commentCard.find(".comment-name").text(commentFilling.author)
    commentCard.find(".comment-body").text(commentFilling.content)

    if (commentFilling.deleteDate !== null){
        commentCard.find(".comment-name").text('[Комментарий удален]')
        commentCard.find(".comment-body").text('[Комментарий удален]')
    } else if (commentFilling.modifiedDate !== null){
        commentCard.find(".changeText").removeClass('d-none')
    }

    commentCard.find(".textCommentDate").text(commentFilling.createTime.substring(0, commentFilling.createTime.indexOf("T"))
        + " " + commentFilling.createTime.substring(commentFilling.createTime.indexOf("T") + 1, commentFilling.createTime.indexOf("T") + 6))

    return commentCard
}