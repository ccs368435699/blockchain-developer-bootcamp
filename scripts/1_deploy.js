const { ethers } = require("hardhat");

async function main(){

    const Token = await ethers.getContractFactory("Token")
    const token = await Token.deploy()
    await token.deployed()
    console.log(1,`Token address is  ${token.address}`)
}

main().then(()=>{
    process.exit(0)
}).catch((error)=>{
    console.error(error);
    process.exit(1)
})