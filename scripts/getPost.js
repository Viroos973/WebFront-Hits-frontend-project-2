import {createBasicPost} from "./exportFunc/createPost.js";
import {Validate} from "./exportFunc/validationForm.js";
import {UpdatePage} from "./exportFunc/updatePage.js";
import {getDate} from "./exportFunc/getDate.js";

let targetElem

export function getComment(postId){
    history.replaceState({}, "", `/post/${postId}`)
    getPostFunc(postId, postId)
}

export async function getPostFunc(postId, targetComment){
    document.getElementById("myContent").innerHTML =
        await fetch("/views/specificPost.html").then((data) => data.text())

    Validate()

    $("#addCommentToPost").submit(function (event){
        event.preventDefault()
        addCommentToPostOrCom(postId, $("#com-write").val())
    })

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
            if (targetComment){
                targetElem = document.getElementById('commentCarts')
            } else {
                targetElem = document.getElementById('postCarts')
            }

            let post = $("#postCarts")
            post.replaceWith(createBasicPost(json, post))
            fillingComments(json.comments, postId)
        }
    })
}

async function fillingComments(comments, postId){
    let commentCard = $("#commentCarts")
    let rootComment = $(".rootComment")
    let subComment = $(".subComment")

    if (comments.length !== 0){
        commentCard.removeClass('d-none')
    }

    for (let com of comments) {
        try {
            const response = await fetch(`https://blog.kreosoft.space/api/comment/${com.id}/tree`, {
                method: 'GET'
            });
            if (response.ok) {
                const json = await response.json();
                if (json !== undefined) {
                    createCommentCard(com, json, rootComment, subComment, commentCard, postId)
                }
            }
        } catch (error) {
            console.error('Error fetching comment:', error);
        }
    }
    targetElem.scrollIntoView({ behavior: 'smooth' });
}

function createCommentCard(rootFilling, subCommentFilling, rootTemplate, subCommentTemplate, commentCard, postId){
    getUserId().then((userId) => {
        let rootCard = fillingCommentElem(rootTemplate, rootFilling, userId, postId)

        for (let subCom of subCommentFilling){
            let subCommentCard = fillingCommentElem(subCommentTemplate, subCom, userId, postId)
            rootCard.find(".sub-comments").append(subCommentCard)
        }

        if (subCommentFilling.length !== 0)
        {
            rootCard.find(".open-sub-comment").removeClass('d-none')
            rootCard.find(".open-sub-comment").click(function (){
                $(this).find('.sub-comments').removeClass('d-none')
                $(this).find('.openBtn').addClass('d-none')
            })
        }

        commentCard.find("#commentList").append(rootCard)
        UpdatePage()
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
        tooltipList
    })
}

function fillingCommentElem(comment, commentFilling, userId, postId){
    let commentCard = comment.clone()
    commentCard.removeClass('d-none')

    commentCard.find(".comment-name").text(commentFilling.author)
    commentCard.find(".comment-body").text(commentFilling.content)

    if (commentFilling.deleteDate !== null){
        commentCard.find(".comment-name").text('[Комментарий удален]')
        commentCard.find(".comment-body").text('[Комментарий удален]')
    } else {
        if (userId === commentFilling.authorId){
            let edit = commentCard.find(".commentEditForm")
            let oldCom = commentCard.find(".oldComment")
            let editText = commentCard.find(".editText")
            let comText = commentCard.find(".comment-body")

            commentCard.find(".myComment").removeClass('d-none')
            commentCard.find(".deleteCom").click(function (){
                deleteComment(commentFilling.id)
            })
            commentCard.find(".editCom").click(function (){
                edit.removeClass('d-none')
                oldCom.addClass('d-none')
                editText.val(comText.text())
            })
            edit.submit(function (event){
                event.preventDefault()
                editComment(commentFilling.id, editText.val())
            })
        }

        if (commentFilling.modifiedDate !== null) {
            commentCard.find(".changeText").removeClass('d-none')
            commentCard.find(".changeText").attr("data-bs-title", getDate(commentFilling.modifiedDate))
        }
    }

    commentCard.find(".textCommentDate").text(getDate(commentFilling.createTime))

    let reply = commentCard.find(".commentReplyForm")
    let replyText = commentCard.find(".replyText")

    commentCard.find(".replyBtn").click(function (){
        reply.removeClass('d-none')
    })

    reply.submit(function (event){
        event.preventDefault()
        addCommentToPostOrCom(postId, replyText.val(), commentFilling.id)
    })

    return commentCard
}

async function addCommentToPostOrCom(postId, content, comId){
    let data = GetParams(comId, content)

    fetch(`https://blog.kreosoft.space/api/post/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.ok){
            location.reload()
        }
    })
}

function getUserId(){
    return fetch('https://blog.kreosoft.space/api/account/profile', {
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
            return json.id
        } else {
            return null
        }
    })
}

function GetParams(parentId, content){
    return {
        'content': content,
        'parentId': parentId
    }
}

async function deleteComment(comId){
    return fetch(`https://blog.kreosoft.space/api/comment/${comId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then((response) => {
        if (response.ok){
            location.reload()
        }
    })
}

async function editComment(comId, content){
    return fetch(`https://blog.kreosoft.space/api/comment/${comId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            'content': content
        })
    }).then((response) => {
        if (response.ok){
            location.reload()
        }
    })
}