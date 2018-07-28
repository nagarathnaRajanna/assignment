var crudder=null;
var logger=null;
var _=require("lodash");
var userCtrl=require("./user.controller.js");
var CryptoJS = require("crypto-js");

function init(_crudder,_logger){
    crudder=_crudder;
    logger=_logger;
}

function validate(req,res){
    logger.info("Inside Validate Function");
    var data=req.swagger.params.data.value || {};
    var email = data.email || "";
    var password=data.password || "";
    if(_.isEmpty(email) || _.isEmpty(password)){
        res.status(400).send({message:"Please Enter Email and Password"});
    }else{
        let condition={"email":email};
        userCtrl.checkUserExists(condition,true).then(doc=>{
            if(_.isEmpty(doc)){
                res.status(400).send({message:"User Not Found Please Enter valid Email"});
            }else if(doc.status=="INACTIVE"){
                res.status(400).send({message:"User Not Active"});
            }else{
                var bytes  = CryptoJS.AES.decrypt(doc.password, userCtrl.SECRETKEY);
                var originalPassword = bytes.toString(CryptoJS.enc.Utf8);
                if(originalPassword==password){
                    res.status(200).send({message:"User Logged in Successfully"});
                }else{
                    res.status(400).send({message:" Password Mismatch !!!!!!!!!!!!"});
                }
            }
        }).catch(err=>{
            res.status(400).send({message:err.message});
        });
    }
}

module.exports={
    init:init,
    validate:validate
}