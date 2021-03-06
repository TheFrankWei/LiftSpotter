const express  = require('express');
const app      = express();
const passport = require('passport');
const flash    = require('connect-flash');
const mongoose = require('mongoose');

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const path         = require('path');
const configDB     = require('./config/database.js');
/**
 * DON'T DO CONNECTION HERE
 */
// // const pg = require('pg');
// const { Pool, Client } = require('pg');
// //
// // connection with Database
// const connectionString = "postgres://admin:12345@localhost/largeScaleDB";
// const client = new Client({
//     connectionString: connectionString,
// });
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());

app.set('view engine', 'hbs');

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening on port:", port);
});
