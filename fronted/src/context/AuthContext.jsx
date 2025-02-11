import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite";
import { ID } from "appwrite";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initializing, setInitializing] = useState(true);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await account.createEmailPasswordSession(email, password);
            const userData = await account.get();
            setUser(userData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, name) => {
        setLoading(true);
        setError(null);
        try {
            await account.create(ID.unique(), email, password, name);
            await login(email, password);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const loginAsGuest = async () => {
        setLoading(true);
        setError(null);
        try {
            const promise = await account.createAnonymousSession();
            setUser(promise);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        account.get().then(user => {
            setUser(user);
            setInitializing(false);
        }).catch(() => {
            setUser(null);
            setInitializing(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register, 
            loginAsGuest, // Add loginAsGuest to the context value
            loading, 
            error,
            initializing
        }}>
            {children}
        </AuthContext.Provider>
    );
};
