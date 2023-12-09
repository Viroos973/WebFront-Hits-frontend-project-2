
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

    communityCard.find(".communityName").text(data.name).attr("data-value", data.id)
    getUserCommunityId(communityCard, data.id)

    communityCard.find(".subscribe").click(function (){
        subscribeFunc(communityCard, data.id)
    })

    communityCard.find(".unsubscribe").click(function (){
        unsubscribeFunc(communityCard, data.id)
    })

    return communityCard
}

async function getUserCommunityId(community, communityId){
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
                if (communityId === data.communityId){
                    if (data.role !== "Administrator"){
                        community.find(".unsubscribe").removeClass('d-none')
                    }
                    return
                }
            }

            community.find(".subscribe").removeClass('d-none')
        }
    })
}

async function subscribeFunc(community, communityId){
    fetch(`https://blog.kreosoft.space/api/community/${communityId}/subscribe`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then((response) => {
        if (response.ok){
            community.find(".unsubscribe").removeClass('d-none')
            community.find(".subscribe").addClass('d-none')
        }
    })
}

async function unsubscribeFunc(community, communityId){
    fetch(`https://blog.kreosoft.space/api/community/${communityId}/unsubscribe`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then((response) => {
        if (response.ok){
            community.find(".subscribe").removeClass('d-none')
            community.find(".unsubscribe").addClass('d-none')
        }
    })
}