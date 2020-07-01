const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comments = require('../Models/comment');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res, next) => {
  Comments.find()
    .select('_id name comment')
    .exec()
    .then((docs) => {
      console.log(docs, 'All Comments');
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err, 'Error in catching comments');
      res.status(500).json({ errorComments: err });
    });
});
router.post('/', (req, res, next) => {
  const comments = new Comments({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    comment: req.body.comment,
  });
  comments
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


router.delete('/:commentId',checkAuth, (req, res, next) => {
  const id = req.params.commentId;
  Comments.remove({ _id: id })
    .exec() // here
    .then((result) => {
      console.log(result);
      res.status(201).json({ message: `comment deleted with id ${id}` });
    })
    .catch((err) => {
      console.log((err) => {
        res.status(500).json({ error: err });
      });
    });
});

module.exports = router;
