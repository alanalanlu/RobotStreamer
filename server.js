const { Console } = require('console')
const express = require('express')
const Router = express.Router

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

var queue = [];

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
function queueSystem(){
  if (queue.length>0){

      var next=queue[0]
      if (!io.sockets.adapter.rooms[100] || io.sockets.adapter.rooms[100].length<2){
        if (io.sockets.adapter.rooms[100]!=null){
          console.log('before enter',io.sockets.adapter.rooms[100],io.sockets.adapter.rooms[100].length)
        }            
        next[1].join(100)
        next[1].to(100).broadcast.emit('user-connected', next[0])
        console.log('entered',io.sockets.adapter.rooms[100],io.sockets.adapter.rooms[100].length)
        
        queue.shift()
        io.emit('shortenQueue',{position: 10})
        setTimeout(function(){
          
          // console.log('leaving',io.sockets.adapter.rooms[100],io.sockets.adapter.rooms[100].length)
          next[1].leave(100)
          next[1].to(100).broadcast.emit('user-disconnected', next[0])
          // console.log('left',io.sockets.adapter.rooms[100],io.sockets.adapter.rooms[100].length)
          queueSystem()
        }, 61000)}
       }
}
// function logic to be called
// console.log('joinroom')
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log(socket)
    
    
    roomId=100

    if (!io.sockets.adapter.rooms[roomId] || io.sockets.adapter.rooms[100].length<2){
      if (io.sockets.adapter.rooms[100]!=null){
        console.log('normal join',io.sockets.adapter.rooms[100],io.sockets.adapter.rooms[100].length)
      }
      socket.join(roomId)
      
      // console.log('joined',io.sockets.adapter.rooms[100],io.sockets.adapter.rooms[100].length)

      socket.to(100).broadcast.emit('user-connected', userId)
      console.log("user-connected")
      if (io.sockets.adapter.rooms[roomId].length==2){
        setTimeout(function(){
          socket.leave(100)
          socket.to(roomId).broadcast.emit('user-disconnected', userId)
          queueSystem()
        }, 61000)}
    }
    else{
      queue.push([userId,socket]); 

      socket.emit('queuePostition', {position: queue.length})

      console.log(queue)
    }
    
    socket.on('disconnect', () => {
      console.log('disconnected')
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
      // for 
      queue = queue.filter(function(e) { return e[0] !== userId })

    })
  })
})

server.listen(process.env.PORT || 3000)