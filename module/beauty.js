const mongoose=require('mongoose');

const beautySchema= new mongoose.Schema({
image:{data:Buffer,contentType:String},
name:String,
social:String,
des:String,
state:String,
loc:String,
fee:String,
con:Number,
date:String,
profess:String

});

const beauty= new mongoose.model('beauty',beautySchema);
module.exports=beauty;