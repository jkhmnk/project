var mongodb = require('./db');
markdown = require('markdown').markdown;

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function (callback) {
    var date = new Date();
    //存储各种格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    //要存入数据库存的文档
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post,
        comments: []
    }
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }

            //将文档插入 posts 集合
            collection.insert(post, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                }
                callback(null);//成功！err为null，并返回存储后的用户文档
            })
        })
    })

};

//读取 文章及其 相关信息
Post.getAll = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }

            var query = {};
            if (name) {
                query.name = name;
            }

            //根据 query 对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err); //失败！返回err
                }

                //解析 markdown 为html
                docs.forEach(function (doc) {
                    doc.post = markdown.toHTML(doc.post);
                })
                callback(null, docs); //成功！以数组形式返回查询结果
            })

        })
    })
}

//读取 文章及其 相关信息
Post.getOne = function (name, day, title, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }

            //根据用户名，发表日期及文章名进行查询
            collection.findOne({
                "name": name,
                "time.day": day,
                "title": title
            }, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //解析 markdown 为html
                if (doc) {
                    doc.post = markdown.toHTML(doc.post);
                    doc.comments.forEach(function (comment) {
                        comment.content = markdown.toHTML(comment.content);
                    })
                }

                callback(null, doc);//返回查询的一篇文章
            })
        })
    })
}

//返回原始发表的内容（markdown 格式）
Post.edit = function (name, day, title, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据用户名，发表日期及文章名进行查询
            collection.findOne({
                "name": name,
                "time.day": day,
                "title": title
            }, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, doc);//返回查询的一篇文章（markdown格式）
            })
        })
    })
}

//更新一篇文章及相关信息
Post.update = function (name, day, title, post, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新文章内容
            collection.update({
                "name": name,
                "time.day": day,
                "title": title
            }, {
                $set: {post: post}
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}

//删除一篇文章
Post.remove = function (name, day, title, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据用户名，日期和标题查找并删除一篇文章
            collection.remove({
                "name": name,
                "time.day": day,
                "title": title
            }, {
                w: 1
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}