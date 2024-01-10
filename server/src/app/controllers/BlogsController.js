const Blog = require("../models/Blogs");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Notification = require('../models/Notification')

const fs = require("fs");
const path = require("path");
class BlogsController {
    // BlogsController() {
    //     limits = 5;
    // }

    // [GET] /blogs/users/:id
    getByUserId = async function (req, res) {
        const userId = req.params.id;

        const blogs = await Blog.find({ userId: userId }).then(function (query) {
            query = Array.from(query);
            query = query.map((blog) => blog.toObject());
            return query;
        });
        res.send(blogs);
    }

    // [GET] /blogs/top
    showTop = async (req, res, next) => {
        await Blog.find({})
            .then((query) => {
                query = Array.from(query);
                query = query.map((blog) => blog.toObject());

                res.send(query);
            })
            .catch((err) => next(err));
    }

    // [GET] /blogs/moi-truong
    showAboutEnvironment = async (req, res, next) => {
        await Blog.find({})
            .then((query) => {
                query = Array.from(query);
                query = query.map((blog) => blog.toObject());
                return query;
            })
            .then(async (blogs) => {
                for (let i = 0; i < blogs.length; i++) {
                    blogs[i].username = await User.findById(blogs[i].userId)
                        .then(user => user.toObject())
                        .then(user => user.username);
                }
                return blogs
            })
            .then(blogs => { res.send(blogs) })
            .catch((err) => next(err));
    }

    // [GET] /blogs/all?limits&pageIndex
    showAll = async (req, res, next) => {
        const limits = req.query.limits || 5;
        const pageIndex = req.query.pageIndex || 1;

        await Blog.find({})
            .limit(limits)
            .skip((pageIndex - 1) * limits)
            .sort({ create_at: -1 })
            .then(async (query) => {
                query = Array.from(query);
                query = query.map((blog) => blog.toObject());

                for (var i = 0; i < query.length; i++) {
                    query[i].username = await User.findById(query[i].userId)
                        .then((user) => user.toObject().username);
                }

                res.send(query);
            })
            .catch((err) => next(err));
    }

    // [GET] /blogs/single/:id
    showSingle = async (req, res) => {
        const id = req.params.id;
        // console.log(req.params);

        const blog = await Blog.findById(id)
            .then((blog) => blog.toObject())
            .catch((err) => {
                console.log(err);
            });

        const username = await User.findById(blog.userId)
            .then((user) => user.toObject())
            .then((user) => user.username);
        blog.username = username;

        res.send(blog);
    }

    // [POST] /blogs/delete/single
    deleteSingle = async (req, res, next) => {
        const user = req.user;
        const data = req.body;

        if (user.id !== data.userId || !data.blogId) {
            res.send({
                error: "Invalid",
            });
        } else {
            await Blog.findById(data.blogId)
                .then(value => value.toObject())
                .then(blog => {
                    // delete all files from upload directory
                    const files = blog.files;
                    console.log(files);

                    try {
                        for (let i = 0; i < files.length; i++)
                            fs.unlink(path.join(__dirname, '..', '..', '..', 'public', 'blogs', files[i].filename),
                                function success() {
                                    console.log('DELETING ' + files[i].filename);
                                });
                        return true;
                    } catch (e) {
                        console.log('ERROR: ' + e.message);
                        return false;
                    }
                })
                .then(status => status)
                .catch((err) => res.send(err));

            await Blog.findByIdAndDelete(data.blogId)
                .then((value) => res.send({ ...value, success: true }))
                .catch((err) => res.send(err));
        }
    }

    // [POST] /blogs
    uploadOne = async (req, res) => {
        const data = req.body;
        // console.log("BLOGS POST", req.files);

        var blog = new Blog({
            title: data.title,
            description: data.detail.substring(0, 200),
            detail: data.detail,
            userId: data.userId,
            files: [...req.files],
        });

        await blog.save();

        res.redirect("back");
    }

    // [POST] /blogs/edit/:id
    edit = async (req, res) => {
        const data = req.body;
        const id = req.params.id;
        var blog = {
            id: id,
            title: data.title,
            detail: data.detail,
        }
        // console.log('BLOG: ', blog);

        try {
            var curr = await Blog.updateOne({ _id: blog.id }, blog);
            res.send({
                data: curr
            });
        } catch (err) {
            res.send({ error: err.message });
        }
    }


    // [POST] /blogs/comments
    postComment = async (req, res) => {
        const data = req.body;
        if (!data.content)
            res.send({ error: 'You must write a content for the comment' });

        const comment = new Comment({
            username: req.user.username,
            blogId: data.blogId,
            content: data.content,
        });

        await comment.save();

        const currentBlog = await Blog.findById(data.blogId);
        const user2 = await User.findById(currentBlog.userId);

        if (user2) {

            let noti = new Notification({
                username: user2.username,
                content: `<b>${req.user.username}</b> đã bình luận bài viết của bạn`,
                link: `/blogs/single/${currentBlog._id}`,
            });
            await noti.save();
        }

        res.send(comment)
    };

    // [GET] /blogs/comments/:id?limits
    getComment = async (req, res) => {
        const limits = req.query.limits;
        await Comment.find({ blogId: req.params.id })
            .limit(limits)
            .then((comments) => comments.map((comment) => comment.toObject()))
            .then((comments) => {
                res.send(comments)
            }).catch((error) =>
                res.send({ error: error.message }));
    }
}

module.exports = new BlogsController;
