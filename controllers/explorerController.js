const Flash = require('../utils/Flash');
const Post = require('../models/Post');
const Profile = require('../models/Profile');

const moment = require('moment');

let genDays = (days) =>{
    let date = moment().subtract(days , 'days')
    return date.toDate()
}

let generateFilterObj = (filter) =>{
    let filterObj = {}
    let order = 1

    switch (filter) {
        case 'week' : {
            filterObj = {
                createdAt: {
                    $gt : genDays(7)
                }
            },
            order = -1
            break;
        }

        case 'month' : {
            filterObj = {
                createdAt: {
                    $gt : genDays(30)
                }
            },
            order = -1
            break;
        }

        case 'all' : {
            order = -1
            break;
        }
            
            
    
    }

    return {
        filterObj,
        order
    }
}


exports.getAllPostsController = async (req,res,next) =>{

    let filter = req.query.filter || 'latest';
    let {filterObj , order} = generateFilterObj(filter.toLowerCase());

    let currentPage = Number.parseInt(req.query.page , 10) || 1;
    let itemPerPage = 9;
    
    try{
        let posts = await Post.find(filterObj)
        .populate('author', 'username')
        .sort(order === 1 ? '-createdAt' : 'createdAt')
        .skip((itemPerPage*currentPage) - itemPerPage)
        .limit(itemPerPage)


        let bookmarks = [];

        if(req.user){
            let profile = await Profile.findOne({user:req.user._id});

            if(profile){
                bookmarks = profile.bookmarks
            }
        }
        
        let totalPost = await Post.countDocuments()
        let totalPage = totalPost / itemPerPage

        res.render('explorer/explorer' , {
            title: 'Home | MERN Blog',
            flashMessage: Flash.getMessage(req),
            posts,
            filter,
            bookmarks,
            itemPerPage,
            totalPage,
            currentPage
        })
    }catch(e){
        next(e)
    }

}


exports.singlePostGetController = async (req,res,next) => {
    let postId = req.params.postId;

    try{

        let post = await Post.findById(postId)
            .populate('author' , 'username profilePics')
            .populate({
                path: 'comments' ,
                populate: {
                    path : 'user',
                    select: 'username profilePics'
                }
            })
            .populate({
                path : 'comments',
                populate:{
                    path: 'replies.user',
                    model: 'User',
                    select: 'username profilePics'
                }
            })

        if(!post){
            let error = new Error('404 page not found!')
            error.status(404)
            throw error;
        }


        let bookmarks = [];

        if(req.user){
            let profile = await Profile.findOne({user:req.user._id});

            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        res.render('explorer/single-post' , {
            title: `${post.title} | MERN Blog`,
            flashMessage: Flash.getMessage(req),
            post,
            bookmarks
        })

    }catch(e){
        next(e)
    }

}