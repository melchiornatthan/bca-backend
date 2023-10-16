const express = require("express");
const passport = require("passport");
const router = express.Router();
const controller = require("../controllers/controller");

// Common error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "An error occurred." });
};

const routes = [
  // Register a new user
  {
    method: "post",
    path: "/register",
    middleware: undefined,
    handler: controller.registerUser,
    description: "Register a new user.",
  },
  // Log in a user
  {
    method: "post",
    path: "/login",
    middleware: passport.authenticate("local"),
    handler: controller.loginUser,
    description: "Log in a user.",
  },
  // Get a list of locations
  {
    method: "get",
    path: "/locations",
    middleware: undefined,
    handler: controller.getLocations,
    description: "Get a list of locations.",
  },
  // Get a list of providers
  {
    method: "get",
    path: "/providers",
    middleware: undefined,
    handler: controller.getProviders,
    description: "Get a list of providers.",
  },
  // Get installation information
  {
    method: "post",
    path: "/installation",
    middleware: undefined,
    handler: controller.getInstallationInfo,
    description: "Get installation information.",
  },
  // Get a list of SLA data
  {
    method: "get",
    path: "/sla",
    middleware: undefined,
    handler: controller.getSLAData,
    description: "Get a list of SLA data.",
  },
  // Get a list of coverage data
  {
    method: "get",
    path: "/coverage",
    middleware: undefined,
    handler: controller.getCoverageData,
    description: "Get a list of coverage data.",
  },
  // Get a list of price data
  {
    method: "get",
    path: "/prices",
    middleware: undefined,
    handler: controller.getPriceData,
    description: "Get a list of price data.",
  },
  // Submit an installation request
  {
    method: "post",
    path: "/installation-request",
    middleware: undefined,
    handler: controller.installationRequest,
    description: "Submit an installation request.",
  },
  // Get a list of installations data
  {
    method: "get",
    path: "/installations",
    middleware: undefined,
    handler: controller.getInstallations,
    description: "Get a list of installations data.",
  },
  // Get installations by ID
  {
    method: "get",
    path: "/installationsById",
    middleware: undefined,
    handler: controller.getInstallationsById,
    description: "Get installations by ID.",
  },
  // Get installations providers
  {
    method: "get",
    path: "/installations-providers",
    middleware: undefined,
    handler: controller.getInstallationsProviders,
    description: "Get installations providers.",
  },
  // Update installations data
  {
    method: "put",
    path: "/update-installations",
    middleware: undefined,
    handler: controller.updateInstallations,
    description: "Update installations data.",
  },
  // Override installations
  {
    method: "post",
    path: "/installation-override",
    middleware: undefined,
    handler: controller.overrideInstallations,
    description: "Override installations.",
  },
];

routes.forEach((route) => {
  const args = [route.path];
  if (route.middleware) {
    args.splice(1, 0, route.middleware);
  }
  args.push(route.handler);

  // Add route-specific error handling middleware
  args.push(errorHandler);

  router[route.method](...args);
});

module.exports = router;
