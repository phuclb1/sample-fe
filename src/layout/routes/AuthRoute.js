import React, { Suspense, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { NEXTFACE_ACCESS_TOKEN } from '../../constants/app';
import { history } from '../../router/history';
import AuthLayout from '../AuthLayout';

export const AuthRoute = ({ component: Component, ...rest }) => {
    const access_token = localStorage.getItem(NEXTFACE_ACCESS_TOKEN);
    useEffect(() => {
        if (access_token) {
            history.push('/');
        }
    }, []);

    return <Route {...rest}
        render={
            (props) => (<AuthLayout >
                <Suspense fallback={< h1 > Still Loading…</h1>}>
                    <Component {...props} />
                </Suspense>
            </AuthLayout>
            )
        }
    />
};