import web3 from "xdc3";
import axios from "axios";
export const convertTokens = async (n) => {
  var b = new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));
  return b;
}
const expectedBlockTime = 3000;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const getTxnStatus = async (txHash, provider) => {
  let transactionReceipt = null
  while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
    transactionReceipt = await provider.getTransactionReceipt(txHash);
    await sleep(3000)
  }
  if (transactionReceipt.status) {
    return [txHash, true];
  } else {
    return [txHash, false];
  }
}





const sendRequest = async (url) => {

  return new Promise((resolve, reject) => {
    const request = (retries) => {
      // Make the HTTP request
      axios.get(url).then((res) => {
        // Check some condition based on response
        // Check number of retries left
        if (!res.data.status) {
          request(--retries);
        } else {
          return resolve(res.data);
        }
      }).catch((error) => {
        reject(error);
      });
    };
    request(5);
  });
};