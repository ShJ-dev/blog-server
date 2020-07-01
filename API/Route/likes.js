const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Blogs = require('../Models/blog')

router.patch('/:blogId',(req,res,next) => {
    const id = req.params.blogId
    // update likes
    Blogs.update({_id: id},{ $set: {likes: req.body.likes} }).exec()
        .then( result => {
            console.log(id)
            res.status(200).json({result,message: `You have added like to /blogs with id ${id}`})
        })
        .catch( err => {
            res.status(500).json({error : err})
        })
})

module.exports = router