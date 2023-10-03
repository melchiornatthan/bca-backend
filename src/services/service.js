const db = require("../database/connection");
const bcrypt = require("bcrypt");

//melakukan register akun ke table user
async function register(body) {
    const { username, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
      return {
        message: "User created successfully",
      };
    } else {
      throw new Error("Error registering user");
    }
  }
  
  //melakukan login 
  async function login(body) {
    const { username, password } = body;
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return {
          message: "User logged in successfully",
          user,
        };
      } else {
        throw new Error("Invalid password");
      }
    } else {
      throw new Error("Invalid username");
    }
  }

  async function getlocations() {
    const query = `SELECT * FROM locations`;
    const result = await db.query(query);
    if (result.rowCount > 0) {
      return {
        list: result.rows
      };
    } else {
      throw new Error("Error getting locations");
    }
  }

  async function getproviders() {
    const query = `SELECT * FROM providers`;
    const result = await db.query(query);
    if (result.rowCount > 0) {
      return {
        list: result.rows
      };
    } else {
      throw new Error("Error getting providers");
    }
  }
  module.exports = {
    register,
    login,
    getlocations,
    getproviders,
  };