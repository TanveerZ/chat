
var db = require('../../../../config/db');
// Api request required starts
const https = require('http');
var request = require('request');
querystring = require('querystring');
require('request-to-curl');
var curl = require('curlrequest');
// Api request required ends
var urlencode = require('urlencode');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var Hashids = require('hashids');
var asyncMiddleware = require("../../../../middlewares/Async"); 
var TBL_USER = require('../schemas/userSchema');
var globalVariables = require('../../../../globalVariables');
var currentUTCDate = globalVariables.crntDate;
var datetime = require('node-datetime');
var config = require('../../../../app/config')
var Helper = require("../../../helper/commen");
require('./../../../../globalfunctions');

 var usersController = {    

    //User Registration  
    register : asyncMiddleware(async (req,res,next)=>{
        plainPassword = req.body.password;
        hashPassword = await bcrypt.hash(plainPassword.toString(),8);
        
        var emailUser=req.body.email;
         
                var first_name=(req.body.first_name)!=""?req.body.first_name:'';
                var last_name=(req.body.last_name)!=""?req.body.last_name:''; 
                var selIfExsist="SELECT user_master.user_id FROM `user_master where user_master.email='"+emailUser ;
                var selIfExsisted=await db.connection.query(selIfExsist, { type: Sequelize.QueryTypes.SELECT})
                var ress= isObjEmpty(selIfExsisted);
                if(ress!=true)
                {
                        let send_data = {message:"These details have already used."};
                        res.status(400).json(send_data);
                }
                else
                {
                    var NewUser = {            
                        password :hashPassword,
                        email : emailUser,
                        first_name:first_name,
                        last_name:last_name,
                        account_status : 1,                  
                        created_at : currentUTCDate
                    }
                    try {
                        var userdata = await TBL_USER.create(NewUser);    
                    } catch (error) {
                        //console.log("Error" , error);
                    }
                }
                   db.connection.query("SELECT user_master.* FROM `user_master` where user_master.user_id= "+userObj.dataValues.user_id, { type: Sequelize.QueryTypes.SELECT})
                .then( async response => {
                    let send_data = {success:true,status:200,message:"User registered successfully, Please verify your email, verification email has been sent to ("+emailUser+").", token: 'JWT '+token,data:response[0]};
                    return res.status(201).json(send_data);           
                }) 
             
        
    }), 
    login : asyncMiddleware( async (req,res,next)=>{
            var NewUser = {
                email : req.body.email,
                password : req.body.password.toString()
            }
            
            var isEmailExsists= await TBL_USER.findOne({where: {email: NewUser.email,account_status:1},
                attributes: ['user_id','password','email']});    
                var ress= isObjEmpty(isEmailExsists);

            if(ress==true)
            {
                var hashPassword = isEmailExsists.dataValues.password.toString();            
                await  bcrypt.compare(NewUser.password,hashPassword,async(err,isMatch)=>{
                    if(err)
                    {
                        let send_data = {message:"Something Went Wrong", error:err};
                        res.status(400).json(send_data);
                    }
                    if(isMatch){
                        db.connection.query("SELECT user_master.* FROM `user_master` where user_master.user_id= "+isEmailExsists.dataValues.user_id, { type: Sequelize.QueryTypes.SELECT})
                        .then((response) => {
                            let send_data = {message:"User login successfully", token: 'JWT '+token,data:response[0]};
                                res.status(200).json(send_data);
                        })
                    }
                });

            }
            else{
                let send_data = {message:"User Does't exists", error:err};
                        res.status(200).json(send_data);
            }
        
        
    }),
    logout : asyncMiddleware( async(req,res,next)=>{
        var userId=req.body.user_id;
        var userLog={
            updated_at: currentUTCDate
             };
        var logout= await TBL_PROFILE.update(userLog,{where:{user_id:userId}});
        await jwt.sign(userId, db.secret, {expiresIn: 1});
        var send_data={message:"You logged out successfully."};  
        res.status(200).json(send_data);
    }),
    
    // user Listing
    userListing : asyncMiddleware( async(req,res,next)=>{
        let offset = (req.params.id-1) *10        
        var sqlQ=`SELECT (SELECT count(user_master.user_id)as countt FROM user_master)as userCount, user_master.* FROM user_master limit 10 offset ${offset}`;
        db.connection.query(sqlQ, { type: Sequelize.QueryTypes.SELECT})
        .then((response) => {            
                var send_data={success:true,status:200,message:"succesfully get Users",data:response};
                res.status(200).json(send_data);})
        .catch((err) => {
            var send_data={success:false,status:500,message:"Something went wrong, please try again",error:err};
            res.status(500).json(send_data);
        })
       
    }),
    //Get user profile details
    getUserProfile: asyncMiddleware( async (req,res,next)=>{

        user_id = req.user.user_id
        const token = await jwt.sign(user_id, db.secret, {})
        
        db.connection.query("SELECT user_master.* where user_master.user_id="+user_id, { 
            type: Sequelize.QueryTypes.SELECT
        })
        .then( async response => {
            let send_data = {message:"User profile details", token: 'JWT '+token,data:response[0]};
            res.status(200).json(send_data);
        })


    }),
    fire_socket : asyncMiddleware( async (req,res,next)=>{
       
        ////console.log("Fire Socket trade done.")

        var pair_id=req.params.id;
        /**
         *  Call Buy socket to emit data 
         *  Dev-DP 24-april-2019
         */
        await socketHelper.buySocket(pair_id,10);

        /**
         *  Call Sell socket to emit data 
         *  Dev-DP 24-april-2019
         */
        await socketHelper.sellSocket(pair_id,10)

        /**
         *  Call Trade socket to emit data 
         *  Dev-DP 24-april-2019
         */
        await socketHelper.tradeSocket(pair_id,10)
                      
        
        // res.io.of('/exchange').emit("tradeDone", {"status" : "end"});
        // res.status(200).json({message : "Firing socket to send trade alert.."});
    })
   
};

module.exports = usersController;
