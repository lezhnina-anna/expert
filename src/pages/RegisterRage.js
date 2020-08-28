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

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const changeSelectHandler = value => {
        setForm({...form, gender: value})
    }

    const {loading, request} = useHttp();
    const auth = useContext(AuthContext);
    const {initCard, authorization} = useRedirect();

    const registerHandler = async (e) => {
        e.preventDefault();

        try {
            request("/spump/owner/register", 'POST', {
                Name: form.name,
                Phone: form.phone,
                Male: form.gender,
                BDate: form.birthDate,
                Email: form.email
            }).then((data) => {
                if (!data[0]) return;

                localStorage.removeItem("_register");
                auth.setOwnerId(data[0].OWNER_ID);
                initCard();
            });
        } catch (e) {}
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
                    <input id={"birthDate"} placeholder={"Дата рождения"} name={"birthDate"} type={"text"}
                           onChange={changeHandler} value={form.birthDate}/>
                </div>
                <div className={"input-field"}>
                    <label htmlFor={"birthDate"}>Пол</label>
                    <Select value={form.gender} options={[
                        {value: 1 , label: "Мужской"},
                        {value: 0 , label: "Женский"},
                    ]} onChange={changeSelectHandler}/>
                </div>
                <div className={"input-field"}>
                    <label htmlFor={"email"}>E-mail</label>
                    <input id="email" placeholder={"E-mail"} name={"email"} type={"text"} onChange={changeHandler}
                           value={form.email || ''}/>
                </div>
                <input type={"submit"} value={"Зарегистрироваться"} disabled={loading || !isFormValid} className={"button"}/>
            </form>
        </div>
    )
}

export default RegisterPage

