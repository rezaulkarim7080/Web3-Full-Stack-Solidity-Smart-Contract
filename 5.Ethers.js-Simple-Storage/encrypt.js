
const ethers = require('ethers');
const fs = require("fs");
require("dotenv").config();


/// ENCRIPT WALLET DATA INFO FOR SAFTY  

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
    const encrypptedKey = await wallet.encrypt(process.env.PRIVATE_KEY_PASS, process.env.PRIVATE_KEY)
    console.log("wallet : ", wallet);
    console.log("encrypptedKey : ", encrypptedKey);
    fs.writeFileSync("./encrypt.json ", encrypptedKey);// save the data to the json file 
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });