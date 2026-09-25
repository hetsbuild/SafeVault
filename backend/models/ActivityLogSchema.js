const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActivityLogSchema = mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId ,
        ref:'user',
        default:null 
    },
    log:{
        type:String,
        default:""
    },
    type:{
        type: String,
        enum: ['create', 'update', 'delete','login','logout','verification'],
        required:true
    }
},{ timestamps: true })

module.exports = mongoose.model("activitylog",ActivityLogSchema)