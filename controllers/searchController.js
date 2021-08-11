const Post = require('../models/Post');
const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');

exports.searchGetController = async (req, res, next) => {

    let term = req.query.term;

    let currentPage = Number.parseInt(req.query.page  , 10) || 1;
    let itemPerPage = 10;
    try {

        let posts = await Post.find({
            $text: {
                $search: term
            }
        })
        .populate('author', 'username')
        .skip((itemPerPage*currentPage) - itemPerPage)
        .limit(itemPerPage)
        
        let totalPost = await Post.countDocuments({
            $text: {
                $search: term
            }
        });

        let bookmarks = [];

        if(req.user){
            let profile = await Profile.findOne({user:req.user._id});

            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        let totalPage = totalPost / itemPerPage;

        res.render('explorer/search' , {
            title: `Showing result for - ${term}`,
            flashMessage: Flash.getMessage(req),
            searchTerm: term,
            itemPerPage,
            currentPage,
            totalPage,
            bookmarks,
            posts
        })

    } catch (e) {
        next(e)
    }

}

