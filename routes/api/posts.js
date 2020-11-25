const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const Post=require('../../models/Posts');
const Profile=require('../../models/Profiles');
const User=require('../../models/Users');
const auth=require('../../middleware/auth');


//@route POST api/posts
//@desc Create a Post
//@access private


router.post('/',[auth,[
check('text','Text is required').not().isEmpty()
]
],
async(req,res)=> {
const errors= await validationResult(req);
if(!errors.isEmpty()) {
    return res.status(400).json({errors:errors.array()});
}
try {
    
    const user=await User.findById(req.user.id).select('-password');
    const newPost= new Post({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id
            });

            const post=await newPost.save();
            res.json(post);

} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
});

//@route GET api/posts
//@desc Get a Post
//@access private

router.get('/',auth,async(req,res)=>{

try {
    const posts= await Post.find().sort({date:-1});
res.json(posts);
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
});

//@route GET api/posts/:id
//@desc Get a Post by id
//@access private

router.get('/:id',auth,async(req,res)=>{

    try {
        const post= await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }
    res.json(post);
    } catch (error) {
        console.error(error.message);
        if(error.kind==='ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server Error');
    }
    });


//@route DELETE api/posts/:id
//@desc DELETE a Post by id
//@access private

router.delete('/:id',auth,async(req,res)=>{

    try {
        const post= await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }

        //Check user

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }
       await post.remove();
    res.json({msg:'Post removed'});
    } catch (error) {
        console.error(error.message);
        if(error.kind==='ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server Error');
    }
    });

//@route PUT api/posts/like/:id
//@desc Like a Post by id
//@access private

router.put('/like/:id',auth,async(req,res)=>{

    try {
        
        const post = await Post.findById(req.params.id);

        //Check if the post is already liked.
        if(post.likes.filter(like=>like.user.toString()=== req.user.id).length>0){
           return res.status(400).json({msg:'Post already liked'});
        }
post.likes.unshift({user:req.user.id});
await post.save();
res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

});

//@route PUT api/posts/unlike/:id
//@desc unlike a Post by id
//@access private

router.put('/unlike/:id',auth,async(req,res)=>{

    try {
        
        const post = await Post.findById(req.params.id);

        //Check if the post is liked or not.
        if(post.likes.filter(like=>like.user.toString()=== req.user.id).length===0){
           return res.status(400).json({msg:'Post is not liked'});
        }
const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
post.likes.splice(removeIndex,1);
await post.save();
res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

});

//@route POST api/posts/comments/:id
//@desc Create a comment for a post
//@access private


router.post('/comments/:id',[auth,[
    check('text','Text is required').not().isEmpty()
    ]
    ],
    async(req,res)=> {
    const errors= await validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    try {
        
        const user=await User.findById(req.user.id).select('-password');
        const post=await Post.findById(req.params.id);
        const newComment= {
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
                };
                post.comments.unshift(newComment);
    
                await post.save();
                res.json(post.comments);
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    });

//@route DELETE api/posts/comments/:id/:comment_id
//@desc Remove a comment
//@access private

router.delete('/comments/:id/:comment_id',auth, async(req,res)=>{

    try {

        const post=await Post.findById(req.params.id);

        //Pull the comment from the post

        const comment=await post.comments.find(comment=>comment.id === req.params.comment_id);

        //Make sure Comment exists.

        if(!comment){
            return res.status(404).json({msg:'Comment does not exist'});
        }

        //Check User if comment user is logged in user or not.

        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }
        const removeIndex=post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);
post.comments.splice(removeIndex,1);
await post.save();
res.json(post.comments);

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

});



module.exports=router;