import React from "react";
import "./signin.css";

function SignIn({ togglePage }) {
    return (
        <div className="signin-container">
            <div className="signin-left">
                <h2>Welcome Back!</h2>
                <p>To keep connected with us, please log in with your personal info.</p>
                <button className="btn" onClick={togglePage}>
                    Sign Up
                </button>
            </div>
            <div className="signin-right">
                <h2>Sign in</h2>
                <form>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button className="btn">Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
