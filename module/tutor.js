const mongoose=require('mongoose');

const tutorSchema = new mongoose.Schema({
    image: { data: Buffer, contentType: String },
    name:String,
    sub:String,
    qual:String,
    class:String, 
    state:String,
    loc:String,
    fee:Number,
    con:Number,
    date:String,
    profess:String,
    
    });
const tutor=mongoose.model('tutor',tutorSchema);
module.exports=tutor;