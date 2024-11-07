// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract DummyERC20 is ERC20 {
    constructor(string memory name, string memory token, uint256 supply) ERC20(name, token) {
        _mint(msg.sender, supply);
    }

    function decimals() public view override returns (uint8) {
        return 8;
    }

    function mintFaucet(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }

}