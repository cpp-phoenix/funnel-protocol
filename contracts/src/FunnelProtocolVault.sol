// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC4626.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract FunnelProtocolVault is ERC4626 {

    uint256 public _totalAssets;
    address public owner;

    constructor(ERC20 _asset, string memory _name, string memory _symbol, address _owner) ERC4626 (_asset, _name, _symbol){
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function totalAssets() public view override returns (uint256) {
        return _totalAssets;
    }

    function totalAssets() override public view returns (uint256) {
        return 0;
    }

    function afterDeposit(uint256 assets, uint256 shares) internal override {
        _totalAssets += assets;
    }

    function beforeWithdraw(uint256 assets, uint256 shares) internal override {
        _totalAssets -= assets;
    }

    function pushAssetUpdate(uint256 _totalAsset) external onlyOwner() {
        _totalAssets = _totalAsset;
    }
}