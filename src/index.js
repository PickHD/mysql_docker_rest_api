process.env.NODE_ENV = 'production';
const App = require('./app');
const { connectDB } = require('./models/index.model');
require('dotenv').config();

const app = new App();
app.listenPort(process.env.PORT);
connectDB();

module.exports = app;
