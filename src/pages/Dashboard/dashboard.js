import { useEffect, useState } from "react";
import "./dashboard.css";
import { Chart } from "react-google-charts";
import { Map, Marker, APIProvider } from "@vis.gl/react-google-maps";
import { GoNumber } from "react-icons/go";
import { FaRoad } from "react-icons/fa6";
import { RiRoadMapFill } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { GiInauguration } from "react-icons/gi";
import { FaRegThumbsUp } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import { Carousel } from 'react-bootstrap';


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


  const fetchDashboardvalues = async() =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend.onrender.com/getDashboardValues?DISTRICT=${selectedCity}`);
      const json = await response.json();
      console.log(json);
      setDashboardData({...json});
      
      // Setting Gauge Value
      const gaugeInitialValue = [["Label","value"]]
      setGaugeValue([...gaugeInitialValue]);

      const inaugrationValue = ['Inaugration',parseInt((json.inaugrationCount/json.totalRecordCount) * 100)]
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
      const response = await fetch(`https://rainwaterharvesting-backend.onrender.com/getAllDistrics`);
      const json = await response.json();
      //console.log(json);
      
      if(json.code === 200){
        setDistricts([...json.data])
      }
    }catch(error){
      throw error;
    }
  }

  const chartEvents = [
    {
      eventName: "select",
      callback: ({ chartWrapper }) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        if (selection.length > 0) {
          const selectedItem = selection[0];
          const selectedRow = selectedItem.row;
          setSelectedValue(pieValue[selectedRow + 1][0]);
          alert(`You clicked on ${pieValue[selectedRow + 1][0]}`);
        }
      },
    },
  ];


  useEffect(()=>{
    console.log(103);
    fetchDashboardvalues();
    fetchMapMarkerLocations();
    fetchPicklistValues();
  },[selectedCity])

  // useEffect(() => {
  //   const carousel = document.getElementById('carouselExampleIndicators');
  //   const carouselInstance = new bootstrap.Carousel(carousel);
  //   carouselInstance.cycle();
  // }, []);
  
  return (
    <>
    { dashboardData ? 
       <div className="container" style={{padding:'25px'}}>
       
       <div style={{marginBottom:50}}>
        <div className="row"> 
          <div className="col-2">
            <img
              src="./logo.jpeg"
              alt="Map of Surat"
              style={{ height: "80px", width: "100%", objectFit: "contain",marginTop:10 }}
            />
          </div>
          <div className="col-10">
            <h1 style={{color:'#1ca1e4'}}>Rainwater Harvesting For State Of Gujarat</h1>
            <select style={{width:250}} onChange={(e) => { 
              console.log(e.target.value);
              setSelectedCity(e.target.value)
              }} class="form-select" aria-label="Default select example">
              <option selected>Please Select District</option>
              {
                districts.map((district,index)=>{
                  return (
                    <option key={index} value={district.DISTRICT}>{district.DISTRICT}</option>
                  )
                })
              }
            </select>
          </div>
        </div>
       </div>
       
       <div className="row" style={{marginTop:10}}>
         <div className="col-2">
           <div class="card" style={{width: '100%',height:100}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Total</div>
                   <h4 class="card-title">{dashboardData.totalRecordCount}</h4>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <GoNumber size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-2">
           <div class="card" style={{width: '100%',height:100}}>
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
         <div className="col-2">
           <div class="card" style={{width: '100%',height:100}}>
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
         <div className="col-2">
           <div class="card" style={{width: '100%',height:100}}>
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
         <div className="col-2">
           <div class="card" style={{width: '100%',height:100}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Inaugrations</div>
                   <h4 class="card-title">{dashboardData.inaugrationCount}</h4>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <GiInauguration size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-2">
           <div class="card" style={{width: '100%',height:100}}>
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
            <div className="col-6">
              <div className="card" style={{height:500}}>
                <APIProvider apiKey='AIzaSyBucoqzCbZyvxNFD3JzxPHDEH5BSkIcOTM'>
                  <Map
                  style={{ borderRadius: "20px",height:500 }}
                  defaultZoom={7}
                  defaultCenter={{
                    lat: 22.6708,
                    lng: 71.5724,
                  }}
                  gestureHandling={"greedy"}
                  disableDefaultUI
                  renderingType="RASTER"
                  >
                    {
                      mapMarkerList.map((marker,index)=>{
                        return(
                          <Marker key={index} title={marker.Village} position={{lat:parseFloat(marker.Latitude),lng:parseFloat(marker.longitude)}} />
                        )
                      })
                    }
                  </Map>
                </APIProvider>
              </div>
            </div>
            <div className="col-6">
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
         <div className="col-8">
           <div class="card" style={{marginTop:10,height:250}}>
           <h5 class="card-title">Pie Chart for all Talukas</h5>
             <Chart
               chartType="PieChart"
               data={pieValue}
               width={"100%"}
               height={"200px"}
               chartEvents={chartEvents}
             />
           </div>
         </div>
         <div className="col-4">
           <div class="card" style={{marginTop:10,height:250}}>
             <h5 class="card-title">Inaugrations & Completion Status (in %)</h5>
             <div style={{display:'flex',width:'100%',alignContent:'center',justifyContent:'center'}}>
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
             </div>
           </div>
         </div>
         <div className="col-12">
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
           </div>
         </div>
         <div className="col-12" style={{marginTop:10}}>
          <button type="button" onClick={()=>navigate('/create')} class="btn btn-primary w-100">Create New Entry</button>
         </div>
       </div>
     </div>
    : 
    
    null}
     
    </>
  );
}
