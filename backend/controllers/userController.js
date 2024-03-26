import asyncHandler from "express-async-handler"
import { User } from '../models/userModel.js';
import { generateToken } from "../config/generateToken.js";

//  AUTHENTICATION

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    // cek apakah semua field sudah diisi 
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter All Field")
    }

    // lalu cek apakah user sudah terdaftar atau belum
    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User Already Exist");
    }

    // jika belum terdaftar buat user baru
    const newUser = await User.create({
        name,
        email,
        password,
        pic
    })


    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            pic: newUser.pic,
            token: generateToken(newUser._id)
        })
    } else {
        throw new Error("Failed to create User")
    }
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password")
    }

})

// QUERY

const getAllUser = asyncHandler(async (req, res) => {

    // jika query search ada cari document yang nama atau emailnya sesuai dengan query, kalau tidak ada query all user
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    // get user except user that login right now
    const user = await User.find(keyword)

    res.send(user)
})

export { registerUser, authUser, getAllUser };