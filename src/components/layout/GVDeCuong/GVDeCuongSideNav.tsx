import { Link } from "react-router-dom";
import { Logout } from "../../ui/Logout";
function GVDeCuongSideNav() {
  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">
          <li>
            <Link className="dropdown-toggle" to={"/gv-de-cuong/danh-sach-de-cuong-duoc-phan-cong"}>
              <span className="title">📄 Quản lý danh sách đề cương được phân công</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to="#" onClick={Logout}>
              <span className="title">🔒 Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GVDeCuongSideNav;
