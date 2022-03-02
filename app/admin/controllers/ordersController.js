var db = require('../../../config/db');
var Sequelize = require('sequelize');

var hlpr = require('../helper/heartbeat');
var Helper = require('../../helper/commen');
var HelperOrder = require('../../helper/orders');

module.exports = {

    orderList: async(req,res,next) => {
        var reqLimit = '',
        where = 'ord.order_id IS NOT NULL';
        if(req.body.limit){
            var reqLimit = `LIMIT ${ (req.body.offset > 0 ) ? ((req.body.offset) * 10): req.body.offset },${req.body.limit}`;
        }
        if(req.body.fromDate){
            where += ` AND ord.created_at >= '${req.body.fromDate} 00:00:00'`;
        }
        if(req.body.toDate){
            where += ` AND ord.created_at <= '${req.body.toDate} 23:59:59'`;
        }
        if(req.body.email){
            where += ` AND mm.email LIKE '${req.body.email}%'`;
        }
        if(req.body.pairId){
            let pair = req.body.pairId;
            var GetPairWithKey = await HelperOrder.GetPairWithKey(pair);
            //console.log(GetPairWithKey);
            var pair_id = GetPairWithKey[0]['tarding_pair_id'];
            var pair_table = `orders_${pair_id}`;
            where += ` AND ord.pair_table = '${pair_table}'`;
        }
        if(req.body.orderStatus){
            if(req.body.orderStatus == "open"){
                where += ` AND ord.is_completed = 'NO' AND ord.is_cancelled = 'NO' AND ord.is_partial = 'NO'`;
            }else if(req.body.orderStatus == "cancelled"){
                where += ` AND ord.is_cancelled = 'YES' AND ord.is_completed = 'NO'`;
            }else if(req.body.orderStatus == "completed"){
                where += ` AND ord.is_completed = 'YES' AND ord.is_cancelled = 'NO' AND ord.is_partial = 'NO'`;
            }else if(req.body.orderStatus == "partial"){
                where += ` AND ord.is_partial = 'YES' AND ord.is_completed = 'NO' AND ord.is_cancelled = 'NO'`;
            }else{
                where + "";
            }
        }
        if(req.body.orderType == 'sell' || req.body.orderType == 'buy'){
            where += ` AND ord.orders_type = '${req.body.orderType}'`;
        }

        where += ` AND ord.is_fake = 'actual'`;

        var sql = `SELECT ord.order_id,ord.is_fake,ord.member_id,ord.orders_type,ord.created_at, ordp.price,ordp.actual_units,ordp.actual_fullfilled_units,mm.email,tp.pair,ord.is_completed,ord.is_partial,ord.is_cancelled, SUBSTR(ord.pair_table,8,5) as pair_id, ordp.order_${pair_id}_id as sub_order_id    
        FROM orders as ord  
        LEFT JOIN ${pair_table} as ordp ON ordp.main_order_id = ord.order_id  
        LEFT JOIN member_master as mm ON mm.member_id = ord.member_id 
        LEFT JOIN trading_pairs as tp ON tp.tarding_pair_id = SUBSTR(ord.pair_table,8,5) 
        WHERE ${where} ORDER BY ord.created_at DESC ${reqLimit}`;
        //console.log(sql);
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT }); 

        var countSql = `SELECT COUNT(ord.order_id) as totalRecords FROM orders as ord 
        LEFT JOIN ${pair_table} as ordp ON ordp.main_order_id = ord.order_id  
        LEFT JOIN member_master as mm ON mm.member_id = ord.member_id 
        LEFT JOIN trading_pairs as tp ON tp.tarding_pair_id = SUBSTR(ord.pair_table,8,5) 
        WHERE ${where}`;

        var totalRecords = await db.connection.query(countSql, { type: Sequelize.QueryTypes.SELECT }); 

        if(results.length > 0){
            return res.status(200).send({status:true,totalRecords:totalRecords[0].totalRecords,data:results,message:"All orders data."})
        }  else{
            return res.status(200).send({status:true,data:[],message:"No records found."})
        }

    },

    tradeSummary: async(req,res,next) => {

        var sql = `SELECT TRUNCATE(AVG(trd.t_price),8) as avgPrice, MAX(trd.t_price) as maxPrice,MIN(trd.t_price) as minPrice,COUNT(trd.trade_id) as tradeCount, TRUNCATE(SUM(trd.actual_units),3) as volumes,tp.pair FROM trades as trd 
        LEFT JOIN trading_pairs as tp ON tp.tarding_pair_id = trd.pair_id 
        GROUP BY trd.pair_id ORDER BY trd.created_at DESC`;

        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT }); 
        if(results.length > 0){
            return res.status(200).send({status:true,data:results,message:"All orders data."})
        }  else{
            return res.status(200).send({status:true,data:[],message:"No records found."})
        }

    },

    


}