import { useEffect, useState } from "react";
import "./dashboard.css";
import { Chart } from "react-google-charts";
import { Map, Marker, APIProvider,InfoWindow } from "@vis.gl/react-google-maps";
import { GoNumber } from "react-icons/go";
import { FaRoad } from "react-icons/fa6";
import { RiRoadMapFill } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { GiInauguration } from "react-icons/gi";
import { FaRegThumbsUp,FaFileCsv,FaFilePdf,FaRegWindowClose  } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { CiLogin } from "react-icons/ci";
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import { Carousel } from 'react-bootstrap';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, formControlClasses } from '@mui/material';
import Modal from '../../components/Modal/Modal.js'
import ImageModal from '../../components/Modal/ImageModal.js'
import { CSVLink, CSVDownload } from "react-csv";
import { useSelector, useDispatch } from 'react-redux';
import { addPicklistValues } from '../../features/picklistValuesSlice.js';


//https://rainwaterharvesting-backend-1.onrender.com
//http://103.116.176.242:3000


export default function Dashboard() {
  const masterPicklistValues = useSelector((state) => state.items.picklistValues);
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const [district,setDistrict] = useState('');
  const [taluka,setTaluka] = useState('');
  const [village,setVillage] = useState('');

  const [dashboardData,setDashboardData] = useState(null);
  const [gaugeValue,setGaugeValue] = useState([]);
  const [pieValue,setPieValue] = useState([]);
  const [stackedBarChart,setStackedBarChart] = useState([]);
  const [mapMarkerList,setmapMarkerList] = useState([]);
  const [tableData,setTableData] = useState([]);
  const [tableDataToShow,setTableDataToShow] = useState([]);
  const [tableCount,setTableCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText,setSearchText] = useState("");
  const [isAdmin,setIsAdmin] = useState(false);
  const [picklistValues, setPicklistValues] = useState({
    district: [],
    taluka: [],
    village: [],
  });
  const [districtPicklistValues,setDistrictPicklistValues] = useState([]);
  const [talukaPicklistValues,setTalukaPicklistValues] = useState([]);
  const [villagePicklistValues,setVillagePicklistValues] = useState([]);

  const [id,setId] = useState('');
  const [username,setUsername] = useState(null);
  const [selectedData,setSelectedData] = useState(null)
  const [showModal,setShowModal] = useState(false);
  const [showOnlyGroundWork,setShowOnlyGroundwork] = useState(false);
  const [showOnlyCompleted,setShowOnlyCompleted] = useState(false);

  const [isLoggedIn,setIsLoggedIn] = useState(true)
  const [activeMarker, setActiveMarker] = useState(null);
  const [showImagePopUp,setImagePopUp] = useState(false);
  const [imagePopUpURL,setImagePopUpURL] = useState(null);
  const [isTalukaAssignedToUser,setIsTalukaAssignedToUser] = useState(false);
  const [sliderImages,setSliderImages] = useState([]);
  const [isDistrictAssignedToUser,setIsDistrictAssignedToUser] = useState(false);

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
            console.log(88,((parseInt(params.row.createdByUserId) === id) || isAdmin))
            handleEditClick(params.row,((parseInt(params.row.createdByUserId) === id) || isAdmin));
          }
        }
        >
          View
        </Button>
      ),
    },
    { field: 'id', headerName: 'ID', width: 70, editable: false },
    { field: 'district', headerName: 'District', width: 130, editable: false },
    { field: 'taluka', headerName: 'Taluka', width: 130, editable: false },
    { field: 'village', headerName: 'Village', width: 130, editable: false },
    { field: 'location', headerName: 'Location', width: 130, editable: false },
    { field: 'work', headerName: 'Work Details', width: 130, editable: false },
    { field: 'inaugurationDate', 
      headerName: 'Start Work Date',
      type: 'date',
      width: 150, 
      editable: false,
      valueFormatter: (params) => params ? params.toLocaleDateString('en-GB') : '', // Format for display
    },
    { field: 'completionDate', 
      headerName: 'Completion Date', 
      type: 'date', 
      width: 150, 
      editable: false, 
      valueFormatter: (params) => params ? params.toLocaleDateString('en-GB') : '', // Format for display
    },
    {
      field: 'inaugurationPhoto',
      headerName: 'Start Work Photo',
      width: 250,
      renderCell: (params) => (
        params.row.inaugurationPhoto ? (
          <div style={{width:'100%',marginTop:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Button
              style={{width:200}}
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
            {
              isAdmin ? 
              <Button
                style={{width:50,marginLeft:10}}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  resetImage(params.row.id,1)
                }}
              >
                <FaRegWindowClose size={20}/>
              </Button>
              :
              null
            }
            
          </div>
        ) : (
          <span>No Image</span> // Optional placeholder when no image is available
        )
      ),
    },
    {
      field: 'completionPhoto',
      headerName: 'Completion Photo',
      width: 250,
      renderCell: (params) => (
        params.row.completionPhoto ? (
          <div style={{width:'100%',marginTop:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
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
            {
              isAdmin ? 
              <Button
                style={{width:50,marginLeft:10}}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  resetImage(params.row.id,0)

                }}
              >
                <FaRegWindowClose size={20}/>
              </Button>
              :
              null
            }

          </div>
          
        ) : (
          <span>No Image</span> // Optional placeholder when no image is available
        )
      ),
    }
  ].filter(column => column.field !== 'edit' || isLoggedIn);
  

  const paginationModel = { page: 0, pageSize: 5 };

  const handleEditClick = (data,canEdit) =>{
    data.canEdit = canEdit;
    console.log(206,{...data});
    setSelectedData({...data});
    setShowModal(true);
  }

  const resetImage = async(recordId,recordType) =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/resetImage`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            recordId:recordId,
            type:recordType
          })
        });
    
      const jsonResponse = await response.json();
      
      if(jsonResponse?.code != 200){
        alert('Something Went Wrong');
        return
      }
      alert('Image Deleted Successfully');
      const updatedTableData = tableDataToShow.map((data) => {
      
        if (data.id === recordId) {
          console.log(237);
          // Update the specific field based on recordType
          if (recordType === 1) {
            return { ...data, inaugurationPhoto: null }; // Clear Inauguration_PHOTO1
          } else {
            return { ...data, completionPhoto: null }; // Clear COMPLETED_PHOTO1
          }
        }
        return data; // Return unchanged records
      });

      setTableDataToShow([...updatedTableData]);
    }catch(error){
      console.log(error.message);
    } 
  }

  const triggerModal = () =>{
    setShowModal(!showModal);
  }

  const fetchData = async () => {
    const offset = (currentPage - 1) * itemsPerPage;
    let userData = await localStorage.getItem('userData');
    if(userData){
      userData = JSON.parse(userData);
    }

    // //console.log(63,`https://rainwaterharvesting-backend-1.onrender.com/fetchRecords?District=SURAT&Taluka=${filters.TALUKA}&Village=${filters.VILLAGE}&offSet=${offset}`)
    const headers = {
      "Cache-Control": "no-cache"
    }
    if(userData?.accessToken){
      headers.Authorization=`Bearer ${userData?.accessToken}`
    }
    if(district.length > 0){
      const response = await fetch(
        `https://rainwaterharvesting-backend-1.onrender.com/fetchRecords?District=${district}&Taluka=${taluka}&Village=${village}&offSet=${offset}`,
        {
          method: "GET",
          headers: headers
        },
      );
  
      const jsonResponse = await response?.json();
      //console.log(182,jsonResponse);
      const rows = jsonResponse?.data?.data?.map((data, index) => ({
        id: data.ID,  // Use the ID field
        district: data.DISTRICT,
        taluka: data.TALUKA,
        village: data.VILLAGE,
        location: data.ENG_LOCATION || data.LOCATION,  // Use either the English location or the location field
        inaugurationDate: data.Inauguration_DATE ? new Date(data.Inauguration_DATE) : null,
        inaugurationPhoto: data.Inauguration_PHOTO1 ? data.Inauguration_PHOTO1 : null,
        completionDate: data.COMPLETED_DATE ? new Date(data.COMPLETED_DATE) : null,
        work:data.WORK_NAME ? data.WORK_NAME : null, 
        completionPhoto: data.COMPLETED_PHOTO1 ? data.COMPLETED_PHOTO1 : null,
        isGroundworkPhotoApproved:data.IS_GROUNDWORK_PHOTO_APPROVED ? true : false,
        isCompletedPhotoApproved:data.IS_COMPLETED_PHOTO_APPROVED ? true : false,
        implementationAuthority:data.IMPLIMANTATION_AUTHORITY,
        createdByUserId:data.CRE_USR_ID
          // Parse the date
      }));
  
      console.log(292,rows);
      
      if(rows && rows?.length > 0){
        setTableData([...rows]);
        setTableDataToShow([...rows]);
        setTableCount(jsonResponse.data.totalCount);
      }
      triggerIsLoggedIn();
    }
   
  };

  const triggerIsLoggedIn = async() =>{
    let userData = await localStorage.getItem('userData');
    if(userData){
      if(!userData.district && !userData.taluka){
        setIsAdmin(true);
      }

      userData = JSON.parse(userData);
      setUsername(userData.user);

      if(taluka != userData.taluka && userData?.taluka != null){
        console.log(325)
        setTaluka(userData.taluka);
      }
      console.log(323,userData)
      if(userData.userId)
      {
        setId(userData.userId);
      }
      setIsLoggedIn(true)
      return;
    }
    setIsLoggedIn(false)
  }

  const getSliderImages=async()=>{
    const response = await fetch(
      `https://rainwaterharvesting-backend-1.onrender.com/getSliderImages`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const jsonResponse = await response.json();
      //console.log(208,jsonResponse);
      if(jsonResponse.code === 200){
        let filesRetrieved = jsonResponse.data.filter((files) => files?.name?.includes('.png') || files?.name?.includes('.jpg'));
        setSliderImages([...filesRetrieved]);
      }
  }

  useEffect(()=>{
    fetchData();
    checkIfTalukaAssignedToUser();
    fetchPicklistValues();
    fetchDistrictPicklistValues();
    getSliderImages();
  },[])

  useEffect(()=>{
    if(district.length === 0){
      setDistrict('Surat')
    }
    if(district.length > 0){
      fetchData();
      fetchDashboardvalues();
      fetchMapMarkerLocations();
    }
  },[district])

  useEffect(()=>{
    console.log(370,taluka)
    if(taluka && taluka.length > 0 && district.length > 0){
      fetchData();
    }
  },[taluka])

  useEffect(()=>{
    if(village && village.length > 0 && taluka.length > 0 && district.length > 0){
      fetchData();
    }
  },[village])

  useEffect(()=>{
    let filteredTableData = [];

    if(tableData.length > 0){
      filteredTableData = tableData.filter((data)=> data?.district?.includes(searchText) || data?.taluka?.includes(searchText) || data?.village?.includes(searchText) || data?.location?.includes(searchText));
    }

    if(showOnlyGroundWork){
      filteredTableData = filteredTableData.filter((data)=> data.inaugurationDate);
    }

    if(showOnlyCompleted){
      filteredTableData = filteredTableData.filter((data)=> data.completionDate);
    }
    setTableDataToShow([...filteredTableData]);     
  },[showOnlyGroundWork,showOnlyCompleted,searchText])

  const triggerImageModalVisibility = () =>{
    setImagePopUp(!showImagePopUp)
  }

  const fetchDashboardvalues = async() =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/getDashboardValues?DISTRICT=${district}`);
      const json = await response.json();
      setDashboardData({...json});
      
      // Setting Gauge Value
      const gaugeInitialValue = [["Label","value"]]
      setGaugeValue([...gaugeInitialValue]);

      const inaugrationValue = ['Start Work',parseInt((json.inaugrationCount/json.totalRecordCount) * 100)]
      const completionValue = ['Completion',parseInt((json.completionCount/json.totalRecordCount) * 100)]

      setGaugeValue([...gaugeInitialValue,inaugrationValue,completionValue])

      const initialPieValue = [["Task", "Hours per Day"]];

      json.pieChart.forEach(values=>{
        initialPieValue.push([values.TALUKA,values.count])
      })

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
    
    //console.log(72,result);
    setStackedBarChart([...result]);

    }
    catch(error){
      throw error;
    }
  }

  const fetchMapMarkerLocations = async() =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/getAllLocationForDistricts?DISTRICT=${district}`);
      const json = await response.json();      
      if(json.code === 200){
        setmapMarkerList([...json.data])
      }
    }catch(error){
      throw error;
    }
  }

  const fetchPicklistValues = async() =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/getPicklistValues`);
      const data = await response.json();
      dispatch(addPicklistValues(data.data));

      // const districtValues = [...new Set(data.data.map(item => item.DISTRICT))]; 
      // const assignedDistrict = district.length > 0 ? district : 'Surat'; 
      // const filteredTalukas = data.data.filter((data)=>{
      //   return data.DISTRICT === assignedDistrict
      // });
    
      // const talukaValues = [...new Set(filteredTalukas.map(item => item.TALUKA))];
    }catch(error){
      throw error;
    }
  }

  const fetchDistrictPicklistValues = async() =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/getDistricts`);
      const data = await response.json();
      if(data.code === 200){
        const districts = data.data.filter((district) => district.DISTRICT).map((district)=> district.DISTRICT);
        setDistrictPicklistValues([...districts]);
      }
    }
    catch(error){
      throw error;
    }
  }

  const navigateToRecordCreation = async() =>{
    const user = await localStorage.getItem('authToken') || await localStorage.getItem('userData');
    if(user){
      navigate('/create');
      return
    }
    navigate('/login');
  }

  const updateRecords = async (updatedRecord) => {
    try {
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/updateRecords`, {
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


  const handleDistrictChange = async (e) => {    
    try{
      setDistrict(e);
      const response = await fetch(`https://rainwaterharvesting-backend-1.onrender.com/getTalukas?District=${e}`);
      const responseData = await response.json();
      if(responseData.code === 200){
        const talukas = responseData.data.filter((taluka) => taluka.TALUKA).map((taluka)=> taluka.TALUKA);
        console.log(539,talukas);
        setTalukaPicklistValues([...talukas]);
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
        const villages = responseData.data.filter((village)=> village.VILLAGE).map((village)=> village.VILLAGE);
        setVillagePicklistValues([...villages])
      }
    }
    catch(error){
      throw error
    }
  };
  

  const processRowUpdate = (newRow, oldRow) => {

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
    }
    updateRecords(rowsToUpdate);
    
    return newRow;
  };

  const handleMarkerClick = (index) => {
    setActiveMarker(index);
  };

  const checkIfTalukaAssignedToUser = async()=>{
    let userData = await localStorage.getItem('userData');
    if(userData){
      
      userData = JSON.parse(userData);
      userData.taluka ? setIsTalukaAssignedToUser(true) : setIsTalukaAssignedToUser(false);
      userData.district ? setIsDistrictAssignedToUser(true) : setIsDistrictAssignedToUser(false)  

      if(userData.district){
        handleDistrictChange(userData.district);
      }

      if(userData.taluka){
        console.log(613)
        handleTalukaChange(userData.taluka)
      }
      return;
    }
    setIsTalukaAssignedToUser(false)
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
            <div className="col-12">
              <img
                src="./header.jpeg"
                style={{ height: "150px", width: "100%" }}
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
                   <div style={{fontSize:10}} class="card-text">Start Work</div>
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
                          title={`Village:${marker.Village}, Location:${marker.Location} , Start Work Date : ${
                            marker.Inauguration_DATE ? marker.Inauguration_DATE : null
                          }`}
                          position={{ lat: parseFloat(marker.Latitude), lng: parseFloat(marker.longitude) }}
                          onClick={() => handleMarkerClick(index)}
                          icon={{
                            url: `${marker.COMPLETED_DATE ? './placeholderBlue.png': './placeholderRed.png'}`  // Replace with your icon URL                          }}
                          }}
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
                                width: "250px",
                                backgroundColor: "white",
                                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                borderRadius: "5px",
                                padding: "5px",
                                zIndex: 1000,
                              }}
                            >
                              {mapMarkerList[activeMarker].Inauguration_PHOTO1 ? (
                                <img
                                  className="card-img-top"
                                  src={mapMarkerList[activeMarker].COMPLETED_DATE ? mapMarkerList[activeMarker].COMPLETED_PHOTO1: mapMarkerList[activeMarker].Inauguration_PHOTO1}
                                  alt="Card image cap"
                                  style={{width:'100%',height:150}}
                                />
                              ) : null}
                              <div className="card-body" style={{ textAlign: "left" }}>
                                <span className="card-text mt-1" style={{ fontSize: 10,display:'block' }}>
                                  District :<b> {mapMarkerList[activeMarker].District}</b>, Taluka :<b> {mapMarkerList[activeMarker].Taluka}</b>
                                </span>
                                <span className="card-text mt-1" style={{ fontSize: 10,display:'block' }}>
                                  Village :<b> {mapMarkerList[activeMarker].Village}</b>
                                </span>
                                <span className="card-text mt-1" style={{ fontSize: 10,display:'block' }}>
                                  Work Location :<b> {mapMarkerList[activeMarker].Location}</b>
                                </span>
                                {mapMarkerList[activeMarker].Inauguration_DATE && (
                                  <span className="card-text mt-1" style={{ fontSize: 10,display:'block' }}>
                                    Start Work Date:   <b> 
                                      {new Date(mapMarkerList[activeMarker].Inauguration_DATE).toLocaleDateString('en-GB', {
                                        day: '2-digit', 
                                        month: '2-digit', 
                                        year: 'numeric'
                                      })}
                                    </b>
                                  </span>
                                )}
                                {mapMarkerList[activeMarker].COMPLETED_DATE && (
                                  <span className="card-text mt-1" style={{ fontSize: 10,display:'block' }}>
                                    Completion Date:   <b> 
                                      {new Date(mapMarkerList[activeMarker].COMPLETED_DATE).toLocaleDateString('en-GB', {
                                        day: '2-digit', 
                                        month: '2-digit', 
                                        year: 'numeric'
                                      })}
                                    </b>
                                  </span>
                                )}
                              </div>
                                {/* Close button */}
                                <button className="btn btn-primary" onClick={() => setActiveMarker(null)} // Reset activeMarker to close the card
                                style={{
                                  width:'100%',
                                  height:40
                                }}
                              >
                                Close
                              </button>
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
              {
                sliderImages.map((slider)=>{
                    return(
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={`https://jalshakti.co.in/Sliders/${slider.name}`}
                          style={{height:500,width:'100%',objectFit:'cover'}}
                          alt="First slide"
                        />
                      </Carousel.Item>
                    )
                })
              }
            </Carousel>
            </div>
          </div>
          
         </div>
       </div>

         {/* Insert Table Here */}
         <div className="col-12 mt-4 mb-2 d-none d-sm-block">
            <div className="row mb-3">
                <div className="col-4">
                      <input id="Search" placeholder="Search Records" name="Search" type="text" value={searchText} onChange={(e)=> setSearchText(e.target.value)}/>
                </div>
               
                <div className="col-6">
                  <div className="row mt-2">
                    <div className="col-6">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" onChange={(e)=> setShowOnlyGroundwork(e.target.checked)} value="" id="flexCheckDefault"/>
                        <label class="form-check-label" for="flexCheckDefault">
                          Start Work Completed Records
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div class="form-check">
                        <input class="form-check-input mt-1" type="checkbox" value="" onChange={(e)=>setShowOnlyCompleted(e.target.checked)} id="flexCheckDefault"/>
                        <label class="form-check-label" for="flexCheckDefault">
                          Completed Records
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-2">
                    <div style={{marginTop:10}}>
                      <CSVLink style={{marginTop:20}} data={tableDataToShow}>Download CSV</CSVLink>
                    </div>
                </div>
            </div>
            <div className="row">
                  {
                    !isDistrictAssignedToUser ? 
                      <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
                        <select
                          value={district}
                          onChange={(e) => {
                            handleDistrictChange(e.target.value);
                          }}
                        >
                          <option value={null}>Select District</option>
                          {districtPicklistValues.map((district, index) => (
                            <option key={index} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      </div>
                    : 
                    null
                  }
                

                  {
                    !isTalukaAssignedToUser ?
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
                      <select
                        value={taluka}
                        onChange={(e) => {
                          handleTalukaChange(e.target.value);
                        }}
                      >
                        <option value=''>Select Taluka</option>
                        {talukaPicklistValues.map((taluka, index) => (
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
                      value={village}
                      onChange={(e) => {
                        setVillage(e.target.value)
                      }}
                    >
                      <option value=''>Select Village</option>
                      {villagePicklistValues.map((village, index) => (
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
         
         <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={tableDataToShow}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              sx={{ border: 0 }}
              processRowUpdate={processRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Paper>
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
             <h5 class="card-title">Start Work & Completion Status (in %)</h5>
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
                    blueFrom: 90,
                    blueTo: 100,
                    greenFrom: 75,
                    greenTo: 100,
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
