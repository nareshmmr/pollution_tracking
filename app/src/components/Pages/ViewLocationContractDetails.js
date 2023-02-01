import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import Axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import truncateEthAddress from 'truncate-eth-address';
import TruncateString from "truncate-string-react";
import { API_URL, PLI_CONTRACT_ADDRESS, MINIMUM_DEPOSIT, MAXIMUM_DEPOSIT, EXPLORER_LINK } from "../Actions/Constants";
import { Web3Modal } from 'web3modal';
import { ethers } from 'ethers';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { getTxnStatus } from '../../utils/contract';
import WalletConnect from "@walletconnect/web3-provider";
import { getXdcModal } from 'xdcpay-web3modal'
import pliContract from "../Contracts/pliabi.json";
import internalContract from "../Contracts/RTPT_InternalContract.json";
const { connectWallet, EthereumContext, createContractInstance, log } = require('react-solidity-web3');


var connectOptions = {
    rpcObj: {
        50: "https://rpc.xinfin.network",
        51: "https://rpc.apothem.network"
    },
    network: "mainnet",
    toDisableInjectedProvider: true
}





const ViewLocationContractDetails = () => {
    const _latitude = useSelector(state => state.latitude);
    const _longitude = useSelector(state => state.longitude);
    //const _aqi = useSelector(state => state.aqi);
    const [db_data, setDbData] = useState({ contract_address: 0, job_id: 0, oracle_addr: 0, network: '' });
    const [contract_data, setContractData] = useState({ accountAddress: null, provider: null, pliInstance: null, internalInstance: null, connectWallet: false, pliBalance: 0 })
    const [AQI, setLabelAqi] = useState(0);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        console.log("get data");
        try {
            let result = await Axios.get(API_URL + '/ptr')
            console.log("YES");
            console.log("result :", result.data[0]["_id"]);;
            setDbData({ contract_address: result.data[0]["contractAddress"], job_id: result.data[0]["jobID"], oracle_addr: result.data[0]["oracleAddress"], network: result.data[0]["network"] });
        } catch (err) {
            Notify.failure('Error Occured');

        }
    }


    const onConnect = async () => {
        try {
            //const instance = await web3Modal.connect();
            const instance = await connectWallet(connectOptions);
            const providerConnect = new ethers.providers.Web3Provider(instance);
            const { chainId } = await providerConnect.getNetwork()
            console.log("chainId", chainId)
            const signer = providerConnect.getSigner();
            const address = await signer.getAddress();
            console.log("address", address)
            var pli_Instance = new ethers.Contract(
                PLI_CONTRACT_ADDRESS,
                pliContract,
                signer
            );
            var internal_Instance = new ethers.Contract(
                db_data.contract_address,
                internalContract,
                signer
            );
            const balance = await internal_Instance.plidbs(address)
            const userBal = ethers.utils.formatEther(balance.totalcredits)
            setContractData({ accountAddress: address, provider: providerConnect, pliInstance: pli_Instance, internalInstance: internal_Instance, connectWallet: true, pliBalance: userBal });
        } catch (err) {
            console.log("err", err)
        }
    }

    const onApprove = async () => {
        console.log("this.state.internalInstance", contract_data.internalInstance)
        console.log("this.state.internalInstance._address", contract_data.internalInstance.address)

        Confirm.prompt(
            'Deposit PLI',
            'Enter No of PLI to Deposit',
            '',
            'Submit',
            'Cancel',
            async (clientAnswer) => {
                console.log("email", clientAnswer)
                if (clientAnswer === "") {
                    Notify.failure('Enter Number of PLI');
                    return;
                }

                if (parseInt(clientAnswer) < MINIMUM_DEPOSIT || parseInt(clientAnswer) > MAXIMUM_DEPOSIT) {
                    Notify.failure(`Enter PLI from ${MINIMUM_DEPOSIT} to ${MAXIMUM_DEPOSIT} `);
                    return;
                }
                //const tokens = await convertTokens(clientAnswer);
                
                const tokens = ethers.utils.parseUnits(clientAnswer, 'ether').toHexString()
                console.log("tokens are :",tokens);
                console.log("Contract address :",contract_data.internalInstance.address);
                console.log("pli instance: ",contract_data.pliInstance);

                Loading.standard('Please Wait...', { messageColor: "#gray", svgColor: "gray", svgSize: '50px', messageID: "approve" });
                try {
                    var transactionHash = await contract_data.pliInstance.approve(contract_data.internalInstance.address, tokens)
                    console.log("trns", transactionHash)
                     Loading.remove()
                    // CHECK TRANSACTION STATUS
                    const [txhash, status] = await getTxnStatus(transactionHash.hash, contract_data.provider);
                 console.log("approval txhash:",txhash);
                    if (!status) {
                        Notify.failure('Error Occured Try Again');
                        return
                    }
                   onDeposit(tokens)
                } catch (err) {
                    Loading.remove()
                    Notify.failure('Error Occured Try Again');

                    console.log("Errr", err)
                }

            },
            (clientAnswer) => {
                console.log("Popup Closed")
            },
            {
            },
        );
    }
    const getBalance = async () => {

        const balance = await contract_data.internalInstance.plidbs(contract_data.accountAddress)
        const userBal = ethers.utils.formatEther(balance.totalcredits)
        setContractData(existingValues => ({ ...existingValues, pliBalance: userBal }))
        console.log("pli balance:", contract_data.pliBalance);
    }

    const onDeposit = async (tokens) => {
        // Loading.standard('Deposit PLI...', { messageColor: "#ff9400", svgColor: "#ff9400", svgSize: '50px', backgroundColor: 'rgba(255,255,255,1)', messageID: "deposit" });
        try {
            var transactionHash = await contract_data.internalInstance.depositPLI(tokens)
            const [txhash, status] = await getTxnStatus(transactionHash.hash, contract_data.provider);
            if (!status) {
                Notify.failure('Error Occured Try Again');
                return
            }
            Loading.remove()
            Report.success(
                'Transaction Success',
                `PLI Deposited Successfully`,
                'View',
                () => {
                    window.open(`${EXPLORER_LINK}/txs/${transactionHash.hash}`)
                    getBalance();
                    // window.location.reload();
                }
            );
        } catch (err) {
            Loading.remove()
            Notify.failure('Error Occured Try Again');
            console.log("Errr", err)
        }


    }
    const fetchAirQualityData = async () => {
        if (validate()) {
            //setLabelAqi(_aqi);
            //Loading.standard('Fetching Lastest Answer...', { messageColor: "#ff9400", svgColor: "#ff9400", svgSize: '50px', backgroundColor: 'rgba(255,255,255,1)', });
            try {
                var transactionHash = await contract_data.internalInstance.requestAirQualityData(contract_data.accountAddress)
                const [txhash, status] = await getTxnStatus(transactionHash.hash, contract_data.provider);
                if (!status) {
                    Notify.failure('Error Occured Try Again');
                    return
                }
                else {
                    //var transactionHash = await contract_data.internalInstance.showAQI()
                    fetchAqi();
                }
            }
            catch (err) {
                //Loading.remove()
                Notify.failure('Error Occured Try Again');
                console.log("Errr", err)
            }

        }
        //return AQI;
    }
    const validate = async () => {
        if (!contract_data.connectWallet) {
            Notify.failure('Connect your wallet');
            return false;
        }//else if(){
        // validate latitude and longitude
        // }
        else {
            await getBalance().then(() => {
                if (contract_data.pliBalance <= 0.1) {
                    Notify.failure('Your PLI balance is low');
                    return false;
                }
            });
        }
        return true;
    }

    const fetchAqi = async () => {
        try {
            const aqi = await contract_data.internalInstance.currentValue();
            console.log("AQI", aqi.toNumber());
            setLabelAqi(aqi.toNumber());
        }
        catch (err) {
            //setLabelAqi(aqi);
            Notify.failure('Error Occured Try Again');
            console.log("Errr", err)

        }

    }

    return (
        <div className="card card-default">
            <div className="card-header">
                <div className="row">
                    <div className="col-md-8" styles={{ padding: "0", margin: "0" }}>
                        <h3 className="card-title">Details</h3>
                    </div>
                    <div className="col-md-4 text-right" styles={{ padding: "0", margin: "0" }}>
                        {!contract_data.connectWallet ? <button onClick={() => onConnect(db_data.contractAddress)} className="btn btn-outline-dark">
                            <span>Connect Wallet</span>{" "}
                            <em className="icon ni ni-arrow-long-right" />
                        </button> : <Fragment><button className="btn btn-outline-dark btn-center" onClick={() => onApprove()}>
                            <span>{"Deposit PLI"}</span>{" "}
                            <big className="badge badge-success">{`Balance :${contract_data.pliBalance}PLI`}</big>
                            <em className="icon ni ni-arrow-long-right" />
                        </button>
                            <p className="text-sm text-muted" styles={{ padding: "0", margin: "0" }}>Minimum 1 PLI, Maximum 100 PLI</p>
                        </Fragment>
                        }
                    </div>
                </div>
            </div>
            <div className="card-body" style={{ padding: 0, margin: 0 }}>
                <div className="row">
                    {/* <div className="col-12"> */}
                    <div className="col-8" style={{ margin: 0, padding: 10 }}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <div className="info-box" style={{ backgroundColor: "#9C9DA119" }}>
                                            <span className="info-box-icon" style={{ width: "30px" }}><i className="fa fa-file-signature"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Contract Address</span>
                                                <span className="info-box-number">{db_data.contract_address && truncateEthAddress(db_data.contract_address)} &nbsp;&nbsp;<img style={{ cursor: "pointer" }} onClick={() => {
                                                    Notify.success("Copied to Clipboard")
                                                    navigator.clipboard.writeText(db_data.contract_address)
                                                }} src="../images/copy.svg" /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /.col */}
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <div className="info-box" style={{ backgroundColor: "#9C9DA119" }}>
                                            <span className="info-box-icon" style={{ width: "30px" }}><i className="fa fa-envelope"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Oracle Address</span>
                                                <span className="info-box-number">{db_data.oracle_addr && truncateEthAddress(db_data.oracle_addr)} &nbsp;&nbsp;<img style={{ cursor: "pointer" }} onClick={() => {
                                                    Notify.success("Copied to Clipboard")
                                                    navigator.clipboard.writeText(db_data.oracle_addr)
                                                }} src="../images/copy.svg" /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /.col */}
                                {/* /.col */}
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <div className="info-box" style={{ backgroundColor: "#9C9DA119" }}>
                                            <span className="info-box-icon" style={{ width: "30px" }}><i className="fa fa-tasks"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Job ID</span>
                                                <span className="info-box-number">{<TruncateString string={db_data.job_id} length={10} typecount={1} type="." />} &nbsp;&nbsp;<img style={{ cursor: "pointer" }} onClick={() => {
                                                    Notify.success("Copied to Clipboard")
                                                    navigator.clipboard.writeText(db_data.job_id)
                                                }} src="../images/copy.svg" /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <div className="info-box" style={{ backgroundColor: "#9C9DA119" }}>
                                            <span className="info-box-icon" style={{ width: "30px" }}><i className="fa fa-network-wired"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Network</span>
                                                <span className="info-box-number">{db_data.network}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="for-group">
                                        <div className="info-box" style={{ backgroundColor: "#9C9DA119" }}>
                                            <span className="info-box-icon" style={{ width: "30px" }}><i className="fa fa-location-arrow"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">
                                                    <h6 className="text-bold">Lat/Long : {Math.round(_latitude * 100) / 100} / {Math.round(_longitude * 100) / 100}  </h6>
                                                    <button onClick={fetchAirQualityData} className="btn btn-secondary">Fetch Air Quality Data</button>
                                                    <p className="text-sm text-muted float-right" styles={{ padding: "0", margin: "0" }}>Fee 0.1 PLI/Hit</p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="col-md-4">
                            <div className="form-group">
                                <div className="info-box" style={{ backgroundColor: "#9C9DA119" }}>
                                    <span className="info-box-icon" style={{ width: "30px" }}><i className="fa fa-cloud"></i></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Air Quality Index</span>
                                        <span><button onClick={fetchAqi} className="btn btn-secondary">fetchAQI</button></span>
                                        <span className="info-box-number text-red">{AQI}</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <div className="info-box" style={{ backgroundColor: "#9C9DA119" }}>
                                            <div className="info-box-content">
                                                <span className="info-box-text text-center text-bold">Air Quality Data</span>
                                                {/* <p className="text-sm text-muted text-center" styles={{ padding: "0", margin: "0" }}>Fee 0.1 PLI/Hit</p> */}
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <span><button onClick={fetchAqi} className="btn btn-secondary">Air Quality Index<big className="badge badge-danger">{AQI}</big></button></span>
                                                    </div>
                                                    {/* <div className="col-md-3">
                                                        <span><button onClick={fetchAqi} className="btn btn-secondary">Air Pollutant one<big className="badge badge-danger">{AQI}</big></button></span>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span><button onClick={fetchAqi} className="btn btn-secondary">Air Pollutant two<big className="badge badge-danger">{AQI}</big></button></span>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span><button onClick={fetchAqi} className="btn btn-secondary">Air Pollutant three <big className="badge badge-danger">{AQI}</big></button></span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /.col */}
                            </div>
                        </div>
                    </div>
                    {/* /.col */}
                    <div className="col-4">
                        <div className="card-body" >
                            <div className="row" >
                                <div className="col-md-16" >
                                    <div className="form-group" style={{ width: "100%", height: "100%" }}>
                                        <iframe
                                        //src={`https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=zenburn&wt=none&l=solidity&width=320&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=11.5px&lh=133%25&si=false&es=2x&wm=false&code=pragma%2520solidity%2520%255E0.4.24%253B%250A%250Ainterface%2520IInvokeOracle%257B%250A%2520%2520%2520%2520function%2520requestAQIData%28address%2520_caller%252Cstring%2520_latitude%252C%2520string%2520_longitude%29%2520external%2520returns%2520%28bytes32%2520requestId%29%253B%250A%2520%2520%2520%2520function%2520showAQI%28%29%2520external%2520view%2520returns%28uint256%29%253B%250A%257D%250A%250Acontract%2520CustomerContract%257B%250A%2520%2520%2520%2520address%2520CONTRACTADDR%2520%253D%2520${db_data.contract_address}%253B%250A%2520%2520%2520%2520bytes32%2520public%2520requestId%253B%2520%250A%250A%2520%2520%2520%2520%252F%252FFund%2520this%2520contract%2520with%2520sufficient%2520PLI%252C%2520before%2520you%2520trigger%2520below%2520function.%2520%250A%2520%2520%2520%2520%252F%252FNote%252C%2520below%2520function%2520will%2520not%2520trigger%2520if%2520you%2520do%2520not%2520put%2520PLI%2520in%2520above%2520contract%2520address%250A%2520%2520%2520%2520function%2520getPriceInfo%28string%2520latitude%252C%2520string%2520longitude%29%2520external%2520returns%28bytes32%29%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%28requestId%29%2520%253D%2520IInvokeOracle%28CONTRACTADDR%29.requestAQIData%28%257B_caller%253Amsg.sender%252C_latitude%253Alatitude%252C_longitude%253Alongitude%257D%29%253B%2520%250A%2520%2520%2520%2520%2520%2520%2520%2520return%2520requestId%253B%250A%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%252F%252FTODO%2520-%2520you%2520can%2520customize%2520below%2520function%2520as%2520you%2520want%252C%2520but%2520below%2520function%2520will%2520give%2520you%2520the%2520pricing%2520value%250A%2520%2520%2520%2520%252F%252FThis%2520function%2520will%2520give%2520you%2520last%2520stored%2520value%2520in%2520the%2520contract%250A%2520%2520%2520%2520function%2520show%28%29%2520external%2520view%2520returns%28uint256%29%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520return%2520IInvokeOracle%28CONTRACTADDR%29.showAQI%28%29%253B%250A%2520%2520%2520%2520%257D%250A%257D`}
                                          src={`https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=zenburn&wt=none&l=solidity&width=320&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=11.5px&lh=133%25&si=false&es=2x&wm=false&code=pragma%2520solidity%2520%255E0.4.24%253B%250A%250Ainterface%2520IInvokeOracle%257B%250A%2520%2520%2520%2520function%2520requestAirQualityData%28address%2520_caller%29%2520external%2520returns%2520%28bytes32%2520requestId%29%253B%250A%2520%2520%2520%2520function%2520showAQI%28%29%2520external%2520view%2520returns%28uint256%29%253B%250A%257D%250A%250Acontract%2520CustomerContract%257B%250A%2520%2520%2520%2520address%2520CONTRACTADDR%2520%253D%2520${db_data.contract_address}%253B%250A%2520%2520%2520%2520bytes32%2520public%2520requestId%253B%2520%250A%250A%2520%2520%2520%2520%252F%252FNote%252C%2520below%2520function%2520will%2520not%2520trigger%2520if%2520you%2520do%2520not%2520put%2520PLI%2520in%2520above%2520contract%2520address%250A%2520%2520%2520%2520function%2520getAirQualityData%28%29%2520external%2520returns%28bytes32%29%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%28requestId%29%2520%253D%2520IInvokeOracle%28CONTRACTADDR%29.requestAirQualityData%28%257B_caller%253Amsg.sender%257D%29%253B%2520%250A%2520%2520%2520%2520%2520%2520%2520%2520return%2520requestId%253B%250A%2520%2520%2520%2520%257D%250A%250A%2520%2520%2520%2520%252F%252FThis%2520function%2520will%2520give%2520you%2520last%2520stored%2520value%2520in%2520the%2520contract%250A%2520%2520%2520%2520function%2520show%28%29%2520external%2520view%2520returns%28uint256%29%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520return%2520IInvokeOracle%28CONTRACTADDR%29.showAQI%28%29%253B%250A%2520%2520%2520%2520%257D%250A%257D`}
                                            style={{
                                                width: "320px",
                                                height: "320px",
                                                border: 0,
                                                transform: "scale(1)",
                                                overflow: "hidden"
                                            }}
                                            sandbox="allow-scripts allow-same-origin">
                                        </iframe>
                                        {/* </div> */}
                                        {/* </div> */}
                                    </div>
                                </div>
                                {/* /.col */}
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
                {/* /.row */}
            </div>
        </div>);
}
export default ViewLocationContractDetails;

