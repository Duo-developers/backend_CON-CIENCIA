import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article:{
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    message:{
        type: String,
        required: true,
        trim: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    versionKey: false    
})

commentSchema.methods.toJSON = function(){
    const {__v, _id, ...comment} = this.toObject();
    comment.cid = _id;
    return comment;
}

export default model('Comment', commentSchema)