const {Schema , model} = require('mongoose');

const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        requred: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        requred: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    replies: [
        {
            body: {
                type: String,
                required: true,
                trim: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                requred: true
            },
            createdAt: {
                type: Date,
                default: new Date()
            }
        }
    ]
    
},{
    timestamps:true
});

const Comment = model('Comment' , commentSchema);

module.exports = Comment;