import React, { useState } from "react";
import "./App.css";
import SignIn from "./signin";
import SignUp from "./signup";

function App() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className={`container ${isSignIn ? "sign-in-mode" : "sign-up-mode"}`}>
      <div className="content-wrapper">
        {isSignIn ? (
          <SignIn togglePage={() => setIsSignIn(false)} />
        ) : (
          <SignUp togglePage={() => setIsSignIn(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
