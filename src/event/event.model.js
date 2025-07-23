import { Schema, model } from "mongoose";

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category:{
        type: String,
        enum: [
            'Biology', 'Chemistry', 'History', 'Medicine', 'Astronomy'
        ],
        required: true
    },
    externalLinks: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        url: {
            type: String,
            required: true,
            trim: true
        }
    }],
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    versionKey: false    
})

eventSchema.methods.toJSON = function() {
    const { __v, _id, ...event } = this.toObject();
    event.eid = _id;
    return event;
}

export default model('Event', eventSchema);