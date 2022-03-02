const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var db = require('../config/db');
var User = require('../app/modules/users/schemas/userSchema');
var globalfn=require('../globalfunctions');

module.exports =  {
    encryption_request: async  (req, res, next) => {
        // if(typeof req.decrypted === 'undefined' || req.decrypted != true ){
        //     try {            
        //         var dataFields=reqDeEncrypt(req.body.data);
        //         dataFields = JSON.parse(dataFields);                
        //         req.body = dataFields;
           
        //     } catch (error) {
        //         //console.log("error", error);
        //         return res.status(500).json(error);
        //     }
        // }
        next();
    }
}