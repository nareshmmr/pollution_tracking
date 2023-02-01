// import { ethers } from 'ethers';
// import Sample from './Sample/Sample';
// import Header from './Header/Header';
// import { abi } from '../artifacts/contracts/PollutionInternalContract.sol/PollutionInternalContract.json';
// import { SampleContract as address } from '../output.json';
// import { useState } from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


import Navbar from './Layouts/Navbar';
import Landing from './Layouts/Landing';
import Footer from './Layouts/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Integrate from './Pages/Integrate';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import aqiDataReducer from './Reducer/aqiDataReducer';

const store = createStore(aqiDataReducer);

// const { connectWallet, EthereumContext, createContractInstance, log } = require('react-solidity-web3');

// var connectOptions = {
//   rpcObj: {
//     50: "https://rpc.xinfin.network",
//     51: "https://rpc.apothem.network"
//   },
//   network: "mainnet",
//   toDisableInjectedProvider: true
// }

function App() {
  // const [connecting, setconnecting] = useState(false);
  // const [ethereumContext, setethereumContext] = useState({});

  // const connect = async (event) => {
  //   event.preventDefault();
  //   const instance = await connectWallet(connectOptions);
  //   const provider = new ethers.providers.Web3Provider(instance);
  //   const signer = provider.getSigner();
  //   const sample = await createContractInstance(address, abi, provider);
  //   const account = signer.getAddress();
  //   setethereumContext({ provider, sample, account })
  //   log("Connect", "Get Address", await signer.getAddress());
  //   setconnecting(true);
  // }
  return (
    <Provider store = {store}>
    <div className="wrapper">
      {/* <Header />
      <header className="App-header">
        <h1>Sample Decentralized Application </h1>
        <p>Powered by react-solidity-xdc3 Package</p>
        <p>Contributed by GoPlugin(www.goplugin.co)</p>
        <form onSubmit={connect}>
          <button type="submit" disabled={connecting}>{connecting ? 'Connected' : 'Connect'}</button>
        </form>
      </header> */}
      
        {/* <EthereumContext.Provider value={ethereumContext}> */}
          <Router>
            <Navbar />
            <Routes>
              <Route exact path='/' element={<Landing />} />
              <Route exact path='/Integrate' element={<Integrate/>} />
            </Routes>
            <Footer />
          </Router>
        {/* </EthereumContext.Provider>
       */}
      {/* <ToastContainer hideProgressBar={true} /> */}
    </div>
    </Provider>
  );
}

export default App;
