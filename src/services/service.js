const bcrypt = require("bcrypt");
const User = require("../models/user");
const Provider = require("../models/provider");
const Location = require("../models/locations");
const Sla = require("../models/sla");
const Coverage = require("../models/coverage");
const Price = require("../models/price");
const Installation = require("../models/installations");

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
    // Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user in the database
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
    // Find the user by their username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error("Invalid username");
    }

    // Check if the provided password matches the hashed password in the database
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
    // Retrieve a list of locations from the database
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
    // Retrieve a list of SLA data from the database, including related location and provider information
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
    // Retrieve a list of coverage data from the database, including related location and provider information
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
    // Retrieve a list of price data from the database, including related location and provider information
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
    // Retrieve a list of provider data from the database
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
async function getInstallationInfo(location) {
  try {
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
      lowestPrice,
      days: lowestSla.filter((sla) => resultProviderIds.includes(sla.id_prov)).map((sla) => sla.days),
    };
  } catch (error) {
    throw new Error(`Error performing installation: ${error.message}`);
  }
}

/**
 * Create a new installation based on provided data.
 *
 * @param {Object} body - The request body containing installation data.
 * @returns {Object} The created installation.
 * @throws {Error} If there are issues with creating the installation.
 */
async function createInstallation(body) {
  // Destructure input data
  const { location, address, branch_pic, area } = body;

  // Fetch installation information based on the provided area
  const installationInfo = await getInstallationInfo(area);

  try {
    // Create a new installation record in the database
    const installation = await Installation.create({
      location,
      address,
      branch_pic,
      price_id: installationInfo.lowestPrice[0].dataValues.id_price,
      area,
      days: installationInfo.days[0],
      provider: installationInfo.lowestPrice[0].provider.dataValues.provider,
      provider_id: installationInfo.lowestPrice[0].id_prov,
      price: installationInfo.lowestPrice[0].dataValues.price,
      area_id: installationInfo.lowestPrice[0].dataValues.id_loc,
    });

    console.log('Installation created:', installation.toJSON());
    return installation;
  } catch (error) {
    console.error('Error creating installation:', error);
    throw new Error('Error creating installation');
  }
}

/**
 * Get a list of installations.
 *
 * @returns {Array} A list of installations.
 * @throws {Error} If there are issues with retrieving installation data.
 */
async function getInstallationList() {
  try {
    // Fetch all installation records from the database
    const installations = await Installation.findAll(
      {
        order:[['status', 'ASC'],['createdAt', 'DESC']]
      }
    );
    return installations;
  } catch (error) {
    console.error('Error fetching installation list:', error);
    throw new Error('Error fetching installation list');
  }
}

/**
 * Get installation by ID.
 *
 * @param {Object} body - The request body containing 'id'.
 * @returns {Array} A list of installations matching the provided ID.
 * @throws {Error} If there are issues with retrieving installation data.
 */
async function getInstallationById(body) {
  const { id } = body;
  try {
    // Fetch all installation records matching the provided ID
    const installation = await Installation.findAll({
      where: {
        id: id,
      }
    });
    return installation;
  } catch (error) {
    console.error('Error fetching installation list:', error);
    throw new Error('Error fetching installation list');
  }
}

/**
 * Update installation status to "approved" by ID if it's currently "pending".
 *
 * @param {Object} body - The request body containing 'id'.
 * @returns {Object} A success message if the update is successful.
 * @throws {Error} If there are issues with updating the installation.
 */
async function updateInstallation(body) {
  const { id } = body;
  try {
    // Update installation status to "approved" if it's currently "pending"
    const updateInstallation = await Installation.update(
      {
        status: "approved",
      },
      {
        where: {
          status: "pending",
          id: id,
        }
      }
    )
    if (updateInstallation[0] === 1) {
      return updateInstallation;
    }
  } catch (error) {
    console.error('Error updating installation list:', error);
    throw new Error('Error updating installation list');
  }
}

/**
 * Override an installation's data and set status to "approved" if it's currently "pending".
 *
 * @param {Object} body - The request body containing 'id', 'id_prov', 'days', 'provider', 'id_price', 'price'.
 * @returns {Object} A success message if the override is successful.
 * @throws {Error} If there are issues with updating the installation.
 */
async function overrideInstallation(body) {
  const { id, id_prov, days, provider, id_price, price } = body;
  try {
    // Update installation with new information and set status to "approved" if it's currently "pending"
    const results = await Installation.update({
      provider: provider,
      provider_id: id_prov,
      days: days,
      price_id: id_price,
      price: price,
      status: "approved"
    },
    {
      where: {
        id: id,
        status: "pending"
      }
    });
    return results;
  } catch (error) {
    console.error('Error updating installation list:', error);
    throw new Error('Error updating installation list');
  }
}

/**
 * Get installation provider based on a location.
 *
 * @param {String} location - The location for which to find the installation provider.
 * @returns {Object} Installation provider information.
 * @throws {Error} If there are issues with finding the installation provider.
 */
async function getInstallationProvider(location) {
  try {
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
      limit: 4,
    });

    if (lowestPrice.length === 0) {
      throw new Error("No prices found for the selected providers.");
    }

    const resultProviderIds = lowestPrice.map((price) => price.id_prov);

    return {
      lowestPrice,
      days: lowestSla.filter((sla) => resultProviderIds.includes(sla.id_prov)).map((sla) => sla.days),
    };
  } catch (error) {
    throw new Error(`Error performing installation: ${error.message}`);
  }
}

module.exports = {
  registerUser,
  getInstallationProvider,
  updateInstallation,
  loginUser,
  getInstallationList,
  overrideInstallation,
  getInstallationInfo,
  getSLAData,
  getInstallationById,
  getPriceData,
  createInstallation,
  getLocations,
  getCoverageData,
  getProviders,
};
