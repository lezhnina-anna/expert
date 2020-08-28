import React from 'react';
import QRCode from "react-qr-code";

const QRCodePopup = (props) => {
    const onContentClick = (e) => {
        e.stopPropagation();
    }

    return (
        <div className={"popup"} onClick={props.hidePopup}>
            <div className={"popup__content"} onClick={onContentClick}>
                <div className={"main__points"}>
                    <span className={"points-value"}>{props.bonuses}</span>
                    <span className={"points-caption"}>Баллов</span>
                </div>
                <p className={"popup__text"}>Поднесите код к считывателю</p>
                <div className={"popup__qrcode"}>
                    <QRCode value={props.id} />
                </div>
            </div>
        </div>
    )
}

export default QRCodePopup