import { NavLink } from "react-router-dom";
import { Logout } from "../../ui/Logout";

function CTDTSideNav() {
  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">

          <li>
            <NavLink
              to="/ctdt/danh-sach-can-bo-vien-chuc"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">
                👨‍🏫 Quản lý danh sách cán bộ viên chức thuộc CTĐT
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ctdt/danh-sach-mon-hoc"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">
                📚 Quản lý danh sách môn học thuộc CTĐT
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ctdt/danh-sach-lop"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">
                🏫 Quản lý danh sách lớp
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ctdt/danh-sach-sinh-vien"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">
                👨‍🎓 Quản lý danh sách sinh viên
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ctdt/danh-sach-de-cuong-can-duyet"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">
                📝 Quản lý danh sách đề cương cần duyệt
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#"
              onClick={Logout}
            >
              <span className="title">🔒 Đăng xuất</span>
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default CTDTSideNav;
