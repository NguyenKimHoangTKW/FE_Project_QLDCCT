import { Link } from "react-router-dom";
import { Logout } from "../../ui/Logout";
function CTDTSideNav() {
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
            <Link className="dropdown-toggle" to={"/ctdt/danh-sach-hoc-ky-thuoc-ctdt"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý học kỳ thuộc CTĐT</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-toggle" to={"/ctdt/danh-sach-khoa-hoc"}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Quản lý khóa học</span>
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

export default CTDTSideNav;
