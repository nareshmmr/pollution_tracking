const { ethers } = require('hardhat');
const { writeFileSync } = require('fs');

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

async function main() {
  const sample = await deploy('PollutionInternalContract', "0x33f4212b027e22af7e6ba21fc572843c0d701cd1","0x963affD65f2378844dbFfb3CF65f73756eADd0C6","021a457c4eda413ea30c8b0a78d0742b");
  console.log("sample deployed to:", sample.address);
  writeFileSync('output.json', JSON.stringify({
    SampleContract: sample.address
  }, null, 2));

}
if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}