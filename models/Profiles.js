const mongoose=require('mongoose');
const { model } = require('./Users');
const profileSchema=mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    company:{
        type: String
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    status:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    bio:{
        type:String
    },
    gitHubUserName:{
        type:String
    },
    experience:[
        {
            title:{
                type:String,
                required:true
            },
            company:{
                type:String,
                required:true
            },
           location :{
                type:String
                          },
            from:{
                type:Date
            },
            to:{
                type:Date
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            },
        }
    ],
    education:[{
        school:{
            type:String,
            required:true
        },
        degree:{
                type:String,
                required:true
            },
            fieldofstudy:{
                type:String,
                required:true
            },
            from:{
                type:String
            },
            to:{
                type:String
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }
    }],
    social:{
       youtube :{
            type:String
        },
       facebook :{
            type:String
        },
        instagram:{
            type:String
        },
        twitter:{
            type:String
        },
       linkedin :{
            type:String
        }
    },
date:{
        type:Date,
        default:Date.now
    },

});

module.exports=Profile=mongoose.model('profile',profileSchema);