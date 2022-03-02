var db = require('../../../config/db');
var Sequelize = require('sequelize');
let request = require('async-request');
var Helper = require("../../modules/wallet/helpers/wallet");
var helperHeartbeat = require('../helper/heartbeat')
var orderHelper = require('./../../modules/orders/helper/orderHelper');

module.exports = {

    bitgoReports: async(req,res,next) => {       
        var account_balances = "SELECT currency_master.is_bitgo_based, currency_name, bitgo_wallet, bitgo_wallet_passphrase, currency_symbol, SUM(accounts.balance + accounts.locked_balance) as `total`, accounts.currency_id FROM `accounts` INNER join  `currency_master` on accounts.currency_id= currency_master.currency_id WHERE currency_master.is_active = 'YES' GROUP BY accounts.currency_id";
        var coins = await db.connection.query(account_balances, { type: Sequelize.QueryTypes.SELECT });
        var coins_info = [];
        for(const coin of coins) {
            if(coin.is_bitgo_based == 'YES'){
                var options = await Helper.AwaitPublicGet(`${coin.currency_symbol}/wallet/${coin.bitgo_wallet}`);
                var data = await request(options.url, options.data);
                if (typeof data.body === 'string') {
                    var body = JSON.parse(data.body);
                }if (typeof body.error === "undefined") {
                    var _bitgobalance = body.confirmedBalance / 1e8;
                    var diff = coin.total - _bitgobalance;

                    coins_info.push({
                        'currency': coin.currency_name,
                        'db_balance': coin.total,
                        'bitgo_balance': _bitgobalance,
                        'difference': diff
                    });
                }
            }
        }

        return res.status(200).send({status:true,data:coins_info});
    },
    balanceReports: async(req,res,next) => {
        var account_balances = "SELECT currency_master.is_bitgo_based, currency_name, bitgo_wallet, bitgo_wallet_passphrase, currency_symbol, SUM(accounts.balance + accounts.locked_balance) as `total`, accounts.currency_id FROM `accounts` INNER join  `currency_master` on accounts.currency_id= currency_master.currency_id  WHERE currency_master.is_active = 'YES' GROUP BY accounts.currency_id";
        var coins = await db.connection.query(account_balances, { type: Sequelize.QueryTypes.SELECT });
        var coins_info = [];
        for(const coin of coins) {
            if(coin.is_bitgo_based == 'YES'){
                var options = await Helper.AwaitPublicGet(`${coin.currency_symbol}/wallet/${coin.bitgo_wallet}`);
                var data = await request(options.url, options.data);
                if (typeof data.body === 'string') {
                    var body = JSON.parse(data.body);
                }if (typeof body.error === "undefined") {
                    var _bitgobalance = body.confirmedBalance / 1e8;
                    var diff = coin.total - _bitgobalance;
                    coins_info.push({
                        'currency': coin.currency_name,
                        'funds_commitment': coin.total,
                        'hot_wallet_balance': _bitgobalance,
                        'cold_wallet_balance': 0,
                        'difference': diff
                    });                
                }
            }else{
                coins_info.push({
                    'currency': coin.currency_name,
                    'funds_commitment': coin.total,
                    'hot_wallet_balance': 0,
                    'cold_wallet_balance': 0,
                    'difference': 0
                });   
            }
        }


        return res.status(200).send({status:true,data:coins_info});
    },
    coinProfile: async(req,res,next) => {
        var fromDate = new Date(new Date().setDate(new Date().getDate()-150));
        var toDate = new Date();

        var fromDateSql = fromDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var toDateSql =  toDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');

        var account_balances = "SELECT currency_master.is_bitgo_based, currency_name, bitgo_wallet, bitgo_wallet_passphrase, currency_symbol, SUM(accounts.balance) as `balance`,SUM(accounts.locked_balance) as locked_balance, accounts.currency_id FROM `accounts` INNER join  `currency_master` on accounts.currency_id= currency_master.currency_id GROUP BY accounts.currency_id";
        var exchData = await db.connection.query(account_balances, { type: Sequelize.QueryTypes.SELECT });

        var deposits = await helperHeartbeat.getDepositWithdrawByCoin('deposit');
        var withdraws = await helperHeartbeat.getDepositWithdrawByCoin('withdraw');

        var sql=`SELECT cm.currency_id,cm.currency_name,cm.currency_symbol,COUNT(trade_id) as totalTrades FROM currency_master as cm LEFT JOIN trades as trd ON (trd.buy_id = cm.currency_id || trd.sell_id = cm.currency_id) WHERE cm.is_active='YES' GROUP BY cm.currency_id`;        
        var allCoins = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT }); 
        
        var coins_info = [], allDeposits = [], allWithdraws = [];
        for(const el of allCoins){

            allDeposits = deposits.filter(function(eld){
                return eld._id == el.currency_id
            });
            allWithdraws = withdraws.filter(function(eld){
                return eld._id == el.currency_id
            });
            allExchData = exchData.filter(function(eld){
                return eld.currency_id == el.currency_id
            });
            
            coins_info.push({
                'currency_id': el.currency_id,
                'currency': el.currency_name,
                'currency_symbol': el.currency_symbol,
                'totalTrades':el.totalTrades,
                'deposits': allDeposits.length > 0 ? allDeposits[0].totalAmount : 0,
                'withdraws': allWithdraws.length > 0 ? allWithdraws[0].totalAmount : 0,
                'balance': allExchData.length > 0 ? allExchData[0].balance : 0,
                'locked_balance': allExchData.length > 0 ? allExchData[0].locked_balance : 0
            })
        }

       return res.status(200).send({status:true,data:coins_info});
    },
    /**
     * Function to get user deposit,withdraw,orders,trades details
     * @param 'user_id'
     * @return 'JSON'
     * @author Durga Parshad
     * @since 01-August-2019
     */
    userLedger : async(req,res) => {
        var member_id = req.body.user_id;
        var result = [];
        var userWitdrawList = await helperHeartbeat.userWithdrawList(member_id); 
        //result.push(userWitdrawList[0]);
        console.log("FIRST STEP ",result);
        var userDepositList = await helperHeartbeat.userDepostList(member_id);
        //result.push(userDepositList[0]);
        console.log("SECOND STEP ",result);
        var userOrders = await orderHelper.memberOrdersList(member_id);
        console.log("ORDER LIST ",userOrders[0]);
        for(var i = 0; i < userOrders.length; i++ ){
            result.push(userOrders[i]);
        }
        console.log("THIRD STEP ",result);
        var trades = await orderHelper.memberTrades(member_id);
        result.push(trades[0]);
        console.log("FINAL STEP ",result);
        return res.status(200).json({status : true, data : result.sort(function(a, b){return a.created_at - b.created_at})});
    }
}