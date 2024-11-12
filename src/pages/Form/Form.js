import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Form.css";
import {DotLoader, BeatLoader} from "react-spinners";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";


const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Form = () => {
  const navigate = useNavigate();
  const items = useSelector((state) => state.items.picklistValues);
  console.log(17,items);
  const location = useLocation();
  const item = location.state?.item;

  const [talukaOptions, setTalukaOptions] = useState([]);
  const [villageOptions,setVillageOptions] = useState([]);
  const [isDistrictPicklistDisabled,setIsDisrictPicklistDisabled] = useState(false);
  const [isTalukaPicklistDisabled,setIsTalukaPicklistDisabled] = useState(false);

  const [DISTRICT, setDistrict] = useState('');
  const [TALUKA, setTaluka] = useState('');
  const [VILLAGE, setVillage] = useState('');
  const [mobile, setMobile] = useState("");
  const [LOCATION, setAddress] = useState(item?.ENG_LOCATION || "");
  const [Inauguration_DATE, setDate] = useState("");
  const [InaugurationPhoto,setInaugurationPhoto] = useState("")
  const [Latitude, setLatitude] = useState(23.0225);
  const [Longitude, setLongitude] = useState(72.5714);
  const [photo, setPhoto] = useState(null);
  const [WORK_NAME,setWorkName] = useState(null);
  const [isLoading,setIsLoading] = useState(false);
  const [IMPLIMANTATION_AUTHORITY,setImplementationAuthority] = useState("");
 


  const userDetails = async() =>{
    let userDetails = await localStorage.getItem('userData');
    if(userDetails){
      userDetails = JSON.parse(userDetails);
      console.log(46,userDetails);
      if(userDetails.taluka && userDetails.taluka != null){
        setTaluka(userDetails.taluka);
        handleTalukaChange(userDetails.taluka);
        setIsTalukaPicklistDisabled(true)
      }
      if(userDetails.district && userDetails.district != null){
        setDistrict(userDetails.district);
        handleDistrictChange(userDetails.district);
        setIsDisrictPicklistDisabled(true)
      }
    }
  }

  useEffect(() => {
    if (navigator.geolocation !== null) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    } else {
      console.log("Browser does not support geolocation");
    }
    
    userDetails();
  }, []);

  const handleDistrictChange = async (e) => {    
    try{
      setDistrict(e);
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/getTalukas?District=${e}`);
      const responseData = await response.json();
      if(responseData.code === 200){
        const talukas = responseData.data.filter((taluka) => taluka.TALUKA).map((taluka)=> taluka.TALUKA);
        console.log(539,talukas);
        setTalukaOptions([...talukas]);
      }
    }
    catch(error){
      throw error;
    }
    const selectedDistrict = e;
    setDistrict(selectedDistrict);
    
  }

  const handleTalukaChange = async(e) => {
    try{
      setTaluka(e);
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/getVillages?Taluka=${e}`);
      const responseData = await response.json();
      if(responseData.code === 200){
        console.log(103,responseData)
        const villages = responseData.data.filter((village)=> village.VILLAGE).map((village)=> village.VILLAGE);
        setVillageOptions([...villages])
      }
    }
    catch(error){
      throw error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "DISTRICT":
        setDistrict(value);
        handleDistrictChange(value);
        break;
      case "TALUKA":
        setTaluka(value);
        handleTalukaChange(value);
        break;
      case "VILLAGE":
        setVillage(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "LOCATION":
        setAddress(value);
        break;
      case "Inauguration_DATE":
        setDate(value);
        break;
      case "IMPLIMANTATION_AUTHORITY":
        setImplementationAuthority(value);
        break;
      case "WorkName":
        setWorkName(value);
        break;
      default:
        break;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Set the image URL for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async(e) => {
    setIsLoading(true);
   try{
    e.preventDefault();

    let userData = await localStorage.getItem('userData');
    if(userData){
      userData = JSON.parse(userData);
    }
  
    const data = {
      DISTRICT,
      TALUKA,
      VILLAGE,
      LOCATION,
      Inauguration_DATE,
      Latitude,
      Longitude,
      WORK_NAME,
      IMPLIMANTATION_AUTHORITY,
      Inauguration_PHOTO1: photo, // Note: You can't send files directly in JSON
    };

    console.log(data);

    const res = await axios.post("https://rainwaterharvesting-backend-1.onrender.com/createRecords",data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.accessToken}`,  // Replace with your actual token if needed
        // You can add more headers as needed
      }
    })
    if(res){
      alert("Successfully added to the table");
      navigate('/');
      console.log("Successfully added to the table\nRes:", res);
    }

    setDistrict("Surat");
    setTaluka("BARDOLI");
    setVillage("");
    setMobile("");
    setAddress("");
    setDate("");
    setLatitude(23.0225);
    setLongitude(72.5714);
    setPhoto(null);
    setWorkName(null);
    setInaugurationPhoto(null);
    setImplementationAuthority("")
   }
   catch(error){
    alert("Something went wrong :-"+error);
   }
   finally{
    setIsLoading(false);
   }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>Water Harvesting Progress</h1>
        <p>
          Please fill in the following information with Water Harvesting
          Progress.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group grid">
            <div className="grid-item">
              <label htmlFor="DISTRICT">District *</label>
              {
              isDistrictPicklistDisabled ? 
                <input className="form-control" disabled={true} value={DISTRICT}/>
              :
                <select id="DISTRICT" name="DISTRICT" disabled={isDistrictPicklistDisabled} value={DISTRICT} onChange={(e)=> {handleChange(e)}}>
                  <option value="Surat">Surat</option>
                  <option value="Navsari">Navsari</option>
                </select>
              }
            </div>
            
            <div className="grid-item">
              <label htmlFor="TALUKA">Taluka *</label>
              {
                isTalukaPicklistDisabled ?
                <input className="form-control" disabled={true} value={TALUKA}/>
                :
                <select
                  id="TALUKA"
                  name="TALUKA"
                  value={TALUKA}
                  disabled={isTalukaPicklistDisabled}
                  onChange={handleChange}
                >
                  <option key={null} value="None"/>

                  {talukaOptions.map((taluka, index) => (
                    <option key={index} value={taluka}>
                      {taluka}
                    </option>
                  ))}
                </select>
              }
              
            </div>
          </div>
          <div className="form-group grid">
            <div className="grid-item">
              <label htmlFor="Village">Village *</label>
              <select
                id="VILLAGE"
                name="VILLAGE"
                value={VILLAGE}
                onChange={handleChange}
              >
              <option key={null} value="None"/>
                {villageOptions.map((taluka, index) => (
                  <option key={index} value={taluka}>
                    {taluka}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid-item">
              <label htmlFor="mobile">Your Mobile No</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={mobile}  
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="IMPLIMANTATION_AUTHORITY">Implimantation Authority *</label>
            <input
              id="IMPLIMANTATION_AUTHORITY"
              name="IMPLIMANTATION_AUTHORITY"
              type="text"
              value={IMPLIMANTATION_AUTHORITY}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="LOCATION">Location *</label>
            <input
              id="LOCATION"
              name="LOCATION"
              type="text"
              value={LOCATION}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="WorkName">Work Details *</label>
            <input
              id="WorkDetails"
              name="WorkName"
              type="text"
              value={WORK_NAME}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Inauguration_DATE">Start Work Date *</label>
            <input
              id="Inauguration_DATE"
              name="Inauguration_DATE"
              type="date"
              value={Inauguration_DATE}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="photo">Start Photo Upload *</label>
            <input
              id="photo"
              name="photo"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          {/* <div className="form-group">
            {photo && (
              <img
                className="uploadedImage"
                src={photo}
                alt="Uploaded Preview"
              />
            )}
          </div> */}
          <button type="submit" >
          {
            isLoading ? 
              <BeatLoader 
                  color={"#ffffff"}
                  loading={isLoading}
                  cssOverride={override}
                  size={15}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
            :
            'Submit'
          }
          </button>
       
         
        </form>
      </div>
    </div>
  );
};

export default Form;