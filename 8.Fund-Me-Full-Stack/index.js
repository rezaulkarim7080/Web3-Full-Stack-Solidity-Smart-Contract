

// document.write("this is from javascript file \n")

const connectButton = document.getElementById('connectBtn');
const fundButton = document.getElementById('fundBtn');

// console.log(ethers);

/// connect 

connectButton.addEventListener('click', connectMetamask)

async function connectMetamask() {
    if (typeof window.ethereum !== "undefined") {

        // document.write("i see a metamask")

        await window.ethereum.request({ method: "eth_requestAccounts" });

        connectButton.innerHTML = "Connected Metamask";
    } else {
        document.write("i do not  see a metamask");
    }
}





// fund function

fundButton.addEventListener('click', fund)

async function fund(ethAmount) {
    console.log(`funding with ${ethAmount}`);

    if (typeof window.ethereum !== "undefined") {

        // Provider / connection to the blockchain
        // signer / wallet 
        // contract that we are interacting with
        // ABI and Address

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        console.log(signer);

    }
}


// withdraw function
// async function withdraw(ethAmount) {

//     console.log(`funding with ${ethAmount}`);

// }
