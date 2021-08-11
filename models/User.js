const {Schema , model} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required:true,
        trim:true,
        maxLength:30
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    profilePics: {
        type: String,
        default: '/uploads/avatar.png'
    }
},{timestamps:true});

const User = model('User' , userSchema);

module.exports = User;