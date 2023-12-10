export async function getTags(tagsList){
    fetch('https://blog.kreosoft.space/api/tag', {
        method: 'GET'
    }).then((response) => {
        if (response.ok){
            return response.json()
        }
    }).then((json) => {
        if (json !== undefined) {
            for (let i = 0; i < json.length; i++){
                tagsList.append('<option value="' + json[i].id + '">' + json[i].name + '</option>');
            }
        }
    })
}