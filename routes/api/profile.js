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
    profileFields.user= req.user.id;
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
   profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{
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
//@route GET api/profile
//@desc GET all profiles
//@access Public

router.get('/', async(req,res)=>{
    try {
        const profiles= await Profile.find().populate('user',['name','avatar']);
        res.send(profiles);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/profile/user/:user_id
//@desc GET id by profile
//@access Public

router.get('/user/:user_id',async(req,res)=>{
try {
    const profile= await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
    if(!profile) return res.status(500).json({msg:'Profile not found'});
    res.json(profile);
} catch (error) {
    console.error(error.message);
    if(error.kind=='ObjectId'){
        return res.status(500).json({msg:'Profile Not found'});   
    }
    res.status(500).send('Server Error');    
}

});
//@route DELETE api/profile
//@desc Delete the profile, user and Post
//@access Private 

//@to-do Delete the posts of the User

router.delete('/',auth,async(req,res)=>{

    try {
        //Delete the profile
        await Profile.findOneAndRemove({user:req.user.id});

        //Delete the User

        await User.findOneAndRemove({_id:req.user.id});
        res.json({msg:'User Deleted'});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Profile not found');
    }

});

//@route PUT api/profile/experience
//@desc Add the user experience
//@access Private

router.put('/experience',[auth,[
    check('title','title is required').not().isEmpty(),
    check('company','company name is required').not().isEmpty(),
    check('from','from is required').not().isEmpty(),
]], 
 async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body;

    const newExp=
    {
        title,
        company,
        location,
        from,
        to,
        current,
        description 
    }

    try {
        const profile = await Profile.findOne({user:req.user.id});

        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
//@route DELETE api/profile/experience/:exp_id
//@desc DELETE the user experience
//@access Private

router.delete('/experience/:exp_id',auth,async(req,res)=>{

   try {

    const profile= await Profile.findOne({user:req.user.id});
//Get Remove Index
    const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
       
   } catch (error) {
       console.error(error.message);
       res.status(500).send('Server Error');       
   }

});

//@route PUT api/profile/education
//@desc Add the user education
//@access Private

router.put('/education',[auth,[
    check('school','school is required').not().isEmpty(),
    check('fieldofstudy','fieldofstudy is required').not().isEmpty(),
    check('degree','degree is required').not().isEmpty(),
]], 
 async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        school,
        fieldofstudy,
        degree,
        from,
        to,
        current,
        description
    }=req.body;

    const newEdu=
    {
        school,
        fieldofstudy,
        degree,
        from,
        to,
        current,
        description 
    }

    try {
        const profile = await Profile.findOne({user:req.user.id});

        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
//@route DELETE api/profile/education/:edu_id
//@desc DELETE the user education
//@access Private

router.delete('/education/:edu_id',auth,async(req,res)=>{

   try {

    const profile= await Profile.findOne({user:req.user.id});
//Get Remove Index
    const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
       
   } catch (error) {
       console.error(error.message);
       res.status(500).send('Server Error');       
   }

});


module.exports=router;