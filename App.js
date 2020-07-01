const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const blogsRoutes = require('./API/Route/blogs');
const commentsRoutes = require('./API/Route/comments');
const defaultRoutes = require('./API/Route/default');
const likesRoutes = require('./API/Route/likes');
const userRoutes=require('./API/Route/user');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Headers','PUT,POST,PATCH,DELETE,GET');
//         return res.status(200).json({});
//     }
//     next();
// }) 

mongoose
  .connect(
   ' mongodb+srv://ShJ-dev:' + 'SEcret' + '@node-rest-shop-ghuq1.mongodb.net/blog-database?retryWrites=true&w=majority',

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((err) => console.log(`Error from mongoose connection ${err}`));

// Routes for blogs
app.use('/', defaultRoutes);
app.use('/blogs', blogsRoutes);
app.use('/comments', commentsRoutes);
app.use('/likes', likesRoutes);
app.use('/user',userRoutes);

app.use((req, res, next) => {
  err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
});
module.exports = app;
