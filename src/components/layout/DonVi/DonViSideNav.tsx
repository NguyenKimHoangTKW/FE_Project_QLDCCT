import { Link } from "react-router-dom";
import { Logout } from "../../ui/Logout";
function DonViSideNav() {
  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">
          <li>
            <Link className="dropdown-toggle" to={"/ctdt/danh-sach-mon-hoc"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý học phần cho đề cương</span>
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
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-khoa-hoc-thuoc-donvi"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý khóa học thuộc Đơn vị</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/donvi/danh-sach-mon-hoc-thuoc-donvi"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý học phần thuộc Đơn vị</span>
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
