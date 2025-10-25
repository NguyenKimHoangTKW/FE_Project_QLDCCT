import { Link } from "react-router-dom";

function DonViHeaderLayout() {
  return (
    <div className="header">
      <div className="logo logo-dark">
        <Link to="/ctdt" className="logo-link">
          <img
            src="/src/assets/images/logo/Icon.png"
            style={{ width: "66px" }}
            alt="Logo"
          />
          <img
            className="logo-fold"
            src="/src/assets/images/logo/Icon.png"
            style={{ width: "66px" }}
            alt="Logo"
          />
        </Link>
      </div>
      <div className="logo logo-white">
        <a href="/">
          <img
            src="/src/assets/images/logo/Icon.png"
            style={{
              width: "63px",
            }}
            alt="Logo"
          />
          <img
            className="logo-fold"
            src="/src/assets/images/logo/Icon.png"
            style={{
              width: "63px",
            }}
            alt="Logo"
          />
        </a>
      </div>
      <div className="nav-wrap">
        <ul className="nav-left">
          <li className="desktop-toggle">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <i className="anticon" />
            </a>
          </li>
          <li className="mobile-toggle">
            <a href="javascript:void(0);">
              <i className="anticon" />
            </a>
          </li>
        </ul>
        <ul className="nav-right">
          <li className="dropdown dropdown-animated scale-left">
            <a href="javascript:void(0);" data-toggle="dropdown">
              <i className="anticon anticon-bell notification-badge" />
            </a>
            <div className="dropdown-menu pop-notification">
              <div className="p-v-15 p-h-25 border-bottom d-flex justify-content-between align-items-center">
                <p className="text-dark font-weight-semibold m-b-0">
                  <i className="anticon anticon-bell" />
                  <span className="m-l-10">Notification</span>
                </p>
                <a
                  className="btn-sm btn-default btn"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <small>View All</small>
                </a>
              </div>
              <div className="relative">
                <div
                  className="overflow-y-auto relative scrollable"
                  style={{ maxHeight: 300 }}
                >
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="dropdown-item d-block p-15 border-bottom"
                  >
                    <div className="d-flex">
                      <div className="avatar avatar-blue avatar-icon">
                        <i className="anticon anticon-mail" />
                      </div>
                      <div className="m-l-15">
                        <p className="m-b-0 text-dark">
                          You received a new message
                        </p>
                        <p className="m-b-0">
                          <small>8 min ago</small>
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default DonViHeaderLayout;
