//jshint esversion:6
require('dotenv').config();
const express= require('express');
const bodyparser=require('body-parser');
const ejs =require('ejs');
const mongoose=require('mongoose');
//const fs =require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
// require('dotenv').config();

const seller = require('./module/schema.js');
const tutor=require('./module/tutor.js');
const cake=require('./module/cake.js');
const beauty =require('./module/beauty.js');
const hostel=require('./module/hostel.js');


const app=express();
//limit size
const upload = multer({
  limits: { fileSize: 5000000 }
});

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
//database
mongoose.connect(process.env.MONGODB_URL);
//1st page 
app.get('/',function(req,res){
 res.render('home.ejs')

})

//seller signin
app.get('/signin',function(req,res){

 res.render('signin.ejs');
})
//seller post
app.post('/main',  async function(req,res){
  try {
    const name=req.body.name;
   // const con=req.body.con;
    const pro=req.body.pro;
   // const pass=req.body.pass;
    const sellerinfo = new seller({
        name:name,
       // number:con,
        profess:pro,
       // password:pass,
    });
 const result= await sellerinfo.save();
 const data = await seller.findOne({profess:pro})
  res.render('mainpage.ejs' ,{datas:data});
 
  } catch (error) {
    console.log("error");
  }


})

//seller login
app.get('/login',function(req,res){
    res.render('login.ejs')
})
//when user put their name
app.post('/login', async function(req, res) {
  try {
      const name = req.body.name;
      const date = req.body.date;
      //console.log(date);

      const user = await tutor.findOne({ name: name });
      
      const cakeUser = await cake.findOne({ realname: name });
      const beautyUser = await beauty.findOne({ name: name });
      const hostelUser = await hostel.findOne({ name: name });
      
     // console.log(hostelUser)


       // Compare the provided date with the stored hashed password
       if (user) {
        const tutorPasswordMatch = await bcrypt.compare(date, user.date);
        if (tutorPasswordMatch) {
            // If password matches, render the admin page with user information
            res.render('admin.ejs', { infos: user });
            return;
        }
    } else  if (cakeUser) {
      const cakePasswordMatch = await bcrypt.compare(date, cakeUser.date);
        if (cakePasswordMatch ) {
            // If password matches, render the admin page with user information
            res.render('admin.ejs', { infos: cakeUser });
            return;
        }
    } else  if (beautyUser) {
      const beautyPasswordMatch = await bcrypt.compare(date, beautyUser.date);
        if ( beautyPasswordMatch) {
            // If password matches, render the admin page with user information
            res.render('admin.ejs', { infos: beautyUser });
            return;
        }
    } else  if (hostelUser) {
      const hostelPasswordMatch = await bcrypt.compare(date, hostelUser.date);
        if ( hostelPasswordMatch ) {
            // If password matches, render the admin page with user information
            res.render('admin.ejs', { infos:hostelUser });
            return;
        }
    } else{
      res.send("Invalid details")
    }
   
  } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
  }
});

 

//tutor info
app.post('/tutor',  upload.single('image'), async function(req,res){
  try{
    if (req.file.size > 5000000) {
      throw new Error('File size exceeds the limit of 5 MB');
    }
const date= await bcrypt.hash(req.body.date, 10);
   const dat= new tutor({
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype
    },
    name:req.body.name,
    sub:req.body.sub,
    class:req.body.class,
    state:req.body.state,
    loc:req.body.loc,
    fee:req.body.fee,
    con:req.body.con,
    date:date,
    profess:req.body.pro,


   })
   const result= await dat.save();
   
   res.redirect('/');


  }catch(error){
    console.log('error');
   res.render('error.ejs');
  }
})
//tutor collection
app.get('/tutor',  async function(req,res){
 try{
 const result= await tutor.find({});
 res.render('tutor.ejs',{infos:result});

 }catch(err){
  
  console.log(err)
 }
});

//tutor search korile
app.post('/find/:object', async  function(req,res){
  try{

  const object=req.body.object;
   const result= await tutor.find(
    {
  "$or":[
    {"name":{$regex:".*" + object+".*",$options:"i"}},
    {"sub":{$regex:".*" + object+".*",$options:"i"}},
    {"state":{$regex:".*" + object+".*",$options:"i"}},
    {"loc":{$regex:".*" + object+".*",$options:"i"}} 
  ]
  
  
  });
   res.render('tutor.ejs',{infos:result});
    
  }catch(error){
      console.log(error);
    }

 
});





 //cakeowner info

app.post('/cake',  upload.single('image') ,async function(req,res){
  try{
    if (req.file.size > 5000000) {
      throw new Error('File size exceeds the limit of 5 MB');
    }
    const date= await bcrypt.hash(req.body.date, 10);
   const data= new cake({
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype
    },
    name:req.body.name,
    realname:req.body.realname,
    social:req.body.social,
    state:req.body.state,
    loc:req.body.loc,
    fee:req.body.fee,
    con:req.body.con,
    date:date,
    profess:req.body.pro,


   })
   const result= await data.save();
   
   res.redirect('/');


  }catch(error){
    console.log('error');
   res.render('error.ejs');
  }
});
//cake collection
app.get('/cake',  async function(req,res){
 try{
 const result= await cake.find({});
 res.render('cake.ejs',{infos:result});

 }catch(err){
  
  console.log(err)
 }
});

//cake r search korile
app.post('/query',async function(req,res){
 try{
  const query=req.body.query + "";
  const result= await cake.find(
   {
 "$or":[
   {"name":{$regex:".*" + query+".*",$options:"i"}},
   {"realname":{$regex:".*"+query+".*",$options:"i"}},
   {"social":{$regex:".*" + query+".*",$options:"i"}},
   {"state":{$regex:".*" + query+".*",$options:"i"}},
   {"loc":{$regex:".*" + query+".*",$options:"i"}} 
 ]
 
 
 });
res.render('cake.ejs',{infos:result});

 }catch(err){
  console.log("error")
 }

});




//beautician info
app.post('/beauty',upload.single('image'),  async function(req,res){
try {
 if(req.file.size>5000000){
  throw new Error("file size is more than 5 mb")
 }
 const date= await bcrypt.hash(req.body.date, 10);
 const data= new beauty({
image:{
  data:req.file.buffer,
  contentType:req.file.mimetype
},
name:req.body.name,
social:req.body.social,
des:req.body.des,
state:req.body.state,
loc:req.body.loc,
fee:req.body.fee,
con:req.body.con,
date:date,
profess:req.body.pro,

 });
 const result= await data.save();
 res.redirect('/');
  

} catch (error) {
  console.log(error)
}

});

//beautician jatiya bisaribo
app.get('/beauty',async function(req,res){
try{
 const result= await beauty.find({});
 res.render('beauty.ejs',{infos:result})

}catch(error){
  console.log(error)
}

});

//particular beautician bisaribo
app.post('/look', async function(req,res){
try{
 const look=req.body.look;
 const result= await beauty.find({
  "$or":[
    {"name":{$regex:".*" + look+".*",$options:"i"}},
    {"des":{$regex:".*" + look+".*",$options:"i"}},
    {"social":{$regex:".*" + look+".*",$options:"i"}},
    {"state":{$regex:".*" + look+".*",$options:"i"}},
    {"loc":{$regex:".*" + look+".*",$options:"i"}} 
  ]


 })
res.render('beauty.ejs',{infos:result});


}catch(error){
  console.log(error)
}

});

//hostel room bisarile
app.get('/hostel', async function(req,res){
 try{
 const result=await hostel.find({});

 res.render('hostel.ejs',{infos:result});

 }catch{
  console.log("error")
 }


});
//hostel owener submit info
 
 app.post('/hostel',  upload.single('image') ,async function(req,res){
  try{
    if (req.file.size > 5000000) {
      throw new Error('File size exceeds the limit of 5 MB');
    }
    const date= await bcrypt.hash(req.body.date, 10);
   const data= new hostel({
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype
    },
    name:req.body.name,
   // realname:req.body.realname,
   // social:req.body.social,
    state:req.body.state,
    loc:req.body.loc,
    fee:req.body.fee,
    con:req.body.con,
    date:date,
    profess:req.body.pro,


   })
   const result= await data.save();
   
   res.redirect('/');


  }catch(error){
    console.log('error');
   res.render('error.ejs');
  }
});

//particular hostel owner  bisaribo
app.post('/owner', async function(req,res){
  try{
   const owner=req.body.owner;
   const result= await hostel.find({
    "$or":[
      {"name":{$regex:".*" + owner+".*",$options:"i"}},
      {"des":{$regex:".*" + owner+".*",$options:"i"}},
      {"state":{$regex:".*" + owner+".*",$options:"i"}},
      {"loc":{$regex:".*" + owner+".*",$options:"i"}} 
    ]
  
  
   })
  res.render('hostel.ejs',{infos:result});
  
  
  }catch(error){
    console.log(error)
  }
  
  });
//edit and delete logicc
app.get('/edit/:id', async function(req,res){
try{
const id= req.params.id;
 const one=  await tutor.findById(id);
 const two= await cake.findById(id);
 //console.log(two);
  const three= await beauty.findById(id);
 const four= await hostel.findById(id);
if(one && one._id==id){
  res.render('update.ejs',{id:id, infos:one});
}else if(two && two._id== id){
//console.log(two);
 res.render('update.ejs',{id:id, infos:two});
}else if(three && three._id==id){
  res.render('update.ejs',{id:id, infos:three});
}else if(four && four._id==id){
  res.render('update.ejs',{id:id, infos:four});
}else{
  res.send("<p>soory bro wrok again</p>")
}

}catch{
  console.log("error bro")
}

});

//tutor update
app.post('/tutor/:id',upload.single('image'), async function(req,res){
  try{
     const id=req.params.id;
     const image =  {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };
    const name=req.body.name;
    const sub=req.body.sub;
    const clas=req.body.class;
    const state=req.body.state;
    const loc=req.body.loc;
    const fee=req.body.fee;
    const con=req.body.con;
   
    const infos= await tutor.findByIdAndUpdate({_id:id},{$set:{image:image,name:name,sub:sub,class:clas,state:state,loc:loc,fee:fee,con:con}});
   //console.log(result)
res.redirect('/tutor');
  }catch{
     console.log('error')
  }
 });



//upadte korile cake
app.post('/cake/:id',upload.single('image'),  async function(req,res){
try{
const id= req.params.id;
const image =  {
 data: req.file.buffer,
 contentType: req.file.mimetype
};
const name=req.body.name;
const realname=req.body.realname;
const social=req.body.social;
const state=req.body.state;
const loc=req.body.loc;
const fee=req.body.fee;
const con=req.body.con;

const infos= await cake.findByIdAndUpdate({_id:id},{$set:{image:image,name:name,realname:realname,social:social,state:state,loc:loc,fee:fee,con:con}});
//console.log(result)
res.redirect('/cake');


}catch(error){
  console.log("error")
}

});

//update of beauty
app.post('/beauty/:id',upload.single('image'),  async function(req,res){
  try{
  const id= req.params.id;
  const image =  {
   data: req.file.buffer,
   contentType: req.file.mimetype
  };
  const name=req.body.name;
  const social=req.body.social;
  const des=req.body.des;
  const state=req.body.state;
  const loc=req.body.loc;
  const fee=req.body.fee;
  const con=req.body.con;
  
  const infos= await beauty.findByIdAndUpdate({_id:id},{$set:{image:image,name:name,social:social,des:des,state:state,loc:loc,fee:fee,con:con}});
  //console.log(result)
  res.redirect('/beauty');
  
  
  }catch(error){
    console.log("error")
  }
  
  });
  //update of hostel
  app.post('/hostel/:id',upload.single('image'),  async function(req,res){
    try{
    const id= req.params.id;
    const image =  {
     data: req.file.buffer,
     contentType: req.file.mimetype
    };
    const name=req.body.name;
   // const social=req.body.social;
    const state=req.body.state;
    const loc=req.body.loc;
    const fee=req.body.fee;
    const con=req.body.con;
    
    const infos= await hostel.findByIdAndUpdate({_id:id},{$set:{image:image,name:name,state:state,loc:loc,fee:fee,con:con}});
    //console.log(result)
    res.redirect('/hostel');
    
    
    }catch(error){
      console.log("error")
    }
    
    });
//delete all page one by one
app.post('/delete/:id',async function(req,res){
  try{
     const id=req.params.id;
     const one=await tutor.findById(id);
     const two=await cake.findById(id);
     const three=await beauty.findById(id);
     const four= await hostel.findById(id);
     if(one && one._id==id){
      await tutor.findByIdAndDelete(id);
      res.redirect('/');
     } else if(two && two._id==id){
      await cake.findByIdAndDelete(id);
      res.redirect('/');
     } else if(three && three._id==id){
      await beauty.findByIdAndDelete(id);
      res.redirect('/');
     }else if(four && four._id==id){
      await hostel.findByIdAndDelete(id);
      res.redirect('/');
     } else{
      res.send("Bhi logic kaam nhi kiya heh he");
     }

 
  }catch{
  console.log('error')
  }
 
 })


//upto here
//about us 
app.get('/about', function(req,res){
  res.render('about.ejs')
});

//privacy us 
app.get('/privacy', function(req,res){
  res.render('privacy.ejs')
});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}


app.listen(3000,function(){
    console.log('server running well');
});