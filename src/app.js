const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const middlewares = require('./middlewares');
const tauSocket = require('./tau-socket');
const api = require('./api');

const app = express();

tauSocket.init(); // start listening for TAU events
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true
  })
});

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', `default-src 'self' *.amazonaws.com`)
  return next()
})
app.use('/obs-overlays', express.static(path.join(__dirname, './pages/obs-overlays')))

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
