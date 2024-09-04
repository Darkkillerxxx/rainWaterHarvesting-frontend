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

export default function Dashboard() {
  const [districts,setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Surat");
  const [dashboardData,setDashboardData] = useState(null)
  const [gaugeValue,setGaugeValue] = useState([
    ["Label","Value"]
  ])
  const [pieValue,setPieValue] = useState([
    ["Task", "Hours per Day"]
  ])
  const [stackedBarChart,setStackedBarChart] = useState([]);
  const [mapMarkerList,setmapMarkerList] = useState([]);

  const fetchDashboardvalues = async() =>{
    try{
      const response = await fetch(`https://rainwaterharvesting-backend.onrender.com/getDashboardValues?DISTRICT=${selectedCity}`);
      const json = await response.json();
      console.log(json);
      setDashboardData({...json});
      
      const inaugrationValue = ['Inaugration',parseInt((json.inaugrationCount/json.totalRecordCount) * 100)]
      const completionValue = ['Completion',parseInt((json.completionCount/json.totalRecordCount) * 100)]

      setGaugeValue([...gaugeValue,inaugrationValue,completionValue])
      //console.log([...gaugeValue,inaugrationValue,completionValue]);

      const pieArray = []
      json.pieChart.forEach(values=>{
        pieArray.push([values.TALUKA,values.count])
      })

      console.log([...pieValue,...pieArray]);
      setPieValue([...pieValue,...pieArray])

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
    
    //console.log(result);
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


  useEffect(()=>{
    console.log(103);
    fetchDashboardvalues();
    fetchMapMarkerLocations();
    fetchPicklistValues();
  },[selectedCity])
  
  return (
    <>
    { dashboardData ? 
       <div className="container" style={{padding:'25px'}}>
       
       <div style={{marginBottom:50}}>
        <h1>Rainwater Harvesting For State Of Gujrat</h1>

        <select style={{width:250}} onChange={(e) => { 
          console.log(e.target.value);
          setSelectedCity(e.target.value)
          }} class="form-select" aria-label="Default select example">
          <option selected>Please Select State</option>
          {
            districts.map((district,index)=>{
              return (
                <option key={index} value={district.DISTRICT}>{district.DISTRICT}</option>
              )
            })
          }
        </select>
       </div>
       
       <div className="row">
         <div className="col-2">
           <div class="card" style={{width: '100%',height:125}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Total</div>
                   <h3 class="card-title">88</h3>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <GoNumber size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-2">
           <div class="card" style={{width: '100%',height:125}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Talukas</div>
                   <h3 class="card-title">{dashboardData.totalRecordCount}</h3>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <FaRoad size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-2">
           <div class="card" style={{width: '100%',height:125}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Villages</div>
                   <h3 class="card-title">{dashboardData.villageCount}</h3>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <RiRoadMapFill size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-2">
           <div class="card" style={{width: '100%',height:125}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Target</div>
                   <h3 class="card-title">88</h3>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <TbTargetArrow size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-2">
           <div class="card" style={{width: '100%',height:125}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Inaugrations</div>
                   <h3 class="card-title">{dashboardData.inaugrationCount}</h3>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <GiInauguration size={30}/>
               </div>
             </div>
             </div>
         </div>
         <div className="col-2">
           <div class="card" style={{width: '100%',height:125}}>
             <div className="row">
               <div className="col-8">
                 <div class="card-body">
                   <div style={{fontSize:10}} class="card-text">Completions</div>
                   <h3 class="card-title">{dashboardData.completionCount}</h3>
                 </div>
               </div>
               <div className="col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                 <FaRegThumbsUp size={30}/>
               </div>
             </div>
             </div>
         </div>

         <div className="col-12" style={{marginTop:10}}>
           <div className="card">
             <APIProvider apiKey='AIzaSyBucoqzCbZyvxNFD3JzxPHDEH5BSkIcOTM'>
               <Map
               style={{ borderRadius: "20px",height:300 }}
               defaultZoom={5}
               defaultCenter={{
                 lat: 20.5937,
                 lng: 78.9629,
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
       </div>
     </div>
    : 
    
    null}
     
    </>
  );
}
