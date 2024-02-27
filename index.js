const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDb = require('./database');
const errorHandler = require('./middleware/errorHandler');
const authroutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('App is working');
  console.log('App is ok');
});

connectDb();

app.use('/api/v1/auth', authroutes);

app.listen(port, () => console.log(`Listening on port ${port}...`));
