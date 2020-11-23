const express=require('express');
const auth = require('../../middleware/auth');
const {check,validationResult}=require('express-validator');
const User=require('../../models/Users');
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const router=express.Router();
//@route GET api/auth
//@desc Test Route
//@access public
router.get('/',auth,async (req,res)=> {
try{
const user= await User.findById(req.user.id).select('-password');
res.json(user);
}catch(err){
    console.error(err);
    res.status(500).send('Server Error');
}
});


//@route POST api/auth
//@desc Authenticate User & get Token
//@access public


router.post('/',[
    check('email','Please enter a valid Email Address').isEmail(),
    check('password','Password is required').exists()
],
 async(req,res)=>{ 
    const errors= validationResult(req) ;
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password}=req.body;

try{
    //See if User email is exists
    let  user= await User.findOne({email});
    if(!user){
        res.status(400).json({errors:[{msg:"Invalid Credentials"}]});
    }
// Compare Password

const isMatch=await bcrypt.compare(password,user.password);
  if(!isMatch){
    res.status(400).json({errors:[{msg:"Invalid Credentials"}]});
  }
//Return jwt
const payload= {
    user:{
        id:user.id
    }
}
jwt.sign(
    payload,
    config.get('jwtSecret'),
    {expiresIn:360000},
    (err,token)=>{
        if(err) throw err;
        res.json({token});

    }
    );
    
}
catch(err){
console.error(err.message);
res.status(500).send('Server Error');

}


    console.log(req.body);
    
}
);
module.exports=router;