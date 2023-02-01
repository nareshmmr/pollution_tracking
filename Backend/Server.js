require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());
const mongoose = require("mongoose");
mongoose.connect(process.env.DATA_BASE_URL,{useNewUrlParser:true});
const db = mongoose.connection;
db.on("error",(error)=>console.log(error));
db.once("open",()=>console.log("connected to database2"));

app.use(express.json());
const ptrRoutes = require('./pollution_data/ptr');
app.use('/ptr',ptrRoutes);

app.listen(5005,()=>console.log("server started2"));











//const createRequest = require('./index').createRequest

// const express = require('express')
// //const bodyParser = require('body-parser')
// const app = express()
// //const port = process.env.EA_PORT || 5001

// app.use(express.json())

// // app.post('/', (req, res) => {
// //   console.log("request value is",req.body)
// //   createRequest(req.body, (status, result) => {
// //     console.log('Result: ', result)
// //     res.status(status).json(result)
// //   })
// // })
// app.get('/',async (req,res)=>{
//     try{
//     res.send("hello world")
//     }
//     catch(err){
//         console.log(err.message);
//     }
//     // try{
//     //     const ptrdata = await PtrSchema.find();
//     //     res.json(ptrdata);
//     // }
//     // catch(err)
//     // {
//     //     res.status(500).json({message:err.message});
//     // }
// })
// app.listen(5005, () => console.log(`Listening on port ${5005}!`))
