const { task } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

task("account", "Prints the list of account", async (taskArgs, hre)=>{
  const  accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address)
  }
})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {
      url: " http://127.0.0.1:8545/"
    }
  }
};
