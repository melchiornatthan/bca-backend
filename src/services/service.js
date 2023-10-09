const bcrypt = require("bcrypt");
const User = require("../models/user");
const Provider = require("../models/provider");
const Location = require("../models/locations");
const Sla = require("../models/sla");
const Coverage = require("../models/coverage");
const Price = require("../models/price");
const sequelize = require("../database/connection");

/**
 * Register a new user.
 *
 * @param {Object} body - The request body containing 'username' and 'password'.
 * @returns {Object} A success message if the user is registered successfully.
 * @throws {Error} If there are issues with user registration.
 */
async function registerUser(body) {
  const { username, password } = body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    if (!newUser) {
      throw new Error("Error registering user");
    }

    return {
      message: "User created successfully",
    };
  } catch (error) {
    throw new Error("Error registering user");
  }
}

/**
 * Authenticate and log in a user.
 *
 * @param {Object} body - The request body containing 'username' and 'password'.
 * @returns {Object} A success message if the user is logged in successfully.
 * @throws {Error} If there are issues with user authentication or login.
 */
async function loginUser(body) {
  const { username, password } = body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error("Invalid username");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return {
      message: "User logged in successfully",
    };
  } catch (error) {
    throw new Error("Error logging in");
  }
}

/**
 * Get a list of locations.
 *
 * @returns {Object} A list of locations.
 * @throws {Error} If there are issues with retrieving locations.
 */
async function getLocations() {
  try {
    const locations = await Location.findAll();

    if (locations.length === 0) {
      throw new Error("Error getting locations");
    }

    return { list: locations };
  } catch (error) {
    throw new Error("Error getting locations");
  }
}

/**
 * Get a list of SLA data.
 *
 * @returns {Object} A list of SLA data.
 * @throws {Error} If there are issues with retrieving SLA data.
 */
async function getSLAData() {
  try {
    const slaList = await Sla.findAll({
      include: [
        {
          model: Location,
          attributes: ['location'],
          required: true, // Use INNER JOIN
        },
        {
          model: Provider,
          attributes: ['provider'],
          required: true, // Use INNER JOIN
        },
      ],
      order: [[Provider, 'provider', 'ASC']],
    });

    if (slaList.length === 0) {
      throw new Error("Error getting SLA data");
    }

    return { list: slaList };
  } catch (error) {
    throw new Error("Error getting SLA data");
  }
}

/**
 * Get a list of coverage data.
 *
 * @returns {Object} A list of coverage data.
 * @throws {Error} If there are issues with retrieving coverage data.
 */
async function getCoverageData() {
  try {
    const coverageList = await Coverage.findAll({
      include: [
        {
          model: Location,
          attributes: ['location'],
          required: true, // Use INNER JOIN
        },
        {
          model: Provider,
          attributes: ['provider'],
          required: true, // Use INNER JOIN
        },
      ],
      order: [[Provider, 'provider', 'ASC']],
    });

    if (coverageList.length === 0) {
      throw new Error("Error getting coverage data");
    }

    return { list: coverageList };
  } catch (error) {
    throw new Error("Error getting coverage data");
  }
}

/**
 * Get a list of price data.
 *
 * @returns {Object} A list of price data.
 * @throws {Error} If there are issues with retrieving price data.
 */
async function getPriceData() {
  try {
    const priceList = await Price.findAll({
      include: [
        {
          model: Location,
          attributes: ['location'],
          required: true, // Use INNER JOIN
        },
        {
          model: Provider,
          attributes: ['provider'],
          required: true, // Use INNER JOIN
        },
      ],
      order: [[Provider, 'provider', 'ASC']],
    });

    if (priceList.length === 0) {
      throw new Error("Error getting price data");
    }

    return { list: priceList };
  } catch (error) {
    throw new Error("Error getting price data");
  }
}

/**
 * Get a list of providers.
 *
 * @returns {Object} A list of providers.
 * @throws {Error} If there are issues with retrieving providers.
 */
async function getProviders() {
  try {
    const providerList = await Provider.findAll();

    if (providerList.length === 0) {
      throw new Error("Error getting providers");
    }

    return { list: providerList };
  } catch (error) {
    throw new Error("Error getting providers");
  }
}

/**
 * Get installation information based on location.
 *
 * @param {Object} body - The request body containing 'location'.
 * @returns {Object} Installation information including the lowestPrice and associated days.
 * @throws {Error} If there are issues with retrieving installation information.
 */
async function getInstallationInfo(body) {
  try {
    const { location } = body;

    // Query for Coverage Providers
    const coverageProviders = await Coverage.findAll({
      include: [
        {
          model: Location,
          attributes: ['location'],
          required: true,
          where: {
            location,
          },
        },
        {
          model: Provider,
          attributes: ['provider'],
          required: true,
        },
      ],
    });

    if (coverageProviders.length === 0) {
      throw new Error("No coverage providers found for the given location.");
    }

    // Extract Provider IDs
    const providerIds = coverageProviders.map((provider) => provider.id_prov);

    // Query for the Lowest SLA
    const lowestSla = await Sla.findAll({
      where: {
        id_prov: providerIds,
      },
      include: [
        {
          model: Location,
          attributes: ['location'],
          where: {
            id: coverageProviders[0].id_loc,
          },
          required: true,
        },
        {
          model: Provider,
          attributes: ['provider'],
          required: true,
        },
      ],
      attributes: ['days', 'id_prov'],
      order: [['days', 'ASC']],
    });

    if (lowestSla.length === 0) {
      throw new Error("No SLAs found for the selected providers.");
    }

    // Extract Provider IDs with the Lowest SLA
    const lowestSlaProviderIds = lowestSla.map((sla) => sla.id_prov);

    // Query for the Lowest Price
    const lowestPrice = await Price.findAll({
      where: {
        id_prov: lowestSlaProviderIds,
      },
      include: [
        {
          model: Location,
          attributes: ['location'],
          where: {
            id: coverageProviders[0].id_loc,
          },
          required: true,
        },
        {
          model: Provider,
          attributes: ['provider'],
          required: true,
        },
      ],
      order: [['price', 'ASC']],
      limit: 1,
    });

    if (lowestPrice.length === 0) {
      throw new Error("No prices found for the selected providers.");
    }

    const resultProviderIds = lowestPrice.map((price) => price.id_prov);

    return {
      result: {
        lowestPrice,
        days: lowestSla.filter((sla) => resultProviderIds.includes(sla.id_prov)).map((sla) => sla.days),
      },
    };
  } catch (error) {
    throw new Error(`Error performing installation: ${error.message}`);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getInstallationInfo,
  getSLAData,
  getPriceData,
  getLocations,
  getCoverageData,
  getProviders,
};
