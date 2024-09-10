import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Login.css";

export const Login = () => {
  const navigate = useNavigate() 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginDetails = {
      username,
      password,
    };

    try {
      const response = await fetch("https://rainwaterharvesting-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
      });

      const data = await response.json();

      if (data.code === 200) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate('/');
        // Redirect user to another page or perform another action after login
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center text-dark mt-5">Login Form</h2>
          <div className="card my-5">
            <form className="card-body cardbody-color p-lg-5" onSubmit={handleLogin}>
              <div className="text-center">
                <img
                  src="./logo.jpeg"
                  className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                  width="200px"
                  alt="profile"
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="Username"
                  placeholder="User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-danger text-center">{error}</p>}

              <div className="text-center">
                <button type="submit" className="btn btn-color px-5 mb-5 w-100">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
