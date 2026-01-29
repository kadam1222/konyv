var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
const konyvekRouter = require('./routes/konyvek')
const authRoutes = require("./routes/tokens")
const kepfeltoltesRouter = require("./routes/kepfeltoltes");


var app = express();

const cors = require('cors')
const corsOptions = { 
    origin: true
    , credentials : true,

}



app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/auth", authRoutes);
app.use('/konyvek', konyvekRouter)
app.use("/upload", kepfeltoltesRouter);



module.exports = app;
