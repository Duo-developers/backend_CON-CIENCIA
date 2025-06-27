import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    perfil: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }],
    status: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['USER_ROLE', 'MODERATOR_ROLE', 'ADMIN_ROLE'],
        default: 'USER_ROLE'
    },
}, {
    timestamps: true,
    versionKey: false
})

userSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

export default model('User', userSchema);