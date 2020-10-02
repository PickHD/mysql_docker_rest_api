/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSON = require('./swagger.json');

const { notFound, errorHandler } = require('./middlewares');
const api = require('./api');

require('dotenv').config();

class App {
  constructor() {
    this.app = express();
    this.config();
  }

  config() {
    this.app.use(cors());
    this.app.use(morgan('tiny'));
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON));
    this.app.use('/api/v1', api);
    this.app.get('/', (req, res) => res.redirect('/api-docs'));
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  listenPort(port) {
    return new Promise((resolve, reject) => {
      const server = this.app.listen(port, () => {
        // eslint-disable-next-line no-shadow
        const { port } = server.address();
        if (process.env.NODE_ENV === 'test') {
          resolve(console.log(`Test Server is listening to Port: ${port}`));
          return;
        }
        resolve(console.log(`Server is listening to Port: ${port}`));
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = App;
