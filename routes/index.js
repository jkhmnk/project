var crypto = require('crypto');
var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.get('/login',checkNotLogin);
router.get('/login', function(req, res) {
    res.render('login', {
        title:'登录',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
});
router.post('/login',checkNotLogin);
router.post('/login', function(req, res) {
    //生成密码的MD5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');

    //检查用户是否存在
    User.get(req.body.name,function (err,user) {
        if (!User) {
            req.flash('error','用户不存在！');
            return res.redirect('/login');//用户不存在则跳转到登录页
        }
        console.log('用户', req.session)
        //检查密码是否一致
        if (user.password != password) {
            req.flash('error','密码错误！');
            return res.redirect('/login');//密码错误则跳转到登录页
        }
        //用户名密码都匹配后，将用户信息存入session
        req.session.user = user;
        req.flash('success','登录成功！');
        res.redirect('/');//登录成功后跳转回主页
    })
});

function checkLogin(req,res,next) {
    if (!req.session.user) {
        req.flash('error','未登录！');
        res.redirect('/login');
    }
    next();
}
function checkNotLogin(req,res,next) {
    if (req.session.user) {
        req.flash('error','已登录！');
        res.redirect('back');
    }
    next();
}

router.get('/', (req, res) => {
    res.render('index', {
        title : '这是标题'
    })
});

router.get('/test', (req, res) => {
    res.render('test')
});

//function checkLogin(req,res,next) {
//    if (!req.session.user) {
//        req.flash('error','未登录！');
//        res.redirect('/login');
//    }
//    next();
//}
//function checkNotLogin(req,res,next) {
//    if (req.session.user) {
//        req.session.user = req.session.user;
//        req.flash('error','已登录！');
//        res.redirect('back');
//    }
//    next();
//}

module.exports = router;
/* GET home page. */
//router.get('/', function req, res) {
//    Post.getAll(null, function (err, posts) {
//        if (err) {
//            posts = [];
//        }
//        res.render('index', {
//            title: '首页',
//            user: req.session.user,
//            posts: posts,
//            success: req.flash('success').toString(),
//            error: req.flash('error').toString()
//        });
//    })
//});
//
//router.get('/reg', checkNotLogin);
//router.get('/reg', function (req, res) {
//    res.render('reg', {
//        title: '注册',
//        user: req.session.user,
//        success: req.flash('success').toString(),
//        error: req.flash('error').toString()
//    });
//});
//router.post('/reg', checkNotLogin);
//router.post('/reg', function (req, res) {
//    var name = req.body.name,
//        password = req.body.password,
//        password_re = req.body['password-repeat'];
//
//    //检验两次用户输入的密码是否一致
//    if (password_re != password) {
//        req.flash('error', '两次输入的密码不一致！');
//        return res.redirect('/reg');//返回注册页
//    }
//
//    //生成密码的MD5值
//    var md5 = crypto.createHash('md5'),
//        password = md5.update(req.body.password).digest('hex');
//    var newUser = new User({
//        name: req.body.name,
//        password: password,
//        email: req.body.email
//    });
//
//    //检查用户是否已经存在
//    User.get(newUser.name, function (err, user) {
//        if (user) {
//            req.flash('error', '用户已存在！');
//            return res.redirect('/reg')//返回注册页
//        }
//
//        //如果用户不存在则新增用户
//        newUser.save(function (err, user) {
//            if (err) {
//                req.flash('error', err);
//                return res.redirect('/reg')//注册失败返回注册页
//            }
//            req.session.user = user;//用户信息存入session
//            req.flash('success', '注册成功！');
//            res.redirect('/');//注册成功后返回主页
//        })
//    })
//});
//
//router.get('/login', checkNotLogin);
//router.get('/login', function (req, res) {
//    res.render('login', {
//        title: '登录',
//        user: req.session.user,
//        success: req.flash('success').toString(),
//        error: req.flash('error').toString()
//    });
//});
//router.post('/login', checkNotLogin);
//router.post('/login', function (req, res) {
//    //生成密码的MD5值
//    var md5 = crypto.createHash('md5'),
//        password = md5.update(req.body.password).digest('hex');
//
//    //检查用户是否存在
//    User.get(req.body.name, function (err, user) {
//        if (!user) {
//            req.flash('error', '用户不存在！');
//            return res.redirect('/login');//用户不存在则跳转到登录页
//        }
//        //检查密码是否一致
//        if (user.password != password) {
//            req.flash('error', '密码错误！');
//            return res.redirect('/login');//密码错误则跳转到登录页
//        }
//        //用户名密码都匹配后，将用户信息存入session
//        req.session.user = user;
//        req.flash('success', '登录成功！');
//        res.redirect('/');//登录成功后跳转回主页
//    })
//});
//
//router.get('/post', checkLogin);
//router.get('/post', function (req, res) {
//    res.render('post', {
//        title: '发表',
//        user: req.session.user,
//        success: req.flash('success').toString(),
//        error: req.flash('error').toString()
//    });
//});
//router.post('/post', checkLogin);
//router.post('/post', function (req, res) {
//    var currentUser = req.session.user,
//        post = new Post(currentUser.name, req.body.title, req.body.post);
//
//    post.save(function (err) {
//        if (err) {
//            req.flash('error', err);
//            return res.redirect('/');
//        }
//        req.flash('success', '发布成功！');
//        res.redirect('/');//发表成功则跳转到主页
//    })
//});
//
//router.get('/logout', checkLogin);
//router.get('/logout', function (req, res) { //退出功能
//    req.session.user = null; //设置user值为null丢掉session中用户的信息，实现用户退出
//    req.flash('success', '退出成功！');
//    res.redirect('/');//退出成功则跳转到主页
//});
//router.post('/logout', checkLogin);
//router.post('/logout', function (req, res) {
//});
//
//router.get('/upload', checkLogin);
//router.get('/upload', function (req, res) { //上传
//    res.render('upload', {
//        title: '文件上传',
//        user: req.session.user,
//        success: req.flash('success').toString(),
//        error: req.flash('error').toString()
//    })
//});
//router.post('/upload', checkLogin);
//router.post('/upload', function (req, res) {
//    for (var i in req.files) {
//        if (req.files[i].size == 0) {
//            //使用同步方式删除一个文件
//            fs.unlinkSync(req.files[i].path);
//            console.log('Successfully removed an empty file!');
//
//        } else {
//            var target_path = './public/images/' + req.files[i].name;
//            //使用同步方式重命名一个文件
//            fs.renameSync(req.files[i].path, target_path);
//            console.log('successfully renamed a file!');
//        }
//    }
//    console.log(req.files);
//    req.flash('success', '文件上传成功！');
//    res.redirect('/upload');
//});
//
//router.get('/u/:name', function (req, res) {
//    //检查用户名是否存在
//    User.get(req.params.name, function (err, user) {
//        if (!user) {
//            req.flash('error', '用户名不存在！');
//            return res.redirect('/');//用户不存在则跳转到首页
//        }
//
//        //查询并返回该用户的所有文章
//        Post.getAll(user.name, function (err, posts) {
//            if (err) {
//                req.flash('error', err);
//                return res.redirect('/');
//            }
//            res.render('user', {
//                title: user.name,
//                posts: posts,
//                user: req.session.user,
//                success: req.flash('success').toString(),
//                error: req.flash('error').toString()
//            })
//        })
//    })
//})
//
//router.get('/u/:name/:day/:title', function (req, res) {
//    Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
//        if (err) {
//            req.flash('error', err);
//            return res.redirect('/');
//        }
//        res.render('article', {
//            title: req.params.title,
//            post: post,
//            user: req.session.user,
//            success: req.flash('success').toString(),
//            error: req.flash('error').toString()
//        })
//    })
//})
//router.post('/u/:name/:day/:title', function (req, res) {
//    var date = new Date(),
//        time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
//
//    var comment = {
//        name: req.body.name,
//        email: req.body.email,
//        website: req.body.website,
//        time: time,
//        content: req.body.content
//    }
//
//    var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
//    newComment.save(function (err) {
//        if (err) {
//            req.flash('error', err);
//            return res.redirect('back');
//        }
//        req.flash('success', '留言成功！！');
//        res.redirect('back');
//    })
//});
//
//router.get('/edit/:name/:day/:title', checkLogin);
//router.get('/edit/:name/:day/:title', function (req, res) {
//    var currentUser = req.session.user;
//    Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
//        if (err) {
//            req.flash('error', err);
//            return res.redirect('/');
//        }
//        res.render('edit', {
//            title: '编辑',
//            post: post,
//            user: req.session.user,
//            success: req.flash('success').toString(),
//            error: req.flash('error').toString()
//        })
//    })
//});
//
//router.post('/edit/:name/:day/:title', checkLogin);
//router.post('/edit/:name/:day/:title', function (req, res) {
//    var currentUser = req.session.user;
//    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
//        var url = '/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title;
//        if (err) {
//            req.flash('error', err);
//            return res.redirect(url);//出错！返回文章页
//        }
//        req.flash('success', '修改成功！');
//        res.redirect(url);//成功！返回文章页
//    })
//});
//
//router.get('/remove/:name/:day/:title', checkLogin);
//router.get('/remove/:name/:day/:title', function (req, res) {
//    var currentUser = req.session.user;
//    Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
//        var url = '/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title;
//        if (err) {
//            req.flash('error', err);
//            return res.redirect('back');//出错！返回文章页
//        }
//        req.flash('success', '删除成功！');
//        res.redirect('/');//成功！返回文章页
//    })
//});
//
//
//function checkLogin(req, res, next) {
//    if (!req.session.user) {
//        req.flash('error', '未登录！');
//        res.redirect('/login');
//    }
//    next();
//}
//function checkNotLogin(req, res, next) {
//    if (req.session.user) {
//        req.flash('error', '已登录！');
//        res.redirect('back');
//    }
//    next();
//}