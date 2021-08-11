const {Schema , model} = require('mongoose');

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 350
    },
    body: {
        type: String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags:{
        type: [String]
    },
    thumbnail: String,
    readTime: String,
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]

}, {timestamps:true});

postSchema.index(
    {
        title: 'text',
        tags: 'text',
        body: 'text' 
    },
    {
        weights: {
            title: 5,
            tags: 5,
            body: 3
        }
    }
)

const Post = model('Post' , postSchema);

module.exports = Post;