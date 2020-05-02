pragma solidity ^0.5.0;

contract Token {
  string public name = "Juniper";
  string public symbol = "JUNI";
  uint256 public decimals = 18;
  uint256 public totalSupply;

  mapping(address => uint256) public balanceOf;

  constructor() public {
    totalSupply = 1000000 * (10 ** decimals);
    balanceOf[msg.sender] = totalSupply;
  }
}