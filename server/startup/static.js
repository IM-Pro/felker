const express = require('express');
const path = require('path');

// Initialize static paths
module.exports = (app) => {
  app.use(express.static(path.resolve(__dirname, '../../assets')));
}