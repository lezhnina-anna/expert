import React from "react";
import logo from '../img/footer-logo.png'
import vk from '../img/vk.svg'
import instagram from '../img/instagram.svg'
import facebook from '../img/facebook.svg'
import ok from '../img/ok.svg'
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <div className={"footer-container"}>
            <footer className={"footer wrapper"}>
                <div className={"footer__items"}>
                    <div className={"footer__item"}>
                        <img alt={"Express Сеть Современных АЗС"} src={logo}/>
                    </div>
                    <div className={"footer__item"}>
                        Служба поддержки клиентов <b><a href={"tel:88003500525"}>8-800-350-05-25</a></b>
                    </div>
                    <div className={"footer__item"}>
                        Секретарь <b><a href={"tel:8(8362)412753"}>8 (8362) 41-27-53</a></b>
                    </div>
                    <div className={"footer__item"}>
                        Бухгалтерия <b><a href={"tel:8(8362)729290"}>8 (8362) 72-92-90</a></b>
                    </div>
                    <div className={"footer__item -full-tablet"}>
                        Мы в социальных сетях
                        <div className={"contacts"}>
                            <a href="https://vk.com/azs.expert" target="_blank" rel="noopener noreferrer">
                                <img src={vk} alt={"vk"}/>
                            </a>
                            <a href="https://www.instagram.com/azs.expert/" target="_blank" rel="noopener noreferrer">
                                <img src={instagram} alt={"instagram"}/>
                            </a>
                            <a href="https://www.facebook.com/azsexpert12/" target="_blank" rel="noopener noreferrer">
                                <img src={facebook} alt={"facebook"}/>
                            </a>
                            <a href="https://ok.ru/group/56410232455176" target="_blank" rel="noopener noreferrer">
                                <img src={ok} alt={"ok"}/>
                            </a>
                        </div>
                        <a className={"docs-link"} href="http://www.expert12.ru/personals_politicts.html">
                            Политика конфиденциальности
                        </a>
                        <a className={"docs-link"} href="http://www.expert12.ru/personal_agreement.html">
                            Согласие на обработку персональных данных
                        </a>
                    </div>
                </div>
                <div className="footer__bottom">2020 Все права защищены
                    <a href="http://www.expert12.ru/">АЗС Эксперт</a>
                    »
                    <Link to="/">Личный кабинет</Link>
                </div>
            </footer>
        </div>
    )
}

export default Footer