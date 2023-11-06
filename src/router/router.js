const express = require("express");
const passport = require("passport");
const router = express.Router();
const controller = require("../controllers/controller");

/**
 * @typedef {Object} Location
 * @property {string} id - The location ID.
 * @property {string} name - The location name.
 */

/**
 * @typedef {Object} Provider
 * @property {string} id - The provider ID.
 * @property {string} name - The provider name.
 */

/**
 * @typedef {Object} InstallationInfo
 * @property {string} location - The location name.
 */

/**
 * @typedef {Object} SLAData
 * @property {string} name - The SLA name.
 * @property {string} value - The SLA value.
 */

/**
 * @typedef {Object} CoverageData
 * @property {string} name - The coverage name.
 * @property {string} value - The coverage value.
 */

/**
 * @typedef {Object} PriceData
 * @property {string} name - The price name.
 * @property {string} value - The price value.
 */

/**
 * @typedef {Object} InstallationRequest
 * @property {string} location - The location for the installation.
 */

/**
 * @typedef {Object} InstallationData
 * @property {string} id - The installation ID.
 */

/**
 * Route to register a new user.
 *
 * @name POST /register
 */
router.post("/register", controller.registerUser);

/**
 * Route to log in a user.
 *
 * @name POST /login
 * @middleware Passport Local Authentication
 */
router.post("/login", passport.authenticate("local"), controller.loginUser);

/**
 * Route to get a list of locations.
 *
 * @name GET /locations
 * @returns {Location[]} - A list of locations.
 */
router.get("/locations", controller.getLocations);

/**
 * Route to get a list of providers.
 *
 * @name GET /providers
 * @returns {Provider[]} - A list of providers.
 */
router.get("/providers", controller.getProviders);

router.get("/locationByArea/:location", controller.getLocationByArea);

/**
 * Route to get installation information.
 *
 * @name POST /installation
 * @param {InstallationRequest} request.body - The installation request object.
 * @returns {InstallationInfo} - Installation information.
 */
router.post("/installation", controller.getInstallationInfo);

router.get("/filtered-installation", controller.getFilteredInstallation);

router.get("/providerCount", controller.getProviderCount);
router.get("/requestsCount", controller.getRequestCount);
/**
 * Route to get a list of SLA data.
 *
 * @name GET /sla
 * @returns {SLAData[]} - A list of SLA data.
 */
router.get("/sla", controller.getSLAData);

/**
 * Route to get a list of coverage data.
 *
 * @name GET /coverage
 * @returns {CoverageData[]} - A list of coverage data.
 */
router.get("/coverage", controller.getCoverageData);

/**
 * Route to get a list of price data.
 *
 * @name GET /prices
 * @returns {PriceData[]} - A list of price data.
 */
router.get("/prices", controller.getPriceData);

router.get("/relocations", controller.getRelocations);
router.get("/dismantles", controller.getDismantles);

router.get("/relocations/:id", controller.getRelocationsById);

/**
 * Route to submit an installation request.
 *
 * @name POST /installation-request
 * @param {InstallationRequest} request.body - The installation request object.
 */
router.post("/installation-request", controller.installationRequest);

/**
 * Route to submit a relocation request.
 *
 * @name POST /relocation-request
 * @param {InstallationRequest} request.body - The relocation request object.
 */
router.post("/relocation-request", controller.relocationRequest);

/**
 * Route to submit a dismantle request.
 *
 * @name POST /dismantle-request
 * @param {InstallationRequest} request.body - The dismantle request object.
 */
router.post("/dismantle-request", controller.dismantleRequest);

/**
 * Route to get a list of installations data.
 *
 * @name GET /installations
 * @returns {InstallationData[]} - A list of installations data.
 */
router.get("/installations", controller.getInstallations);

/**
 * Route to get installations by ID.
 *
 * @name GET /installationsById/:id
 * @param {string} id - The installation ID.
 * @returns {InstallationData} - Installation data.
 */
router.get("/installationsById/:id", controller.getInstallationsById);

/**
 * Route to get installations providers.
 *
 * @name GET /installations-providers/:location/:id_prov
 * @param {string} location - The location name.
 * @param {string} id_prov - The provider ID.
 * @returns {InstallationData} - Installation data.
 */
router.get("/installations-providers/:location/:id_prov", controller.getInstallationsProviders);

/**
 * Route to update installations data by ID.
 *
 * @name PUT /update-installations/:id
 * @param {string} id - The installation ID to update.
 * @returns {InstallationData} - Updated installation data.
 */
router.put("/update-installations/:id", controller.updateInstallations);

/**
 * Route to update relocation records.
 *
 * @name PUT /update-relocations
 * @param {InstallationRequest} request.body - The relocation request object.
 */
router.put("/update-relocations", controller.updateRelocations);

/**
 * Route to update dismantle records.
 *
 * @name PUT /update-dismantle
 * @param {InstallationRequest} request.body - The dismantle request object.
 */
router.put("/update-dismantle", controller.updateDismantle);

/**
 * Route to override installations.
 *
 * @name POST /installation-override
 */
router.post("/installation-override", controller.overrideInstallations);

/**
 * Route to get a batch ID.
 *
 * @name GET /getBatchId
 * @returns {string} - The batch ID.
 */
router.get("/getBatchId", controller.getBatchId);

/**
 * Route to get installations by batch ID.
 *
 * @name GET /getInstallationsbyBatchID/:batchid
 * @param {string} batchid - The batch ID.
 * @returns {InstallationData[]} - A list of installations by batch ID.
 */
router.get("/getInstallationsbyBatchID/:batchid", controller.getInstallationsbyBatchID);

/**
 * Route to get batch installations.
 *
 * @name GET /getBatchInstallations
 * @returns {InstallationData[]} - A list of batch installations.
 */
router.get("/getBatchInstallations", controller.getBatchInstallations);

/**
 * Route to get providers by area.
 *
 * @name GET /getProvidersbyArea/:id_loc
 * @param {string} id_loc - The location ID.
 * @returns {Provider[]} - A list of providers in the specified area.
 */
router.get("/getProvidersbyArea/:id_loc", controller.getProvidersbyArea);

module.exports = router;
