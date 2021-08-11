const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require('../../models/Comment');

exports.commentPostController =async (req,res,next) => {
    let postId = req.params.postId;
    let {body} = req.body;

    if(!req.user){
        res.status(403).json({
            error : "You are not an authenticated user."
        });
    }

    let comment = new Comment({
        user: req.user._id,
        post:postId,
        body,
        replies:[]
    })

    try{

        let createdComment = await comment.save();

        await Post.findOneAndUpdate(
            {_id:postId},
            {$push: {'comments' : createdComment._id}}
        );

        let commentData = await Comment.findById(createdComment._id).populate({
            path: 'user',
            select: 'profilePics username'
        })

        return res.status(201).json(commentData)

    }catch(e){
        console.log(e);

        res.status(500).json({
            error: 'Internal server error.'
        })
    }
}


exports.replyPostController = async (req,res,next) => {
    let commentId = req.params.commentId;
    let {body} = req.body;

    if(!req.user){
        res.status(403).json({
            error : "You are not an authenticated user."
        });
    }

    let reply = {
        user: req.user._id,
        body,
    }

    try{

        await Comment.findOneAndUpdate(
            {_id:commentId},
            {$push: {'replies' : reply}}
        );

        res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics,
            username: req.user.username,
            createdAt: new Date().toLocaleString()
        });

    }catch(e){
        console.log(e);

        res.status(500).json({
            error: 'Internal server error.'
        })
    }
}