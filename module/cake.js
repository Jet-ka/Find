const mongoose=require('mongoose');

const cakeSchema= new mongoose.Schema({
   image:{ data: Buffer, contentType: String },
    name:String,
    realname:String,
    social:String,
    state:String,
    loc:String,
    fee:String,
    con:Number,
    date:String,
    profess:String,

});
const cake= mongoose.model('cake',cakeSchema);
module.exports=cake;