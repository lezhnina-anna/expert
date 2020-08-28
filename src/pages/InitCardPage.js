import React, {useContext, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import Popup from "../components/Popup";
import {useRedirect} from "../hooks/redirect.hook";

const InitCardPage = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isFirstPopup, setIsFirstPopup] = useState(true);
    const [errorCode, setErrorCode] = useState(0);

    const {request} = useHttp();
    const auth = useContext(AuthContext);
    const redirects = useRedirect();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!auth.userId) {
            return;
        }

        request(`/spump/cards/${auth.userId}`, 'PUT', {
            CardNumber: `BEKAR${cardNumber}`,
        }).then(data => {
            if (!data.length) return;

            if (data[0].ERRORCODE) {
                setErrorCode(data[0].ERRORCODE);
                setIsPopupVisible(true)
            } else {
                redirects.main()
            }
        }).catch(e => {
        })
    }

    const createCard = () => {
        if (!auth.userId) {
            return;
        }

        request(`/spump/cards/${auth.userId}`, 'POST')
            .then((data) => {
                if (data.ResultCode === "0") {
                    redirects.main()
                }
            });
    }

    const handleInputChange = (e) => {
        setCardNumber(e.target.value)
    }

    const getPopupContent = () => {
        if (isFirstPopup && errorCode === 1) {
            return (
                <>
                    <p className={"popup__text"}>
                        Карта №{cardNumber} привязана к другому номеру телефона.<br/>
                        Хотите завести виртуальную бонусную карту?
                    </p>
                    <div className={"popup__buttons"}>
                        <span className={"submit"} onClick={createCard}>Да</span>
                        <span className={"cancel"} onClick={() => setIsFirstPopup(false)}>Нет</span>
                    </div>
                </>
            )
        }

        if (isFirstPopup && errorCode === 2) {
            return (
                <>
                    <p className={"popup__text"}>
                        Карта №{cardNumber} не существует.<br/>
                        Хотите завести виртуальную бонусную карту?
                    </p>
                    <div className={"popup__buttons"}>
                        <span className={"submit"} onClick={createCard}>Да</span>
                        <span className={"cancel"} onClick={() => setIsFirstPopup(false)}>Нет</span>
                    </div>
                </>
            )
        }

        return (
            <>
                <p className={"popup__text"}>
                    Если карта №{cardNumber} действительно принадлежит Вам, то обратитесь с данной проблемой к оператору
                    на любой из наших АЗС
                </p>
                <div className={"popup__buttons"}>
                    <span className={"submit"} onClick={hidePopup}>Ok</span>
                </div>
            </>
        )
    }

    const hidePopup = () => {
        setIsPopupVisible(false);
        setIsFirstPopup(true);
        setErrorCode(0)
    }

    return (
        <div className={"register"}>
            <div className={"logo-gray"}/>
            <form className={"form -auth"} onSubmit={handleSubmit}>
                <input placeholder={"Номер бонусной карты"} type={"text"} value={cardNumber}
                       onChange={handleInputChange}/>
                <input type={"submit"} value={"Привязать"} className={"button"}/>
            </form>
            <div className={"bonus-caption"}>
                У меня нет бонусной карты <span className={"bonus-caption__button"} onClick={createCard}>Создать виртуальную</span>
            </div>
            {
                isPopupVisible ?
                    <Popup hide={hidePopup}>
                        {getPopupContent()}
                    </Popup>
                    : void 0
            }
        </div>
    )
}

export default InitCardPage