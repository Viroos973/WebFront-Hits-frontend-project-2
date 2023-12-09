import {getTags} from "./getTags.js";
import {getUserCommunityBtn} from "./getBtnSubOrUnsub.js";
import {createBasicPost} from "./createPost.js";
import {getPagination} from "./getPagination.js";

export async function specificCommunityFunc(communityId, params) {
    document.getElementById("myContent").innerHTML =
        await fetch("/views/specificCommunity.html").then((data) => data.text())

    getTags($("#searchByTags"))
    getUserCommunityBtn($("#btnCommunity"), communityId)
    getCommunity(communityId)

    fetch(`https://blog.kreosoft.space/api/community/${communityId}/post${params}`, {
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
            fillingFilter()
            $(`#postsOnPage`).empty()
            for (let data of json.posts){
                $("#postsOnPage").append(createBasicPost(data, $("#postCarts")))
            }
            getPagination(json.pagination.current, json.pagination.count)
        }
    })

    $('#form-filter').on('submit', function(event) {
        event.preventDefault()

        const searchByTags = $('#searchByTags').val()
        const sortingPosts = $('#sortingPosts').val()
        const sizePage = $('#sizePage').val()

        const params = {}

        if (searchByTags) params.tags = searchByTags
        if (sortingPosts) params.sorting = sortingPosts
        if (sizePage) params.size = sizePage
        params.page = 1

        let paramString = $.param(params)
        paramString = "?" + paramString.replace(/%5B%5D/g, '')
        history.pushState({}, "", paramString)
        location.reload()
    })

    $(".createCommunityPost").click(function (event){
        event.preventDefault()

        let path = $(this).attr('href')
        path += `?${communityId}`
        history.pushState({}, "", path)
        location.reload()
    })
}

async function getCommunity(Id){
    fetch(`https://blog.kreosoft.space/api/community/${Id}`, {
        method: 'GET'
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            $(".community-title").text(`Группа "${json.name}"`)
            $(".community-text").text(` ${json.subscribersCount} подписчиков`)

            if(json.isClosed) $(".type-community-text").text(`Тип сообщества: закрытое`)
            else $(".type-community-text").text(`Тип сообщества: открытое`)

            for (let admin of json.administrators){
                let adm = $(".admin").clone()
                adm.removeClass('d-none')

                if (admin.gender === "Female") adm.find(".imgAuthors").attr('src', '/views/images/woman.png')
                else adm.find(".imgAuthors").attr('src', '/views/images/man.png')

                adm.find(".adminName").text(admin.fullName)

                $(".admins").append(adm)
            }
        }
    })
}

function fillingFilter(){
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.getAll('tags')) $('#searchByTags').val(urlParams.getAll('tags'))
    if (urlParams.get('sorting')) $('#sortingPosts').val(urlParams.get('sorting'))
    if (urlParams.get('size')) $('#sizePage').val(urlParams.get('size'))
}