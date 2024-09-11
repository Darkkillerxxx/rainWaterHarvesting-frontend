import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Form.css";

const Form = () => {
  const location = useLocation();
  const item = location.state?.item;

  const [talukaOptions, setTalukaOptions] = useState([]);

  const [DISTRICT, setDistrict] = useState(item?.DISTRICT || "Surat");
  const [TALUKA, setTaluka] = useState(item?.TALUKA || "BARDOLI");
  const [VILLAGE, setVillage] = useState(item?.VILLAGE || "");
  const [mobile, setMobile] = useState("");
  const [LOCATION, setAddress] = useState(item?.ENG_LOCATION || "");
  const [Inauguration_DATE, setDate] = useState("");
  const [InaugurationPhoto,setInaugurationPhoto] = useState("")
  const [Latitude, setLatitude] = useState(23.0225);
  const [Longitude, setLongitude] = useState(72.5714);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (navigator.geolocation !== null) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
      fetchTalukaOptions();
    } else {
      console.log("Browser does not support geolocation");
    }
  }, []);

  const fetchTalukaOptions = async () => {
    try {
      const response = await fetch(
        "https://rainwaterharvesting-backend.onrender.com/getPicklistValues",
      );
      const jsonResponse = await response.json();
      const uniqueTalukas = [
        ...new Set(jsonResponse.data.map((item) => item.TALUKA)),
      ];
      setTalukaOptions(uniqueTalukas);
    } catch (error) {
      console.error("Error fetching Taluka options:", error);
    }
  };

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
        setPhoto(reader.result); // Set the image URL for preview
      };
      reader.readAsDataURL(file);
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
                <option value="Surat">Surat</option>
                <option value="Navsari">Navsari</option>
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
                {talukaOptions.map((taluka, index) => (
                  <option key={index} value={taluka}>
                    {taluka}
                  </option>
                ))}
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
          {/* <div className="form-group">
            {photo && (
              <img
                className="uploadedImage"
                src={photo}
                alt="Uploaded Preview"
              />
            )}
          </div> */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Form;