import {createBasicPost} from "./createPost.js";
import {getTags} from "./getTags.js";
import {getPagination} from "./getPagination.js";

export async function filterFunction(params){
    document.getElementById("myContent").innerHTML =
        await fetch("/views/filter.html").then((data) => data.text())

    getTags($("#searchByTags"))

    fetch(`https://blog.kreosoft.space/api/post${params}`, {
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

        const searchByAuthors = $('#searchByAuthors').val()
        const searchByTags = $('#searchByTags').val()
        const sortingPosts = $('#sortingPosts').val()
        const searchMinMinutes = $('#searchMinMinutes').val()
        const searchMaxMinutes = $('#searchMaxMinutes').val()
        const flexCheckGroups = $('#flexCheckGroups').is(':checked')
        const sizePage = $('#sizePage').val()

        const params = {}

        if (searchByTags) params.tags = searchByTags
        if (searchByAuthors) params.author = searchByAuthors
        if (searchMinMinutes) params.min = searchMinMinutes
        if (searchMaxMinutes) params.max = searchMaxMinutes
        if (sortingPosts) params.sorting = sortingPosts
        params.onlyMyCommunities = flexCheckGroups
        params.page = 1
        if (sizePage) params.size = sizePage

        let paramString = $.param(params)
        paramString = "?" + paramString.replace(/%5B%5D/g, '')
        history.pushState({}, "", paramString)
        location.reload()
    })
}

function fillingFilter(){
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.get('author')) $('#searchByAuthors').val(urlParams.get('author'))
    if (urlParams.getAll('tags')) $('#searchByTags').val(urlParams.getAll('tags'))
    if (urlParams.get('sorting')) $('#sortingPosts').val(urlParams.get('sorting'))
    if (urlParams.get('min')) $('#searchMinMinutes').val(urlParams.get('min'))
    if (urlParams.get('max')) $('#searchMaxMinutes').val(urlParams.get('max'))
    $('#flexCheckGroups').prop('checked', urlParams.get('onlyMyCommunities') === 'true')
    if (urlParams.get('size')) $('#sizePage').val(urlParams.get('size'))
}