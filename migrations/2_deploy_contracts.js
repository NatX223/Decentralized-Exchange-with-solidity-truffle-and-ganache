const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
  //deploy token
  await deployer.deploy(Token);
  const token = await Token.deployed();
  const address = await token.address;

  //deploy ethswap
  await deployer.deploy(EthSwap, address);
  const ethSwap = await EthSwap.deployed();

  //transfer tokens from address to ethswap smartcontract
  await token.transfer(ethSwap.address, '1000000000000000000000000')
};