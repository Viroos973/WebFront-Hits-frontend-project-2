function getPage(countPage, currentPage){
    let numPageDisplay = 3
    let half = Math.floor(numPageDisplay / 2)
    let to = numPageDisplay

    if (currentPage + half > countPage){
        to = countPage
    } else if (currentPage > half){
        to = currentPage + half
    }

    let minPageDisplay = Math.max(to - numPageDisplay, 0)

    return Array.from({ length: Math.min(countPage, numPageDisplay) }, (v, i) => i + minPageDisplay + 1)
}

 export function getPagination(currentPage, countPage){
    let pages = getPage(countPage, currentPage)
    let pagination = $("#pageDisplay")

    pagination.append('<li class="page-item"> <a class="page-link" href="?page=' + (currentPage - 1 >= 1? currentPage - 1 : 1) +
        '" onclick="route()">&laquo;</a>')

    for (let page of pages){
        pagination.append('<li class="page-item ' + (currentPage === page? 'active' : '') + '"> <a class="page-link" href="?page=' + page +
            '" onclick="route()">' + page + '</a>')
    }

    pagination.append('<li class="page-item"> <a class="page-link" href="?page=' + (currentPage + 1 <= countPage? currentPage + 1 : countPage) +
        '" onclick="route()">&raquo;</a>')
}