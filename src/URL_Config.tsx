export const URL_API_ADMIN = "https://localhost:44314/api/admin";
export const URL_API_CTDT = "https://localhost:44314/api/ctdt";
export const URL_API_CLIENT = "https://localhost:44314/api/client";
export const URL_USER = "https://localhost:44314/api";
export const URL_API_DONVI = "https://localhost:44314/api/donvi";
export const URL_API_SHARED = "https://localhost:44314/api/evaluate";
export const URL_API_DVDC = "https://localhost:44314/api/dvdc";
export const URL = "https://localhost:44314";
export function unixTimestampToDate(unixTimestamp: number) {
    var date = new Date(unixTimestamp * 1000);
    var weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    var dayOfWeek = weekdays[date.getDay()];
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var year = date.getFullYear();
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    var formattedDate = dayOfWeek + ', ' + day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
    return formattedDate;
}