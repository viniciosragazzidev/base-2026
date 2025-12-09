import React from "react";
import { useAuth } from "../hooks/useAuth";

export const HomePage: React.FC = () => {
  const { session, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();

    setIsSigningOut(false);
  };

  return (
    session && (
      <div className="container">
        <h1>Welcome, {session?.user?.name || session?.user?.email}!</h1>

        <div className="user-info">
          <h2>User Session</h2>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <button
          onClick={handleSignOut}
          className="button"
          disabled={isSigningOut}
          style={{ marginTop: "1rem" }}
        >
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </button>

        <div className="info" style={{ marginTop: "2rem" }}>
          <h3>Application Status</h3>
          <p>✅ Successfully authenticated</p>
          <p>✅ Protected route working</p>
          <p>✅ Session management active</p>
        </div>
      </div>
    )
  );
};
