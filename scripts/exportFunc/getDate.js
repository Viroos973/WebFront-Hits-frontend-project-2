export function getDate(date){
    return (date.substring(0, date.indexOf("T"))
    + " " + date.substring(date.indexOf("T") + 1, date.indexOf("T") + 6))
}