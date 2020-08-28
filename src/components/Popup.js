import React from "react";

const Popup = (props) => {
    const onContentClick = (e) => {
        e.stopPropagation();
    }

    return (
        <div className={"popup"} onClick={props.hide}>
            <div className={"popup__content"} onClick={onContentClick}>
                {props.children}
            </div>
        </div>
    )
}

export default Popup