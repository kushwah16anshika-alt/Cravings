import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("UserData")) || null
  );

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(!!user);
  }, [user]);

  const value = {
    user,
    setUser,
    isLogin,
    setIsLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);