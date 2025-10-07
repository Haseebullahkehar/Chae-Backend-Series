import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler (async (req, res) => {
    // Steps to get the user register 
    // Get the user information from frontend
    // validation - not empty 
    // check if user already exists: username, email 
    // check for images, check for avatar 
    // upload them to cloudinary, avatar 
    // create user object - create entry in db 
    // remove password and refresh token field from response 
    // check for user creation 
    // return res 

     const {fullName, username, email, password }= req.body 
     console.log("email: ", email );

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")

        }
        // validate if email has proper format
        if (!email.includes("@")) {
            throw new ApiError(400, "Invalid email format")
        }

        // if email or username already exists 
        const existedUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if(existedUser){
            throw new ApiError(409, "User with email or username already exists")
        }
        
        // avatar image 
        const avatarLocalPath = req.files?.avatar[0]?.path 
        // cover image
        const coverImageLocalPath = req.files?.coverImage[0]?.path

        if (!avatarLocalPath) {
            throw new ApiError (400, "Avatar file is required")
            
        }

        // uploadOnCloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const compareverImage = await uploadOnCloudinary(coverImageLocalPath)

        // check if avatar and coverImage uploaded successfully
         if (!avatar){
            throw new ApiError(400, "Failed to upload avatar or cover image")
            console.log("avatar: ", avatar);
            
         }

        //  create user object in db 
         const user= await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
            
        })

       const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
       )
       if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
       }

       return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully"
       )
    )


        
})

export {registerUser}
    
