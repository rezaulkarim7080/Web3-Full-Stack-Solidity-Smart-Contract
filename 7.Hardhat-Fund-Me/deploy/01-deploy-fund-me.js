
// function deployFunc(hre) {
//     console.log("hi");
// }

const { network } = require("hardhat")

// module.exports.default = deployFunc


// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
//     /// hre.getNamedAccounts
//     /// hre.deployments
// }

// OR

module.exports = async ({ getNamedAccounts, deployments }) => {
    /// hre.getNamedAccounts
    /// hre.deployments
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

}

