import React,{Fragment, useState } from "react";
import { Country, State, City } from 'country-state-city';
import Select from "react-select";

const CountryStateCity = (props) => {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    let countrySelected = <Select className="select2bs4" 
        options={Country.getAllCountries()}
        getOptionLabel={(options) => { return options["name"]; }}
        getOptionValue={(options) => { return options["name"]; }}
        onChange={(LocationData) => {
            setSelectedCountry(LocationData);
            setSelectedState("");
            setSelectedCity("");
            props.onChangeCordinates(LocationData,5);
        }}
        value={selectedCountry}
    />;
    let stateSelected = <Select className="select2bs4" 
        options={State.getStatesOfCountry(selectedCountry?.isoCode)}
        getOptionLabel={(options) => { return options["name"]; }}
        getOptionValue={(options) => { return options["name"]; }}
        onChange={(LocationData) => {
            setSelectedState(LocationData);
            setSelectedCity("");
            props.onChangeCordinates(LocationData,7);
        }}
        value={selectedState}
    />

    let citySelected = <Select className="select2bs4"
        options={City.getCitiesOfState(selectedState?.countryCode, selectedState?.isoCode)}
        getOptionLabel={(options) => { return options["name"]; }}
        getOptionValue={(options) => { return options["name"]; }}
        onChange={(LocationData) => {
            setSelectedCity(LocationData);
            props.onChangeCordinates(LocationData,10);
        }}
        value={selectedCity}
    />

    return (
        <Fragment>
            <div className="card-body" style={{margin:0,padding:10}}>
                <div className="row">
                    <div className="col-md-4" style={{ marginBottom: 0}}>
                        <div className="form-group" style={{ marginBottom: 0}}>
                            <label>Country</label>
                            {countrySelected}
                        </div>
                    </div>
                    {/* /.col */}
                    <div className="col-md-4" style={{ marginBottom: 0}}>
                        <div className="form-group" style={{ marginBottom: 0}}>
                            <label>State</label>
                            {stateSelected}
                        </div>
                    </div>
                    {/* /.col */}
                    {/* /.col */}
                    <div className="col-md-4" style={{ marginBottom: 0}}>
                        <div className="form-group">
                            <label>City</label>
                            {citySelected}
                        </div>
                    </div>
                    {/* /.col */}
                </div>
                {/* /.row */}
            </div>
        </Fragment>
    )
}

export default CountryStateCity;