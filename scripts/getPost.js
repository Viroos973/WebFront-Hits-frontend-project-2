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
        }
    })
}