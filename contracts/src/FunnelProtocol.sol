// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import "./FunnelProtocolVault.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract FunnelProtocol {

    //BTC/USD : 0x56a43EB56Da12C0dc1D972ACb089c06a5dEF8e69
    //ETH/USD : 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165
    //USDC/USD : 0x0153002d20B96532C639313c2d54c3dA09109309
    //USDT/USD : 0x80EDee6f667eCc9f63a0a6f55578F870651f06A4

    FunnelProtocolVault public fpVault;
    address public owner;
    mapping(address => address) public priceFeeds;
    mapping(address => bool) public activeTokens;
    ERC20 public asset;

    constructor(address _asset) {
        asset = ERC20(_asset);
        owner = msg.sender;
        fpVault = new FunnelProtocolVault(asset, 'funnel BTC ', 'fBTC', msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function addFeed(address _token, address _feed) public onlyOwner() {
        priceFeeds[_token] = _feed;
        activeTokens[_token] = true;
    }

    function removeFeed(address _token) public onlyOwner() {
        priceFeeds[_token] = address(0);
        activeTokens[_token] = false;
    }

    function getFeed(address _token) public view returns(address) {
        return priceFeeds[_token];
    }

    function burnFPV(uint256 _amount) public {
        ERC20(fpVault).transferFrom(msg.sender, address(this), _amount);
        fpVault.burnSupply(_amount);
    }

    function deposit(address _token, uint256 _amount) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        uint256 tBtcAmount = convertToShares(_token, _amount);

        ERC20(fpVault.asset()).approve(address(fpVault), tBtcAmount);
        
        fpVault.deposit(tBtcAmount, msg.sender);
    }

    function redeem(uint256 shares) public {
        fpVault.transferFrom(msg.sender, address(this), shares);
        fpVault.redeem(shares, msg.sender, address(this));
    }

    function convertToShares(address _token, uint256 _amount) public view virtual returns (uint256) {
        if(_token != address(asset)) {
            require(activeTokens[_token], "token not supported yet");
            uint256 convertedAmount = currencyConversion(_token, address(asset), _amount);
            return fpVault.convertToShares(convertedAmount);
        } else {
            return fpVault.convertToShares(_amount);
        }
    }

    function convertToAssets(uint256 shares) public view virtual returns (uint256) {
        return fpVault.convertToAssets(shares);
    }

    function currencyConversion(address _token, address _asset, uint256 _amount) public view returns(uint256) {
        uint256 priceSource = uint256(latestRoundData(_token));
        uint256 priceDest = uint256(latestRoundData(_asset));
        return (_amount * priceSource) / priceDest;
    }

    function latestRoundData(address _token) public view
    returns (int256 answer) {
        address _feed = priceFeeds[_token];
        if(_feed != address(0)) {
            (, answer, , , ) = AggregatorV3Interface(_feed).latestRoundData();

        }
        return answer;
    }

}