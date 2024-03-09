import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);

    const login = () => {
        setIsLoading(true)
        setUserToken(userToken.token);
        AsyncStorage.setItem('userToken', userToken.token)
        setIsLoading(false);

    }

    const logout = () => {
        setIsLoading(true)
        setUserToken(null);
        AsyncStorage.removeItem('userToken')
        setIsLoading(false)
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('usersession')
            setIsLoading(userToken.token)
            setIsLoading(false)
        } catch (error) {
            console.log(`isLogged in error ${error}`)
        }
    }


    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    )
}
