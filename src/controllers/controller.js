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
  } catch (err) {
    res.json(err);
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
  } catch (err) {
    res.json(err);
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
  } catch (err) {
    res.json(err);
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
  } catch (err) {
    res.json(err);
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
  } catch (err) {
    res.json(err);
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
  } catch (err) {
    res.json(err);
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
  } catch (err) {
    res.json(err);
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
    const result = await query.getInstallationInfo(req.body);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getCoverageData,
  getPriceData,
  getSLAData,
  getLocations,
  getProviders,
  getInstallationInfo,
};
