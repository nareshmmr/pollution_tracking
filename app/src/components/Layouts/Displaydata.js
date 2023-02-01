import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Displaydata = () => {
    const _latitude = useSelector(state => state.latitude);
    const _longitude = useSelector(state => state.longitude);
    const _aqi = useSelector(state => state.aqi);
    return (<div className="card-body" style={{ padding: 0, margin: 0 }}>
        <div className="row">
            <div className="col-12">
                <div className="card-body" style={{ margin: 0, padding: 10, color: "black" }}>
                    <div className="row">
                        <div className="col-md-4">
                            <Link to="/Integrate" className="btn btn-outline-dark">
                                <span>Monitor Air Quality at </span>{" "}
                                <em className="icon ni ni-arrow-long-right" />
                            </Link>
                        </div>
                        <div className="col-md-4" style={{ marginBottom: 0, marginTop: 0 }}>
                            <div className="form-group" style={{ marginBottom: 0, marginTop: 0 }}>
                                <label >Latitude :</label>
                                <label>&nbsp;{Math.round(_latitude * 10000) / 10000}</label>
                            </div>
                        </div>
                        {/* /.col */}
                        <div className="col-md-4" style={{ marginBottom: 0, marginTop: 0 }}>
                            <div className="form-group" style={{ marginBottom: 0, marginTop: 0 }}>
                                <label>Longitude :</label>
                                <label>&nbsp;{Math.round(_longitude * 10000) / 10000}</label>
                            </div>
                        </div>
                        {/* /.col */}
                        {/* /.col */}
                        {/* <div className="col-md-4" style={{ marginBottom: 0, marginTop:0 }}>
                            <div className="form-group" style={{ marginBottom: 0, marginTop:0 }}>
                                <label>Air Quality Index :</label>
                                <label>&nbsp;{_aqi}</label>
                            </div>
                        </div> */}
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                </div>
            </div>
            {/* /.col */}
        </div>
        {/* /.row */}
    </div>)
}

export default Displaydata;