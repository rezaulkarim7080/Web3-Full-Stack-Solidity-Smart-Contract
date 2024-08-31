const ethers = require('ethers');
const fs = require("fs");
require("dotenv").config();


//
// for creating abi and binary file 
//npx solc --bin --abi --optimize simple.sol -o output/  


async function main() {
    // http://127.0.0.1:7545 -> ganache app


    // npm install ganache
    // 127.0.0.1:8545// run terminal  --> ganache


    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); //alchemy add your rpc URL
    // const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545"); //ganache add your rpc URL



    /// Normal way FOR GET WALLET Data

    // const wallet = new ethers.Wallet(
    //     process.env.PRIVATE_KEY, //terminal -ganache
    //     // "0xb774e8c9a4b3f0abb4e9faf546290621843e54e97a0ba2ab4098521d90e512ab",// ganache-app
    //     provider
    // );

    ///

    /////  USING ENCRYPTION KEY FOR GET WALLET Data

    const getEncryptedJson = fs.readFileSync("./encrypt.json", "utf8");
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        getEncryptedJson, process.env.PRIVATE_KEY_PASS
    );
    wallet = wallet.connect(provider);


    ///// deploy need files / DEPLOY THE CONTRACT

    const abi = fs.readFileSync("./output/simple_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./output/simple_sol_SimpleStorage.bin", "utf8");


    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    /////

    console.log("deploying ...");
    const contract = await contractFactory.deploy();
    const deploymentRecept = await contract.deployTransaction.wait(1);

    console.log(contract);

    console.log(`Deployed Transaction response : ${contract.deployTransaction} `);

    console.log(`Deployment Recept / Contract Deploy Info  : ${deploymentRecept} `);

    console.log(`Contract Address : ${contract.address}`);

    ///  END deploy

    /////////   Row/customize  deploy file / LIKE  DEPLOY THE CONTRACT

    // console.log("Lets deploy with transaction data !");
    // const nonceCounter = await wallet.getTransactionCount();

    // const tx = {
    //     nonce: nonceCounter,
    //     gasPrice: 20000000000,
    //     gasLimit: 1000000,
    //     to: null,
    //     value: 0,
    //     data: "binary code here ",
    //     chainId: 1337,
    // };

    // const signedTxResponse = await wallet.signTransaction(tx);
    // console.log(signedTxResponse);

    // const sendTransaction = (await wallet.sendTransaction(tx)).wait(1);
    // console.log(sendTransaction);

    ///////   END  Row/customize  deploy file 



    ///// simple.sol --> WORKING WITH SOLIDITY FILE / GET DATA AND INFOS FROM CONTRACT

    const currentFavouriteNumber = await contract.getNumber();
    console.log(`Current Favourite Number is ${currentFavouriteNumber.toString()}`);
    const transactionResponcse = await contract.setNumber("15")
    const transactionReceipt = await transactionResponcse.wait(1);
    const updateFavouriteNumber = await contract.getNumber();
    console.log(`Update Favourite Number is ${updateFavouriteNumber.toString()}`);

    ///// ///// END simple.sol 


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });