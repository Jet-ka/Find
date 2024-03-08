const mongoose= require('mongoose');

const sellerSchema= new mongoose.Schema({
    name:String,
    //number:Number,
    profess:String,
    //profes:[String],
   // password:String,
        
    
});

const seller=mongoose.model('seller', sellerSchema  );
module.exports=seller;
//tutor info schema
