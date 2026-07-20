import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const data = sessionStorage.getItem("cravingUser");
    return data ? JSON.parse(data) : null;
  });

  const [isLogin, setIsLogin] = useState(!!user);
  const [role, setRole] = useState(user ? user.userType : null);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("cravingUser", JSON.stringify(user));
      setIsLogin(true);
      setRole(user.userType);
    } else {
      sessionStorage.removeItem("cravingUser");
      setIsLogin(false);
      setRole(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLogin,
        setIsLogin,
        role,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
