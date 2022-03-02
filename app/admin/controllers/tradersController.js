var db = require('../../../config/db');
var Sequelize = require('sequelize');

var hlpr = require('../helper/heartbeat');
var Helper = require('../../helper/commen');
module.exports = {


    allTraders: async(req,res,next) => {
        var reqLimit = '',
        where = 'mm.member_id IS NOT NULL';
        if(req.body.limit){
            var reqLimit = `LIMIT ${req.body.offset},${req.body.limit}`;
        }
        if(req.body.fromDate){
            where += ` AND mm.created_at >= '${req.body.fromDate} 00:00:00'`;
        }
        if(req.body.toDate){
            where += ` AND mm.created_at <= '${req.body.toDate} 23:59:59'`;
        }
        if(req.body.email){
            where += ` AND mm.email LIKE '${req.body.email}%'`;
        }
        if(req.body.referredBy){
            where += ` AND mm.member_id = '${req.body.referredBy}'`;
        }
        if(req.body.country){
            where += ` AND mp.country = '${req.body.country}'`;
        }




        var sql = `SELECT mm.member_id,mm.email,mp.first_name,mm.account_status, mm.is_trading_active FROM member_master as mm 
        LEFT JOIN member_profile as mp ON mp.member_id = mm.member_id 
        WHERE ${where} ORDER BY mm.member_id DESC ${reqLimit}`;
        
        var results = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });

        var sql = `SELECT COUNT(mm.member_id) as totalRecords FROM member_master as mm 
        LEFT JOIN member_profile as mp ON mp.member_id = mm.member_id 
        WHERE ${where}`;

        var resultsCount = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
    
        return res.status(200).send({status:true,totalRecords:resultsCount[0].totalRecords,data:results});
    },

    getTraderDetail: async(req,res,next) => {
        var currencyMaster = await hlpr.getCurrencyMaster(),
        allDeposit = await hlpr.userDepositById(req.body.member_id),
        allWithdraw = await hlpr.userWithdrawById(req.body.member_id),
        deposits = [], withdraws = [], filterDataDeposit = '', filterDataWithdraw = '',filterBalancesData = '', userHistory = [], coinBalances = await hlpr.getMemberBalanceByCoinId(req.body.member_id); 
        
        var filterDeposit = allDeposit.map(vl => {
            return parseInt(vl._id);
        })
        var filterWithdraw = allWithdraw.map(vl => {
            return parseInt(vl._id);
        })
        var filterBalances = coinBalances.map(vl => {
            return parseInt(vl.coin_id);
        })

        for(i=0;i<currencyMaster.length;i++){
           
            var el = currencyMaster[i];
            userHistory[i] = new Object();
            userHistory[i]['currency_symbol'] = el.currency_symbol;
            
            filterDataDeposit = allDeposit.filter(obj => {
                return obj._id == el.currency_id;
            });                
            if(filterDeposit.includes(el.currency_id)){
                userHistory[i]['deposit'] = filterDataDeposit[0].totalAmount;
            }else{
                userHistory[i]['deposit'] = 0;
            }

            filterDataWithdraw = allWithdraw.filter(obj => {
                return obj._id == el.currency_id;
            });

            if(filterWithdraw.includes(el.currency_id)){
                userHistory[i]['withdraw'] = filterDataWithdraw[0].totalAmount;  
                     
            }else{
                userHistory[i]['withdraw'] = 0;
            }   

            filterBalancesData = coinBalances.filter(obj => {
                return obj.coin_id == el.currency_id;
            });

            if(filterBalances.includes(el.currency_id)){
                userHistory[i]['balance'] = filterBalancesData[0].totalBalance; 
                userHistory[i]['address'] = filterBalancesData[0].address; 
            }else{
                userHistory[i]['balance'] = 0;
                userHistory[i]['address'] = '';
            }
            
            userHistory[i]['currency_id'] = el.currency_id;

        }

        var row = await hlpr.userPersonalDetailById(req.body.member_id);
        res.status(200).send({status:true,data:row,userHistory:userHistory});
    },

    lockUser: async(req,res,next) => {
        var sql = `SELECT account_status FROM member_master WHERE member_id = ${req.body.member_id}`;
        var getUserStatus = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        if(getUserStatus[0].account_status == 0){
            var acStatus = 1;
            sql = `UPDATE member_master set account_status = '${acStatus}' WHERE member_id = ${req.body.member_id}`;
        }else{
            var acStatus = 0;
            sql = `UPDATE member_master set account_status = '${acStatus}' WHERE member_id = ${req.body.member_id}`;
        }
        var updateStatus = await db.connection.query(sql);

        if(updateStatus){
            return res.status(200).send({status:true,data:{account_status: acStatus},message:"User has been updated successfully."});
        }else{
            return res.status(400).send({status:false,data:[],message:"Opps! there are some technical issue, user has not been updated."});
        }
    },

    sendAuthKey: async(req,res,next) => {
        var sql = `SELECT google2fa_secret,email FROM member_master WHERE member_id = ${req.body.member_id}`;
        var getUsersAuthKey = await db.connection.query(sql, { type: Sequelize.QueryTypes.SELECT });
        if(getUsersAuthKey[0].google2fa_secret){
            var messageHtml = `<p><br/>Here is your Google Authentication Key: ${getUsersAuthKey[0].google2fa_secret}</p>`
            await res.render('commonmsg', {
                subject:"Authentication Key",
                message: messageHtml
              }, async (err, html) => {
                if (err) {
                  return res.status(500).send({ error: err });
                }
                await Helper.commen.sendMail(getUsersAuthKey[0].email, "Authentication Key", html);
                return res.status(200).send({status:true,message:"Key has been sent on user's email successfully."});
            }); 
        }else{
            return res.status(200).send({status:false,message:"Unable to find authentication key."});
        }

    },

    kycUpdate: async(req,res,next) => {
        var memberProfile = `UPDATE member_profile SET first_name = '${req.body.firstName}',middle_name='${req.body.middleName}',last_name='${req.body.lastName}',dob='${req.body.dob}',phone='${req.body.phone}',address='${req.body.address}',relation='${req.body.relation}',gender='${req.body.gender}',city='${req.body.city}',country='${req.body.country}' WHERE member_id = ${req.body.memberId}`;
        var updateProfile = await db.connection.query(memberProfile);
        if(updateProfile){
            return res.status(200).send({status:true,message:"Kyc has been updated successfully."});
        }else{
            return res.status(400).send({status:true,message:"Opps! there are some technial reason, kyc has not been updated."});
        }
    },

    kycDelete: async(req,res,next) => {
        var memberProfile = `UPDATE member_master SET kyc_status = '0' WHERE member_id = '${req.body.memberId}'`;
        var updateProfile = await db.connection.query(memberProfile);
        if(updateProfile){
            return res.status(200).send({status:true,message:"Kyc has been updated successfully."});
        }else{
            return res.status(400).send({status:true,message:"Opps! there are some technial reason, kyc has not been deleted."});
        }
    }
}