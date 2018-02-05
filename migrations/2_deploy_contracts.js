var HelloEther = artifacts.require("./HelloEther.sol");

module.exports = function(deployer) {
  deployer.deploy(HelloEther);
};
