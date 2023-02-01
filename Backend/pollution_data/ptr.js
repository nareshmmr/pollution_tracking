const express = require("express");
const router = express.Router();
const PtrSchema = require('./ptr_schema');



//getting all
router.get('/',async (req,res)=>{
    // console.log("get called");
    // try{
    // res.send("hello world")
    // }
    // catch(err){
    //     console.log(err.message);
    // }
    try{
        const ptrdata = await PtrSchema.find();
        res.json(ptrdata);
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
})

//getting one
// router.get('/:id',(req,res)=>{
    
// })

// //creating one
// router.post('/',(req,res)=>{
    
// })

// //updating one
// router.patch('/:id',(req,res)=>{
    
// })

// //deleting one
// router.delete('/:id',(req,res)=>{
    
// })

module.exports = router;