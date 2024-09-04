import axios from "axios";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "./Form.css";

const Form = () => {
  const [DISTRICT, setDistrict] = useState(null);
  const [picklistValues,setPicklistvalues] = useState(null);
  const [districtValues,setDistrictValues] = useState([]);
  const [talukaValues,setTalukaValues] = useState([]);
  const [TALUKA, setTaluka] = useState("BARDOLI");
  const [VILLAGE, setVillage] = useState("");
  const [mobile, setMobile] = useState("");
  const [LOCATION, setAddress] = useState("");
  const [Inauguration_DATE, setDate] = useState("");
  const [Latitude, setLatitude] = useState(23.0225);
  const [Longitude, setLongitude] = useState(72.5714);
  const [photo, setPhoto] = useState(null);
  const [isLoading,setIsLoading] = useState(false);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const fetchPicklistValues = () => {
    try{
      axios
      .get(
        "https://rainwaterharvesting-backend.onrender.com/getPicklistValues"
      )
      .then((res) => {
        console.log(res);
        if(res.data.code === 200){
          const districtValues = [];
          setPicklistvalues(res.data.data);

          res.data.data.map((data)=>{
            if(!districtValues.includes(data.DISTRICT)){
              districtValues.push(data.DISTRICT)
            }
          })
          console.log(districtValues);
          setDistrictValues([...districtValues])
        }
      })
      .catch((e) => {
        console.log("Error:", e);
      });
    }
    catch(error){
      throw error;
    }
  }

  useEffect(()=>{
    if(DISTRICT){
      console.log(51,picklistValues,DISTRICT);
      const talukaValues = picklistValues.filter((picklistValue)=> picklistValue.DISTRICT === DISTRICT);
      setTalukaValues([...talukaValues]);
    }
  },[DISTRICT])

  useEffect(() => {
    if (navigator.geolocation !== null) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    } else {
      console.log("Browser does not support geolocation");
    }

    fetchPicklistValues();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "DISTRICT":
        setDistrict(value);
        break;
      case "TALUKA":
        setTaluka(value);
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
      default:
        break;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Get the base64 string
        console.log(base64String); // Do something with the base64 string, e.g., save it to state
        setPhoto(base64String); // Assuming setPhoto is used to store the base64 string
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append("DISTRICT", DISTRICT);
    // formData.append("TALUKA", TALUKA);
    // formData.append("VILLAGE", VILLAGE);
    // // formData.append("mobile", mobile);
    // formData.append("LOCATION", LOCATION);
    // formData.append("Inauguration_DATE", Inauguration_DATE);
    // formData.append("Latitude", Latitude);
    // formData.append("Longitude", Longitude);
    // // formData.append("photo", photo);

    // // for (let [key, value] of formData.entries()) {
    // //   console.log(`${key}: ${value}`);
    // // }
    setIsLoading(true);

    const data = {
      DISTRICT,
      TALUKA,
      VILLAGE,
      // mobile,
      LOCATION,
      Inauguration_DATE,
      Latitude,
      Longitude,
      Inauguration_PHOTO1: photo, // Note: You can't send files directly in JSON
    };

    console.log(data);

    axios
      .post(
        "https://rainwaterharvesting-backend.onrender.com/createRecords",
        data,
      )
      .then((res) => {
        alert("Successfully added to the table");
        console.log("Successfully added to the table\nRes:", res);
      })
      .catch((e) => {
        console.log("Error:", e);
      });
      setIsLoading(false);
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
              <select
                id="DISTRICT"
                name="DISTRICT"
                value={DISTRICT}
                onChange={handleChange}
              >
                <option value={null}>Please Select District</option>
                {
                  districtValues.map((district,index)=>{
                    return (
                      <option key={index} value={district}>{district}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className="grid-item">
              <label htmlFor="TALUKA">Taluka *</label>
              <select
                id="TALUKA"
                name="TALUKA"
                value={TALUKA}
                onChange={handleChange}
              >
                <option value={null}>Select Taluka</option>
                {
                  talukaValues.map((taluka,index)=>{
                    return(
                      <option key={index} value={taluka.TALUKA}>{taluka.TALUKA}</option>
                    )
                  })
                }
              </select>
            </div>
          </div>
          <div className="form-group grid">
            <div className="grid-item">
              <label htmlFor="VILLAGE">Village *</label>
              <input
                id="VILLAGE"
                name="VILLAGE"
                type="text"
                value={VILLAGE}
                onChange={handleChange}
                required
              />
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
            <label htmlFor="LOCATION">Address *</label>
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
            <label htmlFor="Inauguration_DATE">Date *</label>
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
            <label htmlFor="photo">Upload a Photo *</label>
            <input
              id="photo"
              name="photo"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          {
          isLoading ? 
          <ClipLoader
              color="#1ca1e4"
              loading={isLoading}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            :
            <button type="submit">Submit</button>
          }
        </form>
      </div>
    </div>
  );
};

export default Form;
