export async function filterFunction(params){
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
                $("#searchByTags").append('<option value="' + json[i].id + '">' + json[i].name + '</option>');
            }
        }
    })

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
    postCard.find("#post-text").text(fillingDescription(post.description))
    postCard.find("#tags-text").text(post.tags.map(tag => "#" + tag.name + " "))
    postCard.find("#time-text").text("Время чтения: " + post.readingTime + " мин")
    fillingAddress(post.addressId, postCard)
    postCard.find(".count-comments").text(post.commentsCount)
    postCard.find(".count-like").text(post.likes)
    if(post.hasLike) postCard.find("#hasLike").removeClass("far").addClass("fas")
    else postCard.find("#hasLike").removeClass("fas").addClass("far")

    postCard.find("#addOrDeleteLike").click(function (){
        let likeIcon = this.querySelector('i');
        if (likeIcon.classList.contains('far')) {
            addLikeFunction(post, postCard, likeIcon, postCard.find(".count-like").text())
        } else {
            deleteLikeFunction(post, postCard, likeIcon, postCard.find(".count-like").text())
        }
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

function fillingDescription(text){
    if (text.length > 500){
        return text.substring(0, 500) + "..."
    }

    return text
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

function getPage(countPage, currentPage){
    let numPageDisplay = 3
    let half = Math.floor(numPageDisplay / 2)
    let to = numPageDisplay

    if (currentPage + half > countPage){
        to = countPage
    } else if (currentPage > half){
        to = currentPage + half
    }

    let minPageDisplay = Math.max(to - numPageDisplay, 0)

    return Array.from({ length: Math.min(countPage, numPageDisplay) }, (v, i) => i + minPageDisplay + 1)
}

function getPagination(currentPage, countPage){
    let pages = getPage(countPage, currentPage)
    let pagination = $("#pageDisplay")

    pagination.append('<li class="page-item"> <a class="page-link" href="?page=' + (currentPage - 1 >= 1? currentPage - 1 : 1) +
        '" onclick="route()">&laquo;</a>')

    for (let page of pages){
        pagination.append('<li class="page-item ' + (currentPage === page? 'active' : '') + '"> <a class="page-link" href="?page=' + page +
            '" onclick="route()">' + page + '</a>')
    }

    pagination.append('<li class="page-item"> <a class="page-link" href="?page=' + (currentPage + 1 <= countPage? currentPage + 1 : countPage) +
        '" onclick="route()">&raquo;</a>')
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