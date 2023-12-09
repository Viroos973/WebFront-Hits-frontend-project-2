import {getUserCommunityBtn} from "./getBtnSubOrUnsub.js";

export async function communityListFunction(){
    document.getElementById("myContent").innerHTML =
        await fetch("/views/communityList.html").then((data) => data.text())

    fetch('https://blog.kreosoft.space/api/community', {
        method: 'GET'
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            for (let data of json){
                $(".card-wrapper").append(createCommunityCard(data))
            }
        }
    })
}

function createCommunityCard(data){
    let communityCard = $("#communityElem").clone()
    communityCard.removeClass('d-none').removeAttr('id')

    communityCard.find(".communityName").text(data.name)
        .click(function (){
            history.pushState({}, "", `/communities/${data.id}`)
            location.reload()
        })

    getUserCommunityBtn(communityCard, data.id)

    return communityCard
}