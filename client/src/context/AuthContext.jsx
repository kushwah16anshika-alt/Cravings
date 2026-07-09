


// import React, { useContext, useEffect, useState } from "react";

// const AuthContext = React.createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(sessionStorage.getItem("UserData")) || ""
//   );

//   const [isLogin, setIsLogin] = useState(!!user);

//   useEffect(() => {
//     setIsLogin(!!user);
//   }, [user]);

//   const value = {
//     user,
//     setUser,
//     isLogin,
//     setIsLogin,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const data = sessionStorage.getItem("UserData");
    return data ? JSON.parse(data) : null;
  });

  const [isLogin, setIsLogin] = useState(!!user);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("UserData", JSON.stringify(user));
      setIsLogin(true);
    } else {
      sessionStorage.removeItem("UserData");
      setIsLogin(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);