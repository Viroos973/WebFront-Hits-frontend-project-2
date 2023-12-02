import {loginFunction} from "./login.js"
import {registrationFunction} from "./register.js"
import {profileFunction} from "./getProfile.js"
import {filterFunction} from "./filter.js"
import {UpdatePage} from "./updatePage.js";

const route = (event) => {
    event = event || window.event
    event.preventDefault()
    window.history.pushState({}, "", event.target.href)
    handleLocation()
}

const routes = {
    "/": filterFunction,
    "/login": loginFunction,
    "/register": registrationFunction,
    "/profile": profileFunction
}

export const handleLocation = async () => {
    const path = window.location.pathname
    const route = routes[path]
    UpdatePage()
    route()
}

window.onpopstate = handleLocation
window.route = route

$(document).ready(handleLocation())