// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import "https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC4626.sol";
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

    function mintSupply(uint256 _amount) public onlyOwner() {
        _mint(msg.sender, _amount);
    }

    function burnSupply(uint256 _amount) public onlyOwner() {
        _burn(msg.sender, _amount);
    }

    function totalAssets() public view override returns (uint256) {
        return _totalAssets;
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