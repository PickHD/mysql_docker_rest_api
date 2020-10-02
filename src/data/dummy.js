const Customer = require('../models/customer.model');

const data = new Customer({
  first_name: 'Dummys',
  last_name: 'datas',
  email: 'dummydata35@gmail.com',
  address: 'In the world,obviously',
  address_2: '',
  province: 'Dummy Province',
  city: 'Dummy City',
  phone: '109283091238',
  postalCode: 40252,
  active: false
});
const sameEmailData = new Customer({
  first_name: 'Daddy',
  last_name: 'Lopez',
  email: 'dummydata35@gmail.com',
  address: 'In the world,obviously',
  address_2: '',
  province: 'Dummy Province',
  city: 'Dummy City',
  phone: '109283092910',
  postalCode: 40252,
  active: true
});
const ripData = new Customer({
  first_name: 'D',
  last_name: 'L',
  email: 'dummydata35@gmail.com',
  address: 'In the world,obviously',
  address_2: '',
  province: 'Dummy Province',
  city: 'Dummy City',
  phone: '109283092910',
  postalCode: 40252,
  active: true
});
const badData = new Customer({
  first_name: '',
  last_name: '',
  email: 'badJhonny22@gmail.com',
  address: 'In the world',
  address_2: '',
  province: 'Dummy',
  city: 'Dummy City',
  phone: 109283099512,
  postalCode: '',
  active: true
});
const updData = {
  first_name: 'Dummys',
  last_name: 'datas',
  email: 'dummydata55@gmail.com',
  address: 'In the world,obviously',
  address_2: 'Of course galaxy is not included',
  province: 'Dummy Province',
  city: 'Dummy City',
  phone: '109283091238',
  postalCode: 40252,
  active: true
};

module.exports = {
  data, badData, updData, sameEmailData, ripData
};
