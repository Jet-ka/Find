const mongoose=require('mongoose');

const hostelSchema=new mongoose.Schema({
image:{data:Buffer,contenttype:String},
name:String,
state:String,
loc:String,
fee:String,
con:Number,
date:String,
profess:String,


});
const hostel=mongoose.model('hostel',hostelSchema);
module.exports=hostel;