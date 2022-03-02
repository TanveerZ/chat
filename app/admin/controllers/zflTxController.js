var db = require('../../../config/db');
var config = require('../../config');

var env = config.envIs;

const Web3 = require('web3');
var mq = require('amqplib/callback_api');

if (env == 'local') {
    var RabbitMq = 'amqp://guest:guest@localhost'; // Staging server public IP
} else if (env == 'stage') {
    var RabbitMq = 'amqp://rbmq:R3Pt98JNVWQjxbt2@172.31.95.162'; // Staging server Private IP
} else if (env == 'live') {
    var RabbitMq = 'amqp://mqadmin:YpuUQFthhRzJ6GDDyMUwX2rRYUvqNwAK9wfxmRcg@172.31.84.49'; // Live Server Private IP Public IP : 34.225.136.46
}

var mq_query = `eth_block_trasactions_new_${env}`;

class REQUEUE_ETH_TX {

    constructor(){
        var web3EndPoint = "https://mainnet.infura.io/v3/d7145880fb554b8788856147b1d9efc8";
        //var web3EndPoint = config.ETH_NODE_HTTP;
        var provider = new Web3.providers.HttpProvider(web3EndPoint);
        this.web3 = new Web3(provider);
        this.mq_server = { connected: false, ch: {} };
        this.start_rabbitmq_server();
        this.erctoken = [];
        this.erctoken['zfl'] = { "address": "0x19fFfd124CD9089E21026d10dA97f8cD6B442Bff", "decimals": 100000000 };
    }

    async start_rabbitmq_server() {
        var _this = this;
        mq.connect(RabbitMq, async function (err, conn) {
            conn.createChannel(function (err, ch) {
                //console.log("Error " + err)
                if (!err) {
                    _this.mq_server.connected = true;
                    _this.mq_server.ch = ch;
                }
            })
        })
    }

    async transaction_detial(tx_id, res) {
        ////console.log('tx id',tx_id)
        var transaction = await this.web3.eth.getTransaction(tx_id);
        var transactionSend = {};
        var is_token = await this.is_contract(transaction.to);
        ////console.log(is_token);
        if (is_token != null) {
            var amount_hex = transaction.input.substring(74, transaction.input.length);
            var amount = this.web3.utils.hexToNumber("0x" + amount_hex)
            amount = amount / this.erctoken[is_token].decimals;
        } else {
            amount = this.web3.utils.fromWei(transaction.value);
        }
        if (transaction) {
            transactionSend.tx_id = transaction.hash;
            transactionSend.from_address = transaction.from;
            transactionSend.to = is_token != null ? "0x" + transaction.input.substring(34, 74) : transaction.to;
            transactionSend.token = is_token;
            transactionSend.amount = amount;
            transactionSend.block_id = transaction.blockNumber;
        }
        ////console.log(transactionSend);
        await this.add_data_to_queue(JSON.stringify(transactionSend));
        return res.status(200).send({status:true,message:"Transaction has bee added in queue successfully."});

    }

    async is_contract(address) {
        for (var key in this.erctoken) {
            var value = this.erctoken[key];
            if (value.address == address) {
                return key;
            }
        }
        return null;
    }

    async add_data_to_queue(msg) {
        this.mq_server.ch.assertQueue(mq_query, { durable: false });
        this.mq_server.ch.sendToQueue(mq_query, new Buffer(msg));
        //console.log("Transaction added to que")
    }

}

module.exports = { 
    zflTx: async(req,res,next) => {
        if(req.body.tx_id){
            var eth = new REQUEUE_ETH_TX();
            await eth.transaction_detial(req.body.tx_id, res);
        }else{
            return res.status(400).send({status:false,message:"Please add transaction id."});
        }
    }
}