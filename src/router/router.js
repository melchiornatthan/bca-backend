const express = require("express");
const passport = require("passport");
const router = express.Router();
const controller = require("../controllers/controller");

/**
 * Route to register a new user.
 *
 * @method POST
 * @route /register
 */
router.post("/register", controller.registerUser);

/**
 * Route to log in a user.
 *
 * @method POST
 * @route /login
 * @middleware Passport Local Authentication
 */
router.post("/login", passport.authenticate("local"), controller.loginUser);

/**
 * Route to get a list of locations.
 *
 * @method GET
 * @route /locations
 */
router.get("/locations", controller.getLocations);

/**
 * Route to get a list of providers.
 *
 * @method GET
 * @route /providers
 */
router.get("/providers", controller.getProviders);

/**
 * Route to get installation information.
 *
 * @method POST
 * @route /installation
 */
router.post("/installation", controller.getInstallationInfo);

/**
 * Route to get a list of SLA data.
 *
 * @method GET
 * @route /sla
 */
router.get("/sla", controller.getSLAData);

/**
 * Route to get a list of coverage data.
 *
 * @method GET
 * @route /coverage
 */
router.get("/coverage", controller.getCoverageData);

/**
 * Route to get a list of price data.
 *
 * @method GET
 * @route /prices
 */
router.get("/prices", controller.getPriceData);

/**
 * Route to submit an installation request.
 *
 * @method POST
 * @route /installation-request
 */
router.post("/installation-request", controller.installationRequest);

/**
 * Route to get a list of installations data.
 *
 * @method GET
 * @route /installations
 */
router.get("/installations", controller.getInstallations);

/**
 * Route to get installations by ID.
 *
 * @method GET
 * @route /installationsById
 */
router.get("/installationsById/:id", controller.getInstallationsById);

/**
 * Route to get installations providers.
 *
 * @method GET
 * @route /installations-providers
 */
router.get("/installations-providers/:location/:id_prov", controller.getInstallationsProviders);

/**
 * Route to update installations data.
 *
 * @method PUT
 * @route /update-installations
 */
router.put("/update-installations/:id", controller.updateInstallations);

/**
 * Route to override installations.
 *
 * @method POST
 * @route /installation-override
 */
router.post("/installation-override", controller.overrideInstallations);

router.get("/getBatchId", controller.getBatchId);
router.get("/getInstallationsbyBatchID/:batchid", controller.getInstallationsbyBatchID);

router.get("/getBatchInstallations", controller.getBatchInstallations);


router.get("/getProvidersbyArea/:id_loc", controller.getProvidersbyArea);
module.exports = router;
