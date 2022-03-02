var db = require('../../../config/db');
var Sequelize = require('sequelize');

var hlpr = require('../helper/heartbeat');
var Helper = require('../../helper/commen');
var adminHelper = require('./../../modules/admin/helpers/adminHelper');

module.exports = {


    currency: async(req,res,next) => {
        var sql = `SELECT cm.currency_id,cm.currency_name,cm.currency_symbol,cm.is_bitgo_based,cm.is_erc20token,cm.tx_fee as withdrawFee,cm.min_tx_fee as minWithdrawAmount,cm.kyc_max_withd as withdrawLimitKyc FROM currency_master as cm WHERE cm.is_active = 'YES'`;
        
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        return res.status(200).send({status:true,data:results});
    },

    markets: async(req,res,next) => {
        var sql = `SELECT cm.currency_id,cm.currency_name,cm.currency_symbol,cm.is_bitgo_based,cm.is_erc20token,cm.tx_fee as withdrawFee,cm.min_tx_fee as minWithdrawAmount,cm.kyc_max_withd as withdrawLimitKyc FROM currency_master as cm WHERE cm.is_active = 'YES' AND is_market = 'YES'`;
        
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        return res.status(200).send({status:true,data:results});
    },


    currencyPairs: async(req,res,next) => {
        if(req.body.isParent){
            var sql = `SELECT tp.tarding_pair_id,tp.tarding_pair_key,tp.pair,tp.min_pair_price as minTradeLimit,tp.market_price,tp.is_active, tp.currency_id as parent_market, (SELECT TRUNCATE(c_amount,3) FROM pair_commission WHERE pair_id = tp.tarding_pair_id AND order_type = 'BUY') as buyTradeFee,(SELECT TRUNCATE(c_amount,3) FROM pair_commission WHERE pair_id = tp.tarding_pair_id AND order_type = 'SELL') as sellTradeFee FROM trading_pairs as tp WHERE tp.is_active = 'YES' AND currency_id = '${req.body.isParent}'`;
        }else{
            var sql = `SELECT tp.tarding_pair_id,tp.tarding_pair_key,tp.pair,tp.min_pair_price as minTradeLimit,tp.market_price,tp.is_active, tp.currency_id as parent_market, (SELECT TRUNCATE(c_amount,3) FROM pair_commission WHERE pair_id = tp.tarding_pair_id AND order_type = 'BUY') as buyTradeFee,(SELECT TRUNCATE(c_amount,3) FROM pair_commission WHERE pair_id = tp.tarding_pair_id AND order_type = 'SELL') as sellTradeFee FROM trading_pairs as tp WHERE tp.is_active = 'YES'`;
        }
        ////console.log(sql);
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        return res.status(200).send({status:true,data:results});
    },
    editCurrencyInfo: async(req,res,next) => {
        var secPass = req.body.sec_password;
        var settings = await adminHelper.settingsFind();
        for(let set of settings){
            if(set.field_slug == 'third_password') var dbSecPass = set.field_val;
        }

        if(secPass.replace('&amp;','&') != reqDeEncrypt(dbSecPass)){
            return res.status(400).send({status:false,message:"Password not matched."});   
        }

        if(req.body.currencyId > 0){
            var sql = `UPDATE currency_master SET min_tx_fee='${req.body.minWithdrawAmount}', kyc_max_withd='${req.body.withdrawLimitKyc}',tx_fee='${req.body.withdrawFee}' WHERE currency_id=${req.body.currencyId}`;        
            var results = await db.connection.query(sql);

                if(results){
                    return res.status(200).send({status:true,message:"Currency info has been updated successfully."});
                }else{
                    return res.status(400).send({status:false,message:"Opps! there are some technical issue, currency info has not been updated."});
                }
        }else{
            return res.status(400).send({status:false,message:"Currency id is empty."});

        }
    },
    editCurrencyPairInfo: async(req,res,next) => {

        var secPass = req.body.sec_password;
        var settings = await adminHelper.settingsFind();
        for(let set of settings){
            if(set.field_slug == 'third_password') var dbSecPass = set.field_val;
        }
        if(secPass.replace('&amp;','&') != reqDeEncrypt(dbSecPass)){
            return res.status(400).send({status:false,message:"Password not matched."});   
        }

        if(req.body.pairId > 0){
            var ok = false;
            if(req.body.minTradeLimit){               
                var sql = `UPDATE trading_pairs SET min_pair_price=${req.body.minTradeLimit} WHERE tarding_pair_id=${req.body.pairId}`;   
                await db.connection.query(sql);
                ok = true;
            }
            if(req.body.tradeFee){
                var sql = `UPDATE pair_commission SET c_amount='${req.body.tradeFee}' WHERE pair_id=${req.body.pairId}`; 
                await db.connection.query(sql);  
                ok = true;
            }
            if(ok){
                return res.status(200).send({status:true,message:"Currency pair info has been updated successfully."});
            }else{
                return res.status(400).send({status:false,message:"Opps! there are some technical issue, currency pair info has not been updated."});
            }
        }else{
            return res.status(400).send({status:false,message:"Currency pair id is empty."});

        }
    },

    currencySummary: async(req,res,next) => {
        var sql = `SELECT SUM(ac.balance) as balance, SUM(ac.locked_balance) as lockedBalance, SUM(ac.balance + ac.locked_balance) total, cm.currency_symbol FROM accounts as ac LEFT JOIN currency_master as cm ON cm.currency_id = ac.currency_id GROUP BY ac.currency_id`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        return res.status(200).send({status:true,total:results.length,data:results})
    }

    

}
