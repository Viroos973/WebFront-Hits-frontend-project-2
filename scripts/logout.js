export async function logoutFunction(){
    $("#logout-btn").on("click", function (){
        fetch('https://blog.kreosoft.space/api/account/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then((response) => {
            if (response.ok){
                localStorage.setItem('token', "")
                history.pushState({}, "", "/")
                location.reload()
            }
        })
    })
}
