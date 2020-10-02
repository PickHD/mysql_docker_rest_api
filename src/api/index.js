const express = require('express');

const router = express.Router();

const customers = require('./customer');

router.get('/', (req, res) => {
  res.json({
    code: 200,
    success: true,
    message: 'Base route for API customers'
  });
});

router.use('/customers', customers);

module.exports = router;
