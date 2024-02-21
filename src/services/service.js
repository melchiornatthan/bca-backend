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
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");

/**
 * Registers a new user.
 *
 * @param {Object} body - The request body containing 'username' and 'password'.
 * @returns {Object} A success message if the user is registered successfully.
 * @throws {Error} If there are issues with user registration.
 */
async function registerUser(body) {
  const { username, password, isAdmin } = body;

  try {
    // Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      username,
      password: hashedPassword,
      isAdmin,
    });

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
    const payload = {
      userId: user.dataValues.id, // You can customize the payload based on your user object
      username: user.dataValues.username,
      isAdmin: user.dataValues.isAdmin,
      // Add any other relevant information about the user
    };
    const token = jwt.sign(payload, "BCA", { expiresIn: "1h" });

    return {
      message: "User logged in successfully",
      token: token,
      isAdmin: user.dataValues.isAdmin,
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
    const location = await Location.findAll();
    const locations = location.filter(
      (location) => location.location === location.province
    );

    if (locations.length === 0) {
      throw new Error("Error getting locations");
    }

    return { list: locations };
  } catch (error) {
    throw new Error("Error getting locations");
  }
}

async function getLocationsSpecial() {
  try {
    // Retrieve a list of locations from the database
    const location = await Location.findAll();
    const locations = location.filter(
      (location) => location.location !== location.province
    );

    if (locations.length === 0) {
      throw new Error("Error getting locations");
    }

    return { list: locations };
  } catch (error) {
    throw new Error("Error getting locations");
  }
}

async function getInstallationbyLocation(location) {
  try {
    // Retrieve a list of locations from the database
    const Installations = await Installation.findAll({
      attributes: [
        "id",
        "location",
        "communication",
        "address",
        "branch_pic",
        "status",
        "provider",
        "area",
      ],
      where: {
        status: "approved",
        dismantle_status: false,
        relocation_status: false,
        location: {
          [Op.iLike]: `%${location}%`, // Using Op.iLike for case-insensitive matching
        },
      },
    });

    return Installations;
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
          attributes: ["location"],
          required: true, // Use INNER JOIN
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true, // Use INNER JOIN
        },
      ],
      order: [[Provider, "provider", "ASC"]],
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
          attributes: ["location"],
          required: true, // Use INNER JOIN
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true, // Use INNER JOIN
        },
      ],
      order: [[Provider, "provider", "ASC"]],
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
          attributes: ["location"],
          required: true, // Use INNER JOIN
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true, // Use INNER JOIN
        },
      ],
      order: [[Provider, "provider", "ASC"]],
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
    // Retrieve unique batch IDs for each status from the database
    const uniqueInstallationBatchIds = await Installation.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("batchid")), "batchid"],
      ],
      where: {
        status: ["pending"],
      },
    });

    const uniqueRelocationBatchIds = await Relocation.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("batchid")), "batchid"],
      ],
      where: {
        status: ["pending"],
      },
    });

    const uniqueDismantleBatchIds = await Dismantle.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("batchid")), "batchid"],
      ],
      where: {
        status: ["pending"],
      },
    });

    // Count the number of unique batch IDs
    const installationCount = uniqueInstallationBatchIds.length;
    const relocationCount = uniqueRelocationBatchIds.length;
    const dismantleCount = uniqueDismantleBatchIds.length;

    return {
      installation: installationCount,
      relocation: relocationCount,
      dismantle: dismantleCount,
    };
  } catch (error) {
    throw new Error("Error getting count");
  }
}

async function getProvidersCount() {
  try {
    // Retrieve a list of provider data from the database
    const allProviders = await Provider.findAll({ attributes: ["provider"] });
    const installationCounts = await Installation.findAll({
      attributes: [
        "provider",
        [sequelize.fn("count", sequelize.col("provider")), "count"],
      ],
      group: ["provider"],
      where: {
        status: ["approved"],
      },
      raw: true,
    });

    // Create an object to store provider counts
    const providerCounts = {};

    // Initialize provider counts with 0 for all providers
    allProviders.forEach((provider) => {
      providerCounts[provider.provider] = 0;
    });

    // Update provider counts based on the Installation data
    installationCounts.forEach((count) => {
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
          attributes: ["location"],
          required: true,
          where: {
            location,
          },
        },
        {
          model: Provider,
          attributes: ["provider"],
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
          attributes: ["location"],
          where: {
            id: coverageProviders[0].id_loc,
          },
          required: true,
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true,
        },
      ],
      attributes: ["days", "id_prov"],
      order: [["days", "ASC"]],
    });

    if (lowestSla.length === 0) {
      throw new Error("No SLAs found for the selected providers.");
    }

    // Query for the Lowest Price
    const lowestPrice = await Price.findAll({
      where: {
        id_prov: lowestSlaProviderIds,
      },
      include: [
        {
          model: Location,
          attributes: ["location"],
          where: {
            id: coverageProviders[0].id_loc,
          },
          required: true,
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true,
        },
      ],
      order: [["price", "ASC"]],
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
            status: ["approved", "pending"],
          },
        });

        if (providerCount < lowestCount) {
          lowestCount = providerCount;
          bestProvider = provider;
          bestProviderSlaDays = lowestSla.find(
            (sla) => sla.id_prov === provider.id_prov
          ).days;
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

async function getInstallationInfoNew(location) {
  try {
    const providers = await Provider.findAll();
    const filteredProviders = await Promise.all(
      providers.map(async (provider) => {
        const count = await Installation.count({
          where: {
            provider_id: provider.id,
            status: ["approved", "pending"],
          },
        });
        return count < 10 ? provider.id : null;
      })
    );

    const filteredProviderIds = filteredProviders.filter((id) => id !== null);

    const coverageTable = await Coverage.findAll({
      attributes: ["avail", "id_loc", "id_prov"],
      include: [
        {
          model: Location,
          attributes: ["location"],
          where: { location },
          required: true,
        },
        {
          model: Provider,
          attributes: ["provider"],
          where: { id: filteredProviderIds },
          required: true,
        },
      ],
    });

    const availableProviders = coverageTable.map(
      (provider) => provider.id_prov
    );

    const lowestSla = await Sla.findAll({
      where: { id_prov: availableProviders },
      include: [
        {
          model: Location,
          attributes: ["location", "province"],
          where: { location },
          required: true,
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true,
        },
      ],
      attributes: ["days", "id_prov", "id_loc"],
      order: [["days", "ASC"]],
    });

    const bestSla = lowestSla[0];
    const sameSlas = lowestSla.filter(
      (provider) => provider.days === bestSla.days
    );

    const lowestPrice = await Price.findAll({
      attributes: ["id_price", "price", "id_prov", "id_loc"],
      where: {
        id_prov: sameSlas.map((provider) => provider.id_prov),
        id_loc: coverageTable[0].id_loc,
      },
      order: [["price", "ASC"]],
    });

    const bestPrice = lowestPrice[0];
    const samePrice = lowestPrice.filter(
      (provider) => provider.price === bestPrice.price
    );

    const findProvince = await Location.findOne({
      attributes: ["province"],
      where: {
        id: coverageTable[0].id_loc,
      },
    });

    const province = findProvince.province;

    const providerCountPromises = samePrice.map((provider) =>
      Installation.count({
        where: {
          provider_id: provider.id_prov,
          status: ["approved", "pending"],
          province,
        },
      })
    );

    const providerCounts = await Promise.all(providerCountPromises);

    const lowestCountProvince = Math.min(...providerCounts);
    const bestProviderProvinceIndex =
      providerCounts.indexOf(lowestCountProvince);
    const bestProviderProvince = samePrice[bestProviderProvinceIndex];

    const bestProviderCountPromises = samePrice.map((provider) =>
      Installation.count({
        where: {
          provider_id: provider.id_prov,
          status: ["approved", "pending"],
        },
      })
    );

    const providerCountsAll = await Promise.all(bestProviderCountPromises);

    const lowestCount = Math.min(...providerCountsAll);
    const bestProviderIndex = providerCountsAll.indexOf(lowestCount);
    const bestProvider = samePrice[bestProviderIndex];
    const bestProviderDays = lowestSla.find(
      (sla) => sla.id_prov === bestProvider.id_prov
    );
    const bestProviderPrice = lowestPrice.find(
      (sla) => sla.id_prov === bestProvider.id_prov
    );

    return {
      bestProviderDays,
      bestProviderPrice,
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
  const {
    location,
    address,
    branch_pic,
    area,
    batchid,
    createdAt,
    communication,
  } = body;
  const installationInfo = await getInstallationInfoNew(area);
  if (communication === "M2M") {
    const installation = await Installation.create({
      createdAt: createdAt,
      location,
      address,
      batchid: batchid,
      branch_pic,
      area,
      area_id: installationInfo.bestProviderPrice.id_loc,
      province: installationInfo.bestProviderDays.location.province,
      communication: "M2M",
      provider: "Telkomsel",
      provider_id: 5,
    });

    return {
      message: installation,
    };
  }

  // Fetch installation information based on the provided area
  if (installationInfo.bestProviderPrice === undefined) {
    return {
      message: "No provider available",
    };
  }

  try {
    // Create a new installation record in the database
    const installation = await Installation.create({
      createdAt: createdAt,
      location,
      address,
      batchid: batchid,
      branch_pic,
      price_id: installationInfo.bestProviderPrice.id_price,
      area,
      days: installationInfo.bestProviderDays.days,
      provider: installationInfo.bestProviderDays.provider.provider,
      provider_id: installationInfo.bestProviderDays.id_prov,
      price: installationInfo.bestProviderPrice.price,
      area_id: installationInfo.bestProviderPrice.id_loc,
      province: installationInfo.bestProviderDays.location.province,
    });

    return {
      message: installation,
    };
  } catch (error) {
    console.error("Error creating installation:", error);
    throw new Error("Error creating installation");
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
  const {
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
    batchid,
    createdAt,
  } = body;
  try {
    const findInstallation = await Installation.findOne({
      where: {
        id: installation_id,
      },
    });

    if (!findInstallation) {
      return {
        message: "Installation not found",
      };
    } else {
      // Create a new relocation record in the database
      const relocation = await Relocation.create({
        old_location,
        new_location,
        createdAt,
        old_area_id,
        batchid,
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
        provider: findInstallation.dataValues.provider,
        provider_id: findInstallation.dataValues.provider_id,
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
    console.error("Error creating Relocation:", error);
    throw new Error("Error creating Relocation");
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
  const { installation_id, createdAt, batchid } = body;
  try {
    const getLocation = await Installation.findOne({
      attributes: ["location", "provider", "provider_id"],
      where: {
        id: installation_id,
      },
    });

    if (!getLocation) {
      return {
        message: "Installation not found",
      };
      throw new Error("Installation not found");
    } else {
      // Create a new dismantle record in the database
      const dismantle = await Dismantle.create({
        installation_id,
        location: getLocation.location,
        createdAt,
        batchid,
        provider: getLocation.dataValues.provider,
        provider_id: getLocation.dataValues.provider_id,
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
    console.error("Error creating Dismantle:", error);
    throw new Error("Error creating Dismantle");
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
      attributes: [
        "id",
        "location",
        "communication",
        "address",
        "batchid",
        "branch_pic",
        "status",
        "provider",
        "area",
        "relocation_status",
        "dismantle_status",
        "createdAt",
      ],
      order: [
        ["status", "ASC"],
        ["createdAt", "DESC"],
      ],
      where: {
        dismantle_status: false,
        relocation_status: false,
      },
    });
    return installations;
  } catch (error) {
    console.error("Error fetching installation list:", error);
    throw new Error("Error fetching installation list");
  }
}

/**
 * Retrieves a filtered list of installations based on specific criteria, including both approved and pending installations.
 *
 * @returns {Promise<Array>} - An array containing unique approved installations that do not have a pending counterpart.
 * @throws {Error} - Throws an error if there's an issue fetching the installation list.
 */
async function getInstallationFiltered() {
  try {
    // Fetch approved installations
    const approvedInstallations = await Installation.findAll({
      attributes: ["batchid"],
      order: [["createdAt", "DESC"]],
      where: {
        status: "approved",
      },
    });

    // Fetch pending installations
    const pendingInstallations = await Installation.findAll({
      attributes: ["batchid"],
      order: [["createdAt", "DESC"]],
      where: {
        status: "pending",
      },
    });

    // Create an array to store batch IDs with both approved and pending installations
    const installationsWithSameBatchId = [];

    // Iterate through approved installations and find matching pending installations
    approvedInstallations.forEach((approvedInstallation) => {
      const batchIdToSearch = approvedInstallation.batchid;

      // Find matching installations in pending installations based on batchid
      const matchingPendingInstallation = pendingInstallations.find(
        (pendingInstallation) => pendingInstallation.batchid === batchIdToSearch
      );

      if (matchingPendingInstallation) {
        // If a matching pending installation is found, add its batch ID to the result array
        installationsWithSameBatchId.push(batchIdToSearch);
      }
    });

    // Fetch unique approved installations that do not have a pending counterpart
    const installationsWithUniqueBatchId = await Installation.findAll({
      attributes: [
        "id",
        "location",
        "communication",
        "address",
        "branch_pic",
        "provider",
        "area",
        "relocation_status",
        "dismantle_status",
      ],
      where: {
        batchid: {
          [Op.not]: installationsWithSameBatchId,
        },
        status: "approved",
      },
    });

    return installationsWithUniqueBatchId;
  } catch (error) {
    console.error("Error fetching installation list:", error);
    throw new Error("Error fetching installation list");
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
      attributes: [
        "id",
        "area_id",
        "location",
        "communication",
        "address",
        "batchid",
        "branch_pic",
        "status",
        "provider",
        "area",
        "relocation_status",
        "dismantle_status",
      ],
      where: {
        id: id,
      },
      limit: 1,
    });
    return installation;
  } catch (error) {
    console.error("Error fetching installation list:", error);
    throw new Error("Error fetching installation list");
  }
}

/**
 * Retrieves the location ID for the given location name, considering specific criteria.
 *
 * @param {string} location - The name of the location.
 * @returns {Promise<Array>} - An array containing location ID(s) matching the provided name and criteria.
 * @throws {Error} - Throws an error if there's an issue fetching the location list.
 */
async function getLocationByName(location) {
  try {
    // Fetch location records matching the provided name and criteria
    const Installations = await Installation.findAll({
      attributes: ["id", "location"],
      where: {
        location: {
          [Op.iLike]: `%${location}%`, // Using Op.iLike for case-insensitive matching
        },
        status: "approved",
        dismantle_status: false,
        relocation_status: false,
      },
    });
    return Installations;
  } catch (error) {
    console.error("Error fetching location list:", error);
    throw new Error("Error fetching location list");
  }
}

/**
 * Retrieves a list of relocations, ordered by status and creation date.
 *
 * @returns {Promise<Array>} - An array containing relocation records.
 * @throws {Error} - Throws an error if there's an issue fetching the relocation list.
 */
async function getRelocations() {
  try {
    // Fetch relocation records ordered by status and creation date
    const relocationList = await Relocation.findAll({
      order: [
        ["status", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
    return relocationList;
  } catch (error) {
    console.error("Error fetching relocation list:", error);
    throw new Error("Error fetching relocation list");
  }
}

/**
 * Retrieves a specific relocation record by ID.
 *
 * @param {number} id - The ID of the relocation record.
 * @returns {Promise<object|null>} - An object containing the relocation record with the provided ID, or null if not found.
 * @throws {Error} - Throws an error if there's an issue fetching the relocation list.
 */
async function getRelocationsById(id) {
  try {
    // Fetch a specific relocation record by ID
    const relocationRecord = await Relocation.findOne({
      where: {
        id: id,
      },
    });
    return relocationRecord;
  } catch (error) {
    console.error("Error fetching relocation list:", error);
    throw new Error("Error fetching relocation list");
  }
}

/**
 * Retrieves a list of dismantles, ordered by status and creation date, including associated installation information.
 *
 * @returns {Promise<Array>} - An array containing dismantle records with associated installation information.
 * @throws {Error} - Throws an error if there's an issue fetching the dismantle list.
 */
async function getDismantles() {
  try {
    // Fetch dismantle records ordered by status and creation date, including associated installation information
    const dismantleList = await Dismantle.findAll({
      order: [
        ["status", "ASC"],
        ["createdAt", "DESC"],
      ],
      include: [
        {
          model: Installation,
          attributes: ["location"],
          required: true,
        },
      ],
    });
    return dismantleList;
  } catch (error) {
    console.error("Error fetching dismantle list:", error);
    throw new Error("Error fetching dismantle list");
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
    console.error("Error updating installation list:", error);
    throw new Error("Error updating installation list");
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
  const {
    id,
    installation_id,
    new_location,
    new_address,
    new_area,
    new_area_id,
    new_branch_pic,
    new_communication,
  } = body;
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
    console.error("Error updating Relocation list:", error);
    throw new Error("Error updating Relocation list");
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
          status: "dismantled",
          dismantle_status: false,
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
    console.error("Error updating Dismantle list:", error);
    throw new Error("Error updating Dismantle list");
  }
}

/**
 * Gets the batch ID of the latest installation.
 *
 * @returns {Object} The latest batch ID.
 * @throws {Error} If there are issues with getting the batch ID.
 */
async function getInstallationBatchId() {
  try {
    // Get the batch ID of the latest installation
    const getBatchId = await Installation.findOne({
      order: [["batchid", "DESC"]],
      attributes: ["batchid"],
      limit: 1,
    });

    // If getBatchId is null, return 2000000
    if (!getBatchId) {
      return {batchid : 2000000};
    }

    return getBatchId;
  } catch (error) {
    console.error("Error getting batch ID", error);
    throw new Error("Error getting batch ID");
  }
}


/**
 * Retrieves the batch ID of the latest dismantle.
 *
 * @returns {Promise<object|null>} - An object containing the batch ID of the latest dismantle, or null if none exists.
 * @throws {Error} - Throws an error if there's an issue retrieving the batch ID.
 */
async function getDismantleBatchId() {
  try {
    // Get the batch ID of the latest dismantle
    const latestDismantle = await Dismantle.findOne({
      order: [["batchid", "DESC"]],
      attributes: ["batchid"],
      limit: 1,
    });


    if (!latestDismantle) {
      return {batchid : 2000000};
    }

    return latestDismantle;
  } catch (error) {
    console.error("Error getting dismantle batch ID", error);
    throw new Error("Error getting dismantle batch ID");
  }
}

/**
 * Retrieves the batch ID of the latest relocation.
 *
 * @returns {Promise<object|null>} - An object containing the batch ID of the latest relocation, or null if none exists.
 * @throws {Error} - Throws an error if there's an issue retrieving the batch ID.
 */
async function getRelocationBatchId() {
  try {
    // Get the batch ID of the latest relocation
    const latestRelocation = await Relocation.findOne({
      order: [["batchid", "DESC"]],
      attributes: ["batchid"],
      limit: 1,
    });

    if (!latestRelocation) {
      return {batchid : 2000000};
    }

    return latestRelocation;
  } catch (error) {
    console.error("Error getting relocation batch ID", error);
    throw new Error("Error getting relocation batch ID");
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
          attributes: ["provider", "id"],
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
    console.error("Error getting provider List", error);
    throw new Error("Error getting provider List");
  }
}

/**
 * Gets a list of installations grouped by batch ID.
 *
 * @returns {Array} A list of installations grouped by batch ID.
 * @throws {Error} If there are issues with retrieving installation data.
 */
async function getBatchInstallation(batchid) {
  try {
    // Get a list of installations grouped by batch ID
    const getBatchList = await Installation.findAll({
      order: [
        ["createdAt", "DESC"],
        ["status", "ASC"],
      ],
      attributes: ["batchid", "status", "createdAt"],
      group: ["batchid", "status", "createdAt"],
    });

    const searchByBatchID = getBatchList.filter((installation) => {
      const lowerCaseBatchId = batchid.toLowerCase();

      // Check if the batchid contains the specified batchid (case-insensitive)
      if (installation.batchid.toLowerCase().includes(lowerCaseBatchId)) {
        return true;
      }
      return false;
    });

    // Create an array to store unique batch IDs
    const uniqueBatchIds = new Set();

    // Filter installations to keep only the first occurrence of each batch ID
    const filteredList = searchByBatchID.filter((installation) => {
      if (!uniqueBatchIds.has(installation.batchid)) {
        uniqueBatchIds.add(installation.batchid);
        return true;
      }
      return false;
    });

    return filteredList;
  } catch (error) {
    console.error("Error getting batch List", error);
    throw new Error("Error getting batch List");
  }
}

/**
 * Retrieves a list of batch relocations, grouped by batch ID.
 *
 * @returns {Promise<Array>} - A list of unique batch relocations, ordered by creation date and status.
 * @throws {Error} - Throws an error if there's an issue retrieving the batch list.
 */
async function getBatchRelocation(batchid) {
  try {
    // Get a list of relocations grouped by batch ID, ordered by creation date and status
    const getBatchList = await Relocation.findAll({
      order: [
        ["createdAt", "DESC"],
        ["status", "ASC"],
      ],
      attributes: ["batchid", "status", "createdAt"],
      group: ["batchid", "status", "createdAt"],
    });

    // Create a Set to store unique batch IDs
    const uniqueBatchIds = new Set();

    const searchByBatchID = getBatchList.filter((relocation) => {
      const lowerCaseBatchId = batchid.toLowerCase();

      // Check if the batchid contains the specified batchid (case-insensitive)
      if (relocation.batchid.toLowerCase().includes(lowerCaseBatchId)) {
        return true;
      }
      return false;
    });

    // Filter relocations to keep only the first occurrence of each batch ID
    const filteredList = searchByBatchID.filter((relocation) => {
      if (!uniqueBatchIds.has(relocation.batchid)) {
        uniqueBatchIds.add(relocation.batchid);
        return true;
      }
      return false;
    });

    return filteredList;
  } catch (error) {
    console.error("Error getting batch relocation list", error);
    throw new Error("Error getting batch relocation list");
  }
}

/**
 * Retrieves a list of batch dismantles, grouped by batch ID.
 *
 * @returns {Promise<Array>} - A list of unique batch dismantles, ordered by creation date and status.
 * @throws {Error} - Throws an error if there's an issue retrieving the batch list.
 */
async function getBatchDismantle(batchid) {
  try {
    // Get a list of dismantles grouped by batch ID, ordered by creation date and status
    const getBatchList = await Dismantle.findAll({
      order: [
        ["createdAt", "DESC"],
        ["status", "ASC"],
      ],
      attributes: ["batchid", "status", "createdAt"],
      group: ["batchid", "status", "createdAt"],
    });

    // Create a Set to store unique batch IDs
    const uniqueBatchIds = new Set();

    const searchByBatchID = getBatchList.filter((dismantle) => {
      const lowerCaseBatchId = batchid.toLowerCase();

      // Check if the batchid contains the specified batchid (case-insensitive)
      if (dismantle.batchid.toLowerCase().includes(lowerCaseBatchId)) {
        return true;
      }
      return false;
    });

    // Filter dismantles to keep only the first occurrence of each batch ID
    const filteredList = searchByBatchID.filter((dismantle) => {
      if (!uniqueBatchIds.has(dismantle.batchid)) {
        uniqueBatchIds.add(dismantle.batchid);
        return true;
      }
      return false;
    });

    return filteredList;
  } catch (error) {
    console.error("Error getting batch dismantle list", error);
    throw new Error("Error getting batch dismantle list");
  }
}


/**
 * Retrieves a list of installations for the specified batch ID.
 *
 * @param {number} batchid - The ID of the batch for which installations are requested.
 * @returns {Promise<Array>} - A list of installations matching the specified batch ID.
 * @throws {Error} - Throws an error if there's an issue retrieving the batch list.
 */
async function getInstallationbyBatch(batchid) {
  try {
    // Get a list of installations for the specified batch ID
    const installationList = await Installation.findAll({
      attributes: [
        "id",
        "location",
        "communication",
        "address",
        "batchid",
        "branch_pic",
        "status",
        "provider",
        "area",
      ],
      where: { batchid: batchid },
    });
    return installationList;
  } catch (error) {
    console.error("Error getting installation list", error);
    throw new Error("Error getting installation list");
  }
}

/**
 * Retrieves a list of relocations for the specified batch ID.
 *
 * @param {number} batchid - The ID of the batch for which relocations are requested.
 * @returns {Promise<Array>} - A list of relocations matching the specified batch ID.
 * @throws {Error} - Throws an error if there's an issue retrieving the batch list.
 */
async function getRelocationbyBatchId(batchid) {
  try {
    // Get a list of relocations for the specified batch ID
    const relocationList = await Relocation.findAll({
      where: { batchid: batchid },
    });

    return relocationList;
  } catch (error) {
    console.error("Error getting installation IDs", error);
    throw new Error("Error getting installation IDs");
  }
}


/**
 * Retrieves a list of dismantles for the specified batch ID.
 *
 * @param {number} batchid - The ID of the batch for which dismantles are requested.
 * @returns {Promise<Array>} - A list of dismantles matching the specified batch ID.
 * @throws {Error} - Throws an error if there's an issue retrieving the batch list.
 */
async function getDismantlebyBatchId(batchid) {
  try {
    // Get a list of dismantles for the specified batch ID
    const dismantleList = await Dismantle.findAll({
      where: { batchid: batchid },
    });
    return dismantleList;
  } catch (error) {
    console.error("Error getting dismantle list", error);
    throw new Error("Error getting dismantle list");
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
    if (id_prov !== "5") {
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

      return results;
    } else {
      const newProvider = await Provider.findAll({
        where: {
          id: id_prov,
        },
      });

      const results = await Installation.update(
        {
          provider: newProvider[0].dataValues.provider,
          provider_id: id_prov,
          status: "approved",
          days: null,
          price_id: null,
          price: null,
          communication: "M2M",
        },
        {
          where: {
            id: id,
            status: "pending",
          },
        }
      );
      return results;
    }
  } catch (error) {
    console.error("Error updating installation list:", error);
    throw new Error("Error updating installation list");
  }
}

/**
 * Retrieves installation information based on location and provider ID.
 *
 * @param {string} location - The location for which installation information is needed.
 * @param {number} id_prov - The ID of the provider for which information is requested.
 * @returns {Promise<{lowestPrice: Array, days: Array}>} - An object containing the lowest price and corresponding SLA days.
 * @throws {Error} - Throws an error if no coverage providers, SLAs, or prices are found.
 */
async function getInstallationProvider(location, id_prov) {
  try {
    // Query for Coverage Providers
    const coverageProviders = await Coverage.findAll({
      include: [
        {
          model: Location,
          attributes: ["location"],
          required: true,
          where: {
            location,
          },
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true,
          where: {
            id: id_prov,
          },
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
          attributes: ["location"],
          where: {
            id: coverageProviders[0].id_loc,
          },
          required: true,
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true,
        },
      ],
      attributes: ["days", "id_prov"],
      order: [["days", "ASC"]],
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
          attributes: ["location"],
          where: {
            id: coverageProviders[0].id_loc,
          },
          required: true,
        },
        {
          model: Provider,
          attributes: ["provider"],
          required: true,
        },
      ],
      order: [["price", "ASC"]],
      limit: 4,
    });

    if (lowestPrice.length === 0) {
      throw new Error("No prices found for the selected providers.");
    }

    // Extract Provider IDs with the Lowest Price
    const resultProviderIds = lowestPrice.map((price) => price.id_prov);

    return {
      lowestPrice,
      days: lowestSla
        .filter((sla) => resultProviderIds.includes(sla.id_prov))
        .map((sla) => sla.days),
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
  getLocationsSpecial,
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
  getInstallationBatchId,
  getLocationByName,
  getRelocationBatchId,
  getRelocationbyBatchId,
  getInstallationbyBatch,
  getBatchDismantle,
  getBatchRelocation,
  getDismantleBatchId,
  getInstallationbyLocation,
  getInstallationFiltered,
  getDismantlebyBatchId,
  getInstallationInfoNew,
};
