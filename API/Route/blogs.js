const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: fileFilter,
});

const Blogs = require('../Models/blog'); // here

router.get('/', (req, res, next) => {
  Blogs.find()
    .select('_id title content blogImage likes')
    .exec() //here
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.post('/',checkAuth, upload.single('blogImage'), (req, res, next) => {
  console.log(req.file, 'file');
  const blog = new Blogs({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    blogImage: req.file ? req.file.path : null, // here
    likes: req.body.likes,
  });
  console.log(blog);
  blog
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  res.status(200).json({
    message: 'Handling POST request to /blogs',
    blogAdded: blog,
  });
});

// POST will not be required with given id
router.get('/:blogId', (req, res, next) => {
  const id = req.params.blogId;
  Blogs.find({ _id: id })
    .select('_id title content blogImage likes') // here
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.patch('/:blogId',checkAuth, (req, res, next) => {
  const id = req.params.blogId;
  // while update pass data as title,content
  Blogs.update(
    { _id: id },
    { $set: { title: req.body.title, content: req.body.content } }
  )
    .exec() //here
    .then((result) => {
      res
        .status(200)
        .json({
          result,
          message: `You made a patch or update request to /blogs with id ${id}`,
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
router.delete('/:blogId',checkAuth, (req, res, next) => {
  const id = req.params.blogId;
  Blogs.remove({ _id: id })
    .exec() // here
    .then((result) => {
      console.log(result);
      res.status(201).json({ message: `blog deleted with id ${id}` });
    })
    .catch((err) => {
      console.log((err) => {
        res.status(500).json({ error: err });
      });
    });
});

module.exports = router;
