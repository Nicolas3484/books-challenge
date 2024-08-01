const express = require('express');
const session = require('express-session');
const path = require('path')
const mainRouter = require('./routes/main');
const methodOverride = require('method-override');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const SessionCookie = require(path.resolve(__dirname, './validations/SessionCookie'));
const checkSession = require(path.resolve(__dirname, './validations/checkSession'));



// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'libritos',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(methodOverride('_method'));
app.use(SessionCookie);
app.use(checkSession);


// config
app.set('view engine', 'ejs');
app.set('views', 'src/views');



// routes
app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
