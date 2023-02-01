import { useState, useContext, useEffect } from 'react';
import './Sample.css';
const { executeTransaction, EthereumContext, log, queryData } = require('react-solidity-web3');

function Sample(props) {
  const [submitting, setSubmitting] = useState(false);
  // const [latitude,setLatitude]=useState(0);
  // const [longitude,setLongitude]=useState(0);

  useEffect(()=>{
    console.log("latitude",props.lat)
    console.log("longitude",props.lng)
  },[props.lat,props.lng])
  
  const { provider, sample } = useContext(EthereumContext);
  console.log("sample", sample)

  const testMyFunc = async (event) => {
    console.log("Test My Func called");
    event.preventDefault();
    setSubmitting(true);
    let response1 = await executeTransaction(sample, provider, 'testMyFunc', [props.lat.toString(), props.lng.toString()]);
    log("testMyFunc", "hash", response1.txHash)
    setSubmitting(false);
  }


  return <div className="Container">
    <div>
      <h1>CHECK AIR QUALITY</h1><br></br>
      <form onSubmit={testMyFunc}>
        <div>
          <label>Latitude :</label>
          <label>{props.lat}</label>
          {/* <input type="number"  min="-90" max="+90" onChange={(e)=>setLatitude(e.target.value)} value={latitude}/> */}
        </div>
        <div>
          <label>Longitude :</label>
          <label>{props.lng}</label>
          {/* <input type="number" onChange={(e)=>setLongitude(e.target.value)} value={longitude}/> */}
        </div>
        <button type="submit" disabled={submitting}>{submitting ? 'Fetching AQI..' : 'Check AQI'}</button>
      </form>
    </div>
  </div>
}



export default Sample;