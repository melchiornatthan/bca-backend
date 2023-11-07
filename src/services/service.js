const bcrypt = require("bcrypt");
const User = require("../models/user");
const Provider = require("../models/provider");
const Location = require("../models/locations");
const Sla = require("../models/sla");
const Coverage = require("../models/coverage");
const Price = require("../models/price");
const Installation = require("../models/installations");
const Relocation = require("../models/relocation");
const Dismantle = require("../models/dismantle");
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const e = require("express");

/**
 * Registers a new user.
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
 * Authenticates and logs in a user.
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
 * Gets a list of locations.
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
 * Gets a list of SLA data.
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
 * Gets a list of coverage data.
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
 * Gets a list of price data.
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
 * Gets a list of providers.
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

async function getRequestCount() {
  try {
    // Retrieve a list of provider data from the database
    const installation = await Installation.count({
      where: {
        status: ['pending'],
      },
    });

    const relocation = await Relocation.count({
      where: {
        status: ['pending'],
      },
    });

    const dismantle = await Dismantle.count({
      where: {
        status: ['pending'],
      },
    });
 
     return {
        installation : installation,
        relocation : relocation,
        dismantle : dismantle,
     };
  } catch (error) {
    throw new Error("Error getting count");
  }
}

async function getProvidersCount() {
  try {
    // Retrieve a list of provider data from the database
    const allProviders = await Provider.findAll({ attributes: ['provider'] });
    const installationCounts = await Installation.findAll({
      attributes: ['provider', [sequelize.fn('count', sequelize.col('provider')), 'count']],
      group: ['provider'],
      where: {
        status: ['approved'],
      },
      raw: true,
    });

     // Create an object to store provider counts
     const providerCounts = {};

     // Initialize provider counts with 0 for all providers
     allProviders.forEach(provider => {
       providerCounts[provider.provider] = 0;
     });
 
     // Update provider counts based on the Installation data
     installationCounts.forEach(count => {
       providerCounts[count.provider] = count.count;
     });
 
     return providerCounts;
  } catch (error) {
    throw new Error("Error getting count");
  }
}

/**
 * Gets installation information based on location.
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
      limit: 2,
    });

    if (lowestPrice.length === 0) {
      throw new Error("No prices found for the selected providers.");
    }

    let bestProvider = null;
    let lowestCount = Infinity;

    if (lowestPrice.length === 2) {
      for (const provider of lowestPrice) {
        const providerCount = await Installation.count({
          where: {
            provider_id: provider.id_prov,
            status: ['approved', 'pending'],
          },
        });

        if (providerCount < lowestCount) {
          lowestCount = providerCount;
          bestProvider = provider;
          bestProviderSlaDays = lowestSla.find(sla => sla.id_prov === provider.id_prov).days;
        }
      }
    }
    return {
      bestProvider,
      days: bestProviderSlaDays,
    };
  } catch (error) {
    throw new Error(`Error performing installation: ${error.message}`);
  }
}

/**
 * Creates a new installation based on provided data.
 *
 * @param {Object} body - The request body containing installation data.
 * @returns {Object} The created installation.
 * @throws {Error} If there are issues with creating the installation.
 */
async function createInstallation(body) {
  // Destructure input data
  const { location, address, branch_pic, area, batchid, createdAt } = body;

  // Fetch installation information based on the provided area
  const installationInfo = await getInstallationInfo(area);

  try {
    console.log(installationInfo.bestProvider.dataValues);
    // Create a new installation record in the database
    const installation = await Installation.create({
      createdAt: createdAt,
      location,
      address,
      batchid: batchid,
      branch_pic,
      price_id: installationInfo.bestProvider.dataValues.id_price,
      area,
      days: installationInfo.days,
      provider: installationInfo.bestProvider.dataValues.provider.dataValues.provider,
      provider_id: installationInfo.bestProvider.dataValues.id_prov,
      price: installationInfo.bestProvider.dataValues.price,
      area_id: installationInfo.bestProvider.dataValues.id_loc,
    });

    
    return {
      message: "Installation created successfully",
    };
  } catch (error) {
    console.error('Error creating installation:', error);
    throw new Error('Error creating installation');
  }
}

/**
 * Creates a new relocation record based on provided data.
 *
 * @param {Object} body - The request body containing relocation data.
 * @returns {Object} The created relocation record.
 * @throws {Error} If there are issues with creating the relocation record.
 */
async function createRelocation(body) {
  // Destructure input data
  const { old_location, new_location, old_area_id, new_area_id, old_branch_pic, new_branch_pic, old_communication, new_communication, old_area, new_area, old_address, new_address, installation_id } = body;
  console.log(old_location)
  try {
    const findInstallation = await Installation.findOne({
      where: {
        id: installation_id,
      },
    });
    if (!findInstallation) {
      return {
        message: "Installation not found",
      }
      throw new Error("Installation not found");
    }else{
    // Create a new relocation record in the database
    const relocation = await Relocation.create({
      old_location,
      new_location,
      old_area_id,
      new_area_id,
      old_branch_pic,
      new_branch_pic,
      old_communication,
      new_communication,
      old_area,
      new_area,
      old_address,
      new_address,
      installation_id,
    });

    const updateInstallation = await Installation.update(
      {
        relocation_status: true,
      },
      {
        where: {
          id: installation_id,
        },
      }
    );

    return {
      message: "Relocation created successfully",
    };
  }
  } catch (error) {
    console.error('Error creating Relocation:', error);
    throw new Error('Error creating Relocation');
  }
}

/**
 * Creates a new dismantle record based on provided data.
 *
 * @param {Object} body - The request body containing dismantle data.
 * @returns {Object} The created dismantle record.
 * @throws {Error} If there are issues with creating the dismantle record.
 */
async function createDismantle(body) {
  // Destructure input data
  const { installation_id } = body;
  try {
    
    const getLocation = await Installation.findOne({
      attributes: ['location'],
      where: {
        id: installation_id,
      },
    });

    if(!getLocation){
      return {
        message: "Installation not found",
      }
      throw new Error("Installation not found");
    }else{
    // Create a new dismantle record in the database
    const dismantle = await Dismantle.create({
      installation_id,
      location: getLocation.location,
    });
    const updateInstallation = await Installation.update(
      {
        dismantle_status: true,
      },
      {
        where: {
          id: installation_id,
        },
      }
    );

    return getLocation;
    }
  } catch (error) {
    console.error('Error creating Dismantle:', error);
    throw new Error('Error creating Dismantle');
  }
}

/**
 * Gets a list of installations.
 *
 * @returns {Array} A list of installations.
 * @throws {Error} If there are issues with retrieving installation data.
 */
async function getInstallationList() {
  try {
    // Fetch all installation records from the database
    const installations = await Installation.findAll({
      attributes: ['id', 'location', 'communication', 'address', 'batchid', 'branch_pic', 'status', 'provider', 'area', 'relocation_status', 'dismantle_status'],
      order: [['status', 'ASC'], ['createdAt', 'DESC']],
    });
    return installations;
  } catch (error) {
    console.error('Error fetching installation list:', error);
    throw new Error('Error fetching installation list');
  }
}

async function getInstallationFiltered() {
  try {
    // Fetch all installation records from the database
    const approvedInstallations = await Installation.findAll({
      attributes: ['batchid'],
      order: [['createdAt', 'DESC']],
      where: {
        status: "approved",
      }
    });

    const pendingInstallations = await Installation.findAll({
      attributes: ['batchid'],
      order: [['createdAt', 'DESC']],
      where: {
        status: "pending",
      }
    });

    const installationsWithSameBatchId = [];

    // Iterate through 'approvedInstallations' and 'pendingInstallations'
    approvedInstallations.forEach(approvedInstallation => {
      const batchIdToSearch = approvedInstallation.batchid;
      
      // Find matching installations in 'pendingInstallations' based on 'batchid'
      const matchingPendingInstallation = pendingInstallations.find(pendingInstallation => pendingInstallation.batchid === batchIdToSearch);
      
      if (matchingPendingInstallation) {
        // If a matching 'pendingInstallation' is found, add it to the result array
        installationsWithSameBatchId.push(batchIdToSearch);
      }
    });
    
    console.log(installationsWithSameBatchId);
    const installationsWithUniqueBatchId = await Installation.findAll({
      attributes: ['id', 'location', 'communication', 'address', 'branch_pic', 'provider', 'area', 'relocation_status', 'dismantle_status'],
      where: {
        batchid: {
          [Op.not]: installationsWithSameBatchId,
        },
        status: "approved",
      }
    });

    return installationsWithUniqueBatchId;
    
  } catch (error) {
    console.error('Error fetching installation list:', error);
    throw new Error('Error fetching installation list');
  }
}



/**
 * Gets an installation by its ID.
 *
 * @param {Object} id - The request body containing 'id'.
 * @returns {Array} A list of installations matching the provided ID.
 * @throws {Error} If there are issues with retrieving installation data.
 */
async function getInstallationById(id) {
  try {
    // Fetch all installation records matching the provided ID
    const installation = await Installation.findAll({
      attributes: ['id', 'area_id','location', 'communication', 'address', 'batchid', 'branch_pic', 'status', 'provider', 'area', 'relocation_status', 'dismantle_status'],
      where: {
        id: id,
      },
    });
    return installation;
  } catch (error) {
    console.error('Error fetching installation list:', error);
    throw new Error('Error fetching installation list');
  }
}

async function getLocationByName(location) {
  try {
    // Fetch all installation records matching the provided ID
    const locationId = await Location.findAll({
      attributes: ['id'],
      where: {
        location: location,
      },
    });
    return locationId;
  } catch (error) {
    console.error('Error fetching Location list:', error);
    throw new Error('Error fetching Location list');
  }
}

async function getRelocations() {
  try {
    // Fetch all installation records matching the provided ID
    const RelocList = await Relocation.findAll({
      order: [['status', 'ASC'], ['createdAt', 'DESC']],
    });
    return RelocList;
  } catch (error) {
    console.error('Error fetching Relocation list:', error);
    throw new Error('Error fetching Relocation list');
  }
}

async function getRelocationsById(id) {
  try {
    // Fetch all installation records matching the provided ID
    const RelocList = await Relocation.findOne({
      where: {
        id: id,
      },
    });
    return RelocList;
  } catch (error) {
    console.error('Error fetching Relocation list:', error);
    throw new Error('Error fetching Relocation list');
  }
}

async function getDismantles() {
  try {
    // Fetch all installation records matching the provided ID
    const DismantleList = await Dismantle.findAll({
      order: [['status', 'ASC'], ['createdAt', 'DESC']],
      include: [
        {
          model: Installation,
          attributes: ['location'],
          required: true,
        },]
    });
    return DismantleList;
  } catch (error) {
    console.error('Error fetching Dismantle list:', error);
    throw new Error('Error fetching Dismantle list');
  }
}


/**
 * Updates an installation's status to "approved" by ID if it's currently "pending".
 *
 * @param {Object} id - The request body containing 'id'.
 * @returns {Object} A success message if the update is successful.
 * @throws {Error} If there are issues with updating the installation.
 */
async function updateInstallation(id) {
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
        },
      }
    );
    if (updateInstallation[0] === 1) {
      return updateInstallation;
    }
  } catch (error) {
    console.error('Error updating installation list:', error);
    throw new Error('Error updating installation list');
  }
}

/**
 * Updates a relocation record's status to "approved" and updates the corresponding installation information if it's currently "pending".
 *
 * @param {Object} body - The request body containing 'id', 'installation_id', 'new_location', 'new_address'.
 * @returns {Object} A success message if the update is successful.
 * @throws {Error} If there are issues with updating the relocation record.
 */
async function updateRelocation(body) {
  const { id, installation_id, new_location, new_address, new_area, new_area_id, new_branch_pic, new_communication } = body;
  try {
    // Update the relocation record's status to "approved" if it's currently "pending"
    const updateRelocation = await Relocation.update(
      {
        status: "approved",
      },
      {
        where: {
          status: "pending",
          id,
        },
      }
    );
    if (updateRelocation[0] === 1) {
      // Update the corresponding installation information with the new location and address
      const updateInstallation = await Installation.update(
        {
          location: new_location,
          address: new_address,
          area: new_area,
          area_id: new_area_id,
          branch_pic: new_branch_pic,
          communication: new_communication,
          relocation_status: false,
        },
        {
          where: {
            id: installation_id,
          },
        }
      );
      return updateInstallation;
    }
  } catch (error) {
    console.error('Error updating Relocation list:', error);
    throw new Error('Error updating Relocation list');
  }
}

/**
 * Updates a dismantle record's status to "approved" and deletes the corresponding installation record if it's currently "pending".
 *
 * @param {Object} body - The request body containing 'installation_id' and 'id'.
 * @returns {Object} A success message if the update is successful.
 * @throws {Error} If there are issues with updating the dismantle record.
 */
async function updateDismantle(body) {
  const { installation_id, id } = body;
  try {
    // Update the dismantle record's status to "approved" if it's currently "pending"
    const updateDismantle = await Dismantle.update(
      {
        status: "approved",
      },
      {
        where: {
          status: "pending",
          id,
        },
      }
    );
    if (updateDismantle[0] === 1) {
      // Delete the corresponding installation record
      const updateInstallation = await Installation.update(
        {
          status: 'dismantled'
        },
        {
          where: {
            id: installation_id,
          },

        });
      return updateInstallation;
    }
  } catch (error) {
    console.error('Error updating Dismantle list:', error);
    throw new Error('Error updating Dismantle list');
  }
}

/**
 * Gets the batch ID of the latest installation.
 *
 * @returns {Object} The latest batch ID.
 * @throws {Error} If there are issues with getting the batch ID.
 */
async function getBatchId() {
  try {
    // Get the batch ID of the latest installation
    const getBatchId = await Installation.findOne({
      order: [['batchid', 'DESC']],
      attributes: ['batchid'],
      limit: 1,
    });
    return getBatchId;
  } catch (error) {
    console.error('Error getting batch ID', error);
    throw new Error('Error getting batch ID');
  }
}

/**
 * Gets a list of providers for a specific location.
 *
 * @param {Number} id_loc - The location ID for which to retrieve providers.
 * @returns {Object} A list of providers for the specified location.
 * @throws {Error} If there are issues with retrieving provider data.
 */
async function getProvidersbyArea(id_loc) {
  try {
    // Get a list of providers for the specified location
    const getBatchList = await Price.findAll({
      include: [
        {
          model: Provider,
          attributes: ['provider', 'id'],
          required: true,
        },
      ],
      where: {
        id_loc: id_loc,
      },
      attributes: [],
    });

    return {
      list: getBatchList,
    };
  } catch (error) {
    console.error('Error getting provider List', error);
    throw new Error('Error getting provider List');
  }
}

/**
 * Gets a list of installations grouped by batch ID.
 *
 * @returns {Array} A list of installations grouped by batch ID.
 * @throws {Error} If there are issues with retrieving installation data.
 */
async function getBatchInstallation() {
  try {
    // Get a list of installations grouped by batch ID
    const getBatchList = await Installation.findAll({
      order: [['createdAt', 'DESC'], ['status', 'ASC']],
      attributes: ['batchid', 'status', 'createdAt'],
      group: ['batchid', 'status', 'createdAt'],
    });

    // Create an array to store unique batch IDs
    const uniqueBatchIds = new Set();

    // Filter installations to keep only the first occurrence of each batch ID
    const filteredList = getBatchList.filter((installation) => {
      if (!uniqueBatchIds.has(installation.batchid)) {
        uniqueBatchIds.add(installation.batchid);
        return true;
      }
      return false;
    });

    // Delete duplicate installations
    for (const installation of getBatchList) {
      if (!filteredList.some((item) => item.batchid === installation.batchid)) {
        // Delete the installation with the same batch ID
        await Installation.destroy({ where: { batchid: installation.batchid } });
      }
    }

    return filteredList;
  } catch (error) {
    console.error('Error getting batch List', error);
    throw new Error('Error getting batch List');
  }
}

/**
 * Gets a list of installations for a specific batch ID.
 *
 * @param {String} batchid - The batch ID for which to retrieve installations.
 * @returns {Array} A list of installations for the specified batch ID.
 * @throws {Error} If there are issues with retrieving installation data.
 */
async function getInstallationbyBatch(batchid) {
  try {
    // Get a list of installations for the specified batch ID
    const getBatchList = await Installation.findAll({
      attributes: ['id', 'location', 'communication', 'address', 'batchid', 'branch_pic', 'status', 'provider', 'area'],
      where: { batchid: batchid },
    });
    return getBatchList;
  } catch (error) {
    console.error('Error getting batch List', error);
    throw new Error('Error getting batch List');
  }
}

/**
 * Overrides an installation's data and sets its status to "approved" if it's currently "pending".
 *
 * @param {Object} body - The request body containing 'id', 'id_prov', 'location'.
 * @returns {Object} A success message if the override is successful.
 * @throws {Error} If there are issues with updating the installation.
 */
async function overrideInstallation(body) {
  const { id, id_prov, location } = body;
  try {
    const newProvider = await getInstallationProvider(location, id_prov);
    // Update the installation with new information and set its status to "approved" if it's currently "pending"
    const results = await Installation.update(
      {
        provider: newProvider.lowestPrice[0].provider.provider,
        provider_id: id_prov,
        days: newProvider.days[0],
        price_id: newProvider.lowestPrice[0].id_price,
        price: newProvider.lowestPrice[0].price,
        status: "approved",
      },
      {
        where: {
          id: id,
          status: "pending",
        },
      }
    );

    // const updateTable = await updateInstallationsProvider();
    return results;
  } catch (error) {
    console.error('Error updating installation list:', error);
    throw new Error('Error updating installation list');
  }
}

async function updateInstallationsProvider() {
  try {
    // Update the installation with new information and set its status to "approved" if it's currently "pending"
    const results = await Installation.findAll(
      {
        where: {
          status: "pending",
        },
      }
    );

    results.forEach(async (installation) => {
      const newProvider = await getInstallationInfo(installation.area);
      await Installation.update(
        {
          provider: newProvider.bestProvider.dataValues.provider.dataValues.provider,
          provider_id: newProvider.bestProvider.dataValues.provider.dataValues.id_prov,
          days: newProvider.days,
          price_id: newProvider.bestProvider.dataValues.provider.dataValues.id_price,
          price: newProvider.bestProvider.dataValues.provider.dataValues.price,
        },
        {
          where: {
            id: installation.id,
          },
        }
      );
      console.log(installation.id)
    });
    return results;
  } catch (error) {
    console.error('Error updating installation list:', error);
    throw new Error('Error updating installation list');
  }
}

async function getInstallationProvider(location, id_prov) {
  try {
    console.log(id_prov)
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
          where: {
            id: id_prov
          }
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
  updateDismantle,
  updateInstallation,
  loginUser,
  getBatchInstallation,
  getInstallationList,
  overrideInstallation,
  getInstallationProvider,
  getInstallationInfo,
  getSLAData,
  getCoverageData,
  getPriceData,
  createInstallation,
  createRelocation,
  createDismantle,
  getProvidersCount,
  updateRelocation,
  getProvidersbyArea,
  getRelocationsById,
  getProviders,
  getInstallationById,
  getDismantles,
  getLocations,
  getRequestCount,
  getRelocations,
  getBatchId,
  getLocationByName,
  getInstallationbyBatch,
  getInstallationFiltered,
};