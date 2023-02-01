
const initialState = {
    latitude:0,
    longitude:0,
    aqi:0,
    zoom:1
};

const aqiDataReducer = (state = initialState,action)=>{
    const newState = {...state};

    if(action.type === "LATITUDE_CHANGE"){
        newState.latitude = action.val;
    }
    if(action.type === "LONGITUDE_CHANGE"){
        newState.longitude = action.val;
    }
    if(action.type === "AQI_CHANGE"){
        newState.aqi = action.val;
    }
    if(action.type === "ZOOM_CHANGE"){
        newState.zoom = action.val;
    }
    return newState;
};

export default aqiDataReducer;