const Flash = require('../utils/Flash');
const {
    validationResult
} = require('express-validator');
const errorFormatter = require('../utils/errorFormatter');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');



// Dashboard get controller
exports.dashboardGetController = async (req, res, next) => {

    try {

        let profile = await Profile.findOne({
            user: req.user._id
        })
        .populate({
            path: 'bookmarks',
            model: 'Post',
            select: 'title thumbnail readTime createdAt'
        })
        .populate({
            path: 'posts',
            model: 'Post',
            select: 'title thumbnail readTime createdAt'
        })
        if (!profile) {
            return res.redirect('/dashboard/create-profile')
        }

        res.render('dashboard/dashboard', {
            title: 'Daahboard | Blog',
            flashMessage: Flash.getMessage(req),
            profile,
            posts: profile.posts.reverse().slice(0,4),
            bookmarks: profile.bookmarks.reverse().slice(0,4)
        })

    } catch (e) {
        next(e)
    }


}


// Create Profile controller
exports.createProfileGetController = async (req, res, next) => {

    try {

        let profile = await Profile.findOne({
            user: req.user._id
        })

        if (profile) {
            return res.redirect('/dashboard/edit-profile')
        }

        res.render('dashboard/profile/create-profile', {
            title: 'Create Profile | Blog',
            flashMessage: Flash.getMessage(req),
            error: {},
            value: {}
        })

    } catch (e) {
        next(e)
    }

}


exports.createProfilePostController = async (req, res, next) => {
    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body

    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        req.flash('fail', 'Invalid Credentials')
        return res.render('dashboard/profile/create-profile', {
            title: 'Create Profile | Blog',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            value: {
                name,
                title,
                bio,
                website,
                facebook,
                twitter,
                github
            }
        })
    }

    try {

        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePics: req.user.profilePics,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || '',
            },
            posts: [],
            bookmarks: []
        });

        let createdProfile = await profile.save();

        await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: {
                profile: createdProfile._id
            }
        });

        req.flash('success', 'Profile Created Successfully!');

        res.redirect('/dashboard')

    } catch (e) {
        next(e)
    }
}


exports.editProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({
            user: req.user._id
        })
        if (!profile) {
            return res.redirect('/dashboard/create-profile')
        }

        res.render('dashboard/profile/edit-profile', {
            title: 'Edit Profile | Blog',
            flashMessage: Flash.getMessage(req),
            error: {},
            value: profile
        })
    } catch (e) {
        next(e)
    }
}


exports.editProfilePostController = async (req, res, next) => {

    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body

    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        req.flash('fail', 'Invalid Credentials')
        return res.render('dashboard/profile/edit-profile', {
            title: 'Edit Profile | Blog',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            value: {
                name,
                title,
                bio,
                links: {
                    website: website,
                    facebook: facebook,
                    twitter: twitter,
                    github: github
                }
            }
        })
    }

    try {

        let updatedProfile = await Profile.findOneAndUpdate(
            {user: req.user._id}, 
            {$set: {
                name,
                title,
                bio,
                profilePics: req.user.profilePics,
                links: {
                    website: website || '',
                    facebook: facebook || '',
                    twitter: twitter || '',
                    github: github || '',
                }
            }}, 
            {new: true}
        )

        req.flash('success' , 'Profile Updated Successfully!');
        res.render('dashboard/profile/edit-profile' , {
            title: 'Edit Profile | Blog',
            flashMessage: Flash.getMessage(req),
            error: {},
            value: updatedProfile
        })

    } catch (e) {
        next(e)
    }
}


exports.profileGetController = async (req,res,next) =>{
    try{

        let profile = await Profile.findOne({user: req.user._id})

        if(!profile){
            return res.redirect('/dashboard/create-profile')
        }

        let posts = await Post.find({author:req.user._id})

        posts = posts.reverse();

        res.render('dashboard/profile/profile' , {
            title: 'Profile | Blog',
            flashMessage: Flash.getMessage(req),
            posts,
            profile
        })

    }catch(e){
        next(e)
    }
}



exports.bookmarksGetController = async (req,res,next) =>{

    try{
        let profile = await Profile.findOne({user: req.user._id})
            .populate({
                path: 'bookmarks',
                model: 'Post',
                select: 'title thumbnail readTime createdAt'
            })

        res.render('dashboard/bookmarks' , {
            title: 'Bookmarks | Blog',
            flashMessage: Flash.getMessage(req),
            profile,
            posts:profile.bookmarks,
        })
    }catch(e){
        next(e)
    }

}


exports.commentsGetController = async (req,res,next) =>{
    try{

        let profile = await Profile.findOne({user : req.user._id})
        let comments = await Comment.find({post : {$in : profile.posts}})
            .populate({
                path : 'post',
                select: 'title thumbnail'
            })
            .populate({
                path: 'user',
                select: 'username profilePics'
            })
            .populate({
                path: 'replies.user',
                select: 'username profilePics'
            })

        
        res.render('dashboard/comments' , {
            title: 'Comments | Blog',
            flashMessage: Flash.getMessage(req),
            profile,
            comments,
        })

    }catch(e){
        console.log(e);
        next(e)
    }
}

