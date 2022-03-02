module.exports = function(app, io,database){
var amqp = require('amqplib/callback_api');
// const cors = require('cors');
// app.use(cors()); 
io.on('connection', (socket) => {
    // //console.log('made socket connetion',socket.id);
    // handle chat event
    socket.emit('chat', { someProperty: 'some value', otherProperty: 'other value' });
    socket.on('notify', (data) => {

                // if received chat request 

                amqp.connect('amqp://localhost', function(err, conn) {
                conn.createChannel(function(err, ch) {

                // latest message fetch 
                var q = 'hello1ssss';
            
                ch.assertQueue(q, {durable: false});
                // Note: on Node 6 Buffer.from(msg) should be used
            
                //console.log(" [x] Sent 'Hello user1!'");
                ch.sendToQueue(q, new Buffer.from('Hello user1!')); 

                
                //console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
                    ch.consume(q, function(msg) {

                    //console.log(" [x] Received %s", msg.content.toString());

                    // now send notification to all 
                    
                    //console.log(data)
                    io.sockets.emit('test',{fromnode:'hi pardeep'})
                    
                    setTimeout(function () {
                        io.sockets.emit('test',{fromnode:'kidda'})
            
                    }, 5000)     

                           
                    setTimeout(function () {
                        io.sockets.emit('test',{fromnode:'new data'})
            
                    }, 10000)     
                
                
                    
                }, {noAck: true});
                


                });
            });

    });
    
})

}