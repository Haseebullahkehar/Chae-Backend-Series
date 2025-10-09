// import { Router } from 'express';
// import { registerUser } from '../controllers/user.controller.js';
// import {upload} from "../middlewares/multer.middleware.js"


// const router = Router()

// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }, 
//         {
//             name: "coverImage",
//             maxCount: 1
//         }
//     ]),
    
//     registerUser
//     )
    
// export default router;

import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

//for uploading images to cloudinary 
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
    
    registerUser
)

//while hitting ../users/register, it will first execute the app.js folder where userRouter is declared, 
// the router will redirect to to user.routes.js file and will execute the route  (/register), 
// and then it will try to execute the post method i.e, registerUser and the fn will go into user.controller.js file and will 
// execute the logic for registerUser

// 1. app.js file  (/api/v1/users)

// 2. user.routes.file  (/api/v1/users/register)
// 3. user.contoller.js file --business logic (registerUser)


export default router
