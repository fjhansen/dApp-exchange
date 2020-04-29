//@dev reads truffle artifacts from abis
const Token = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Token);
};