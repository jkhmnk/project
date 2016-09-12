var Post = require('../models/post')

Post.getAll(null, function (err, posts) {
    if (err) {
        posts = [];
    }
})

module.exports = Post;