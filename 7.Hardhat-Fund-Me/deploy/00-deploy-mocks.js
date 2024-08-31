const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId;

    if (developmentChains.includes(network.name)) {
        console.log("local network detected ! Deployibg mocks....");
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            // args:,
        })
    }

}