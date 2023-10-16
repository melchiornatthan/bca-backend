const query = require("../services/service");

async function handleRequestResponse(req, res, queryFunction) {
  try {
    const result = await queryFunction(req.body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

function registerUser(req, res) {
  handleRequestResponse(req, res, query.registerUser);
}

function loginUser(req, res) {
  handleRequestResponse(req, res, query.loginUser);
}

function getLocations(req, res) {
  handleRequestResponse(req, res, query.getLocations);
}

function getProviders(req, res) {
  handleRequestResponse(req, res, query.getProviders);
}

function getSLAData(req, res) {
  handleRequestResponse(req, res, query.getSLAData);
}

function getCoverageData(req, res) {
  handleRequestResponse(req, res, query.getCoverageData);
}

function getPriceData(req, res) {
  handleRequestResponse(req, res, query.getPriceData);
}

function getInstallationInfo(req, res) {
  handleRequestResponse(req, res, (body) => query.getInstallationInfo(body.location));
}

function installationRequest(req, res) {
  handleRequestResponse(req, res, query.createInstallation);
}

function getInstallations(req, res) {
  handleRequestResponse(req, res, query.getInstallationList);
}

function getInstallationsById(req, res) {
  handleRequestResponse(req, res, query.getInstallationById);
}

function getInstallationsProviders(req, res) {
  handleRequestResponse(req, res, (body) => query.getInstallationProvider(body.location));
}

function updateInstallations(req, res) {
  handleRequestResponse(req, res, query.updateInstallation);
}

function overrideInstallations(req, res) {
  handleRequestResponse(req, res, query.overrideInstallation);
}

module.exports = {
  registerUser,
  overrideInstallations,
  getInstallations,
  updateInstallations,
  getInstallationsProviders,
  loginUser,
  getCoverageData,
  getInstallationsById,
  getPriceData,
  getSLAData,
  installationRequest,
  getLocations,
  getProviders,
  getInstallationInfo,
};
