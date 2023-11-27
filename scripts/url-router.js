import {loginFunction} from "./login.js"
import {registrationFunction} from "./register.js"

const route = (event) => {
    event = event || window.event
    event.preventDefault()
    window.history.pushState({}, "", event.target.href)
    handleLocation()
}

const routes = {
    "/login": loginFunction,
    "/register": registrationFunction
}

const handleLocation = async () => {
    const path = window.location.pathname
    const route = routes[path]
    route()
}

window.onpopstate = handleLocation
window.route = route