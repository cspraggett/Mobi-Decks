let socket = io('/game2');
const room_id = window.location.pathname;

$(function () {
  socket.on('connect', () => {
    socket.emit('join', room_id);
  })

  socket.on('system', function(msg){
  const text = JSON.parse(msg);
  console.log('system: ' + text.msg);
  });
})

