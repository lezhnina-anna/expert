import {Redirect, Route, Switch} from "react-router-dom";
import MainPage from "./pages/MainPage";
import React from "react";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import RegisterPage from "./pages/RegisterRage";
import InitCardPage from "./pages/InitCardPage";
import CollapsePage from "./pages/CollapsePage";

const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/settings" component={SettingsPage}/>
                <Route exact path="/init-card" component={InitCardPage}/>
                <Route exact path="/collapse" component={CollapsePage}/>
                <Redirect to={"/"}/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route exact path="/auth" component={AuthPage}/>
            <Route exact path="/register" component={RegisterPage}/>
            <Redirect to={"/auth"}/>
        </Switch>
    )
}

export default useRoutes;