// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./comment.model');
var db = 'mongodb://localhost/comments';
mongoose.connect(db);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create route for get all comments
app.get('/comments', function(req, res) {
    console.log('Getting all comments');
    Comment.find({})
        .exec(function(err, comments) {
            if (err) {
                res.send('Error has occured');
            } else {
                console.log(comments);
                res.json(comments);
            }
        });
});

// Create route for get one comment
app.get('/comments/:id', function(req, res) {
    console.log('Getting one comment');
    Comment.findOne({
            _id: req.params.id
        })
        .exec(function(err, comment) {
            if (err) {
                res.send('Error has occured');
            } else {
                console.log(comment);
                res.json(comment);
            }
        });
});

// Create route for post comment
app.post('/comment', function(req, res) {
    console.log('Posting a comment');
    var newComment = new Comment();
    newComment.username = req.body.username;
    newComment.comment = req.body.comment;
    newComment.save(function(err, comment) {
        if (err) {
            res.send('Error saving comment');
        } else {
            console.log(comment);
            res.send(comment);
        }
    });
});

// Create route for update comment
app.put('/comment/:id', function(req, res) {
    console.log('Updating a comment');
    Comment.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                username: req.body.username,
                comment: req.body.comment
            }
        }, {
            upsert: true
        },
        function(err, newComment) {
            if (err) {
                res.send('Error updating comment');
            } else {
                console.log(newComment);
                res.send(newComment);
            }
        });
});

// Create route for delete comment
app.delete('/comment/:id', function(req, res) {
    console.log('Deleting a comment');
    Comment.findOneAndRemove({
            _id: req.params.id
        },
        function(err, comment) {
            if (err) {