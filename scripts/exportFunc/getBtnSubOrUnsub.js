export async function getUserCommunityBtn(community, communityId){
    fetch(`https://blog.kreosoft.space/api/community/${communityId}/role`, {
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
            community.find(".subscribe").click(function (){
                subscribeFunc(community, communityId)
            })

            community.find(".unsubscribe").click(function (){
                unsubscribeFunc(community, communityId)
            })

            if (json === "Administrator"){
                community.find(".createCommunityPost").removeClass('d-none')
            } else if (json === "Subscriber"){
                community.find(".unsubscribe").removeClass('d-none')
            } else {
                community.find(".subscribe").removeClass('d-none')
            }
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

            if (window.location.pathname !== "/communities") location.reload()
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
            
            if (window.location.pathname !== "/communities") location.reload()
        }
    })
}