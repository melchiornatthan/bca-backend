const query = require("../services/service");

/**
 * Handles a request and response by invoking a query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} queryFunction - The query function to be executed.
 */
async function handleRequestResponse(req, res, queryFunction) {
  try {
    const result = await queryFunction(req.body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Registers a user by invoking the 'registerUser' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function registerUser(req, res) {
  handleRequestResponse(req, res, query.registerUser);
}

/**
 * Gets the batch ID by invoking the 'getBatchId' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getBatchId(req, res) {
  handleRequestResponse(req, res, query.getBatchId);
}

/**
 * Logs a user in by invoking the 'loginUser' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function loginUser(req, res) {
  handleRequestResponse(req, res, query.loginUser);
}

/**
 * Retrieves a list of locations by invoking the 'getLocations' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getLocations(req, res) {
  handleRequestResponse(req, res, query.getLocations);
}

/**
 * Retrieves a list of providers by invoking the 'getProviders' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getProviders(req, res) {
  handleRequestResponse(req, res, query.getProviders);
}

/**
 * Retrieves SLA data by invoking the 'getSLAData' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getSLAData(req, res) {
  handleRequestResponse(req, res, query.getSLAData);
}

/**
 * Retrieves coverage data by invoking the 'getCoverageData' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getCoverageData(req, res) {
  handleRequestResponse(req, res, query.getCoverageData);
}

/**
 * Retrieves price data by invoking the 'getPriceData' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getPriceData(req, res) {
  handleRequestResponse(req, res, query.getPriceData);
}

/**
 * Retrieves installation info by invoking the 'getInstallationInfo' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getInstallationInfo(req, res) {
  handleRequestResponse(req, res, (body) => query.getInstallationInfo(body.location));
}

/**
 * Initiates an installation request by invoking the 'createInstallation' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function installationRequest(req, res) {
  handleRequestResponse(req, res, query.createInstallation);
}

/**
 * Initiates a relocation request by invoking the 'createRelocation' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function relocationRequest(req, res) {
  handleRequestResponse(req, res, query.createRelocation);
}

function getRelocations(req, res) {
  handleRequestResponse(req, res, query.getRelocations);
}

function getDismantles(req, res) {
  handleRequestResponse(req, res, query.getDismantles);
}

/**
 * Retrieves a list of installations by invoking the 'getInstallationList' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getInstallations(req, res) {
  handleRequestResponse(req, res, query.getInstallationList);
}

/**
 * Retrieves an installation by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getInstallationsById(req, res) {
  try {
    const id = req.params.id;
    const result = await query.getInstallationById(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Retrieves a list of installations grouped by batch ID by invoking the 'getBatchInstallation' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getBatchInstallations(req, res) {
  handleRequestResponse(req, res, query.getBatchInstallation);
}

function getFilteredInstallation(req, res) {
  handleRequestResponse(req, res, query.getInstallationFiltered);
}

/**
 * Retrieves a list of providers for a specific area.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getProvidersbyArea(req, res) {
  try {
    const id_loc = req.params.id_loc;
    const result = await query.getProvidersbyArea(id_loc);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Retrieves installation providers for a specific location and provider ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
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

/**
 * Updates an installation record.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function updateInstallations(req, res) {
  try {
    const id = req.params.id;
    const result = await query.updateInstallation(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Updates relocation records by invoking the 'updateRelocation' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function updateRelocations(req, res) {
  handleRequestResponse(req, res, query.updateRelocation);
}

/**
 * Updates dismantle records by invoking the 'updateDismantle' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function updateDismantle(req, res) {
  handleRequestResponse(req, res, query.updateDismantle);
}

function getProviderCount(req, res) {
  handleRequestResponse(req, res, query.getProvidersCount);
}

function getRequestCount(req, res) {
  handleRequestResponse(req, res, query.getRequestCount);
}

/**
 * Initiates a dismantle request by invoking the 'createDismantle' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function dismantleRequest(req, res) {
  handleRequestResponse(req, res, query.createDismantle);
}

/**
 * Overrides installation records by invoking the 'overrideInstallation' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function overrideInstallations(req, res) {
  handleRequestResponse(req, res, query.overrideInstallation);
}

/**
 * Retrieves a list of installations for a specific batch ID by invoking the 'getInstallationbyBatch' query function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getInstallationsbyBatchID(req, res) {
  try {
    const batchid = req.params.batchid;
    const result = await query.getInstallationbyBatch(batchid);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

async function getRelocationsById(req, res) {
  try {
    const id = req.params.id;
    const result = await query.getRelocationsById(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

async function getLocationByArea(req, res) {
  try {
    const location = req.params.location;
    const result = await query.getLocationByName(location);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

module.exports = {
  registerUser,
  getLocationByArea,
  overrideInstallations,
  getInstallations,
  getBatchInstallations,
  updateInstallations,
  getInstallationsbyBatchID,
  getInstallationsProviders,
  loginUser,
  getRequestCount,
  getCoverageData,
  getBatchId,
  getInstallationsById,
  getPriceData,
  getSLAData,
  installationRequest,
  getLocations,
  getProvidersbyArea,
  getProviders,
  relocationRequest,
  getInstallationInfo,
  dismantleRequest,
  updateRelocations,
  getFilteredInstallation,
  getDismantles,
  getRelocations,
  getProviderCount,
  getRelocationsById,
  updateDismantle,
};
