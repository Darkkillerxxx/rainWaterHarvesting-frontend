import { useEffect, useState } from "react";
import "./dashboard.css";
import { Chart } from "react-google-charts";
import { Map, Marker, APIProvider,InfoWindow } from "@vis.gl/react-google-maps";
import { GoNumber } from "react-icons/go";
import { FaRoad } from "react-icons/fa6";
import { RiRoadMapFill } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { GiInauguration } from "react-icons/gi";
import { FaRegThumbsUp } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { CiLogin } from "react-icons/ci";
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import { Carousel } from 'react-bootstrap';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Modal from '../../components/Modal/Modal.js'
import ImageModal from '../../components/Modal/ImageModal.js'

//https://rainwaterharvesting-backend.onrender.com
//http://103.116.176.242:3000


export default function Dashboard() {
  const navigate = useNavigate()

  const [districts,setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Surat");
  const [dashboardData,setDashboardData] = useState(null)
  const [gaugeValue,setGaugeValue] = useState([])
  const [pieValue,setPieValue] = useState([])
  const [stackedBarChart,setStackedBarChart] = useState([]);
  const [mapMarkerList,setmapMarkerList] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [tableData,setTableData] = useState([]);
  const [tableCount,setTableCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    DISTRICT: 'Surat',
    TALUKA: null,
    VILLAGE: null,
  });
  const [picklistValues, setPicklistValues] = useState({
    district: [],
    taluka: [],
    village: [],
  });
  const [username,setUsername] = useState(null);
  const [selectedData,setSelectedData] = useState(null)
  const [showModal,setShowModal] = useState(false);

  const [isLoggedIn,setIsLoggedIn] = useState(true)
  const [activeMarker, setActiveMarker] = useState(null);
  const [picklistData, setPicklistData] = useState([]);  // Added picklistData state
  const [showImagePopUp,setImagePopUp] = useState(false);
  const [imagePopUpURL,setImagePopUpURL] = useState(null);
  const [isTalukaAssignedToUser,setIsTalukaAssignedToUser] = useState(false);

  const itemsPerPage = 10;

  const columns = [
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => 
          {
            console.log(params.row);
            handleEditClick(params.row)
          }
        }
        >
          Edit
        </Button>
      ),
    },
    { field: 'id', headerName: 'ID', width: 70, editable: false },
    { field: 'district', headerName: 'District', width: 130, editable: false },
    { field: 'taluka', headerName: 'Taluka', width: 130, editable: false },
    { field: 'village', headerName: 'Village', width: 130, editable: false },
    { field: 'location', headerName: 'Location', width: 130, editable: false },
    { field: 'inaugurationDate', headerName: 'GroundWork Date', type: 'date', width: 150, editable: false },
    { field: 'completionDate', headerName: 'Completion Date', type: 'date', width: 150, editable: false },
    {
      field: 'inaugurationPhoto',
      headerName: 'GroundWork Photo',
      width: 150,
      renderCell: (params) => (
        params.row.inaugurationPhoto ? (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              setImagePopUp(true)
              setImagePopUpURL(params.row.inaugurationPhoto)
            }}
          >
            View Image
          </Button>
        ) : (
          <span>No Image</span> // Optional placeholder when no image is available
        )
      ),
    },
    {
      field: 'completionPhoto',
      headerName: 'Completion Photo',
      width: 150,
      renderCell: (params) => (
        params.row.completionPhoto ? (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              setImagePopUp(true)
              setImagePopUpURL(params.row.completionPhoto)
            }}
          >
            View Image
          </Button>
        ) : (
          <span>No Image</span> // Optional placeholder when no image is available
        )
      ),
    }
  ].filter(column => column.field !== 'edit' || isLoggedIn);
  

  const paginationModel = { page: 0, pageSize: 5 };

  const handleEditClick = (data) =>{
    setSelectedData({...data});
    setShowModal(true);
  }

  const triggerModal = () =>{
    setShowModal(!showModal);
  }

  const fetchData = async () => {
    const offset = (currentPage - 1) * itemsPerPage;
    // console.log(63,`https://rainwaterharvesting-backend.onrender.com/fetchRecords?District=SURAT&Taluka=${filters.TALUKA}&Village=${filters.VILLAGE}&offSet=${offset}`)
    const response = await fetch(
      `https://rainwaterharvesting-backend.onrender.com/fetchRecords?District=SURAT&Taluka=${filters.TALUKA}&Village=${filters.VILLAGE}&offSet=${offset}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    );

    const jsonResponse = await response.json();
    const rows = jsonResponse.data.data.map((data, index) => ({
      id: data.ID,  // Use the ID field
      district: data.DISTRICT,
      taluka: data.TALUKA,
      village: data.VILLAGE,
      location: data.ENG_LOCATION || data.LOCATION,  // Use either the English location or the location field
      inaugurationDate: data.Inauguration_DATE ? new Date(data.Inauguration_DATE) : null,
      inaugurationPhoto: data.Inauguration_PHOTO1 ? data.Inauguration_PHOTO1 : null,
      completionDate: data.COMPLETED_DATE ? new Date(data.COMPLETED_DATE) : null,
      completionPhoto: data.COMPLETED_PHOTO1 ? data.COMPLETED_PHOTO1 : null,  // Parse the date
    }));

    console.log(rows);
    
    setTableData(rows);
    setTableCount(jsonResponse.data.totalCount);
    triggerIsLoggedIn();
  };

  const triggerIsLoggedIn = async() =>{
    let userData = await localStorage.getItem('userData');
    if(userData){
      userData = JSON.parse(userData);
      setUsername(userData.user);

      if(filters.TALUKA != userData.taluka){
        setFilters({...filters,TALUKA:userData.taluka})
      }
      setIsLoggedIn(true)
      return;
    }
    setIsLoggedIn(false)
  }

  useEffect(()=>{
    console.log(142);
    fetchData();
    checkIfTalukaAssignedToUser();
  },[])

  useEffect(() => {
    if(filters.DISTRICT || filters.TALUKA || filters.VILLAGE){
      console.log(148);
      fetchData();
    }
  }, [filters]);

  const triggerImageModalVisibility = () =>{
    setImagePopUp(!showImagePopUp)
  }

  const fetchDashboardvalues = async() =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend.onrender.com/getDashboardValues?DISTRICT=${selectedCity}`);
      const json = await response.json();
      console.log(json);
      setDashboardData({...json});
      
      // Setting Gauge Value
      const gaugeInitialValue = [["Label","value"]]
      setGaugeValue([...gaugeInitialValue]);

      const inaugrationValue = ['Groundwork',parseInt((json.inaugrationCount/json.totalRecordCount) * 100)]
      const completionValue = ['Completion',parseInt((json.completionCount/json.totalRecordCount) * 100)]

      setGaugeValue([...gaugeInitialValue,inaugrationValue,completionValue])
      console.log(36,[...gaugeInitialValue,inaugrationValue,completionValue]);

      const initialPieValue = [["Task", "Hours per Day"]];

      json.pieChart.forEach(values=>{
        initialPieValue.push([values.TALUKA,values.count])
      })

      console.log([...initialPieValue]);
      setPieValue([...initialPieValue]);

      const stackedBarChartValue = json.stackedBarChart;

      const talukas = [...new Set(stackedBarChartValue.map(item => item.TALUKA))];
      const grants = [...new Set(stackedBarChartValue.map(item => item.ENG_GRANT))];

      const result = [
        ["Grants", ...grants]
      ];

      talukas.forEach(taluka => {
        const row = [taluka];
        grants.forEach(grant => {
            const entry = stackedBarChartValue.find(item => item.TALUKA === taluka && item.ENG_GRANT === grant);
            row.push(entry ? entry.count : 0);
        });
        result.push(row);
      });
    
    console.log(72,result);
    setStackedBarChart([...result]);

    }
    catch(error){
      throw error;
    }
  }

  const fetchMapMarkerLocations = async() =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend.onrender.com/getAllLocationForDistricts?DISTRICT=${selectedCity}`);
      const json = await response.json();
      //console.log(json);
      
      if(json.code === 200){
        setmapMarkerList([...json.data])
      }
    }catch(error){
      throw error;
    }
  }

  const fetchPicklistValues = async() =>{
    try{
      const response = await fetch('https://rainwaterharvesting-backend.onrender.com/getPicklistValues');
      const data = await response.json();
      setPicklistData(data.data);

      const districtValues = [...new Set(data.data.map(item => item.DISTRICT))];
      const talukaValues = [...new Set(data.data.map(item => item.TALUKA))];

      await localStorage.setItem('Talukas',talukaValues.toString());

      const villageValues = [...new Set(data.data.map(item => item.VILLAGE))];
  
      setPicklistValues({
        district: districtValues,
        taluka: talukaValues,
        village: villageValues,
      });
    }catch(error){
      throw error;
    }
  }

  const chartEvents = [
    {
      eventName: "select",
      callback: async({ chartWrapper }) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        if (selection.length > 0) {
          const selectedItem = selection[0];
          const selectedRow = selectedItem.row;
          setSelectedValue(pieValue[selectedRow + 1][0]);
          alert(`You clicked on ${pieValue[selectedRow + 1][0]}`);
          await localStorage.setItem('selectedTaluka',pieValue[selectedRow + 1][0]);
          navigate('/records', { state: { selectedTaluka: pieValue[selectedRow + 1][0] } });
        }
      },
    },
  ];

  const navigateToRecordCreation = async() =>{
    const user = await localStorage.getItem('token');
    if(user){
      navigate('/create');
      return
    }
    navigate('/login');
  }


  useEffect(()=>{
    console.log(103);
    fetchDashboardvalues();
    fetchMapMarkerLocations();
    fetchPicklistValues();
  },[selectedCity])

  const updateRecords = async (updatedRecord) => {
    try {
      const response = await fetch(`https://rainwaterharvesting-backend.onrender.com/updateRecords`, {
        method: 'POST', // or 'PUT' if you're updating existing records
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord), // Convert the updatedRecord object to JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to update records');
      }
  
      alert('Tables Successfully Updated');
    } catch (error) {
      alert(error);
    }
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
  

  const processRowUpdate = (newRow, oldRow) => {

    console.log('Row updated:', newRow);

    const rowsToUpdate = {
      ID: newRow.id,
      DISTRICT: newRow.district,
      TALUKA: newRow.taluka,
      VILLAGE: newRow.village, // Assuming you want the English village name, or you can add gVILLAGE if necessary
      ENG_LOCATION: newRow.location, // Maps to location
      Inauguration_DATE: newRow.inaugurationDate, // Maps to the date field
      Inauguration_PHOTO1:newRow.inaugurationPhoto,
      COMPLETED_DATE: newRow.completionDate, // Maps to English Grant
      COMPLETED_PHOTO1: newRow.completionPhoto || null, // If labour exists, otherwise null
      IMPLIMANTATION_AUTHORITY: newRow.implementationAuthority || null, // If authority exists, otherwise null
      // Add any other fields that might be needed from the original object
    }
    console.log(296,rowsToUpdate);
    updateRecords(rowsToUpdate);
    
    return newRow;
  };

  const handleMarkerClick = (index) => {
    console.log(276,index);
    setActiveMarker(index);
  };

  const handleMouseOut = () => {
    setActiveMarker(null);
  };

  const checkIfTalukaAssignedToUser = async()=>{
    const userData = await localStorage.getItem('userData');
    if(userData && userData.taluka){
      setIsTalukaAssignedToUser(true);
    }
    setIsTalukaAssignedToUser(false);
  }

  const logOut = () =>{
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
  }
  
  
  return (
    <>
    { dashboardData ? 
       <div className="container" style={{padding:'25px'}}>
       
       <div style={{marginBottom:50}}>
        <div className="row"> 
          <div className="col-1">
            <img
              src="./smjt.png"
              style={{ height: "100px", width: "100%", objectFit: "contain",marginTop:10 }}
            />
          </div>
          <div className="col-10">
            <h2 style={{color:'#1ca1e4',fontStyle:'oblique'}}><b>जल संचय जन भागीदारी</b></h2>
            <h5>जल शक्ति मंत्रालय</h5>
            <h5>सूरत, गुजरात राज्य</h5>

          </div>
          <div className="col-1">
            <img
              src="./logo.jpeg"
              style={{ height: "90px", width: "100%", objectFit: "contain",marginTop:10 }}
            />
          </div>
        </div>
       </div>
       
       <div className="row" style={{marginTop:10}}>
         <div className="col-xl-2 col-l-2 col-m-6 col-xs-12">
           <div class="card mb-2" style={{width: '100%',height:100}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">State Target</div>
                   <h4 class="card-title">{dashboardData.totalRecordCount}</h4>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <GoNumber size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-xl-2 col-l-2 col-m-6 col-xs-12">
           <div class="card mb-2" style={{width: '100%',height:100}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Talukas</div>
                   <h4 class="card-title">{dashboardData.talukasCount}</h4>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <FaRoad size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-xl-2 col-l-2 col-m-6 col-xs-12">
           <div class="card mb-2" style={{width: '100%',height:100}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Villages</div>
                   <h4 class="card-title">{dashboardData.villageCount}</h4>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <RiRoadMapFill size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-xl-2 col-l-2 col-m-6 col-xs-12">
           <div class="card mb-2" style={{width: '100%',height:100}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Target</div>
                   <h4 class="card-title">{dashboardData.totalTargetCount}</h4>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <TbTargetArrow size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-xl-2 col-l-2 col-m-6 col-xs-12">
           <div class="card mb-2" style={{width: '100%',height:100}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">GroundWork</div>
                   <h4 class="card-title">{dashboardData.inaugrationCount}</h4>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <GiInauguration size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-xl-2 col-l-2 col-m-6 col-xs-12">
           <div class="card mb-2" style={{width: '100%',height:100}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Completions</div>
                   <h4 class="card-title">{dashboardData.completionCount}</h4>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <FaRegThumbsUp size={30}/>
               </div>
             </div>
             </div>
         </div>

         <div className="col-12" style={{marginTop:10}}>
          <div className="row">
            <div className="col-xl-6 col-l-6 col-m-6 col-xs-12">
              <div className="card mb-2" style={{height:500}}>
              <APIProvider apiKey="AIzaSyBucoqzCbZyvxNFD3JzxPHDEH5BSkIcOTM">
                <Map
                  style={{ borderRadius: "20px", height: 500 }}
                  defaultZoom={12}
                  defaultCenter={{
                    lat: 21.1702,
                    lng: 72.8311,
                  }}
                  gestureHandling={"greedy"}
                  disableDefaultUI
                  renderingType="RASTER"
                >
                  {mapMarkerList.map((marker, index) => {
                    return (
                      <>
                        <Marker
                          key={index}
                          title={`Village:${marker.Village}, Location:${marker.Location} , GroundWork Date : ${
                            marker.Inauguration_DATE ? marker.Inauguration_DATE : null
                          }`}
                          position={{ lat: parseFloat(marker.Latitude), lng: parseFloat(marker.longitude) }}
                          onClick={() => handleMarkerClick(index)}
                        />

                        <>
                          {activeMarker === index ? (
                            <div
                              className="card"
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)", // Center the InfoWindow
                                width: "300px",
                                backgroundColor: "white",
                                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                borderRadius: "5px",
                                padding: "15px",
                                zIndex: 1000,
                              }}
                            >
                              {/* Close button */}
                              <button
                                onClick={() => setActiveMarker(null)} // Reset activeMarker to close the card
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                  background: "none",
                                  border: "none",
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  width:"30px",
                                  color:'black',
                                  alignSelf:'end',
                                  marginTop:'10px'
                                }}
                              >
                                X
                              </button>

                              {mapMarkerList[activeMarker].Inauguration_PHOTO1 ? (
                                <img
                                  className="card-img-top"
                                  src={mapMarkerList[activeMarker].Inauguration_PHOTO1}
                                  alt="Card image cap"
                                  style={{width:'100%',height:150}}
                                />
                              ) : null}
                              <div className="card-body" style={{ textAlign: "left" }}>
                                <h5 className="card-title" style={{ fontSize: 15 }}>
                                  <b>District :</b> {mapMarkerList[activeMarker].District}, <b>Taluka :</b> {mapMarkerList[activeMarker].Taluka}
                                </h5>
                                <span className="card-text" style={{ fontSize: 12 }}>
                                  <b>Village :</b> {mapMarkerList[activeMarker].Village}
                                </span>
                                <br />
                                <span className="card-text" style={{ fontSize: 12 }}>
                                  <b>Work Location :</b> {mapMarkerList[activeMarker].Location}
                                </span>
                                <br />
                                {mapMarkerList[activeMarker].Inauguration_DATE && (
                                  <span className="card-text mt-2" style={{ fontSize: 12 }}>
                                    <b>GroundWork Date:</b> {mapMarkerList[activeMarker].Inauguration_DATE.split('T')[0]}
                                  </span>
                                )}<br/>
                                {mapMarkerList[activeMarker].COMPLETED_DATE && (
                                  <span className="card-text" style={{ fontSize: 12 }}>
                                   <b>Completion Date:</b>{mapMarkerList[activeMarker].COMPLETED_DATE.split('T')[0]}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </>
                      </>
                    );
                  })}
                </Map>
              </APIProvider>

              </div>
            </div>
            <div className="col-xl-6 col-l-6 col-m-6 col-xs-12">
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./1.jpg"
                  style={{height:500,width:'100%'}}
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./2.jpg"
                  style={{height:500,width:'100%'}}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./3.jpg"
                  style={{height:500,width:'100%'}}
                  alt="Third slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./4.jpg"
                  style={{height:500,width:'100%'}}
                  alt="Third slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./5.jpg"
                  style={{height:500,width:'100%'}}
                  alt="Third slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./6.jpg"
                  style={{height:500,width:'100%'}}
                  alt="Third slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./7.jpg"
                  style={{height:500,width:'100%'}}
                  alt="Third slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./8.jpg"
                  style={{height:500,width:'100%'}}
                  alt="Third slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="./10.jpg"
                  style={{height:500,width:'100%'}}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
            </div>
          </div>
          
         </div>
       </div>
       <div className="row">
         <div className="col-xl-8 col-l-8 col-m-8 col-xs-12">
           <div class="card" style={{marginTop:10,height:250}}>
           <h5 class="card-title">Pie Chart for all Talukas</h5>
             <Chart
               chartType="PieChart"
               data={pieValue}
               width={"100%"}
               height={"200px"}
               options={{
                pieSliceText: 'value', // Display the values
                chartArea: {
                  width: '90%',  // Increase the pie chart area width
                  height: '90%'  // Increase the pie chart area height
                }
                // You can also use 'percentage' to display percentages
              }}
             />
           </div>
         </div>
         <div className="col-xl-4 col-l-4 col-m-6 col-xs-12">
           <div class="card" style={{marginTop:10,height:250}}>
             <h5 class="card-title">GroundWork & Completion Status (in %)</h5>
             <div
                style={{
                  display: 'flex',
                  width: '100%',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}
              >
                <Chart
                  chartType="Gauge"
                  width="80%"
                  data={gaugeValue}
                  options={{
                    width: 500,
                    height: 150,
                    redFrom: 90,
                    redTo: 100,
                    yellowFrom: 75,
                    yellowTo: 90,
                    minorTicks: 5,
                  }}
                />
                <style>
                  {`
                    @media (max-width: 768px) {
                      div {
                        justify-content: flex-start !important;
                        padding-left: 10px;
                      }
                    }
                  `}
                </style>
              </div>
           </div>
         </div>
         
         {/* Insert Table Here */}
         <div className="col-12 mt-4 mb-2 d-none d-sm-block">
            <div className="row">
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
                    <select
                      value={filters.DISTRICT}
                      onChange={(e) => {
                        handleTalukaChange(e);
                      }}
                    >
                      <option value="null">Select District</option>
                      {picklistValues.district.map((district, index) => (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  {
                    
                    !isTalukaAssignedToUser ?
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
                      <select
                        value={filters.TALUKA}
                        onChange={(e) => {
                          handleTalukaChange(e);
                        }}
                      >
                        <option value="null">Select Taluka</option>
                        {picklistValues.taluka.map((taluka, index) => (
                          <option key={index} value={taluka}>
                            {taluka}
                          </option>
                        ))}
                      </select>
                    </div>
                    :
                    null
                  }
                

                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
                    <select
                      value={filters.VILLAGE}
                      onChange={(e) => {
                        setFilters({ ...filters, VILLAGE: e.target.value });
                      }}
                    >
                      <option value="null">Select Village</option>
                      {picklistValues.village.map((village, index) => (
                        <option key={index} value={village}>
                          {village}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-4">
                    {isLoggedIn ? (
                      <div style={{display:'flex',justifyContent:'space-around'}}>
                        <button
                          type="button"
                          onClick={() => navigateToRecordCreation()}
                          className="btn btn-primary w-75"
                          >
                          Create New Record
                        </button>
                        <CiLogin style={{marginTop:5,cursor:'pointer'}} onClick={()=>logOut()} size={30}/>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="btn btn-primary w-100"
                      >
                        Login to Edit/Create
                      </button>
                    )}
                  </div>

            </div>
         </div>



         <div className="col-12 mt-4 mb-2 d-block d-sm-none">
          <div className="row">
            <div className="col-6 mb-2">
              <select
                value={filters.DISTRICT}
                onChange={(e) => {
                  handleTalukaChange(e);
                }}
              >
                <option value="null">Select District</option>
                {picklistValues.district.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 mb-2">
              <select
                value={filters.TALUKA}
                onChange={(e) => {
                  handleTalukaChange(e);
                }}
              >
                <option value="null">Select Taluka</option>
                {picklistValues.taluka.map((taluka, index) => (
                  <option key={index} value={taluka}>
                    {taluka}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 mb-2">
              <select
                value={filters.VILLAGE}
                onChange={(e) => {
                  setFilters({ ...filters, VILLAGE: e.target.value });
                }}
              >
                <option value="null">Select Village</option>
                {picklistValues.village.map((village, index) => (
                  <option key={index} value={village}>
                    {village}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 mb-2">
              {isLoggedIn ? (
                <button
                  type="button"
                  style={{ height: 40, fontSize: 12 }}
                  onClick={() => navigateToRecordCreation()}
                  className="btn btn-primary w-100"
                >
                  Create New Record
                </button>
              ) : (
                <button
                  type="button"
                  style={{ height: 40, fontSize: 12 }}
                  onClick={() => navigate('/login')}
                  className="btn btn-primary w-100"
                >
                  Login to Edit/Create
                </button>
              )}
            </div>
          </div>
        </div>

         
         
         <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={tableData}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              sx={{ border: 0 }}
              processRowUpdate={processRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Paper>
        
         <div className="col-12">
          {
            stackedBarChart[0][1] ? 
           <div class="card" style={{marginTop:10}}>
           <Chart
               chartType="BarChart"
               width="100%"
               height="400px"
               data={stackedBarChart}
               options={{
                 title: "Grants Data",
                 chartArea: { width: "50%" },
                 isStacked: true,
                 orientation:'horizontal',
                 hAxis: {
                   title: "Total Population",
                   minValue: 0,
                 },
                 vAxis: {
                   title: "City",
                 },
               }}
             />
           </div>:null}

           {
          showModal ? 
            <div className="col-12" style={{display:'flex',justifyContent:'center'}}>
                <Modal triggerModalVisibility={triggerModal} rowData={selectedData} picklistOptions={picklistValues}/>
            </div>
            :
            null
          }

          {
            showImagePopUp ?
            <div className="col-12" style={{display:'flex',justifyContent:'center'}}>
                <ImageModal selectedImage={imagePopUpURL} onHandleClose={triggerImageModalVisibility}/>
            </div>
            :
            null
          }
          
         </div>
       </div>
     </div>
    : 
    
    null}
     
    </>
  );
}
