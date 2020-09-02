const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// ENV Variables
dotenv.config({ path: './config/config.env' });

// User authentication with passport (Google Strategy)
require('./config/passport')(passport);

// mongoose connect
connectDB();

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Helpers
const { formatDate } = require('./helpers/hbs');

// Handlebars template engine
app.engine('.hbs', exphbs({helpers: {
  formatDate
}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Session 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// passport
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const port = process.env.PORT;
app.listen(port, console.log(`server running on ${process.env.PORT}`));
