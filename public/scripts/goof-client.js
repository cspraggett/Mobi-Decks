let data = {};
const handDivs = {player: [], opponent: []};
const socket = io('http://localhost:8080/game');
const room_id = window.location.pathname;

//---------------------------------------------------------/
// socket specific events ---------------------------------/
//---------------------------------------------------------/

$(function () {
  console.log('start');
  //socket initialization
  socket.on('connect', () => {
    socket.emit('join', room_id);

    //socket disconnect message
    socket.on('disconnect', () => {
      socket.emit('leave', 'hello');
    })
  })

  // system message: include clear table at start of game
  socket.on('system', function(msg){
    const text = JSON.parse(msg);
    console.log('system: ' + text.msg);

    if (text.type === 'start') {
      $('.p2-won').empty();
      $('.p2-hand').empty();
      // $('.bid-table').empty();
      $('.bids').empty();
      $('.dealer-bid').empty();
      $('.p1-hand').empty();
      $('.p1-won').empty();
      $('.p2-score').text(0);
      $('.p1-score').text(0);
    }

  });

  // display current dealer card
  const dealerPlay = function(card) {
    $('.dealer-bid').append($((cardImage.club[card])));
    data.player.ready = true;
  }

  // place cards at the beginning at the start of a game
  const spawnCardsWithDelay = function(index) {
    if (index < 13) {
      setTimeout(() => {
        let num = index.toString();
        let playerColor, opponentColor = "";
        // assign preset colors(suits) for each player
        if (data.player._id === 1) {
          playerColor = "spade";
          opponentColor = "heart";
        } else if (data.player._id === 2) {
          playerColor = "heart";
          opponentColor = "spade";
        }
        // make new divs and place image inside
        let innerDivTop = $(`<div class="cards">`).append($(cardImage[opponentColor][num]));
        let innerDivBot = $(`<div class="cards bot">`).append($(cardImage[playerColor][num]));
        // this assigns a hidden value to div that holds imgs, required to track specific card in handDivs
        $(innerDivTop).attr({ value: num });
        $(innerDivBot).attr({ value: num });
        // push newly made divs(cards) into handDivs, array that holds divs equal to hand cards
        handDivs.opponent.push(innerDivTop);
        handDivs.player.push(innerDivBot);
        // append newly made divs to appropriate div in html
        $(".p2-hand").append($(innerDivTop));
        $(".p1-hand").append($(innerDivBot));

        spawnCardsWithDelay(index + 1);
      }, 30);
    } else {
      dealerPlay(data.dealer._hand[0]);
      data.phase = 1;
      console.log('new gamePhase: phase: ' + data.phase);
    }
  }

  // when game phase changing data is received
  socket.on('gamePhase', function(msg) {
    data = JSON.parse(msg);
    console.log('new gamePhase: phase: ' + data.phase);

    //initialization
    if (data.phase === 0) {
      handDivs.player = [];
      handDivs.opponent = [];
      spawnCardsWithDelay(0);
      console.log('initialization');
    } else if (data.phase < 14) {
      // at the start of each phase
      setTimeout(() => {
        $('.bids').empty();
        $('.dealer-bid').empty();
        $('.p2-score').text(data.oScore);
        $('.p1-score').text(data.pScore);
        dealerPlay(data.dealer._hand[0]);
      }, 1000);
    } else if (data.phase === 14) {
      let innerDivTop = $(`<div>`).append(`<p>opponent won cards: ${data.player._wonBids} </p>`);
      let innerDivBot = $(`<div>`).append(`<p>player won cards: ${data.opponent._wonBids} </p>`);
      $($(innerDivTop)).prependTo('.bids');
      $($(innerDivBot)).appendTo('.bids');
    }
  })

  // when game update information is received
  socket.on('gameUpdate:goof', function(msg){
  const update = JSON.parse(msg);

    if (data.player._id !== update.player * 1) {
      if (update.item === "bid") {
        // find location of opponent card that is sent to bid
        cardValue = update.value;
        cardIndex = jQuery.inArray(cardValue * 1, data.opponent._hand);

        // remove opponent card from hand in data
        data.opponent._hand.splice(cardIndex, 1);
        // update opponent current bid in data
        data.opponent._currentBid = update.value;
        // place opponent card in bid
        for (let i = 0; i < handDivs.opponent.length; i++) {
          if (handDivs.opponent[i].attr("value") === cardValue) {
            $(handDivs.opponent[i]).prependTo('.bids');
            $(handDivs.opponent[i]).removeClass('cards');
            $(handDivs.opponent[i]).addClass('row bid-card');
          }
        }
        console.log('opponent bid: ' + data.opponent._currentBid);
      }
    } else {
      if (update.item === "bid") {
        // find location of opponent card that is sent to bid
        cardValue = update.value;
        cardIndex = jQuery.inArray(cardValue * 1, data.player._hand);

        // remove opponent card from hand in data
        data.player._hand.splice(cardIndex, 1);
        // update opponent current bid in data
        data.player._currentBid = update.value;
        // place opponent card in bid
        for (let i = 0; i < handDivs.player.length; i++) {
          if (handDivs.player[i].attr("value") === cardValue) {
            $(handDivs.player[i]).appendTo('.bids');
            $(handDivs.player[i]).removeClass('cards bot');
            $(handDivs.player[i]).addClass('row bid-card');
          }
        }
        console.log('player bid: ' + data.player._currentBid);
      }
    }
  })

  //-------------------------------------------------------/
  // document ready events --------------------------------/
  //-------------------------------------------------------/

  // when player picks a card
  $(".p1-hand").on('click', function(event) {
    if (
      data.player._currentBid === null
      && data.player.ready === true
      && $(event.target.parentNode).attr("value") !== undefined
      ) {
      cardValue = $(event.target.parentNode).attr("value");
      socket.emit('gameUpdate:goof', `{"room_id": "${room_id}", "player": "${data.player._id}", "item": "bid", "value": "${cardValue}" }`);
      data.player.ready = false;
    }
  });
});

