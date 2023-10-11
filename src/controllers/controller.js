const query = require("../services/service");

/**
 * Register a new user.
 *
 * @param {Object} req - The request object containing the request body.
 * @param {Object} res - The response object.
 */
async function registerUser(req, res) {
  try {
    const result = await query.registerUser(req.body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Authenticate and log in a user.
 *
 * @param {Object} req - The request object containing the request body.
 * @param {Object} res - The response object.
 */
async function loginUser(req, res) {
  try {
    const result = await query.loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get a list of locations.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getLocations(req, res) {
  try {
    const result = await query.getLocations();
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get a list of providers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getProviders(req, res) {
  try {
    const result = await query.getProviders();
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get a list of SLA data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getSLAData(req, res) {
  try {
    const result = await query.getSLAData();
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get a list of coverage data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getCoverageData(req, res) {
  try {
    const result = await query.getCoverageData();
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get a list of price data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getPriceData(req, res) {
  try {
    const result = await query.getPriceData();
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get installation information based on location.
 *
 * @param {Object} req - The request object containing the request body.
 * @param {Object} res - The response object.
 */
async function getInstallationInfo(req, res) {
  try {
    const result = await query.getInstallationInfo(req.body.location);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Submit an installation request.
 *
 * @param {Object} req - The request object containing the request body.
 * @param {Object} res - The response object.
 */
async function installationRequest(req, res) {
  try {
    const result = await query.createInstallation(req.body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get all installation requests.
 *
 * @param {Object} req - The request object containing the request body.
 * @param {Object} res - The response object.
 */
async function getInstallations(req, res) {
  try {
    const result = await query.getInstallationList();
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get installation information by ID.
 *
 * @param {Object} req - The Express request object containing 'body'.
 * @param {Object} res - The Express response object to send the result or error.
 */
async function getInstallationsById(req, res) {
  try {
    const result = await query.getInstallationById(req.body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Get installation providers based on a location.
 *
 * @param {Object} req - The Express request object containing 'location'.
 * @param {Object} res - The Express response object to send the result or error.
 */
async function getInstallationsProviders(req, res) {
  try {
    const result = await query.getInstallationProvider(req.body.location);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Update installation status to "approved" by ID if it's currently "pending".
 *
 * @param {Object} req - The Express request object containing 'body'.
 * @param {Object} res - The Express response object to send the result or error.
 */
async function updateInstallations(req, res) {
  try {
    const result = await query.updateInstallation(req.body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
}

/**
 * Override an installation's data and set status to "approved" if it's currently "pending".
 *
 * @param {Object} req - The Express request object containing 'body'.
 * @param {Object} res - The Express response object to send the result or error.
 */
async function overrideInstallations(req, res) {
  try {
    const result = await query.overrideInstallation(req.body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
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
