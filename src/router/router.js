const express = require("express");
const passport = require("passport");
const router = express.Router();
const controller = require("../controllers/controller");

/**
 * Route to register a new user.
 */
router.post("/register", controller.registerUser);

/**
 * Route to log in a user.
 */
router.post("/login", passport.authenticate("local"), controller.loginUser);

/**
 * Route to get a list of locations.
 */
router.get("/locations", controller.getLocations);

/**
 * Route to get a list of providers.
 */
router.get("/providers", controller.getProviders);

/**
 * Route to get installation information.
 */
router.post("/installation", controller.getInstallationInfo);

/**
 * Route to get a list of SLA data.
 */
router.get("/sla", controller.getSLAData);

/**
 * Route to get a list of coverage data.
 */
router.get("/coverage", controller.getCoverageData);

/**
 * Route to get a list of price data.
 */
router.get("/prices", controller.getPriceData);

module.exports = router;
