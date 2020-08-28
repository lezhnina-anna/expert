import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import QRCodePopup from "../components/QRCodePopup";
import {AuthContext} from "../context/auth.context";
import {useRedirect} from "../hooks/redirect.hook";
import Preloader from "../components/Loader";
import QRCode from "react-qr-code";

const MainPage = () => {
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const {initCard, collapse} = useRedirect();

    const [loading, setLoading] = useState(true)
    const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);
    const [bonuslog, setBonuslog] = useState([]);
    const [data, setData] = useState({
        id: -1,
        name: "",
    });
    const [cardInfo, setCardInfo] = useState({
        id: -1,
        bonuses: 0
    });

    const hidePopup = () => {
        setIsQrCodeVisible(false)
    }

    const showQRCode = () => {
        setIsQrCodeVisible(true)
    }

    const getCards = useCallback(async () => {
        if (data.id === -1) return;

        try {
            const response = await request(`/spump/cards/${data.id}`);

            if (!response.length) {
                initCard()
            }

            if (response.length > 1) {
                collapse()
            }

            const card = response[0]
            if (card && card.CARD_ID) {
                setCardInfo({id: card.CARD_ID.replace("BEKAR", ""), bonuses: card.POINTS})
            }

            setLoading(false)
        } catch (e) {
            setLoading(false)
        }
    }, [request, setCardInfo, data.id, collapse, initCard]);


    const getHistory = useCallback(async () => {
        if (data.id === -1 || cardInfo.id === -1) return;

        try {
            await request(`/spump/bonuslog/${data.id}`, 'POST', {
                DateFrom: "01.01.2020",
                DateTo: "01.01.2021",
                CardID: cardInfo.id
            }).then(data => {

            })
        } catch (e) {}
    }, [data, request, cardInfo])

    const getData = useCallback(async () => {
        try {
            const response = await request("/spump/owner", 'POST', {OwnerID: auth.userId});
            const user = response[0];

            if (user) {
                setData({id: user.OWNER_ID, name: user.NAME, cardId: user.CARD_ID});
            }
        } catch (e) {}
    }, [request, auth]);

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    useEffect(() => {
        getCards();
    }, [getCards]);

    if (loading) {
        return <Preloader/>
    }

    return (
        <div className={"main wrapper"}>
            <div className={"desktop-container"}>
                <QRCode value={`BEKAR${cardInfo.id}`} />
                <div>
                    <div className={"main__name"}>{data.name}</div>
                    <div className={"main__number"}>Карта №{cardInfo.id}</div>
                    <div className={"main__points"}>
                        <span className={"points-value"}>{cardInfo.bonuses}</span>
                        <span className={"points-caption"}>Баллов</span>
                    </div>
                </div>
            </div>
            <div className={"main__bonuslog"}>
                {
                    bonuslog && bonuslog.map(item => {
                        return <div key={item.changed} className={"bonuslog__item"}>
                            <div className={"left"}>
                                <span className={"note"}>{item.note}</span>
                                <span className={"date"}>{item.changed}</span>
                            </div>
                            <div className={"right"}>
                                <span className={"points -plus"}>+ 140 Б</span>
                            </div>
                        </div>
                    })
                }
            </div>
            <div className={"qrcode"} onClick={showQRCode}/>
            {
                isQrCodeVisible ? <QRCodePopup hidePopup={hidePopup} bonuses={cardInfo.bonuses} id={`BEKAR${cardInfo.id}`}/> : void 0
            }
        </div>
    )
}

export default MainPage
