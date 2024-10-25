import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Table.css";


export default function FilteredTable() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    DISTRICT: null,
    TALUKA: null,
    VILLAGE: null,
  });
  const [picklistValues, setPicklistValues] = useState({
    district: [],
    taluka: [],
    village: [],
  });
  const [picklistData, setPicklistData] = useState([]);  // Added picklistData state

  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTaluka = location.state?.selectedTaluka; // Access the passed state
  console.log(26,location)

  useEffect(() => {
    fetchPicklistValues();
    setFilters({
      ...filters,TALUKA:selectedTaluka
    })
  }, []);

  useEffect(() => {
    console.log(36)
    if(filters.DISTRICT || filters.TALUKA || filters.VILLAGE){
      console.log(38)
      fetchData();
    }
  }, [filters, currentPage]);

  const fetchPicklistValues = async () => {
    try {
      const response = await fetch('https://rainwaterharvesting-backend-1.onrender.com/getPicklistValues');
      const data = await response.json();
      setPicklistData(data.data);

      const districtValues = [...new Set(data.data.map(item => item.DISTRICT))];
      const talukaValues = [...new Set(data.data.map(item => item.TALUKA))];
      const villageValues = [...new Set(data.data.map(item => item.VILLAGE))];
  
      setPicklistValues({
        district: districtValues,
        taluka: talukaValues,
        village: villageValues,
      });

    } catch (error) {
      console.error('Error fetching picklist values:', error);
    }
  };

  const fetchData = async () => {
    const offset = (currentPage - 1) * itemsPerPage;
    console.log(63,`https://rainwaterharvesting-backend-1.onrender.com/fetchRecords?District=${filters.DISTRICT}&Taluka=${filters.TALUKA}&Village=${filters.VILLAGE}&offSet=${offset}`)
    const response = await fetch(
      `https://rainwaterharvesting-backend-1.onrender.com/fetchRecords?District=${filters.DISTRICT}&Taluka=${filters.TALUKA}&Village=${filters.VILLAGE}&offSet=${offset}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    );

    const jsonResponse = await response.json();
    setData(jsonResponse.data.data);
    setTotalCount(jsonResponse.data.totalCount);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const updateRecordInTable = async(item) => {
    const isAuth = await localStorage.getItem('token');
    if(!isAuth){
      navigate("/login");
      return;
    }
    navigate("/create", { state: { item } });
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      DISTRICT: selectedDistrict,
      TALUKA: null,
      VILLAGE: null,
    }));
  };

  const handleTalukaChange = (e) => {
    const selectedTaluka = e.target.value;
    // console.log(118,picklistData);
    setFilters(prevFilters => ({
      ...prevFilters,
      TALUKA: selectedTaluka,
      VILLAGE: null,
    }));
  
    const filteredVillages = picklistData.filter((data) => {
      return data.TALUKA === selectedTaluka;
    });
    
    const villageValues = filteredVillages.map(item => item.VILLAGE);
    setPicklistValues({ ...picklistValues, village: villageValues });
  };

  const handleVillageChange = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      VILLAGE: e.target.value,
    }));
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="filtered-table">
      <div className="filters">
        <select
          value={filters.DISTRICT}
          onChange={(e) => {
            setFilters({ ...filters, DISTRICT: e.target.value });
            if (e.target.value !== 'null') {
              const filteredTaluka = picklistValues.taluka.filter(taluka => {
                return picklistData.find(item => item.DISTRICT === e.target.value && item.TALUKA === taluka);
              });
              setPicklistValues({ ...picklistValues, taluka: filteredTaluka });
              
            } else {
              fetchPicklistValues();
            }
          }}
        >
          <option value="null">Select District</option>
          {picklistValues.district.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>

        <select
          value={filters.TALUKA}
          onChange={(e) => {
            handleTalukaChange(e);
          }}
        >
          <option value="null">Select Taluka</option>
          {picklistValues.taluka.map((taluka, index) => (
            <option key={index} value={taluka}>{taluka}</option>
          ))}
        </select>

        <select
          value={filters.VILLAGE}
          onChange={(e) => {
            setFilters({ ...filters, VILLAGE: e.target.value });
            fetchData();
          }}
        >
          <option value="null">Select Village</option>
          {picklistValues.village.map((village, index) => (
            <option key={index} value={village}>{village}</option>
          ))}
        </select>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>DISTRICT</th>
            <th>TALUKA</th>
            <th>VILLAGE</th>
            <th>LOCATION</th>
            <th>INAUGURATION DATE</th>
            <th>ENG_GRANT</th>
            <th>Labour</th>
            <th>IMPLIMANTATION_AUTHORITY</th>
            <th>LOCATION_G</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} onClick={() => updateRecordInTable(item)}>
              <td>{item.ID}</td>
              <td>{item.DISTRICT}</td>
              <td>{item.TALUKA}</td>
              <td>{item.VILLAGE}</td>
              <td>{item.ENG_LOCATION}</td>
              <td>{item.Inauguration_DATE}</td>
              <td>{item.ENG_GRANT}</td>
              <td>{item.Labour}</td>
              <td>{item.IMPLIMANTATION_AUTHORITY}</td>
              <td>{item.LOCATION}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ width: '300px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
