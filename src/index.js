import express from 'express';
import mongoose from 'mongoose';
import { app } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

app.use(express.json())
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI  ,
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});


// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { app } from './app.js';

// dotenv.config();

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };

// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT || 3000, () => {
//       console.log(`Server is running on port ${process.env.PORT || 3000}`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection failed:', err);
//     process.exit(1);
//   });













// require('dotenv').config({path: './env'})
// import dotenv from "dotenv"
// import connectDB from "./db/index.js";
// import {DB_NAME} from "./constants.js"
// // import {app} from './app.js'
// // dotenv.config({
// //     path: './.env'
// // })



// // connectDB()
// // .then(() => {
// //     app.listen(process.env.PORT || 8000, () => {
// //         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
// //     })
// // })
// // .catch((err) => {
// //     console.log("MONGO db connection failed !!! ", err);
// // })











// import express from "express"
// const app = express()
// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("errror", (error) => {
//             console.log("ERRR: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })

//     } catch (error) {
//         console.error("ERROR: ", error)
//         throw err
//     }
// })()

