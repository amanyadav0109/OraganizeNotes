import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        const savedUser = localStorage.getItem("user");

        if (token && savedUser&&savedUser !== "undefined") {

            setUser({

                token,

                ...JSON.parse(savedUser)

            });

        }

        setLoading(false);

    }, []);

    const login = (token, userData) => {

        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(userData));

        setUser({

            token,

            ...userData

        });

    };

    const logout = () => {
         console.log("Logout Called");
 setUser(null);
        localStorage.removeItem("token");

        localStorage.removeItem("user");
 localStorage.removeItem("email");

       

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);