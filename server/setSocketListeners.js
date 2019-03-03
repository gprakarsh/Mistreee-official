module.exports = {
    setSocketListeners: function (socket, db,io){
        
        socket.on('join room', room => {
            console.log('User subscribed to ' + room)
            socket.join(room)
        })

        socket.on('someoneWantsToChat', conversationId=>{
            console.log({conversationId})
            io.to('adminChatRoom').emit('someoneWantsToChat', conversationId)
        })
        
        socket.on('msg',data=>{
            console.log(data)  
            io.to(data.conversationId).emit('msg', data)
        })

        socket.on('someoneLoggedIn', async() => {
            console.log('someoneLoggedInYo')
            let loginStats = await db.info.loginsCount()
            
            let userCount = await db.info.userCount()
            userCount = parseInt(userCount[0].count)
            let mechCount = await db.info.mechCount()
            mechCount = parseInt(mechCount[0].count)
    
            let userPercentage = userCount / (userCount + mechCount) * 100
            let mechPercentage = mechCount / (userCount + mechCount) * 100

            io.to('line').emit('someoneLoggedIn',{data:loginStats})
            io.to('donut').emit('someoneLoggedIn',{data:{userPercentage,mechPercentage}})
        })
}}