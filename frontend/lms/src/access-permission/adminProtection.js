import { useContext } from "react";
import { UserContext } from "../Context/userContext";
import { Navigate } from "react-router-dom";

export const AdminProtection = (children) => {
  const { isUserAdmin } = useContext(UserContext);
  const { Component } = children;
  // if (user) {
  //   console.log("user is logged in");
  if (isUserAdmin === true) {
    console.log("AdminProtection user is admin");
    return <Component />;
  } else {
    console.log("AdminProtection User is not admin");
    return <Navigate to="/books" />;
  }
  // } else {
  //   console.log("user not logged in");
  //   return <Navigate to="/" replace />;
  // }
};
