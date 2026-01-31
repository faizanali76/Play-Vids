import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        
    },
     avatar:{
        type: String,
        required: true,
        
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    coverImage:{
        type: String,
        
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: [true, "Password is Required"]
    },
    refreshToken:{
        type: String,
    }

},{timestamps: true})

// this code runs before saving the user into db, it's a mongoose middleware
userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})
// method to compare password, used during login to verify password correctness 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
        _id: this.id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
        _id: this.id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User = mongoose.model("User", userSchema);