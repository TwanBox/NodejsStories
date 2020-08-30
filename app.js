const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use('/', require('./routes/index'));

const port = process.env.PORT;

app.listen(port, console.log(`server running on ${process.env.PORT}`));

