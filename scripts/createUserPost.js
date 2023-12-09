import {Validate} from "./validationForm.js";
import {getTags} from "./getTags.js";

let level = 0
let objectGuid = null
let param

export async function createUserPost(params){
    history.replaceState({}, "", `/post/create`)
    param = params.slice(1)

    document.getElementById("myContent").innerHTML =
        await fetch("/views/createUserPost.html").then((data) => data.text())

    Validate()

    $('.selectAddress').select2({ width: '100%' })

    getTags($("#createByTags"))
    getUserCommunity()
    inputChange($("#addressElem"), 0)

    $("#form-create-user-post").submit(function (event) {
        event.preventDefault()
        let data = GetParams()
        let communityId = $("#createByGroups").val()

        if (communityId === "0"){
            createPostWithoutCommunity(data)
        } else {
            createPostWithCommunity(data, communityId)
        }
    })
}

async function getUserCommunity(){
    fetch('https://blog.kreosoft.space/api/community/my', {
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
            for (let data of json){
                if (data.role === "Administrator"){
                    getCommunityName(data.communityId)
                }
            }
        }
    })
}

async function getCommunityName(Id){
    fetch(`https://blog.kreosoft.space/api/community/${Id}`, {
        method: 'GET'
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            if (param === Id) $("#createByGroups").append('<option value="' + Id + '" selected>' + json.name + '</option>')
            else $("#createByGroups").append('<option value="' + Id + '">' + json.name + '</option>')
        }
    })
}

function inputChange(div, lev){
    let obj = $(`#l-${lev}`)
    let selectedData = ""

    if (lev === 0){
        obj.on('select2:select', function (){
            let allDivs = $("#address").find('div')
            let currentId = 0

            allDivs.each(function(index, element) {
                let elementId = parseInt($(element).find(".selectAddress").attr('id').match(/\d+/)[0])

                if (elementId > currentId){
                    level = currentId
                    element.remove()
                }
            })

            if ($(this).val() !== '0'){
                objectGuid = "889b1f3a-98aa-40fc-9d3d-0f41192758ab"
                addAddressElem(1281271)
            } else {
                objectGuid = null
            }
        })
    } else {
        let parentId = $(`#l-${lev - 1}`)

        obj.on('select2:open', function (){
            let inputSelect = $('.select2-search__field')

            inputSelect.val(selectedData)
            inputSelect.off('input').on('input', function() {
                selectedData = $(this).val()
                getAddressChild(parentId.val(), $(`#l-${lev}`), selectedData)
            })
        })

        obj.on('select2:select', function (){
            let data = $(this).find('option:selected').data('value')
            let allDivs = $("#address").find('div')
            let currentId = parseInt($(this).attr('id').match(/\d+/)[0])

            allDivs.each(function(index, element) {
                let elementId = parseInt($(element).find(".selectAddress").attr('id').match(/\d+/)[0])

                if (elementId > currentId){
                    level = currentId
                    element.remove()
                }
            })

            if ($(this).val() !== '0'){
                div.find('label').text(data.objectLevelText)

                if (data.objectLevel !== "Building"){
                    addAddressElem(data.objectId)
                }
            } else {
                div.find('label').text("Нет элемента")

                if (parentId.attr('id').match(/\d+/)[0] === '0') data = { objectGuid: "889b1f3a-98aa-40fc-9d3d-0f41192758ab" }
                else data = parentId.find('option:selected').data('value')
            }

            objectGuid = data.objectGuid
        })
    }
}

function addAddressElem(parentId){
    level++
    let div = $("<div></div>")
    div.addClass('mb-3')

    let label = $("<label></label>")
    label.attr('for', `l-${level}`)
    label.text('Следующий элемент')

    let select = $("<select></select>")
    select.addClass('selectAddress', 'form-control')
    select.attr('id', `l-${level}`)
    select.append('<option></option>')
    select.append('<option value="0">-</option>')

    div.append(label)
    div.append(select)
    $(select).select2({ width: '100%' })

    $("#address").append(div)

    getAddressChild(parentId, select)
    inputChange(div, level)
}

function getAddressChild(parentId, select, query){
    let url = `https://blog.kreosoft.space/api/address/search`
    url += `?parentObjectId=${parentId}`

    if (query){
        url += `&query=${query}`
        select.find('option:gt(1)').remove();
    }

    fetch(url, {
        method: 'GET'
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            for (let data of json){
                select.append('<option value="' + data.objectId + '" data-value=\'' + JSON.stringify(data) + '\'>' + data.text + '</option>')
            }
        }
    })
}

function GetParams(){
    let title = $("#createNamePost").val()
    let description = $("#createTextPost").val()
    let readingTime = $("#createReadingTime").val()
    let image = $("#createImg").val()
    let addressId = objectGuid
    let tags = $("#createByTags").val()

    return {
        'title': title,
        'description': description,
        'readingTime': readingTime,
        'image': image === ""? null : image,
        'addressId': addressId,
        'tags': tags
    }
}

async function createPostWithoutCommunity(data){
    fetch('https://blog.kreosoft.space/api/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (!response.ok){
            $("#form-create-user-post .error-mes").css('display', 'block')
        } else {
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            history.pushState({}, "", "/")
            location.reload()
        }
    })
}

async function createPostWithCommunity(data, communityId){
    fetch(`https://blog.kreosoft.space/api/community/${communityId}/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (!response.ok){
            $("#form-create-user-post .error-mes").css('display', 'block')
        } else {
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            history.pushState({}, "", "/")
            location.reload()
        }
    })
}