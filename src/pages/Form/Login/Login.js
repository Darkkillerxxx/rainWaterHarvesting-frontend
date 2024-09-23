import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { useSelector, useDispatch } from 'react-redux';


export const Login = () => {
  const masterPicklistValues = useSelector((state) => state.items.picklistValues);

  const navigate = useNavigate() 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [taluka,setTaluka] = useState(null);
  const [district,setDistrict] = useState(null);
  const [pickListValues,setPickListValues] = useState({
    district:[],
    talukas:[]
  })
  const [talukaList,setTalukaList] = useState([]);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    const loginDetails = {
      username,
      password,
      taluka,
      district
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

  const loadDistrictList = () =>{
    const districtValues = [...new Set(masterPicklistValues.map(item => item.DISTRICT))];
    console.log(districtValues,masterPicklistValues);
    
    setPickListValues({
      district:[...districtValues],
      talukas:[]
    })
  }

  useEffect(()=>{
    loadTalukaList();
    loadDistrictList();
  },[])

  const onDistrictSelect = (e) =>{
    setDistrict(e.target.value);

    const filteredTalukas = masterPicklistValues.filter((data)=>{
      return data.DISTRICT === e.target.value
    });
    
    const talukaValues = [...new Set(filteredTalukas.map(item => item.TALUKA))];
  
    setPickListValues((prev)=>({
      ...prev,
      talukas:[...talukaValues]
    }))
  }

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
                  Select District
              </label>
              <div className="form-outline mb-4">
              <select
                  value={district}
                  onChange={(e) => {
                    onDistrictSelect(e)
                  }}>
                    <option value=''>Select District</option>
                    {pickListValues?.district?.map((value)=>{
                      return(
                        <option key={value} value={value}>{value}</option>
                      )
                    })}
                </select>
              </div>

              <label className="form-label" htmlFor="form3Example3">
                  Select Taluka
              </label>
              <div className="form-outline mb-4">
              <select
                  value={taluka}
                  onChange={(e) => {
                    setTaluka(e.target.value)
                  }}>
                    <option value=''>Select Taluka</option>
                      {pickListValues?.talukas?.map((taluka, index) => (
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

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  onClick={()=>handleLogin()}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

 );
};

export default Login;
