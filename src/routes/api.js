const express = require('express'),
router = express.Router();
const authenticate = require('../middlewares/middlewares').authenticate;
const apiBase = '../api';

module.exports = function (app) {
    // API routes


    app.use('/', authenticate, require(`${apiBase}/product/index`));
};