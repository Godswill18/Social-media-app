import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    desc: {
        type: String,
        default: "",
    },
    img: {
        type: String,
        default: "",
    },
    likes: [

        {

            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
        },
    ],
    
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;