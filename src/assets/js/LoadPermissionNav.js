$(document).ready(async function () {
    await LoadPermissionNav();
});
async function LoadPermissionNav() {
    const res = await $.ajax({
        url: `/api/load-nav-nguoi-dung`,
        type: 'GET'
    });
    let html = "";
    const data = JSON.parse(res);
    html =
        `
            <li class="nav-item dropdown">
                 <a href="/trang-chu">
                    <span class="icon-holder">
                       <i class="fas fa-home"></i>
                    </span>
                    <span class="title">Trang chủ</span>
                </a>
            </li>
            `;
    data.forEach(navcha => {     
        if (navcha.NavCon && navcha.NavCon.length > 0) {
            html += `
                <li class="nav-item dropdown" data-ma="Admin_${navcha.NavCha.replace(/\s+/g, '')}">
                    <a class="dropdown-toggle" href="javascript:void(0);">
                        <span class="icon-holder">
                            ${navcha.URL_IC}
                        </span>
                        <span class="title">${navcha.NavCha}</span>
                        <span class="arrow">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </a>
                    <ul class="dropdown-menu">
                        ${navcha.NavCon.map(con => `
                            <li>
                                <a href="${con.link_dieu_huong}">${con.ten_nav_con}</a>
                            </li>
                        `).join("")}
                    </ul>
                </li>
                `;
        } else {
            html += `
                <li class="nav-item dropdown" data-ma="Admin_${navcha.NavCha.replace(/\s+/g, '')}">
                    <a href="${navcha.URL_NC || 'javascript:void(0);'}">
                        <span class="icon-holder">
                            ${navcha.URL_IC}
                        </span>
                        <span class="title">${navcha.NavCha}</span>
                    </a>
                </li>
                `;
        }
    });
    html +=
        `
            <li class="nav-item dropdown">
                <a class="dropdown-toggle" href="javascript:void(0)" onclick="logout()">
                    <span class="icon-holder">
                        <i class="anticon anticon-logout"></i>
                    </span>
                    <span class="title">Đăng xuất</span>
                </a>
            </li>
            `;
    $(".side-nav-menu").html(html);
    $(".side-nav-menu .dropdown-toggle").off("click").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation(); 
        const parentLi = $(this).closest(".nav-item");
        const submenu = parentLi.find(".dropdown-menu").first();
        if (parentLi.hasClass("open")) {
            submenu.stop(true, true).slideUp(200);
            parentLi.removeClass("open");
        } else {
            $(".side-nav-menu .nav-item.open").removeClass("open").find(".dropdown-menu").slideUp(200);
            submenu.stop(true, true).slideDown(200);
            parentLi.addClass("open");
        }
    });
}