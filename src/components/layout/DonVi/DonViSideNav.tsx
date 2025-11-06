import { Link } from "react-router-dom";
import { Logout } from "../../ui/Logout";
function DonViSideNav() {
  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">
          <li>
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-mon-hoc-thuoc-donvi"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý học phần thuộc Đơn vị</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-hoc-ky-thuoc-donvi"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý học kỳ thuộc Đơn vị</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/quan-li-danh-sach-can-bo-vien-chuc"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý danh sách cán bộ viên chức</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-khoa-hoc-thuoc-donvi"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý khóa học thuộc Đơn vị</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-mau-de-cuong"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý mẫu đề cương</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-muc-tieu-hoc-phan"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý mục tiêu học phần</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-chuan-dau-ra-hoc-phan"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý chuẩn đầu ra học phần</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-chuan-dau-ra-ctdt"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý chuẩn đầu ra chương trình đào tạo</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/tao-moi-mau-de-cuong"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Tạo mới mẫu đề cương</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/quan-li-danh-sach-muc-do-dong-gop"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý mức độ đóng góp</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" onClick={Logout}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DonViSideNav;
