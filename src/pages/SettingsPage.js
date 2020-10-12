import React, {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import Select from "../components/Select";

const SettingsPage = () => {
    const [form, setForm] = useState({
        name: "",
        birthDate: "",
        gender: "1",
        email: "",
        phone: "",
        id: -1
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const {request, loading} = useHttp();
    const auth = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.name.replaceAll(" ", "").length === 0 || form.birthDate.replaceAll(" ", "").length === 0) {
            setError("Все поля должны быть корректно заполнены");
            return ;
        }

        try {
            request("/spump/owner", 'PUT', {
                Name: form.name,
                Phone: form.phone,
                Male: form.gender,
                BDate: form.birthDate,
                Email: form.email,
                OwnerID: form.id
            }).then(() => {
                getData();
                setMessage("Данные успешно обновлены");

                setTimeout(() => {
                    setMessage("")
                }, 3000)
            })
        } catch (e) {
            setError("При отправке формы произошла ошибка")
        }
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

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const changeSelectHandler = value => {
        setForm({...form, gender: value})
    }

    const getData = useCallback(async () => {
        if (auth.userId === null) return

        try {
            const response = await request("/spump/owner", 'POST', {OwnerID: auth.userId});
            const user = response[0];

            if (user) {
                setForm({
                    id: user.OWNER_ID,
                    name: user.NAME || "",
                    email: user.EMAIL || "",
                    birthDate: user.BDATE || "",
                    phone: user.PHONE,
                    gender: user.MALE !== null ? +user.MALE : ""
                });
            }

        } catch (e) {
        }
    }, [request, auth.userId]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div className={"wrapper"}>
            <h2>Настройки</h2>
            <div className={"settings"}>
                <div className={"settings__item"}>
                    <h3>Личные данные</h3>
                    <form className={"form"} onSubmit={handleSubmit}>
                        <div className={"input-field"}>
                            <label htmlFor={"name"}>Имя Фамилия</label>
                            <input style={{flex: "50%"}} id={"name"} name={"name"} type={"text"} onChange={changeHandler}
                                   value={form.name}/>
                        </div>
                        <div className={"input-field"}>
                            <label htmlFor={"birthDate"}>Дата рождения</label>
                            <input id={"birthDate"} name={"birthDate"} type={"text"} placeholder={"дд.мм.гггг"}
                                   onChange={changeDateHandler} value={form.birthDate}/>
                        </div>
                        <div className={"input-field"}>
                            <label htmlFor={"birthDate"}>Пол</label>
                            <Select value={form.gender} options={[
                                {value: 1 , label: "Мужской"},
                                {value: 0 , label: "Женский"},
                            ]} onChange={changeSelectHandler}/>
                        </div>
                        <div className={"input-field"}>
                            <label htmlFor={"email"}>Email</label>
                            <input id="email" name={"email"} type={"text"} onChange={changeHandler}
                                   value={form.email || ''}/>
                        </div>

                        <div className={"error"}>{error}</div>
                        <div className={"message"}>{message}</div>

                        <input type={"submit"} value={"Сохранить"} disabled={loading} className={"transparent-button"}/>
                    </form>
                </div>
                <div className={"settings__item"}>
                    <h3>Прочее</h3>
                    <div className={"settings__links"}>
                        <a href={"http://www.expert12.ru/dogovor.html"} rel="noopener noreferrer" target={"_blank"}>
                            Пользовательское соглашение
                        </a>
                    </div>
                    <div className={"settings__exit"} onClick={auth.logout}>Выход из профиля</div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage