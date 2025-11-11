import { Link } from "react-router-dom";
import { Logout } from "../../ui/Logout";
function GVDeCuongSideNav() {
  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">
         
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

export default GVDeCuongSideNav;
