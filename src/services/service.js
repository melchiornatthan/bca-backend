const db = require("../database/connection");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Provider = require("../models/provider");
const Location = require("../models/locations");
const Sla = require("../models/sla");
const Coverage = require("../models/coverage");
const Price = require("../models/price");
const sequelize = require("../database/connection");


//melakukan register akun ke table user
async function register(body) {
  const { username, password } = body;
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record using Sequelize
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
    });

    if (newUser) {
      return {
        message: "User created successfully",
      };
    } else {
      throw new Error("Error registering user");
    }
  } catch (error) {
    throw new Error("Error registering user");
  }
}
  
  //melakukan login 
  async function login(body) {
    try {
      const { username, password } = body;
  
      // Use Sequelize to find a user by username
      const user = await User.findOne({
        where: {
          username: username,
        },
      });
  
      if (!user) {
        throw new Error("Invalid username");
      }
  
      // Use bcrypt to compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (isPasswordValid) {
        return {
          message: "User logged in successfully",
        };
      } else {
        throw new Error("Invalid password");
      }
    } catch (error) {
      throw new Error("Error logging in");
    }
  }

  async function getlocations() {
    try {
      const locations = await Location.findAll();
      if (locations.length > 0) {
        return {
          list: locations,
        };
      } else {
        throw new Error("Error getting locations");
      }
    } catch (err) {
      throw err; // Re-throw the error for handling elsewhere
    }
  }
  

  async function getsla() {
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
  
      if (slaList.length > 0) {
        return {
          list: slaList,
        };
      } else {
        throw new Error("Error getting SLA data");
      }
    } catch (err) {
      throw err; // Re-throw the error for handling elsewhere
    }
  }
  

  async function getcoverage() {
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
  
      if (coverageList.length > 0) {
        return {
          list: coverageList,
        };
      } else {
        throw new Error("Error getting coverage data");
      }
    } catch (err) {
      throw err; // Re-throw the error for handling elsewhere
    }
  }
  

  async function getprices() {
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
  
      if (priceList.length > 0) {
        return {
          list: priceList,
        };
      } else {
        throw new Error("Error getting price data");
      }
    } catch (err) {
      throw err; // Re-throw the error for handling elsewhere
    }
  }
  

  async function getproviders() {
  try {
    const providerList = await Provider.findAll();

    if (providerList.length > 0) {
      return {
        list: providerList,
      };
    } else {
      throw new Error("Error getting providers");
    }
  } catch (err) {
    throw err; // Re-throw the error for handling elsewhere
  }
}


  async function installation(body) {
    const { location } = body;
    const query = `WITH location_id_cte AS (
      SELECT id
      FROM locations
      WHERE location = '${location}'
    ),
    available_providers AS (
      SELECT
        c.id_loc,
        c.id_prov,
        s.days,
        p.price
      FROM coverages c
      INNER JOIN slas s ON c.id_loc = s.id_loc AND c.id_prov = s.id_prov
      INNER JOIN prices p ON c.id_loc = p.id_loc AND c.id_prov = p.id_prov
      WHERE c.id_loc IN (SELECT id FROM location_id_cte)
        AND c.avail = true
    ),
    ranked_providers AS (
      SELECT
        ap.id_loc,
        ap.id_prov,
        ap.days,
        ap.price,
        ROW_NUMBER() OVER (PARTITION BY ap.id_loc ORDER BY ap.days ASC) AS days_rank,
        ROW_NUMBER() OVER (PARTITION BY ap.id_loc ORDER BY ap.price ASC) AS price_rank
      FROM available_providers ap
    )
    SELECT 
          pr.provider, 
          rp.days AS days_to_install,
          p.price AS selected_price,
          p.id AS selected_price_id
        FROM ranked_providers rp
        JOIN prices p ON rp.id_loc = p.id_loc AND rp.id_prov = p.id_prov
        JOIN providers pr ON pr.id = rp.id_prov
        WHERE rp.days_rank = 1 OR (rp.days_rank = 2 AND rp.price_rank = 1);
    `
    
    try {
      const result = await sequelize.query(query, {type : sequelize.QueryTypes.SELECT});
      return result;
    } catch(err) {
      // Rolled back
      console.error(err);
    }
  }

  module.exports = {
    register,
    login,
    getsla,
    getprices,
    getlocations,
    getcoverage,
    installation,
    getproviders,
  };