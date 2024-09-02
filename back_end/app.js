var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./socketConfig/setupSockets');

const dotenv = require('dotenv');
dotenv.config();

main().then(() => console.log(`Connected, running at http://localhost:3000`)).catch(err => console.log(err))

async function main() {
  await mongoose.connect(`${process.env.MONGODB}`);
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/post');
const quizRouter = require('./routes/quiz');

var app = express();

const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 24,
  }
});

app.use(cors({
  origin: `http://localhost:5173`,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session())

const setupPassport = require('./authentication/passportSetup');
setupPassport();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post', postRouter);
app.use('/quiz', quizRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    success: false,
    msg: err.message,
  });
});


const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:5173`,
    credentials: true,
  },
});

io.engine.use(sessionMiddleware);

setupSocket(io);

httpServer.listen( process.env.PORT || 3000, () => {
  console.log(`Listening to ${process.env.BASEURL}`);
} );
