const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  content: String,
  blogImage: String,
  likes: {type:Number,default:0}
});

module.exports = mongoose.model('Blogs', blogSchema);
