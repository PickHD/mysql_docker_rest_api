const { connection } = require('./index.model');

class Customer {
  constructor(customer) {
    // eslint-disable-next-line no-unused-expressions
    this.first_name = customer.first_name;
    this.last_name = customer.last_name;
    this.email = customer.email;
    this.address = customer.address;
    this.address_2 = customer.address_2;
    this.province = customer.province;
    this.city = customer.city;
    this.phone = customer.phone;
    this.postalCode = customer.postalCode;
    this.active = customer.active;
  }

  static Create(newCustomer) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO customers SET ?', newCustomer, (err, res) => {
        if (err) {
          reject(err, null);
          return;
        }
        resolve({ id: res.insertId, ...newCustomer });
      });
    });
  }

  static FindAll() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM customers', (err, res) => {
        if (err) {
          reject(err, null);
          return;
        }
        resolve(res);
      });
    });
  }

  static FindOne(customerId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM customers WHERE id=?', customerId, (err, res) => {
        if (err) {
          reject(err, null);
          return;
        }
        resolve(res[0]);
      });
    });
  }

  static FindByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM customers WHERE email=?', email, (err, res) => {
        if (err) {
          reject(err, null);
          return;
        }
        resolve(res[0]);
      });
    });
  }

  static Update(customer, id) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE customers SET first_name=?,last_name=?,email=?,address=?,address_2=?,province=?,city=?,phone=?,postalCode=?,active=? WHERE id=?', [
        // eslint-disable-next-line max-len
        customer.first_name, customer.last_name, customer.email, customer.address, customer.address_2, customer.province, customer.city, customer.phone, customer.postalCode, customer.active, id
      ], (err, res) => {
        if (err) {
          reject(err, null);
          return;
        }
        resolve(res);
      });
    });
  }

  static Remove(customerId) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM customers WHERE id=?', customerId, (err, res) => {
        if (err) {
          reject(err, null);
          return;
        }
        resolve(res);
      });
    });
  }
}
module.exports = Customer;
