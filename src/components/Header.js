import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import logo from "../img/logo.png"
import settings from "../img/settings.png"
import menu from "../img/menu.png"
import {AuthContext} from "../context/auth.context";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const auth = useContext(AuthContext)

    const toggleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const onContentClick = (e) => {
        e.stopPropagation();
    }

    useEffect(() => {
        if (isMenuOpen) {
            document.body.setAttribute("style", "overflow: hidden");
        } else {
            document.body.setAttribute("style", "overflow: auto");
        }
    }, [isMenuOpen])

    return (
        <>
            <header className={"header wrapper"}>
                <Link to={"/"} className={"header__logo"}>
                    <img src={logo} alt={"Expert Сеть современных АЗС"}/>
                </Link>
                <div className={"header__menu"}>
                    <a className={"header__menu-item"} href={"http://www.expert12.ru/events/"}>Акции</a>
                    <a className={"header__menu-item"} href={"http://www.expert12.ru/refuel-map/"}>карта АЗС</a>
                    <a className={"header__menu-item"} href={"http://www.expert12.ru/shinomontazh.html"}>шиномонтаж</a>
                    <a className={"header__menu-item"} href={"http://www.expert12.ru/carwash.html"}>автомойка</a>
                    <a className={"header__menu-item"} href={"http://www.expert12.ru/vacansy/"}>вакансии</a>
                    {/*<a className={"header__site-link header__menu-item"} href={"http://www.expert12.ru/"}>Вернуться на сайт</a>*/}
                </div>
                <div className={"header__icons"}>
                    {
                        auth.isAuthenticated
                            ? <Link className={"header__menu-item -settings"} to={"/settings"}>
                                <img src={settings} alt={"settings"}/>
                            </Link>
                            : void 0
                    }
                    <div className={"header__menu-item -menu"} onClick={toggleMenuOpen}>
                        <img src={menu} alt={"menu"}/>
                    </div>
                </div>
            </header>
            {
                isMenuOpen
                    ?  <div className={"mobile-menu-container"} onClick={closeMenu}>
                        <div className={"mobile-menu"} onClick={onContentClick}>
                            <div className={"mobile-menu__close"} onClick={closeMenu}/>
                            <a className={"mobile-menu__item"} href={"http://www.expert12.ru/events/"}>Акции</a>
                            <a className={"mobile-menu__item"} href={"http://www.expert12.ru/refuel-map/"}>карта АЗС</a>
                            <a className={"mobile-menu__item"} href={"http://www.expert12.ru/shinomontazh.html"}>шиномонтаж</a>
                            <a className={"mobile-menu__item"} href={"http://www.expert12.ru/carwash.html"}>автомойка</a>
                            <a className={"mobile-menu__item"} href={"http://www.expert12.ru/vacansy/"}>вакансии</a>
                            <div className={"mobile-menu__item -exit"} onClick={auth.logout}>Выход из профиля</div>
                        </div>
                    </div>
                    : void 0
            }
        </>
    )
}

export default Header