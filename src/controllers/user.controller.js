// import {asyncHandler} from "../utils/asyncHandler.js";
// import {ApiError} from "../utils/ApiError.js"
// import {User} from "../models/user.model.js"
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asyncHandler( async (req, res) => {
//     // get user details from frontend
//     // validation - not empty
//     // check if user already exists: username, email
//     // check for images, check for avatar
//     // upload them to cloudinary, avatar
//     // create user object - create entry in db
//     // remove password and refresh token field from response
//     // check for user creation
//     // return res


//     const {fullName, email, username, password } = req.body
//     console.log("incoming fields:", { email, username, fullName });
//     if (req.files) {
//         const filesSummary = Object.fromEntries(
//             Object.entries(req.files).map(([k, v]) => [
//                 k,
//                 v?.map(f => ({ fieldname: f.fieldname, originalname: f.originalname, path: f.path, mimetype: f.mimetype, size: f.size }))
//             ])
//         );
//         console.log("incoming files:", filesSummary);
//     }

//     if (
//         [fullName, email, username, password].some((field) => field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }

//     const existedUser = await User.findOne({
//         $or: [{ username }, { email }]
//     })

//     if (existedUser) {
//         throw new ApiError(409, "User with email or username already exists")
//     }
//     //console.log(req.files);

//     const avatarFile = req.files?.avatar?.[0];
//     const avatarLocalPath = avatarFile?.path;
//     let coverImageLocalPath = req.files?.coverImage?.[0]?.path;

//     // let coverImageLocalPath;
//     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//         coverImageLocalPath = req.files.coverImage[0].path
//     }
    
    
//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar file is required. Send multipart/form-data with field name 'avatar' and an image file.")
//     }
//     // Pre-upload sanity checks
//     if (typeof avatarFile?.size === 'number' && avatarFile.size === 0) {
//         throw new ApiError(400, "Avatar file appears to be empty or corrupt. Please choose a valid image.")
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null

//     if (!avatar) {
//         console.log("avatar upload result:", avatar);
//         throw new ApiError(400, "Failed to upload avatar. Ensure it is a valid image file.")
//     }
   

//     const user = await User.create({
//         fullName,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         email, 
//         password,
//         username: username.toLowerCase()
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )

//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering the user")
//     }

//     return res.status(201).json(
//         new ApiResponse(200, createdUser, "User registered Successfully")
//     )

// } )

// export {registerUser}
    
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res) => {
     // get user details from frontend
//     // validation - not empty
//     // check if user already exists: username, email
//     // check for images, check for avatar
//     // upload them to cloudinary, avatar
//     // create user object - create entry in db
//     // remove password and refresh token field from response
//     // check for user creation
//     // return res

    const {fullName, username, email, password}= req.body //this line is called destructuring, It extracts values directly from the req.body object (the data sent in the request).
    // console.log("email", email)
    // console.log(req.body)
    
    // validation (beginner level)
//  if (fullName === "") {
//         throw new ApiError(400, "FullName is required")
        
//     }

// SOME Method :  is used for validation in one go rather than writing all aforementioned if statements

    if (
        [fullName, username, email, password].some((field) => field?.trim() === "" )) //Returns true if at least one element satisfies the condition.
        
        throw new ApiError(400, "All fields are required");
    {
        
    }

    if (!email.includes("@")) {
        throw new ApiError(400, "Email is invalid")
        
    }
// It queries your database (MongoDB most likely) using Mongoose.

// $or means: find one user where either username or email matches.

// Example:
// “Find me a user whose username is john123 OR whose email is john@example.com.”

// ⚠️ User.findOne() returns a Promise, so you must await it if your function is async

    const existedUser= await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
        
    }

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath= req.files?.coverImage?.[0]?.path;

    // let coverImageLocalPath;

    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path;

        
    // }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
        
    }
    console.log(req.files)

    //upload avatar on cloudinary 
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar. Invalid or unsupported image.")


    }

    //create user object in db- entry in the db 
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username:  username.toLowerCase(),
        email,
        password
    })

    // remove password and refresh token field from response ( we do not want that users be allowed to see password and refresh tokens)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
        
    )
    // check if the user has been created successfully by id 

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
        
    }

    //Return response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    
})

export {registerUser}
