import { useContext } from "react";
import { Outlet } from 'react-router-dom';

import NotificationField from "../components/NotificationField"
import AuthContext from '../helpers/Authcontext';

import '../Assets/SCSS/sideBarLayout.scss';

function SideBarLayout() {
    const { authState } = useContext(AuthContext);

    return (
        <>
            <NotificationField />
            <div id="side-bar-layout">
                <section className="control-container">
                    <div className="control-container__user-information">
                        <div className="control-container__user-information__avatar">
                            <img src="/" alt="avatar" />
                        </div>
                        <button className="btn btn-text">{authState.username || 'no name'}</button>
                        <div className="control-container__user-information__more-submenu"></div>
                    </div>
                    <div className="control-container__navbar"></div>
                    <div className="control-container__helper"></div>
                </section>
                <section className="content-container">
                    <Outlet />
                </section>
            </div>
        </>
    )
}

export default SideBarLayout;
