import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen";
import { useLoading } from "./context/LoadingContext";
import Loading from "./components/Loading";

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const location = useLocation();
  const { isLoading, message } = useLoading();

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

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {isLoading && <Loading message={message} />}

      {isInitializing && showSplash ? <SplashScreen /> : <AppRoutes />}
    </>
  );
}

export default App;
