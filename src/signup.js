import React from "react";
import "./signin.css";

function SignUp({ togglePage }) {
    return (
        <div className="signup-container">
            <div className="signup-left">
                <h2>Welcome Back!</h2>
                <p>To keep connected with us, please log in with your personal info.</p>
                <button className="btn" onClick={togglePage}>
                    Sign In
                </button>
            </div>
            <div className="signup-right">
                <h2>Create Account</h2>

                <p>Use your email for registration</p>
                <form>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button className="btn">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
