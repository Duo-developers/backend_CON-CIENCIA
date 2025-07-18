import {Schema, model} from 'mongoose';

const articleSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type: String,
        required: true,
        trim: true
    },
    category:[{
        type: String,
        enum: [
            'Biology', 'Chemistry', 'History', 'Medicine', 'Astronomy'
        ],
        required: true
    }],
    images:[{
        type: String
    }],
    videos:[{
        type: String
    }],
    createdAt:{
        type: Date,
        default: Date.now
    },
    status:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    versionKey: false    
})

articleSchema.methods.toJSON = function(){
    const {__v, _id, ...art} = this.toObject();
    art.aid = _id;
    return art;
}

export default model('Article', articleSchema)