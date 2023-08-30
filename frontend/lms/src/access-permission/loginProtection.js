import { useContext } from "react";
import { UserContext } from "../Context/userContext";
import { Navigate } from "react-router-dom";

export const LoginProtection = (children) => {
  const { user } = useContext(UserContext);
  const { Component } = children;
  if (user) {
    return <Component />;
  } else {
    return <Navigate to="/" replace />;
  }
};
