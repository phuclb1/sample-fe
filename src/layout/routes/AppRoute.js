import React, { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { NEXTFACE_ACCESS_TOKEN, ROUTES } from "../../constants/app";
import { getUserInfo } from "../../redux/actions/userAction";
import { history } from "../../router/history";
import AppLayout from "../AppLayout";

export const AppRoute = ({ component: Component, ...rest }) => {
    const access_token = localStorage.getItem(NEXTFACE_ACCESS_TOKEN);
    const dispactch = useDispatch();

    useEffect(() => {
        if (!access_token) {
            history.push(ROUTES.LOGIN);
        } else {
            dispactch(getUserInfo());
        }
    }, []);

    return (
        <Route {...rest} render={(props) => (<AppLayout>
            <Suspense fallback={<h1> Still Loading… </h1>}>
                <Component {...props} />
            </Suspense>
        </AppLayout>)}
        />
    );
};