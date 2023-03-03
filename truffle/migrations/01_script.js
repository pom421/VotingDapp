const Voting = artifacts.require("Voting");

module.exports = async (deployer, network, accounts) => {
    console.log("Accounts 0", accounts[0]);
    // await deployer.deploy(Voting, 5, { from: accounts[0], value: 100000000 });
    await deployer.deploy(Voting);
    const instance = await Voting.deployed();
    console.log("Voting deployed to:", instance.address);
    // await console.log("valeur du retrieve", await instance.retrieve());
};
