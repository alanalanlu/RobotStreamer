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

// function logic to be called
// console.log('joinroom')
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    // function queueSystem(){
    //   if (queue.length>0){
    //       var next=queue[0]
    //       socket.to(100).broadcast.emit('user-connected', next)
    //       queue.shift()
    //       io.emit('shortenQueue',{position: 10})
    //       setTimeout(function(){
    //         socket.to(100).broadcast.emit('user-disconnected', next)
    //         queueSystem()
    //       }, 11000)}
    // }
    // roomId=100
    // if (!io.sockets.adapter.rooms[roomId] || io.sockets.adapter.rooms[roomId].length<2){
    //   socket.join(roomId)
    //   socket.to(100).broadcast.emit('user-connected', userId)
    //   if (io.sockets.adapter.rooms[roomId].length==2){
    //     setTimeout(function(){
    //       socket.leave(100)
    //       socket.to(roomId).broadcast.emit('user-disconnected', userId)
    //       queueSystem()
    //     }, 11000)}
    // }
    // else{
    //   queue.push(userId); 

    //   socket.emit('queuePostition', {position: queue.length})

    //   console.log(queue)
    socket.to(100).broadcast.emit('user-connected', userId)
    
    socket.on('disconnect', () => {
      console.log('disconnected')
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
      queue = queue.filter(function(e) { return e !== userId })
    })
  })
})

server.listen(process.env.PORT || 3000)