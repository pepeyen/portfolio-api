require("dotenv-safe").config();
const express = require('express');

const app = express();

//Add-ons
const morgan = require('morgan');
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');


//Routes
const root = require('./routes/root');
const api = require('./routes/apis');

app.use(morgan('dev'));
app.use(cors({
    origin: `${process.env.ORIGIN_ADDRESS || 'http://localhost:3000'}`,
    credentials: true
}));
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

app.use('/', root);
app.use('/static', express.static('public'))
app.use('/api', api);

const port = process.env.PORT||8080;
app.listen(port);