var db = require('../../../config/db');
var Sequelize = require('sequelize');

var hlpr = require('../helper/heartbeat');
var Helper = require('../../helper/commen');


module.exports = {

    referralUsers: async(req,res,next) => {
        var reqLimit = 10,
        reqOffset = 0,
        whereCon = "referral_points_id IS NOT NULL";
        
        if(req.body.userId){
            whereCon += ` AND ref_id = ${req.body.userId}`;
        }
        if(req.body.limit){
            reqLimit = req.body.limit;
        }
        if(req.body.offset){
            reqOffset = req.body.offset;
        }
        var sql = `SELECT rp.referral_points_id,rp.ref_id,rp.referred_by,rp.points as zfls,rp.lavel,rp.is_Active,rp.created_at FROM referral_points as rp WHERE ${whereCon} ORDER BY rp.referral_points_id DESC LIMIT ${reqOffset},${reqLimit}`;  
        //console.log(sql);      
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        var sql = `SELECT COUNT(rp.referral_points_id) as totalRecords FROM referral_points as rp WHERE ${whereCon}`;        
        var countRecords = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        return res.status(200).send({status:true,totalRecords:countRecords[0].totalRecords, data:results});
    },


}