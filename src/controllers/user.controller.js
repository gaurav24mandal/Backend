import {asyncHandler}  from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import  {ApiResponse}      from "../utils/ApiResponse.js"
import {ApiError} from "../utils/apiError.js"
import {fileUpload} from "../utils/cloudinary.js"
import jwt from 'jsonwebtoken'

const registerUser = asyncHandler(async(req , res )=>{
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res 


    const {fullName , username , email , password} = req.body;
     

     if(
        [username ,fullName ,email, password].some((field)=>field?.trim() === "")
    ){
           throw new ApiError(400, 'All fields are required')
     }
       const existedUser = await User.findOne({
           $or : [{username}, {email}]
       })
       if(existedUser){
        throw new ApiError(401, "username or email already exists")
       }
      
       
       let avatarpath ;
       let coverImagePath = null;

       if(req.files){
       
        
          avatarpath = req.files.avatar[0].path
          }
      
       if(req.files.coverImage){
        coverImagePath = req.files.coverImage[0].path
       }
       if(!avatarpath){
        throw new ApiError(401, "avatar file is required at multer ");
       }
       const avatar = await fileUpload(avatarpath);
       console.log( 'avatar', avatar);
       
        let coverImage;
       if(coverImagePath){
         coverImage = await fileUpload(coverImagePath);
         console.log(coverImage);
         
       }
      
        
       if(!avatar){
        throw new ApiError(401, "avatar file is required at cloudinary");
       }
      
       
       
     const user = await User.create({
          fullName,
          avatar : avatar.url,
          coverImage : coverImage?.url || "",
          email,
          password,
          username: username.toLowerCase()
     })
    console.log(" user ", user);
    
   
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    console.log( `createdUser ${createdUser}`);
    
    if(!createdUser){
        throw new ApiError(500," something went wrong while regsitration of user please try again")
     }
     return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully ")
     )
})
const generateAccessTokenAndRefreshTokens = async(userId)=>{
   try {
         const user = await User.findById(userId)
        const accessToken =   user.generateAccessToken()
        const refreshToken = user.generateRefresh();
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave : false});
        
        return {refreshToken, accessToken}
       
        
   } catch (error) {
     throw new ApiError(500, "something went worng while generating refresh and access token ")
   }
}
const loginUser = asyncHandler(async(req, res)=>{
 /**
  * req  body = data 
  * username or email
  * find the user 
  * password check 
  * access token and refresh token
  * send cookies  
  * 
  */
 
 
 const { email, password, username} = req.body;
 console.log(req.body);
 
 if(!(username )){
  throw new ApiError(400, "Username or Email is required")
 }
 const user =  await User.findOne({
  $or: [{username}, {email}]
    })
    if(!user){
      throw ApiError(400, "User does not exist")
     }
     console.log(user);
     
      const isPasswordValid =   await  user.isPasswordCorrect(password);
      if(!isPasswordValid){
        throw  new ApiError(401, "Invalid User credientials")
       }
       const {refreshToken , accessToken} =  await generateAccessTokenAndRefreshTokens(user._id);
       const loggedInUserData = await User.findById(user._id).select("-password -refreshToken")
       const options = {
        httpOnly : true ,
        secure : true
       }
       
       
      
       
       
         return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", refreshToken,options)
         .json(
          new ApiResponse(200,{
                user : loggedInUserData, refreshToken, accessToken
          },
              "user logged In successfully"
        )
         )
         
  })

const  logout = asyncHandler(async(req, res)=>{
    try {
     
      
        await User.findByIdAndUpdate(req.user._id,
          {
            $unset:{
              refreshToken:1
            }
         },
         {
          new : true
         }
          )

     const options = {
      httpOnly: true,
      secure : true
     } 
     return res 
     .status(200)
     .clearCookie('accessToken', options)
     .clearCookie('refreshToken', options)
     .json(new ApiResponse(200, "user Logout successfully"))
          
    } catch (error) {
       throw new ApiError(400, "error while deleteing token user not logout ")
    }
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
        const incomingRefreshToken = req.cookie.accessToken || req.body;
        if(!incomingRefreshToken){
          throw new ApiError('unauthorized request');   
        }
      const decodedToken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SCERET);

      const user = await User.findById(decodedToken._id);

      if(!user){
        throw new ApiError(400, "invalid refresh token");
      }
      if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(400, 'token is expired')
      }
       
      options : {
        httpOnly: true;
        secure : true
      }
     const {accessToken , newRereshToken} = generateAccessTokenAndRefreshTokens(user._id)

      return res
      .status(200)
      .cookie('accessToken',accessToken, options)
      .cookie('refreshToken',  newRereshToken , options)
      .json(
        new ApiResponse(200,
          {accessToken , refreshToken: newRereshToken},
          "Access Token refreshed successfully"
        )
      )
})

   
export  {registerUser , loginUser, refreshAccessToken , logout}