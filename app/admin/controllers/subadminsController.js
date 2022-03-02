var db = require('../../../config/db');
var Sequelize = require('sequelize');

var hlpr = require('../helper/heartbeat');
var Helper = require('../../helper/commen');
var bcrypt = require('bcryptjs');
module.exports = {


    getAllSubAdmins: async(req,res,next) => {
        
        var sql = `SELECT mm.member_id,mm.email,mm.account_status,mp.first_name,mp.last_name FROM member_master as mm LEFT JOIN member_profile as mp ON mp.member_id = mm.member_id 
        WHERE mm.user_role = 3 ORDER BY mm.member_id DESC`;
        
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        return res.status(200).send({status:true,data:results});
    },

    addSubAdminUser: async(req,res,next) => {

        if(req.body.email){   
            var subAdminMenus = '', sql = '', results = '';
            var randomNum = Math.floor(Math.random() * 1000001);      
            plainPassword = randomNum;
            var menus = req.body.menus;

            sql = `SELECT COUNT(email) as isEmailExist FROM member_master WHERE email = '${req.body.email}'`
            results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
            //console.log(results[0].isEmailExist);
            if(results[0].isEmailExist > 0){
                return res.status(400).send({status:false,message:"This email already exist."});
            }
            if(menus.length > 0){
                subAdminMenus = JSON.stringify(menus);
            }
            hashPassword = await bcrypt.hash(plainPassword.toString(),8);    
            sql = `INSERT INTO member_master (email,user_role,password,account_status,referred_by,email_status,kyc_status,sub_admin_menus) 
            VALUES('${req.body.email}',3,'${hashPassword}',1,1,1,1,'${subAdminMenus}')`;
            results = await db.connection.query(sql);
            if(results.length > 0){
                memberId = results[0];
                var firstName = req.body.first_name || 'anonymous';
                var lastName = req.body.last_name || 'anonymous';
                sql = `INSERT INTO member_profile (member_id,first_name,last_name) 
                VALUES(${memberId},'${firstName}','${lastName}')`;
                var results = await db.connection.query(sql);
                if(results.length > 0){
                    var messageHtml = `<p><br/>Your sub admin account has been created on Zedxe.<br> Here are your login credentials.<br>email: ${req.body.email}<br>password: ${plainPassword}</p>`
                    await res.render('commonmsg', {
                        subject:"Sub-Admin Account Credentials",
                        message: messageHtml
                      }, async (err, html) => {
                        if (err) {
                          return res.status(500).send({ error: err });
                        }
                        await Helper.commen.sendMail(req.body.email, "Sub-Admin Account Credentials", html);
                    }); 
                    return res.status(200).send({status:true,message:"User has been created successfully."});
                }
            }
            return res.status(400).send({status:false,message:"Opps! there is some technical issue, your user has not been saved."});
        }

    },

    editSubAdminUser: async(req,res,next) => {
        if(req.body.email && req.body.user_id){   
            var subAdminMenus = '', sql = '', results = '';
            var menus = req.body.menus;

            sql = `SELECT COUNT(email) as isEmailExist FROM member_master WHERE email = '${req.body.email}' AND member_id != ${req.body.user_id}`
            results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });

            if(results[0].isEmailExist > 0){
                return res.status(400).send({status:false,message:"This email already exist."});
            }
            if(menus.length > 0){
                subAdminMenus = JSON.stringify(menus);
            }   
            sql = `UPDATE member_master SET sub_admin_menus = '${subAdminMenus}' WHERE member_id = ${req.body.user_id} AND user_role = 3`;
            results = await db.connection.query(sql);

            if(results.length > 0){
                var firstName = req.body.first_name || 'anonymous';
                var lastName = req.body.last_name || 'anonymous';
                sql = `UPDATE member_profile SET first_name = '${firstName}', last_name = '${lastName}' WHERE member_id = ${req.body.user_id}`;                
                var results = await db.connection.query(sql);

                if(results.length > 0){
                    return res.status(200).send({status:true,message:"User has been updated  successfully."});
                }
            }
            return res.status(400).send({status:false,message:"Opps! there is some technical issue, your user has not been saved."});
        }
        return res.status(400).send({status:false,message:"Opps! there is some technical issue, your user has not been saved.2"});

    },

    deleteSubAdminUser: async(req,res,next) => {
        var sql = '';
        sql = `DELETE FROM member_profile WHERE member_id = ${req.body.user_id}`;
        var results = await db.connection.query(sql);
        if(results){
            sql = `DELETE FROM member_master WHERE member_id = ${req.body.user_id} AND user_role = 3`;
            var results = await db.connection.query(sql);
            return res.status(200).send({status:true,message:"User has been deleted successfully."}); 
        }
    },

}