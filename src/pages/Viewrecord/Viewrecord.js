import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Viewrecord = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-xl-4" style={{ paddingLeft:'150px'}}>
          <label htmlFor="numberDropdown" className="mr-2">
            Select Option:
          </label>
          <select
          
            id="numberDropdown"
            value={selectedOption}
            onChange={handleChange}
            className="px-2 py-1  border border-gray-300  rounded col-xl-7 "
          >
            <option value="" disabled >
              Select an option
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="col-xl-2">
          <button type="button" className="btn btn-success rounded-2">Generate Report</button>
        </div>
        <div className="col-xl-2">
            <button type="button" className="btn btn-success rounded-2"
            onClick={() => navigate("/")}
            >
                Back to Home

            </button>

        </div>
      </div>
    </div>
  );
};

export default Viewrecord;
