var db = require('../../../config/db');
var Sequelize = require('sequelize');

var hlpr = require('../helper/heartbeat');
var Helper = require('../../helper/commen');


module.exports = {


    allCounter: async(req,res,next) => {
        var allData = new Object();
        var sql = `SELECT COUNT(mm.email) as allTraders FROM member_master as mm WHERE mm.user_role = '1'`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        allData['totalTraders'] = results[0].allTraders;

        var sql = `SELECT COUNT(order_id) as completedOrders FROM orders WHERE is_completed = 'YES'`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        allData['completedOrders'] = results[0].completedOrders;

        var sql = `SELECT COUNT(order_id) as pendingOrders FROM orders WHERE is_completed = 'NO' AND is_cancelled = 'YES'`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        allData['pendingOrders'] = results[0].pendingOrders;

        allData['totalEarning'] = "0";

        var sql = `SELECT COUNT(mm.email) as pendingKyc FROM member_master as mm WHERE mm.user_role = '1' AND mm.kyc_status = 0`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        allData['pendingKyc'] = results[0].pendingKyc;
        
        return res.status(200).send({status:true,data:allData});
    },

    tradeAndVolumeComparison: async(req,res,next) => {
        var sql = `SELECT COUNT(tt.trade_id) as tradeCount,SUM(tt.actual_units) as sumVolume,tp.tarding_pair_key FROM trades as tt LEFT JOIN trading_pairs as tp ON tp.tarding_pair_id = tt.pair_id WHERE tp.is_active = 'YES' GROUP BY tt.pair_id`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        Array.prototype.getColumn = function(name) {
            return this.map(function(el) {
            if (el.hasOwnProperty(name)) return el[name];
            }).filter(function(el) { return typeof el != 'undefined'; }); 
        };
        var data = {           
            pair_key:results.getColumn('tarding_pair_key'),
            trades:results.getColumn('tradeCount'),
            volume:results.getColumn('sumVolume'),        
        };
        return res.status(200).send({status:true,data:data});
    },

    newAndActiveUsers: async(req,res,next) => {
        return res.status(200).send({status:true,data:[]});
        var sql = `SELECT YEAR(mm.created_at) AS y, MONTH(mm.created_at) AS m, COUNT(DISTINCT mm.member_id) as newUsers, COUNT(DISTINCT oo.member_id) as activeUsers FROM member_master as mm LEFT JOIN orders as oo ON MONTH(oo.created_at) = MONTH(mm.created_at) GROUP BY y, m`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });

        Array.prototype.getColumn = function(name) {
            return this.map(function(el) {
            if (el.hasOwnProperty(name)) return el[name];
            }).filter(function(el) { return typeof el != 'undefined'; }); 
        };
        var data = {           
            year:results.getColumn('y'),
            months:results.getColumn('m'),
            newUsers:results.getColumn('newUsers'),        
            activeUsers:results.getColumn('activeUsers'),        
        };
        return res.status(200).send({status:true,data:data});

    },

    withdrawMonths: async(req,res,next) => {
        var results = await  hlpr.withdrawByMonths();
        Array.prototype.getColumn = function(name) {
            return this.map(function(el) {
            if (el.hasOwnProperty(name)) return el[name];
            }).filter(function(el) { return typeof el != 'undefined'; }); 
        };
        var data = {           
            m:results.getColumn('_id'),
            withdraws:results.getColumn('amount')       
        };
        return res.status(200).send({status:true,data:data});
    },

    tradesByMonth: async(req,res,next) => {
        var sql = `SELECT YEAR(trd.created_at) AS y, MONTH(trd.created_at) AS m, COUNT(DISTINCT trd.order_id) as allTrades FROM trades as trd GROUP BY y, m`;
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        Array.prototype.getColumn = function(name) {
            return this.map(function(el) {
            if (el.hasOwnProperty(name)) return el[name];
            }).filter(function(el) { return typeof el != 'undefined'; }); 
        };
        var data = {           
            m:results.getColumn('m'),
            trades:results.getColumn('allTrades')       
        };
        return res.status(200).send({status:true,data:data});

    }

}