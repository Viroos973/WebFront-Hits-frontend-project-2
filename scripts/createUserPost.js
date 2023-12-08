import {Validate} from "./validationForm.js";
import {getTags} from "./getTags.js";

let level = 0
let objectGuid

export async function createUserPost(){
    document.getElementById("myContent").innerHTML =
        await fetch("/views/createUserPost.html").then((data) => data.text())

    Validate()

    $('.selectAddress').select2({ width: '100%' })

    getTags($("#createByTags"))
    getUserCommunity()
    inputChange($("#addressElem"), 0)
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
            $("#createByGroups").append('<option value="' + Id + '">' + json.name + '</option>')
        }
    })
}

function inputChange(div, lev){
    let obj = $(`#l-${lev}`)

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
            $('.select2-search__field').on('input', function() {
                getAddressChild(parentId.val(), $(`#l-${lev}`), $(this).val())
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
    select.append('<option value="0"></option>')

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
        select.empty()
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
                select.append('<option value="' + data.objectId + '" data-value=\'' + JSON.stringify(data) + '\'>' + data.text + '</option>');
            }
        }
    })
}