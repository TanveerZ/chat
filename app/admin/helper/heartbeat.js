var mongoose = require('mongoose');
var db = require('../../../config/db');
var Sequelize = require('sequelize');

mongoose.connect(`mongodb://${db.mongo.host}/${db.mongo.db}`, { useNewUrlParser: true });
var TRANSACTIONS = mongoose.model('Transactions');
var speakeasy   = require('speakeasy');


module.exports = {

    userPersonalDetailById: async(id) => {
        var sql = `SELECT mm.member_id,mm.email,mm.created_at as joining_date,mm.sub_admin_menus,mp.first_name,mp.last_name,mp.dob,mp.phone,mp.country,mp.city,mp.zipcode,mk.doc_type as first_level_kyc,mk.selfie_photo as second_level_kyc,
        (CASE 
        WHEN mk.doc_type = '1' THEN "ID Card" 
        WHEN mk.doc_type = '2' THEN "Passport" 
        WHEN mk.doc_type = '3' THEN "Driving License" 
        ELSE "Pending" END) as id_type 
        FROM member_master as mm LEFT JOIN member_profile as mp ON mp.member_id = mm.member_id LEFT JOIN member_kyc as mk ON mk.member_id = mm.member_id WHERE mm.member_id = ${id}`;
        return await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
    },
    /**
     * Function to get list of all deposits 
     * @param 'user_id'
     * @return 'JSON'
     * @author Durga Parshad
     * @since 01-August-2019
     */
    userDepostList: async(member_id) => {
        var tran = TRANSACTIONS.aggregate([
            {
                "$match" : {
                    "user_id" : member_id.toString()
                }
            }
        ])
        return tran.exec();
    },
    /**
     * Function to get list of all withdraws 
     * @param 'user_id'
     * @return 'JSON'
     * @author Durga Parshad
     * @since 01-August-2019
     */
    userWithdrawList: async(member_id) => {
        var tran = TRANSACTIONS.aggregate([
            {
                "$match" : {
                    "user_id" : member_id.toString()
                }
            }
        ])
        return tran.exec();
    },
    userWithdrawById: async(id) => {
        var transWithdrawAgr = TRANSACTIONS.aggregate([            
            { 
                "$match": {
                    "type": "withdraw",
                    "status": "confirmed",
                    "user_id": id.toString()
                }
            },
            {
                "$group":{ 
                    "_id": "$coin",
                    "totalAmount":{"$sum": "$amount" }},
            }           
        ]);
        var row = await transWithdrawAgr.exec();
        return row;
    },
    userDepositById: async(id) => {
        var transWithdrawAgr = TRANSACTIONS.aggregate([            
            { 
                "$match": {
                    "type": "deposit",
                    "status": "confirmed",
                    "user_id": id.toString()
                }
            },
            {
                "$group":{ 
                    "_id": "$coin",
                    "totalAmount":{"$sum": "$amount" }},
            }           
        ]);
        var row = await transWithdrawAgr.exec();
        return row;
    },
    getDepositWithdrawByCoin: async(type,status) => {
    status = status || "confirmed";
    var transDepositAgr = TRANSACTIONS.aggregate([            
        { 
            "$match": {
                "type": type,
                "status": status
            }
        },
        {
            "$group":{ 
                "_id": "$coin",
                "totalAmount":{"$sum": "$amount" }},
        }           
    ]);
     return await transDepositAgr.exec();
    },
    withdrawByMonths: async(id) => {
        var transWithdrawAgr = TRANSACTIONS.aggregate([            
            { 
                "$match": {
                    "type": "withdraw",
                    "status": "confirmed"
                }
            },
            
            {
                "$group":{ 
                    "_id": {"$month":"$created_date"},
                    "amount": {"$sum": "$amount" }
                },
            },
            {"$sort": { "_id": 1 }}           
        ]);
        var row = await transWithdrawAgr.exec();
        return row;
    },
    getCurrencyMaster: async(req,res,next) => {          
        var sql=`SELECT currency_id,currency_name,currency_symbol FROM currency_master WHERE is_active='YES'`;        
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT }); 
        return results;
    },
    getMemberBalanceByCoinId: async(id) => {          
        var sql = `SELECT currency_id as coin_id, SUM(balance+locked_balance) as totalBalance,address FROM accounts WHERE member_id = ${id} GROUP BY currency_id`;
        //console.log(sql);
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT }); 
        return results;
    },
    getAllOrdersByMemberId: async(id) => {
        var sql = `SELECT order_id,orders_type,pair_table FROM orders WHERE member_id = ${id} AND (is_completed = 'YES' OR is_partial = 'YES')`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        
        if(results.length > 0){
            var buyOrderIds = [],sellOrderIds = [], pairTables = [];
            for(const el of results){
                pairTables.push(el.pair_table);
                if(el.orders_type == 'BUY'){
                    buyOrderIds.push(el.order_id);
                }else{
                    sellOrderIds.push(el.order_id);
                }
            }
            buyOrderIds = buyOrderIds.join(",");
            sellOrderIds = sellOrderIds.join(",");

            if(pairTables.length > 0){
                for(const pairs of pairTables){
                    var sqlBuy = `SELECT buy_id,SUM(price*(actual_units - fullfilled_units)) as allBuyPrices FROM ${pairs}  WHERE buy_id IN(${buyOrderIds}) GROUP BY buy_id UNION ALL `;
                    var sqlSell = `SELECT buy_id,SUM(price*(actual_units - fullfilled_units)) as allSellPrices FROM ${pairs} WHERE sell_id IN(${sellOrderIds}) GROUP BY buy_id UNION ALL `;
                }
                var buyOrderStats = await db.connection.query(sqlBuy, { type: Sequelize.QueryTypes.SELECT });
                var sellOrdersStats = await db.connection.query(sqlSell, { type: Sequelize.QueryTypes.SELECT });
                //console.log('buyids',buyOrderStats);
                //console.log('sellids',sellOrdersStats);
            }
        }        
    }

}