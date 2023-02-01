import React, { useEffect, useState } from "react";
import OpenLayer from "./Map";
import CountryStateCity from "./CountryStateCity";
import Displaydata from "./Displaydata";
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";



const Landing = (props) => {
  const dispatch = useDispatch();
  const _latitude = useSelector(state => state.latitude);
  const _longitude = useSelector(state => state.longitude);
  const _zoom = useSelector(state => state.zoom);
  const _aqi = useSelector(state => state.aqi);
  const API_KEY = '62a14805af5e085bc5ee47fc0fa60e8157ea39ad'

  useEffect(() => {
    fetch(`https://api.waqi.info/feed/geo:${_latitude};${_longitude}/?token=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        let air_quality = data["data"]["aqi"].toString();
        if (air_quality >= 0 && air_quality <= 500) {
          dispatch({ type: "AQI_CHANGE", val: data["data"]["aqi"].toString() });
        }
        else {
          dispatch({ type: "AQI_CHANGE", val: null});
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [_latitude, _longitude]);

  const handleOnChangeCoordinates = (locationData,zoom) => {
    dispatch({type:"LATITUDE_CHANGE",val:locationData.latitude});
    dispatch({type:"LONGITUDE_CHANGE",val:locationData.longitude});
    dispatch({type:"ZOOM_CHANGE",val:zoom});
  }

  const handleSetNewLatLong = (lng,lat,zoom) => {
    dispatch({type:"LATITUDE_CHANGE",val:lat});
    dispatch({type:"LONGITUDE_CHANGE",val:lng});
    dispatch({type:"ZOOM_CHANGE",val:zoom});
  }


  console.log("latitude,longitude =", _latitude, _longitude);

  return (
    <div>
      <div className="container">
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper" style={{ backgroundColor: "White" }}>
          {/* Main content */}
          <section className="content" style={{ backgroundColor: "white", marginTop: 20 }}>
            <div className="container-fluid">
              {/* /.Map */}
              <div className="card card-default">
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-8">
                      <h3 className="card-title">Choose Location</h3>
                    </div>
                    {/* <div className="col-md-4 text-right">
                      <button type="button" class="btn btn-outline-dark" >Check AQI</button>
                    </div> */}
                    {/* <div className="col-md-4 text-right">
                      <Link to="/Integrate" className="btn btn-outline-dark" state={{ lat: _latitude, lng: _longitude }}>
                        <span>Monitor AQI at </span>{" "}
                        <em className="icon ni ni-arrow-long-right" />
                      </Link>
                    </div> */}
                  </div>
                </div>
                {/* /.card-header */}
                <div className="card-body" style={{ padding: 0, margin: 0}}>
                  <div className="row">
                    <div className="col-12">
                      {<CountryStateCity onChangeCordinates={handleOnChangeCoordinates} />}
                      {/* {<Displaydata />}
                      {<OpenLayer lat={_latitude} long={_longitude} zoom={_zoom} setNewLatLonZm={handleSetNewLatLong} />} */}
                    </div>
                    {/* /.col */}
                  </div>
                  {/* /.row */}
                </div>
                <div className="card-body" style={{ padding: 0, margin: 0,border:"1px solid grey",borderRadius:"10px"}}>
                  <div className="row" style={{ padding: 0, margin: 0}}>
                    <div className="col-12" style={{ padding: 0, margin: 0}}>
                      {/* {<CountryStateCity onChangeCordinates={handleOnChangeCoordinates} />} */}
                      {<Displaydata />}
                      {/* {<OpenLayer lat={_latitude} long={_longitude} zoom={_zoom} setNewLatLonZm={handleSetNewLatLong} />} */}
                    </div>
                    {/* /.col */}
                  </div>
                  {/* /.row */}
                </div>
                <div className="card-body" style={{ padding: 0, margin: 0}}>
                  <div className="row">
                    <div className="col-12">
                      {/* {<CountryStateCity onChangeCordinates={handleOnChangeCoordinates} />} */}
                      {/* {<Displaydata />} */}
                      {<OpenLayer lat={_latitude} long={_longitude} zoom={_zoom} setNewLatLonZm={handleSetNewLatLong} />}
                    </div>
                    {/* /.col */}
                  </div>
                  {/* /.row */}
                </div>
                {/* /.card-body */}
              </div>
              {/* /.Map */}

            </div>
            {/* /.container-fluid */}
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}

        {/* Control Sidebar */}
        <aside className="control-sidebar control-sidebar-dark">
          {/* Control sidebar content goes here */}
        </aside>
        {/* /.control-sidebar */}
      </div>
    </div>
  );
}
export default (Landing);


   //const [bgColor, setBgColor] = useState("white");
           //setBackgroundColor(data["data"]["aqi"]);
        //setBgColor("white");
        
          // const setBackgroundColor = (_aqi)=>{
  //   console.log("background color changed");
  //   console.log("aqi = ",_aqi);
  //   switch(true)
  //   {
  //     case (_aqi<=50 && _aqi >=0):
  //       console.log("green is set");
  //       setBgColor("green");
  //       break;
  //       case _aqi<=100 && _aqi>50:
  //         setBgColor("yellow");
  //         break;
  //         case _aqi<=150 && _aqi>100:
  //         setBgColor("orange");
  //         break;
  //         case _aqi<=200 && _aqi>150:
  //           setBgColor("red");
  //         break;
  //         case _aqi<=300 && _aqi>200:
  //           setBgColor("purple");
  //         break;
  //         case _aqi>300:
  //           setBgColor("maroon");
  //         break;
  //         default:
  //           setBgColor("white");
  //         break;
  //   }
  // }