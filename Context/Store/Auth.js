import React, { useEffect, useReducer, useState } from "react";
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage'

import authReducer from "../Reducers/Auth.reducer";
import { setCurrentUser } from "../Actions/Auth.actions";
import AuthGlobal from './AuthGlobal.js'

const Auth = props => {
    console.log(props.children)
    const [stateUser, dispatch] = useReducer(authReducer, {
        isAuthenticated: null,
        user: {}
    });
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        setShowChild(true);
        if (AsyncStorage.jwt) {
            const decoded = AsyncStorage.jwt ? AsyncStorage.jwt : "";
            if (setShowChild) {
                dispatch(setCurrentUser(jwt_decode(decoded)))
            }
        }
        return () => setShowChild(false);
    }, [])


    if (!showChild) {
        return null;
    } else {
        return (
            <AuthGlobal.Provider
                value={{
                    stateUser,
                    dispatch
                }}
            >
                {props.children}
            </AuthGlobal.Provider>
        )
    }
};

export default Auth