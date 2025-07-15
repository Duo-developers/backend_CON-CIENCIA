import User from "../user/user.model.js";
import Article from "../article/article.model.js"

export const emailExists = async (email = "") => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }
}

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The username ${username} is already registered`)
    }
}

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("The user does not exist")
    }
}

export const articleExists = async (aid = " ") => {
    const existe = await Article.findById(aid)
    if (!existe) {
        throw new Error("The Article does not exist")
    }
}