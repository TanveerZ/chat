require('./globalfunctions');
global.activeUsers = [];
global.member = '';
global.userSocket = {};

module.exports = async function(io){

    io.of("exchange").on('connection', async (socket) => {
       
        /**
         * Function to set value of global userPair variable 
         * @param 
         * @return 'empty'
         * @author Durga Parshad
         * @since 25-april-2019
         */
        socket.on('currentPair',async(data) => {
            socket.join(data.data);
            if(data.data !== 'undefined'){
                global.activeUsers.push({
                    userSocketId : socket.id,
                    userPair : data.data
                }) 
            }      
        })
                
        /**
         * Function to empty global activeUsers variable in disconnetion 
         * @param 
         * @return 'empty'
         * @author Durga Parshad
         * @since 25-april-2019
         */

        socket.on('disconnect', function () {
                
            for(key in global.activeUsers) {
                if(global.activeUsers[key].userSocketId == socket.id){
                    global.activeUsers.splice(key,1);
                }
            }
                  
        }); 
            
    })
}