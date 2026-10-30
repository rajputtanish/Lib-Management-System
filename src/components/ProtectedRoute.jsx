import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { envData } from "../data";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!isLoggedIn || !token) return;

      try {
        const response = await fetch(`${envData.apiUrl}/login/check-token`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            navigate("/");
          }
          return;
        }

        console.log("Token verified successfully");
      } catch (error) {
        console.error("Token verification request failed:", error);
      }
    };

    verifyToken();
  }, [isLoggedIn, token, navigate]);

  if (!isLoggedIn || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
