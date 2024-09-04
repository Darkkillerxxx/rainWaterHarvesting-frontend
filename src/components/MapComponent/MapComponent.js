import { useEffect } from "react";
//AIzaSyAELTpYaAj6aQ50_An1XQF7xyijTLgTDOc
export default function MapComponent(props) {
  useEffect(() => {
    console.log(props);
  });
  return (
    <>
      {/* <div>{props.city}</div> */}
      <div>
        <img
          src="./MapSurat.png"
          alt="Map of Surat"
          style={{ height: "70vh", width: "100%", objectFit: "cover" }}
        />
      </div>
    </>
  );
}

// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// https://www.openstreetmap.org/relation/1952514#map=10/21.1927/73.1442
