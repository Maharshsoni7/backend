import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: 'Welcome Maharsh soni on Backend'
    // })

    //response from front end 
    //validation check
    //check if user ins not already  exist 
    //check avatar image 
    //upload on cloudier
    //create user object - create entry in db
    //remove pass and refresh token from filed 
    //return res


    const { username, email, fullName, password } = req.body
    console.log("emailL:", email);

    if ([username, email, fullName, password].some((field => field?.trim() === ''))) {
        throw new ApiError(400, 'all fields are required')
    }
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, 'user with email or username already exists')
    }

    const avatarLocalPath = req?.files?.avatar[0]?.path;
    const coverImageLocalPath = req?.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, 'avatar file is  required')
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, 'avatar file is  required')
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        username: username.toLowerCase(),
        email,
        password,
        coverImage: coverImage?.url || ''

    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while register user')
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})


export { registerUser }