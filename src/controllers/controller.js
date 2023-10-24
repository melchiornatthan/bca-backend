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

function getBatchId(req, res) {
  handleRequestResponse(req, res, query.getBatchId);
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

async function getInstallationsById(req, res) {
  try {
    const id = req.params.id;
    const result = await query.getInstallationById(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

function getBatchInstallations(req, res) {
  handleRequestResponse(req, res, query.getBatchInstallation);
}



async function getProvidersbyArea(req, res) {
  try {
    const id_loc = req.params.id_loc;
    const result = await query.getProvidersbyArea(id_loc);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}


async function getInstallationsProviders(req, res) {
  try {
    const location = req.params.location;
    const id_prov = req.params.id_prov;
    const result = await query.getInstallationProvider(location, id_prov);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

async function updateInstallations(req, res) {
  try {
    const id = req.params.id;
    const result = await query.updateInstallation(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

function overrideInstallations(req, res) {
  handleRequestResponse(req, res, query.overrideInstallation);
}

async function getInstallationsbyBatchID(req, res) {
  try {
    const batchid = req.params.batchid;
    const result = await query.getInstallationbyBatch(batchid);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}
module.exports = {
  registerUser,
  overrideInstallations,
  getInstallations,
  getBatchInstallations,
  updateInstallations,
  getInstallationsbyBatchID,
  getInstallationsProviders,
  loginUser,
  getCoverageData,
  getBatchId,
  getInstallationsById,
  getPriceData,
  getSLAData,
  installationRequest,
  getLocations,
  getProvidersbyArea,
  getProviders,
  getInstallationInfo,
};
