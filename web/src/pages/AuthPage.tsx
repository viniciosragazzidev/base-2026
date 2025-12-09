import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { useAuth } from "../hooks/useAuth";

export const AuthPage: React.FC = () => {
  const { isAuthenticated, isLoading, session } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // If already authenticated, redirect to home
  if (isLoading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    !session && (
      <div className="container">
        <h1>Better Auth Integration Demo</h1>

        <div className="form-toggle" style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => setIsLogin(true)}
            className={isLogin ? "active" : ""}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={!isLogin ? "active" : ""}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <Login onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setIsLogin(true)} />
        )}

        <div className="info" style={{ marginTop: "2rem" }}>
          <h3>Backend Integration Status</h3>
          <p>✅ Better Auth configured</p>
          <p>✅ Prisma + SQLite setup</p>
          <p>✅ CORS configured</p>
          <p>✅ Auth endpoints: http://localhost:3333/api/auth/*</p>
        </div>
      </div>
    )
  );
};
