if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
const dns = require('dns');
// change DNS
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const { MongoStore } = require("connect-mongo");
const ExpressError = require('./utils/ExpressError.js');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');





const dbUrl = process.env.MONGODB_URI;
  console.log("DB URL =", process.env.MONGODB_URI);
main()
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));






const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Mongo Session Store Error:", err);
});



const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get('/', (req, res) => {
//   res.send('Hi, I am root');
// });

app.use(session(sessionOption));
app.use(flash());

//passport for login users
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

// passport demo

// app.get('/demouser', async (req, res) => {
//   let fakeUser = new User({
//     email: 'Kirtesh@gmail.com',
//     username: 'Sigma-student',
//   });
//   let registeredUser = await User.register(fakeUser, 'HelloWorld');
//   res.send(registeredUser);
// });

// Listing Routes
app.use('/listings', listingRouter);
// Review Routes
app.use('/listings/:id/reviews', reviewRouter);
// user Router
app.use('/', userRouter);

// 404 Route
app.use((req, res, next) => {
  if (req.originalUrl === '/.well-known/appspecific/com.chrome.devtools.json') {
    return res.status(204).end();
  }

  next(new ExpressError(404, 'Page Not Found'));
});

// Error Middleware
app.use((err, req, res, next) => {
  console.log(err);

  let { statusCode = 500, message = 'Something Went Wrong' } = err;

  res.status(statusCode).render('error.ejs', {
    statusCode,
    message,
  });
});

app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
