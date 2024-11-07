// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract DummyERC20 is ERC20 {
    address public owner;

    constructor(string memory name, string memory token, uint256 supply) ERC20(name, token) {
        _mint(msg.sender, supply);
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "not owner");
        _;
    }

    function decimals() public view override returns (uint8) {
        return 8;
    }

    function mintSupply(uint256 _amount) public onlyOwner() {
        _mint(msg.sender, _amount);
    }

    function burnSupply(uint256 _amount) public onlyOwner() {
        _burn(msg.sender, _amount);
    }

}