const Web3 = require('web3');
var globalFun = require('./globalfunctions')

var node = 'https://mainnet.infura.io/v3/d7145880fb554b8788856147b1d9efc8';
var provider = new Web3.providers.HttpProvider(node);
var web3 = new Web3(provider);
//0x23757B9Bea82519201e008b61f7c1fbcCf562406
var address = '0x23757B9Bea82519201e008b61f7c1fbcCf562406';
var result =  web3.eth.getTransactionCount(address, 'pending' ).then(function(result){
    console.log(result);
})

var b = encryptValue("0xf19cee8d58b1843e35d585a3cdfa6ac1142bc7a0c14afec000f7845f14929f77");
//console.log("b ", b);
var c = '2ecd9a1b9fe03a621ace2929c90150d2158ec3bf3b0d2247ce2ac778664629d8b0f064e2023b08ad2678237ee7c1748a9496ca017c2e06606859a178407b2ad91e00b836c9d52d8f7b50c74e69819bf3';
var a = decryptValue(c);
//console.log( "secret", a );





return;

require('amqplib/callback_api').connect("amqp://localhost", async function (err, conn) {
            conn.createChannel(function (err, ch) {
                var q = 'SRO_buy_sell_socket';
                
                //console.log("Test module");
                var msg ='{"action_type":"sell","main_order_id":26,"pair_id":1,"pair_order_table":"orders_1","sub_order_id":26}';
                //console.log(msg)
                ch.assertQueue(q, { durable: false });
                // Note: on Node 6 Buffer.from(msg) should be used
                ch.sendToQueue(q, new Buffer(msg));
                //console.log(" [x] Sent %s", msg);
            });
            setTimeout(function () { conn.close(); console.log("quaue connection closed."); }, 500);
        });

        
        

        if( db_eth_balance == null ){
            return { error: `You need atleast ${transferGasPriceInEth} eth in your account to send one transaction.` };
        } else if( eth_balance == 0 && db_eth_balance > 0 && erc20TokenBalance > 0 ) {
            if( db_eth_balance > transferGasPriceInEth ){
                //Gas fees transfer from main_to_wallet (m_to_w)
                return { type: 'm_to_w', gas_fees: transferGasPriceInEth, msg: 'Admin will transfer gas fees to user wallet for transaction' };
            }else{
                return { error: `You need atleast ${transferGasPriceInEth} eth in your account to send one transaction.` };
            }
        } else if ( eth_balance < transferGasPriceInEth ) {
            //return { error: `You need atleast ${transferGasPriceInEth} eth in your account to send one transaction.` };
            if( db_eth_balance > transferGasPriceInEth ){
                //Gas fees transfer from main_to_wallet (m_to_w)
                return { type: 'm_to_w', gas_fees: transferGasPriceInEth, msg: 'Admin will transfer gas fees to user wallet for transaction' };
            }else{
                return { error: `You need atleast ${transferGasPriceInEth} eth in your account to send one transaction.` };
            }
        } else {
            return {};
        }
