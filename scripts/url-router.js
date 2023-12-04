import {loginFunction} from "./login.js"
import {registrationFunction} from "./register.js"
import {profileFunction} from "./getProfile.js"
import {filterFunction} from "./filter.js"
import {UpdatePage} from "./updatePage.js";
import {getPostFunc} from "./getPost.js";

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
    "/post/:Id": getPostFunc,
    "/": filterFunction,
    "/login": loginFunction,
    "/register": registrationFunction,
    "/profile": profileFunction
}

export const handleLocation = async () => {
    let path = window.location.pathname
    let params = window.location.search

    const match = path.match('([0-9a-f-]+)')

    if (match){
        path = path.replace(/\/post\/[0-9a-f-]+/, "/post/:Id")
        params = match[0]
    }

    const route = routes[path]
    UpdatePage()
    route(params)
}

window.onpopstate = handleLocation
window.route = route

$(document).ready(handleLocation())