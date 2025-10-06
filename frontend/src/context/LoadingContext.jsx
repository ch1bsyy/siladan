/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useCallback } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showLoading = useCallback((msg = "") => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setMessage("");
  }, []);

  const value = { isLoading, showLoading, hideLoading, message };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
