const asyncHandler = require("express-async-handler");

const bridgeService = require("../services/bridgeService")

exports.index = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Site Home Page");
});

exports.bridge_mint = asyncHandler(async (req, res, next) => {
    await bridgeService.mint()
    res.send("NOT IMPLEMENTED: bridge mint");
});

exports.bridge_unmint = asyncHandler(async (req, res, next) => {
    await bridgeService.unMint()
    res.send("NOT IMPLEMENTED: bridge unmint");
});