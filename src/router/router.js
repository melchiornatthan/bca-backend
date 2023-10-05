const express = require("express");
const passport = require("passport");
const router = express.Router();
const controller = require("../controllers/controller");


router.post("/register", controller.register) ;
router.post("/login", passport.authenticate("local"), controller.login);
router.get("/locations", controller.getlocations);
router.get("/providers", controller.getproviders);
router.post("/installation", controller.installation);
router.get("/sla", controller.getsla);
router.get("/coverage", controller.getcoverage);
router.get("/prices", controller.getprices);

module.exports = router;