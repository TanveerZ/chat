var db = require('../../../config/db');
var TBL_USER = require('../../modules/users/schemas/userSchema');
var bcrypt = require('bcryptjs');
var hbtHelper = require('../helper/heartbeat')
var globalVariables = require('../../../globalVariables');
var currentUTCDate = globalVariables.crntDate;
module.exports = {



    changePassword : async function(req,res,next){
        member_id = req.body.member_id;
        newPassword = req.body.new_password.toString();
        oldPassword = req.body.old_password.toString();
        confirmPassword = req.body.confirm_password.toString();
        if(!member_id){
            return res.status(400).send({status:false,message:"Member id is required"});
        }else if(newPassword !== confirmPassword){
            return res.status(400).send({status:false,message:"Confirm password did't matched with New Password"});
        }else{
            var isPasswordExsists= await TBL_USER.findOne({where: {member_id: member_id},
                attributes: ['member_id','password','email','user_role']});
            var ress = isObjEmpty(isPasswordExsists);
        
            if(ress == true){
                let send_data = {status:false,message:"User not found, Please send correct data."};
                res.status(400).json(send_data);            
            }else{
                var hashPassword = isPasswordExsists.dataValues.password.toString()
                const validPassword = await comparePassword(oldPassword,hashPassword);

                if(validPassword == true){

                    let hashNewPassword =  await bcrypt.hash(newPassword,8);
                    var userPass = {
                            password : hashNewPassword,
                            updated_at: currentUTCDate
                        };
                    var passUpdate = await TBL_USER.update(userPass,{where:{member_id:member_id}});
                    
                    let send_data = {status:true, message:"Password has been updated successfully."};
                    res.status(200).json(send_data);

                }else{
                    let send_data = {status:false, message:"Invalid old password."};
                    res.status(400).json(send_data);
                }
            }
        }
    },

}

function comparePassword(oldPassword,hashPassword) {

    const passwordCheck = new Promise((resolve, reject) => {
        bcrypt.compare(oldPassword,hashPassword,(err,hash)=>{
        if (err) reject(err)
        resolve(hash)
        });
    })
    
    return passwordCheck
}