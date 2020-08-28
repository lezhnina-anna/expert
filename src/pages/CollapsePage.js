import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/auth.context";
import {useHttp} from "../hooks/http.hook";
import {useRedirect} from "../hooks/redirect.hook";
import Preloader from "../components/Loader";

const CollapsePage = () => {
    const [checked, setChecked] = useState(1);
    const [cards, setCards] = useState([]);
    const {request, loading} = useHttp();
    const auth = useContext(AuthContext);
    const {main} = useRedirect();

    const handleCheckboxChange = (val) => {
        setChecked(val)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        request(`/spump/cards/${auth.userId}/collapse`, 'PUT', {MainCardNumber: checked})
            .then(() => {
                main();
            })
            .catch(e => {
            })
    }

    const getCards = useCallback(async () => {
        try {
            const response = await request(`/spump/cards/${auth.userId}`);
            if (!response.length) {
                return;
            }

            if (response.length === 1) {
                main()
            }

            setCards(response);
            setChecked(response[0].CARD_ID)
        } catch (e) {
        }
    }, [request, setCards, auth.userId, main]);

    useEffect(() => {
        getCards()
    }, [getCards])

    if (loading) {
       return <Preloader/>
    }

    return (
        <div className={"register wrapper"}>
            <div className={"logo-gray"}/>
            <form className={"form"} onSubmit={handleSubmit}>
                {
                    cards.map(card => {
                        return (
                            <div className={"input-field"} key={card.CARD_ID}>
                                <div className={"custom-checkbox"}>
                                    <label className="container">
                                        <input onChange={() => handleCheckboxChange(card.CARD_ID)} type="checkbox"
                                               checked={checked === card.CARD_ID}/>
                                        <span className="checkmark"/>
                                        <div className={"card-info"}>
                                            <span className={"number"}>Карта №{card.CARD_ID.replace('BEKAR', '')}</span>
                                            {
                                                checked === card.CARD_ID
                                                    ? <span className={"note"}>Основная карта</span>
                                                    : void 0
                                            }
                                            <span className={"points"}>{card.POINTS} Б</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )
                    })
                }
                <input type={"submit"} className={"button"} value={"Объединить карты"}/>
            </form>
            <div className={"caption"}>
                Баллы со всех бонусных карт будут переведены на основную, а сами карты отмечены как неиспользуемые
            </div>
        </div>
    )
}

export default CollapsePage


/*
    <div className={"input-field"}>
                    <div className={"custom-checkbox"}>
                        <label className="container">
                            <input onChange={() => handleCheckboxChange(2)} type="checkbox" checked={checked === 2}/>
                            <span className="checkmark"/>
                            <div className={"card-info"}>
                                <span className={"number"}>Карта №0000000001</span>
                                <span className={"points -plus"}>140 Б</span>
                            </div>
                        </label>
                    </div>
                </div>
*/
