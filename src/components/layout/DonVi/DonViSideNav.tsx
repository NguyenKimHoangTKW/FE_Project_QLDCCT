import { NavLink } from "react-router-dom";
import { Logout } from "../../ui/Logout";

function DonViSideNav() {
  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">

          <li className="nav-item">
            <NavLink
              to="/donvi/danh-sach-mon-hoc-thuoc-donvi"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý học phần thuộc Đơn vị</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/danh-sach-hoc-ky-thuoc-donvi"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý học kỳ thuộc Đơn vị</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/quan-li-danh-sach-can-bo-vien-chuc"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý danh sách cán bộ viên chức</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/danh-sach-khoa-hoc-thuoc-donvi"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý khóa học thuộc Đơn vị</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/danh-sach-mau-de-cuong"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý mẫu đề cương</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/danh-sach-muc-tieu-hoc-phan"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý mục tiêu học phần</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/danh-sach-chuan-dau-ra-hoc-phan"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý chuẩn đầu ra học phần</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/danh-sach-chuan-dau-ra-ctdt"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý chuẩn đầu ra CTĐT</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/tao-moi-mau-de-cuong"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Tạo mới mẫu đề cương</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/quan-li-danh-sach-muc-do-dong-gop"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý mức độ đóng góp</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/quan-li-danh-sach-ma-tran-dong-gop"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý ma trận đóng góp</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/donvi/quan-li-danh-sach-chuong-trinh-dao-tao"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">Quản lý danh sách CTĐT</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              onClick={Logout}
              to="#"
            >
              <span className="title">Đăng xuất</span>
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default DonViSideNav;
