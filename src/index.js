// require('dotenv').config()

import dotenv from 'dotenv'
import { app } from './app.js'
import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})
connectDB()
    .then(() => {
        app.listen(process.env.PROT || 8000, () => {
            console.log(`Server is running at port :${process.env.PROT}`);
        })
    }).catch((err) => {
        console.log("Mongo db Err", err);
    })