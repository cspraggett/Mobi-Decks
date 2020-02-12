module.exports = function(io) {

  console.log('loaded newSocket.js');

  io.of("/game2").on('connection', function(socket) {
    socket.on('join', (room_id) => {
      // console.log(io.nsps['/game2'].adapter.rooms[room_id]);
      socket.join(room_id);


      // console.log('*-start--------------------------');
      // console.log('*-object keys io.nsps------------');
      // console.log(Object.keys(io.nsps));
      // console.log('*-all rooms----------------------');
      // console.log(Object.keys(io.nsps['/game2'].adapter.rooms));
      // console.log('*-specific room length-----------');
      // console.log(io.nsps['/game2'].adapter.rooms[room_id].length);
      // console.log('*-specific room sockets----------');
      // console.log(io.nsps['/game2'].adapter.rooms[room_id].sockets);
      // console.log('--------------------------------*');
      // console.log('*---------------------------end-*');

    })
    // if (!io.nsps['/game2'].adapter.rooms.room1) {

    // } else {
    //   if ((io.nsps['/game2'].adapter.rooms.room1.length >= 2)) socket.join('room2');
    // }


  //   function getAllRoomMembers(room, _nsp) {
  //     var roomMembers = [];
  //     var nsp = (typeof _nsp !== 'string') ? '/game2' : _nsp;

  //     for( var member in io.nsps[nsp].adapter.rooms[room] ) {
  //         roomMembers.push(member);
  //     }

  //     return roomMembers;
  // }
  // console.log(getAllRoomMembers('room1'));


  io.of("/game2").in('room1').emit('system', `{ "type": "announcement", "msg": "you are in game2" }`);
  })


};
