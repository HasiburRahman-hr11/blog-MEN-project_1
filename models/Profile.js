const {Schema , model} = require('mongoose');

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name:{
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    title: {
        type: String,
        maxLength: 150,
        required: true,
        trim: true,
    },
    bio:{
        type: String,
        maxLength: 500,
        required: true,
        trim: true,
    },
    profilePics: String,
    links: {
        website: String,
        facebook: String,
        twitter: String,
        github: String,
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        }
    ]
},{
    timestamps:true
});

const Profile = model('Profile' , profileSchema);

module.exports = Profile;