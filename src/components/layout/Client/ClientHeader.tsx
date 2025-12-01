import { Link } from "react-router-dom";

function ClientHeaderLayout() {
  return (
    <div className="header">
      <div className="logo logo-dark">
        <Link to="/" className="logo-link">
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
     
      </div>
    </div>
  );
}
export default ClientHeaderLayout;
