const query = require("../services/service");

async function register(req, res) {
    try {
      const result = await query.register(req.body);
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }
  
  async function login(req, res) {
    try {
      const result = await query.login(req.body);
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }

  async function getlocations(req, res) {
    try {
      const result = await query.getlocations();
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }

  async function getproviders(req, res) {
    try {
      const result = await query.getproviders();
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }

  module.exports = {
    register,
    login,
    getlocations,
    getproviders,
  };
  