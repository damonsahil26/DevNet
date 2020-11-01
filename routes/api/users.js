const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator/check');
const User =require('../../models/Users');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');

//@route POST api/users
//@desc Register User
//@access public


router.post('/',[
    check('name','Please enter the name').not().isEmpty(),
    check('email','Please enter a valid Email Address').isEmail(),
    check('password','Please enter a valid password with 6 or more characters').isLength({min:6})
],
 async(req,res)=>{ 
    const errors= validationResult(req) ;
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password}=req.body;

try{
    //See if User exists
    let  user= await User.findOne({email});
    if(user){
        res.status(400).json({errors:[{msg:"User already exists"}]});
    }

    // Use gravatar for User
    const avatar= gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
    });

     user=new User({
        name,
        email,
        avatar,
        password
    });

    //Encrypt the password
const salt= await bcrypt.genSalt(10);
user.password=await bcrypt.hash(password,salt);

await user.save();

    res.send("User Registered");
}
catch(err){
console.error(err.message);
res.status(500).send('Server Error');

}


    console.log(req.body);
    
}
);
module.exports=router;