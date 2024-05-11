import React, { useRef, useState, useContext } from "react";
import "./auth.css";
import authContext from "../context/auth-context";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const auth = useContext(authContext);

  const switchModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
      }`,
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }`,
      };
    }

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed");
        }
        return response.json();
      })
      .then((data) => {
        if (data.data.login.token) {
          auth.login(
            data.data.login.token,
            data.data.login.userId,
            data.data.login.tokenExpiration
          );
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };

  return (
    <main>
      <form className="auth-form" onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={emailRef} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={passwordRef} />
        </div>
        <div className="form-actions">
          <button className="switch" type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? "SignUp" : "SignIn"}
          </button>
          <button type="submit" onClick={submitHandler}>
            {!isLogin ? "SignUp" : "SignIn"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AuthPage;
