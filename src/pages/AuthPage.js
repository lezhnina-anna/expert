import React, {useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import {useRedirect} from "../hooks/redirect.hook";
const config = require('../config.json')

const AuthPage = () => {
    const [form, setForm] = useState({phone: "", checked: false})
    const [isFormValid, setIsFormValid] = useState(false)
    const [isNumberEntered, setIsNumberEntered] = useState(false)
    const [SMScode, setSMScode] = useState("")
    const [error, setError] = useState("")
    const [codeError, setCodeError] = useState("")

    const {request} = useHttp();
    const auth = useContext(AuthContext);
    const redirects = useRedirect();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.checked) return;

        if (form.phone.length === 11 && form.phone[0] === "7") {
            form.phone = form.phone.replace("7", "8");
        }

        request(
            "/auth/register",
            'POST',
            {username: form.phone},
            {Authorization: `Basic ${config.basicToken}`}
        ).then(() => {
            setIsNumberEntered(true)
        }).catch(e => {
            setError("Ошибка отправки сообщения. Проверьте корректность номера или повторите попытку позже")
        })
    }

    const handleSubmitAuth = (e) => {
        e.preventDefault();
        let headers = {};
        headers['Authorization'] = `Basic ${config.basicToken}`;
        headers['Content-Type'] = 'application/x-www-form-urlencoded';

        request(
            "/auth/token",
            'POST',
            `username=${form.phone}&password=${SMScode}&grant_type=password`,
            headers
        ).then((data) => {
            auth.setTokens(data.access_token, data.refresh_token);
            authOrRegister();
        }).catch(e => {
            setCodeError("Неверный код")
        })
    }

    const authOrRegister = () => {
        if (!localStorage.getItem("userData")) return;

        const token = JSON.parse(localStorage.getItem("userData")).accessToken;
        if (!token) return;

        request("/spump/owner", 'POST', {Phone: form.phone}, {Authorization: `Bearer ${token}`})
            .then(response => {
                const user = response[0];
                if (user) {
                    getCards(user.OWNER_ID)
                }
            })
            .catch(e => {
                if (e.message === "404") {
                    localStorage.setItem("_register", form.phone);
                    redirects.register()
                }
            })
    }

    const getCards = async (id) => {
        auth.setOwnerId(id);
        const token = JSON.parse(localStorage.getItem("userData")).accessToken;
        if (!token) return;

        try {
            const response = await request(`/spump/cards/${id}`, 'GET', null, {Authorization: `Bearer ${token}`});
            if (!response.length) {
                localStorage.setItem("_register", form.phone);
                redirects.initCard()
            } else if (response.length === 1) {
                redirects.main()
            } else {
                redirects.collapse()
            }
        } catch (e) {
            console.log("catch error")
        }
    }

    const handleCheckboxChange = async () => {
        await setForm({...form, checked: !form.checked});
    }

    const handleInputChange = (e) => {
        const val = e.target.value;
        if (isNaN(+val) || val.length > 11) {
            return
        }

        setForm({...form, phone: val});
    }

    const handleCodeChange = (e) => {
        if (e.target.value.length > 5 || isNaN(+e.target.value)) return;

        setSMScode(e.target.value)
    }

    useEffect(() => {
        const res = form.phone.trim() !== "" && form.checked;
        /*&&
            form.phone.trim().length === 11
        */
        setIsFormValid(res)
    }, [form]);

    useEffect(() => {
        if (!isNumberEntered) {
            return;
        }

        focusInput("SMS")
    }, [isNumberEntered]);

    useEffect(() => {
        focusInput("phoneNumber")
    }, []);

    const focusInput = (id) => {
        const input = document.getElementById(id);

        if (!input) {
            return;
        }

        input.focus()
    }

    return (
        <div className={"auth wrapper"}>
            <div className={"logo-gray"}/>
            {
                !isNumberEntered
                    ? <form className={"form -auth"} onSubmit={handleSubmit}>
                        <input id={"phoneNumber"} name={"phoneNumber"} placeholder={"Номер телефона"} type={"text"}
                               value={form.phone || ""}
                               onChange={handleInputChange}/>

                        <div className={"error"}>{error}</div>

                        <input type={"submit"} value={"Получить код"} className={"button"}
                               disabled={!isFormValid}/>
                        <div className={"custom-checkbox"}>
                            <label className="container">
                                <input onChange={handleCheckboxChange} type="checkbox" checked={form.checked}/>
                                <span className="checkmark"/> Я соглашаюсь с правилами {" "}
                                <a rel="noopener noreferrer" target={"_blank"} href={"http://www.expert12.ru/dogovor.html"}>
                                    Пользовательского соглашения
                                </a>
                            </label>
                        </div>
                    </form>
                    : <form className={"form -auth"} onSubmit={handleSubmitAuth}>
                        <input id={"SMS"} placeholder={"SMS-код"} type={"text"} value={SMScode || ""}
                               onChange={handleCodeChange}/>
                        <div className={"error"}>{codeError}</div>
                        <input type={"submit"} value={"Войти"} className={"button"}/>
                    </form>
            }
        </div>
    )
}

export default AuthPage