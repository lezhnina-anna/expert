import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/auth.context";
import {useHttp} from "../hooks/http.hook";
import {useRedirect} from "../hooks/redirect.hook";
import Select from "../components/Select";

const RegisterPage = (props) => {
    const [form, setForm] = useState({
        name: "",
        birthDate: "",
        gender: "1",
        email: "",
        phone: localStorage.getItem("_register")
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState("");

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const changeDateHandler = event => {
        let result = event.target.value.replace(" ", "");
        const isDeleting = result.length < form[event.target.name].length;

        if (!isDeleting && (result.length === 2 || result.length === 5)) {
            result += ".";
        }

        if (result.length > 10 || isNaN(+result.replaceAll(".", ""))) {
            return;
        }

        setForm({...form, [event.target.name]: result})
    }

    const changeSelectHandler = value => {
        setForm({...form, gender: value})
    }

    const {loading, request} = useHttp();
    const auth = useContext(AuthContext);
    const {initCard, authorization} = useRedirect();

    const registerHandler = async (e) => {
        e.preventDefault();

        if (form.name.replaceAll(" ", "").length === 0
            || form.phone.replaceAll(" ", "").length === 0
            || form.birthDate.replaceAll(" ", "").length === 0
            || form.email.replaceAll(" ", "").length === 0
        || !isFormValid) {
            setError("Все поля должны быть заполнены");
            return;
        }

        try {
            request("/spump/owner/register", 'POST', {
                Name: form.name,
                Phone: form.phone,
                Male: form.gender,
                BDate: form.birthDate,
                Email: form.email
            }).then((data) => {
                if (!data[0]) {
                    setError('Произошла ошибка на сервере. Повторите попытку позже')
                    return;
                }
                setError("");
                localStorage.removeItem("_register");
                auth.setOwnerId(data[0].OWNER_ID);
                initCard();
            });
        } catch (e) {
            setError('Произошла ошибка на сервере. Повторите попытку позже')
        }
    }


    useEffect(() => {
        if (form.name === null) return;

        if (!form.phone || !form.name || !form.birthDate || !form.email) {
            setIsFormValid(false);
            return
        }
        const res = form.phone.trim() !== "" && form.name.trim() !== "" && form.birthDate.trim() !== ""
            && form.email.trim() !== "";

        setIsFormValid(res)
    }, [form]);

    useEffect(() => {
        if (!localStorage.getItem("_register")) {
            authorization()
        }
    }, [authorization])

    return (
        <div className={"register wrapper"}>
            <div className={"logo-gray"}/>
            <form className={"form"} onSubmit={registerHandler}>
                <div className={"input-field"}>
                    <label htmlFor={"name"}>Имя Фамилия</label>
                    <input id={"name"} placeholder={"Имя Фамилия"} name={"name"} type={"text"} onChange={changeHandler}
                           value={form.name}/>
                </div>
                <div className={"input-field"}>
                    <label htmlFor={"birthDate"}>Дата рождения</label>
                    <input id={"birthDate"} placeholder={"дд.мм.гггг"} name={"birthDate"} type={"text"}
                           onChange={changeDateHandler} value={form.birthDate}/>
                </div>
                <div className={"input-field"}>
                    <label>Пол</label>
                    <Select value={form.gender} options={[
                        {value: 1, label: "Мужской"},
                        {value: 0, label: "Женский"},
                    ]} onChange={changeSelectHandler}/>
                </div>
                <div className={"input-field"}>
                    <label htmlFor={"email"}>E-mail</label>
                    <input id="email" placeholder={"E-mail"} name={"email"} type={"text"} onChange={changeHandler}
                           value={form.email || ''}/>
                </div>
                {error && <div style={{margin: "10px 0"}}>{error}</div>}
                <input type={"submit"} value={"Зарегистрироваться"} disabled={loading || !isFormValid}
                       className={"button"}/>
            </form>
        </div>
    )
}

export default RegisterPage

