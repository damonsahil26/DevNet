const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profiles');
const User=require('../../models/Users');
const { route } = require('./users');
//@route GET api/profile/me
//@desc get current user profile
//@access Private
router.get('/me',auth,  async(req,res)=> {
try {
    const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
    if(!profile){
        return res.status(400).json({msg:'There is no profile for this user'});
    }
    res.json(profile);
    
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
});
//@route POST api/profile
//@desc Create and update Profiles
//@access Private
router.post('/',[auth, [
    check('status', 'Status is Requierd').not().isEmpty(),
    check('skills','Skills is Required').not().isEmpty()
]],async (req,res)=>{
    const errors= validationResult(req) ;
        if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } =req.body;
    //Build profile object
    const profileFields={};
    profileFields.user=req.body.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(githubusername) profileFields.githubusername=githubusername;
    if(status) profileFields.status=status;
    if(skills) profileFields.skills=skills.split(',').map(skill => skill.trim());
    profileFields.social={};
    if(youtube) profileFields.social.youtube=youtube;
    if(instagram) profileFields.social.instagram=instagram;
    if(facebook) profileFields.social.facebook=facebook;
    if(twitter) profileFields.social.twitter=twitter;
    if(linkedin) profileFields.social.linkedin=linkedin;

   try {
    let profile= await Profile.findOne({user:req.user.id});
if(profile){
//Update
   profile=await Profile.findByIdAndUpdate({user:req.user.id},{$set:profileFields},{
       new:true
   });
   return res.json(profile);
}   
//Create
profile=new Profile(profileFields);
await profile.save();
return res.json(profile);
}
   catch(err){
       console.error(err.message);
       res.status(500).send('Server Error');
   }
    res.send('hello');
}
);


module.exports=router;