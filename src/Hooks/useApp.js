import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
const useApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [useEmail, setUserEmail] = useState(() => {
    const storedUserEmail = Cookies.get("userEmail");
    return storedUserEmail || "";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = Cookies.get("isLoggedIn");

    return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
  });

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      let todayDate = Date.now();
      const loginTime = JSON.parse(Cookies.get("loginTime"));
      const expirationLoginTime = 8 * 60 * 60 * 1000;

      if (loginTime && todayDate - loginTime < expirationLoginTime) {
        setIsLoggedIn(true);
        setUserEmail(Cookies.get("userEmail"));
      } else {
        handleLogout();
      }
    }
  }, []);

  const onSubmitLogin = (email) => {
    let todayDate = Date.now();

    Cookies.set("loginTime", JSON.stringify(todayDate));
    Cookies.set("isLoggedIn", JSON.stringify(true));
    Cookies.set("userEmail", email);

    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);

    Cookies.remove("token");
    Cookies.remove("loginTime");
    Cookies.remove("isLoggedIn");
    Cookies.remove("userEmail");
  };

  return {
    onSubmitLogin,
    handleLogout,
    isLoggedIn,
    isSidebarOpen,
    setIsSidebarOpen,
    useEmail,
  };
};

export default useApp;
