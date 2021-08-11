const Post = require('../models/Post');
const Profile = require('../models/Profile');
const readingTime = require('reading-time');

const Flash = require('../utils/Flash');
const { validationResult } = require('express-validator');
const errorFormatter = require('../utils/errorFormatter');

exports.createPostGetController = async (req, res, next) => {

    let profile = await Profile.findOne({ user: req.user._id })
    res.render('posts/create-post', {
        title: 'Create new post | MERN Blog',
        flashMessage: Flash.getMessage(req),
        error: {},
        value: {},
        profile
    })
}


exports.createPostPostController = async (req, res, next) => {

    let profile = await Profile.findOne({ user: req.user._id })

    let { title, body, tags } = req.body;

    let errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        req.flash('fail', 'Invalid Information!')

        return res.render('posts/create-post', {
            title: 'Create new post | MERN Blog',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            value: { title, body, tags },
            profile
        });
    }

    if (tags) {
        tags = tags.split(',').map(tag => {
            return tag.trim()
        })
    }

    let readTime = readingTime(body).text;

    let post = new Post({
        title,
        body,
        author: req.user._id,
        tags,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })

    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`
    }
    console.log(req.file)

    try {

        let createdPost = await post.save();

        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { 'posts': createdPost._id } }
        )

        req.flash('success', 'Post created successfully!');

        res.redirect(`/posts/edit-post/${createdPost._id}`)

    } catch (e) {
        next(e)
    }


}

exports.editPostGetController = async (req, res, next) => {

    try {
        let profile = await Profile.findOne({ user: req.user._id });
        let postId = req.params.postId;
        let post = await Post.findOne({ author: req.user._id, _id: postId });

        if (!post) {
            let error = new Error('404 Page not found!')
            error.status = 404
            throw error
        }

        res.render('posts/edit-post', {
            title: 'Edit Post | MERN Blog',
            flashMessage: Flash.getMessage(req),
            error: {},
            profile,
            post
        })

    } catch (e) {
        next(e)
    }
}


exports.editPostPostController = async (req, res, next) => {

    let { title, body, tags } = req.body

    try {

        let profile = await Profile.findOne({ user: req.user._id });
        let postId = req.params.postId;
        let post = await Post.findOne({ author: req.user._id, _id: postId });

        if (!post) {
            let error = new Error('404 Page not found!')
            error.status = 404
            throw error
        }

        let errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {
            req.flash('fail', 'Invalid Information!')

            return res.render('posts/edit-post', {
                title: 'Edit  post | MERN Blog',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped(),
                post,
                profile
            });
        }

        let readTime = readingTime(body).text;

        if (tags) {
            tags = tags.split(',').map(tag => {
                return tag.trim()
            })
        }

        let thumbnail = post.thumbnail
        if (req.file) {
            thumbnail = `/uploads/${req.file.filename}`
        }
        

        let updatedPost = await Post.findOneAndUpdate(
            {_id: postId},
            {$set: {title, body, tags, thumbnail, readTime}},
            {new: true}
        );


        req.flash('success', 'Post updated successfully.');

        res.redirect(`/posts/edit-post/${post._id}`);

    } catch (e) {
        next(e)
    }
}



exports.deletePostGetController =async (req, res, next) =>{
    let postId = req.params.postId;

    try{
        let post = await Post.findOne({ author: req.user._id, _id: postId });
        if(!post){
            let error = new Error('404 page not found')
            error.status(404)
            throw error;
        }

        await Post.findOneAndDelete({_id: postId});

        await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$pull : {'posts' : postId}}
        );

        req.flash('success', 'Post deleted successfully!');
        res.redirect('/posts');

    }catch(e){
        next(e)
    }

}