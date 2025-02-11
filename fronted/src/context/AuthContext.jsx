import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite";
import { ID } from "appwrite";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        account.get().then(setUser).catch(() => setUser(null));
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register, 
            loading, 
            error 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
