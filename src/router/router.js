const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const authMiddleware = require("../middlewares/tokenAuth");

// Public routes
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

// Protected routes
router.use(authMiddleware);

router.get("/locations", controller.getLocations);
router.get("/special-locations", controller.getLocationsSpecial);
router.get("/providers", controller.getProviders);
router.get("/locationByArea/:location", controller.getLocationByArea);
router.post("/installation", controller.getInstallationInfo);
router.get("/filtered-installation", controller.getFilteredInstallation);
router.get("/providerCount", controller.getProviderCount);
router.get("/requestsCount", controller.getRequestCount);
router.get("/sla", controller.getSLAData);
router.get("/coverage", controller.getCoverageData);
router.get("/prices", controller.getPriceData);
router.get("/relocations", controller.getRelocations);
router.get("/dismantles", controller.getDismantles);
router.get("/relocations/:id", controller.getRelocationsById);
router.get("/installationByLocation/:location", controller.getInstallationbyLocation);
router.post("/installation-request", controller.installationRequest);
router.post("/relocation-request", controller.relocationRequest);
router.post("/testing", controller.testing);
router.post("/dismantle-request", controller.dismantleRequest);
router.get("/installations", controller.getInstallations);
router.get("/installationsById/:id", controller.getInstallationsById);
router.get("/atmById/:id", controller.getAtmById);
router.get("/installations-providers/:location/:id_prov", controller.getInstallationsProviders);
router.put("/update-installations/:id", controller.updateInstallations);
router.put("/update-relocations", controller.updateRelocations);
router.put("/update-dismantle", controller.updateDismantle);
router.post("/installation-override", controller.overrideInstallations);
router.get("/getInstallationBatchId", controller.getInstallationBatchId);
router.get("/getRelocationBatchId", controller.getRelocationBatchId);
router.get("/getDismantleBatchId", controller.getDismantleBatchId);
router.get("/getInstallationsbyBatchID/:batchid", controller.getInstallationsbyBatchID);
router.get("/getRelocationsbyBatchID/:batchid", controller.getRelocationbyBatchId);
router.get("/getDismantlebyBatchID/:batchid", controller.getDismantlebyBatchID);
router.get("/getBatchInstallations/:batchid", controller.getBatchInstallations);
router.get("/getBatchRelocation/:batchid", controller.getBatchRelocations);
router.get("/getBatchDismantle/:batchid", controller.getBatchDismantle);
router.get("/getProvidersbyArea/:id_loc", controller.getProvidersbyArea);

module.exports = router;
