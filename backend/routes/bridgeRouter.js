const express = require("express");
const router = express.Router();

const bridgeController = require("../controllers/bridgeController")

router.get("/", bridgeController.index)

router.get("/mint", bridgeController.bridge_mint)

router.get("/unmint", bridgeController.bridge_unmint)

module.exports = router