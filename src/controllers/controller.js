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

  async function getsla(req, res) {
    try {
      const result = await query.getsla();
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }

  async function getcoverage(req, res) {
    try {
      const result = await query.getcoverage();
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }

  async function getprices(req, res) {
    try {
      const result = await query.getprices();
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }

  async function installation(req, res) {
    try {
      const result = await query.installation(req.body);
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }

  module.exports = {
    register,
    login,
    getcoverage,
    getprices,
    getsla,
    getlocations,
    getproviders,
    installation,
  };
  