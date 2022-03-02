var db = require('../../../config/db');
var Sequelize = require('sequelize');
var mongoose = require('mongoose');
mongoose.connect(`mongodb://${db.mongo.host}/${db.mongo.db}`, { useNewUrlParser: true });
var TRANSACTIONS = mongoose.model('Transactions');
var helperHeartbeat = require('../helper/heartbeat');

module.exports = {



    withdraws: async(req,res,next) => {

        var deposits = await helperHeartbeat.getDepositWithdrawByCoin('deposit');
        var withdraws = await helperHeartbeat.getDepositWithdrawByCoin('withdraw');
        var pendingTx = await helperHeartbeat.getDepositWithdrawByCoin('withdraw','signed');

        //console.log(pendingTx)

        var sql=`SELECT cm.currency_id,cm.currency_name,cm.currency_symbol FROM currency_master as cm WHERE cm.is_active='YES' GROUP BY cm.currency_id`;        
        var allCoins = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT }); 

        var coins_info = [],allDeposits = [], allWithdraws = [], allPending = [];
        for(const el of allCoins){

            allDeposits = deposits.filter(function(eld){
                return eld._id == el.currency_id
            });
            allWithdraws = withdraws.filter(function(eld){
                return eld._id == el.currency_id
            });
            allPending = pendingTx.filter(function(eld){
                return eld._id == el.currency_id
            });

            
            coins_info.push({
                'currency_id': el.currency_id,
                'currency': el.currency_name,
                'currency_symbol': el.currency_symbol,
                'total': allDeposits.length > 0 ? allDeposits[0].totalAmount : 0,
                'withdraws': allWithdraws.length > 0 ? allWithdraws[0].totalAmount : 0,
                'pending': allPending.length > 0 ? allPending[0].totalAmount : 0  
            })
        }

       return res.status(200).send({status:true,data:coins_info});
    },



}