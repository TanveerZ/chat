var db = require('../../../config/db');

var mongoose = require('mongoose');
mongoose.connect(`mongodb://${db.mongo.host}/${db.mongo.db}`, { useNewUrlParser: true });
var TRANSACTIONS = mongoose.model('Transactions');

module.exports = {


    depositsWithdraws: async(req,res,next) => {
        var reqLimit = 10,
        reqOffset = 0,
        where = new Object();
        where['type'] = req.body.type;

        if(req.body.limit){
            reqLimit = req.body.limit;
        }
        if(req.body.offset){
            reqOffset = req.body.offset;
        }
        if(req.body.userId) {
            where['user_id'] = req.body.userId.toString();
        }
        if(req.body.coinId && req.body.coinId !== "all"){
            where['coin'] = req.body.coinId.toString();
        }
        if(req.body.status && req.body.status !== "all"){
            where['status'] = req.body.status;
        }
        if(req.body.fromDate){
            var fromDate = new Date(req.body.fromDate);
            var toDate = new Date(req.body.toDate);    
            where['created_date'] = new Object({ "$gte": fromDate,"$lt": toDate });
        }
        if(req.body.toDate){
            var fromDate = new Date(req.body.fromDate);
            var toDate = new Date(req.body.toDate);         
            where['created_date'] = new Object({ "$gte": fromDate,"$lt": toDate });
        }    
        //console.log(where)
        var transWithdrawAgr = TRANSACTIONS.aggregate([            
            { 
            "$match": where
        },
            { "$sort" : { created_date : -1} },
            { "$skip" : reqOffset },
            { "$limit" : reqLimit }           
        ]);
        var results = await transWithdrawAgr.exec();

        var transWithdrawAgr = TRANSACTIONS.aggregate([            
            { 
            "$match": where
        },
            { "$count" : "totalRecords"  }           
        ]);
        var resultsCount = await transWithdrawAgr.exec();
        var totalRecords = resultsCount.length > 0 ? resultsCount[0].totalRecords : 0;
        return res.status(200).send({status:true,totalRecords:totalRecords,data:results});
    },


}