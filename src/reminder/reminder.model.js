import { Schema, model } from "mongoose";

const reminderSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    notificationMethod: {
        type: String,
        enum: ["email", "calendar"],
        required: true
    },
    reminderTime: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
    }, {
    timestamps: true,
    versionKey: false
});

export default model("Reminder", reminderSchema);
