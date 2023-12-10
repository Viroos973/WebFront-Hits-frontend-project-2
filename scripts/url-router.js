import {loginFunction} from "./login.js"
import {registrationFunction} from "./register.js"
import {profileFunction} from "./getProfile.js"
import {filterFunction} from "./filter.js"
import {UpdatePage} from "./exportFunc/updatePage.js";
import {getComment, getPostFunc} from "./getPost.js";
import {authorsFunction} from "./authors.js";
import {createUserPost} from "./createUserPost.js";
import {communityListFunction} from "./communityList.js";
import {specificCommunityFunc} from "./specificCommunity.js";

const route = (event) => {
    event = event || window.event
    event.preventDefault()

    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    let hrefPage =  event.target.href
    hrefPage = hrefPage.substring(hrefPage.indexOf('=') + 1)
    url.searchParams.append('page', hrefPage);
    window.location.href = url.toString();
}

const routes = {
    "/communities/:Id": specificCommunityFunc,
    "/post/:Id": getPostFunc,
    "/post/:Id/comment": getComment,
    "/": filterFunction,
    "/login": loginFunction,
    "/register": registrationFunction,
    "/profile": profileFunction,
    "/authors": authorsFunction,
    "/post/create": createUserPost,
    "/communities": communityListFunction
}

export const handleLocation = async () => {
    let path = window.location.pathname
    let paramsOne = window.location.search
    let paramsTwo = paramsOne

    const match = path.match('([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})')

    if (match){
        path = path.replace(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/, ":Id")
        paramsOne = match[0]
    }

    const route = routes[path]
    route(paramsOne, paramsTwo)
    UpdatePage()
}

window.onpopstate = handleLocation
window.route = route

$(document).ready(handleLocation())