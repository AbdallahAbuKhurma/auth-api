'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
const v1Routes = require('./routes/v1.js'); /**============V1 Routes============ */
const v2Routes = require('./routes/v2');/**=============V1 Routes============= */
const authRoutes = require('./auth/routes.js'); /**============Auth Routes============== */

// Prepare the express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prepare the express app
app.use(logger);
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use(authRoutes);/**=======Auth======= */
app.use('/api/v1', v1Routes);/**======V1====== */
app.use('/api/v2', v2Routes);/**======V2====== */

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

// Error Handlers
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port || 3000, () => console.log(`Listening on ${port}`));
  },
};
