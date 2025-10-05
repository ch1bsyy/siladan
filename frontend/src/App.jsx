import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const location = useLocation();

  const showSplash = location.pathname === "/";

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsInitializing(false);
    }
  }, [showSplash]);

  return isInitializing && showSplash ? <SplashScreen /> : <AppRoutes />;
}

export default App;
