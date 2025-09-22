function SideNav() {
    return (
        <div className="side-nav">
            <div className="side-nav-inner">
                <ul className="side-nav-menu scrollable">

                    <li className="nav-item dropdown">
                        <a className="dropdown-toggle" href="javascript:void(0);">
                            <span className="icon-holder">
                                <i className="anticon anticon-lock" />
                            </span>
                            <span className="title">Authentication</span>
                            <span className="arrow">
                                <i className="arrow-icon" />
                            </span>
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <a href="login-1.html">Login 1</a>
                            </li>
                            <li>
                                <a href="login-2.html">Login 2</a>
                            </li>
                            <li>
                                <a href="login-3.html">Login 3</a>
                            </li>
                            <li>
                                <a href="sign-up-1.html">Sign Up 1</a>
                            </li>
                            <li>
                                <a href="sign-up-2.html">Sign Up 2</a>
                            </li>
                            <li>
                                <a href="sign-up-3.html">Sign Up 3</a>
                            </li>
                            <li>
                                <a href="error-1.html">Error 1</a>
                            </li>
                            <li>
                                <a href="error-2.html">Error 2</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default SideNav;