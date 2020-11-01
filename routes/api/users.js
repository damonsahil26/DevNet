const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator/check');



//@route POST api/users
//@desc Register User
//@access public

router.post('/',[
    check('name','Please enter the name').not().isEmpty(),
    check('email','Please enter a valid Email Address').isEmail(),
    check('password','Please enter a valid password with 6 or more characters').isLength({min:6})
],(req,res)=>{ 
    const errors= validationResult(req) ;
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    console.log(req.body);
    res.send("User Route")});
module.exports=router;