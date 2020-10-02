/* eslint-disable consistent-return */
const express = require('express');

const Redis = require('ioredis');

const { body, validationResult } = require('express-validator');

require('dotenv').config();

const Customer = require('../models/customer.model');

const router = express.Router();

const client = new Redis(process.env.REDIS_HOST);

// !GET ROUTE
router.get('/', async (req, res, next) => {
  try {
    const getData = await Customer.FindAll();
    res.status(200).json({
      code: 200,
      success: true,
      result: getData
    });
  } catch (error) {
    return next(error);
  }
});
//! POST ROUTE
router.post('/', [
  body('first_name').not().isEmpty().isLength({ min: 5 }),
  body('last_name').not().isEmpty().isLength({ min: 5 }),
  body('email').not().isEmpty().isEmail()
    .custom((value) => Customer.FindByEmail(value)
      .then((user) => {
        if (user) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject('Email is already used!');
        }
      })),
  body('address').not().isEmpty(),
  body('province').not().isEmpty(),
  body('city').not().isEmpty().isLength({ min: 5 }),
  body('phone').not().isEmpty(),
  body('postalCode').not().isEmpty(),
  body('active').not().isEmpty().isBoolean(),
], async (req, res, next) => {
  // ? define overlimit function
  async function isOverLimit(ip) {
    let val;
    try {
      val = await client.incr(ip);
    } catch (err) {
      console.error('isOverLimit: could not increment key');
      next(err);
    }

    console.log(`${ip} has value: ${val}`);

    if (val >= 11) {
      return true;
    }
    client.expire(ip, 10);
  }
  try {
    const ovrLimit = await isOverLimit(req.ip);
    // ? if true
    if (ovrLimit) {
      res.status(429);
      const error = new Error('Too Many Request,try again later');
      return next(error);
    }
    const validErr = validationResult(req);
    if (!validErr.isEmpty()) {
      return res.status(400).json({
        code: 400,
        success: false,
        validation_errors: validErr.array()
      });
    }
    const customer = new Customer({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      address: req.body.address,
      address_2: req.body.address_2 ? req.body.address_2 : '',
      province: req.body.province,
      city: req.body.city,
      phone: req.body.phone,
      postalCode: req.body.postalCode,
      active: req.body.active
    });
    const newData = await Customer.Create(customer);
    res.status(201).json({
      code: 201,
      success: true,
      result: newData
    });
  } catch (error) {
    return next(error);
  }
});

// !GET FROM ID ROUTE
router.get('/:customerId', async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const getOne = await Customer.FindOne(customerId);
    if (getOne == null) {
      res.status(404);
      const error = new Error(`Id:${customerId} Not Found.`);
      return next(error);
    }
    res.status(200).json({
      code: 200,
      success: true,
      result: getOne
    });
  } catch (error) {
    return next(error);
  }
});
// ! PUT FROM ID ROUTE
router.put('/:customerId', [
  body('first_name').not().isEmpty().isLength({ min: 5 }),
  body('last_name').not().isEmpty().isLength({ min: 5 }),
  body('email').not().isEmpty().isEmail(),
  body('address').not().isEmpty(),
  body('province').not().isEmpty(),
  body('city').not().isEmpty().isLength({ min: 5 }),
  body('phone').not().isEmpty(),
  body('postalCode').not().isEmpty(),
  body('active').not().isEmpty().isBoolean(),
], async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const validErrUpd = validationResult(req);
    if (!validErrUpd.isEmpty()) {
      return res.status(400).json({
        code: 400,
        success: false,
        validation_errors: validErrUpd.array()
      });
    }
    const updOne = await Customer.Update(req.body, customerId);
    if (updOne.affectedRows === 0) {
      res.status(404);
      const error = new Error(`Id:${customerId} Not Found.`);
      return next(error);
    }
    res.status(200).json({
      code: 200,
      success: true,
      message: 'Customer Successfully Updated!'
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:customerId', async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const delOne = await Customer.Remove(customerId);

    if (delOne.affectedRows === 0) {
      res.status(404);
      const error = new Error(`Id:${customerId} Not Found.`);
      return next(error);
    }
    res.status(200).json({
      code: 200,
      success: true,
      message: 'Customer successfully deleted!'
    });
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
