import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
}
from 'mdb-react-ui-kit';
import "./Login.css";

export const Login = () => {
  const navigate = useNavigate() 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [taluka,setTaluka] = useState(null);
  const [talukaList,setTalukaList] = useState([]);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    const loginDetails = {
      username,
      password,
      taluka
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
        localStorage.setItem("userData", JSON.stringify({user:username,accessToken:data.token,taluka:taluka}));
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

  const loadTalukaList = async () =>{
    const fetchedTalukas = await localStorage.getItem('Talukas');
    if(fetchedTalukas){
      setTalukaList([...fetchedTalukas.split(',')])
    }
  }

  useEffect(()=>{
    loadTalukaList()
  },[])

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            {
              error.length > 0 ? 
              <span style={{color:'red'}}>{error}</span> : null
            }
            <form onSubmit={handleLogin}>
              {/* Email input */}
              <label className="form-label" htmlFor="form3Example3">
                  Select Taluka
              </label>
              <div className="form-outline mb-4">
              <select
                  value={taluka}
                  onChange={(e) => {
                    setTaluka(e.target.value)
                  }}>
                    <option value="null">Select Taluka</option>
                      {talukaList.map((taluka, index) => (
                        <option key={index} value={taluka}>
                          {taluka}
                        </option>
                    ))}
                </select>
              </div>

              <label className="form-label" htmlFor="form3Example3">
                  Email address
              </label>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  onChange={(e) => setUsername(e.target.value)}
                />
               
              </div>

              {/* Password input */}
              <label className="form-label" htmlFor="form3Example4">
                  Password
              </label>
              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              
              </div>

              <div className="d-flex justify-content-between align-items-center">
                {/* Checkbox */}
                <div className="form-check mb-0">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                  />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="#!" className="text-body">
                  Forgot password?
                </a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  onClick={()=>handleLogin()}
                >
                  Login
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account?{" "}
                  <a href="#!" className="link-danger">
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

 );
};

export default Login;
