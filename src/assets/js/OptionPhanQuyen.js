let BASE_URL = `/api/v1/admin`;
let BASE_URL_DV = `/api/v1/donvi`;
let BASE_URL_CTDT = `/api/v1/ctdt`;
let BASE_URL_DVCM = `/api/v1/dvcm`;
function goBack() {
    window.history.back();
}
$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    if (jqxhr.status === 401) {
        Swal.fire({
            text: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
            icon: "warning"
        }).then(() => {
            Logout_Session();
            window.location.href = "/trang-chu";
        });
    }
});
$(document).ready(function () {
    $("input").attr("autocomplete", "off");
    $("#from_date, #to_date").attr("readonly");
   
    $(".datetime-input").datepicker({
        closeText: "Đóng",
        prevText: "Trước",
        nextText: "Sau",
        currentText: "Hôm nay",
        monthNames: ["Tháng một", "Tháng hai", "Tháng ba", "Tháng tư", "Tháng năm", "Tháng sáu", "Tháng bảy", "Tháng tám", "Tháng chín", "Tháng mười", "Tháng mười một", "Tháng mười hai"],
        monthNamesShort: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
        dayNames: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
        dayNamesShort: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
        dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        weekHeader: "Tuần",
        dateFormat: "dd/mm/yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: "",
        changeMonth: true,
        changeYear: true,
        yearRange: "-70:+5"
    }).datepicker("refresh");
})
function goBack() {
    window.history.back();
}
function Sweet_Alert(ico, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: ico,
        title: title
    });
}

function convertToTimestamp(dateStr) {
    if (!dateStr) return null;

    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const dateObj = new Date(year, month, day);
    return Math.floor(dateObj.getTime() / 1000);
}
function unixTimestampToDate(unixTimestamp) {
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
function ajaxAsync(options) {
    return new Promise((resolve, reject) => {
        $.ajax(options).done(resolve).fail(reject);
    });
}
function initImportUI({ formSelector, uploadBtn, fileInput, surveyInput, apiUrl }) {
    var hub = $.connection.importHub;
    let startTime = null;
    let totalRows = 0;

    function resetProgress() {
        startTime = null;
        totalRows = 0;
        $("#progressFill")
            .removeClass("bg-success bg-danger bg-info")
            .addClass("progress-bar-animated")
            .css("width", "0%").text("0%");
        $("#progressText").text("0");
        $("#progressTotal").text("0");
        $("#etaText").text("--");
        $("#statusMessage").removeClass("text-success text-danger text-info").text("");
        $("#btnCancelImport").show();
    }

    // --- SignalR handlers ---
    hub.client.updateProgressValue = function (processed, total) {
        if (!startTime) startTime = new Date();
        totalRows = total;

        let percent = total > 0 ? Math.round((processed / total) * 100) : 0;
        $("#progressFill").css("width", percent + "%").text(percent + "%");
        $("#progressText").text(processed);
        $("#progressTotal").text(total);

        // ETA
        let now = new Date();
        let elapsed = (now - startTime) / 1000;
        let avgPerRow = processed > 0 ? elapsed / processed : 0;
        let remaining = Math.max(total - processed, 0);
        let etaSec = Math.round(remaining * avgPerRow);

        if (etaSec > 0 && processed < total) {
            let min = Math.floor(etaSec / 60);
            let sec = etaSec % 60;
            $("#etaText").text(`${min} phút ${sec} giây`);
        } else {
            $("#etaText").text("--");
        }
    };

    hub.client.importCompleted = function (payload) {
        $("#progressFill")
            .removeClass("progress-bar-animated")
            .addClass("bg-success")
            .text("Hoàn tất");
        $("#etaText").text("0 giây");
        $("#statusMessage")
            .addClass("text-success")
            .text(`Import thành công (${payload.inserted || 0} thêm mới, ${payload.updated || 0} cập nhật).`);
        $("#btnCancelImport").hide();

        setTimeout(() => {
            $("#progressModal").modal("hide");
            resetProgress();
        }, 2000);
    };

    hub.client.importCanceled = function (payload) {
        $("#progressFill")
            .removeClass("progress-bar-animated")
            .addClass("bg-info")
            .text("Đã hủy");
        $("#statusMessage")
            .addClass("text-info")
            .text(`Đã hủy import tại dòng ${payload.processed}.`);
        $("#btnCancelImport").hide();

        setTimeout(() => {
            $("#progressModal").modal("hide");
            resetProgress();
        }, 2000);
    };

    hub.client.importFailed = function (msg) {
        $("#progressFill")
            .removeClass("progress-bar-animated")
            .addClass("bg-danger")
            .text("Lỗi");
        $("#statusMessage")
            .addClass("text-danger")
            .text(msg || "Có lỗi khi import.");
        $("#btnCancelImport").hide();

        setTimeout(() => {
            $("#progressModal").modal("hide");
            resetProgress();
        }, 2500);
    };

    // --- Start SignalR ---
    $.connection.hub.start().done(function () {
        console.log("SignalR connected for import UI");
    });

    // --- Handler khi submit form hoặc click button ---
    const handler = async function (e) {
        e.preventDefault();

        const file = $(fileInput)[0].files[0];
        if (!file) {
            Swal.fire("Thông báo", "Vui lòng chọn file Excel!", "warning");
            return;
        }

        let formData = new FormData();
        formData.append("file", file);
        if (surveyInput) {
            const surveyID = $(surveyInput).val();
            if (!surveyID) {
                Swal.fire("Thông báo", "Vui lòng chọn phiếu khảo sát!", "warning");
                return;
            }
            formData.append("surveyID", surveyID);
        }

        resetProgress();
        $("#progressModal").modal({ backdrop: "static", keyboard: false });

        try {
            const res = await $.ajax({
                url: apiUrl,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                xhrFields: { withCredentials: true }
            });

            if (!(res && res.success)) {
                $("#statusMessage").addClass("text-danger").text(res.message || "Không upload được file");
                $("#progressFill")
                    .removeClass("progress-bar-animated")
                    .addClass("bg-danger")
                    .text("Lỗi");
                $("#btnCancelImport").hide();
                setTimeout(() => {
                    $("#progressModal").modal("hide");
                    resetProgress();
                }, 2000);
            }
        } catch (err) {
            $("#statusMessage").addClass("text-danger").text("Có lỗi khi upload file!");
            $("#progressFill")
                .removeClass("progress-bar-animated")
                .addClass("bg-danger")
                .text("Lỗi");
            $("#btnCancelImport").hide();
            setTimeout(() => {
                $("#progressModal").modal("hide");
                resetProgress();
            }, 2000);
        }
    };

    if (formSelector) {
        $(document).on("submit", formSelector, handler);
    } else if (uploadBtn) {
        $(document).on("click", uploadBtn, handler);
    }

    // --- Cancel button ---
    $(document).on("click", "#btnCancelImport", async function () {
        try {
            await $.post("/api/cancel-import");
            $("#statusMessage").addClass("text-info").text("Đang hủy...");
        } catch (err) {
            $("#statusMessage").addClass("text-danger").text("Không gửi được yêu cầu hủy!");
        }
    });
}
