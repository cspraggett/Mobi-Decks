let data = {};
const handDivs = {player: [], opponent: []};

$(document).ready(() => {

  //---------------------------------------------------------/
  // socket specific events ---------------------------------/
  //---------------------------------------------------------/

  $(function () {
    //socket initialization
    const socket = io('http://localhost:8080/game');

    // // when player enters chat send it to server: DISABLED UNTIL REIMPLEMENTATION
    // $('form').submit(function(e){
    //   e.preventDefault(); // prevents page reloading
    //   socket.emit('chat message', `{ "id": "${socket.id}", "msg": "${$('#m').val()}" }`);
    //   $('#m').val('');
    //   return false;
    // });

    // // when recieveing chat message from server display message: DISABLED UNTIL REIMPLEMENTATION
    // socket.on('chat message', function(msg){
    //   const data = JSON.parse(msg);
    //   console.log(data.msg);
    // });

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
      }

    });

    // display current dealer card
    const dealerPlay = function(arr) {
      arr = arr.slice(1);
      $('.dealer-bid').append($('<img src="/images/cards/2C.png">'));
    }

    // place cards at the beginning at the start of a game
    const spawnCardsWithDelay = function(index) {
      if (index < 13) {
        setTimeout(() => {
          let num = index.toString();
          let playerColor, opponentColor = "";
          // assign preset colors(suits) for each player
          if (data.player.id === 1) {
            playerColor = "spade";
            opponentColor = "heart";
          } else if (data.player.id === 2) {
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
        dealerPlay(data.dealer.hand);
        data.phase = 1;
        console.log('new gamePhase: phase: ' + data.phase);
      }
    }

    // when game phase changing data is received
    socket.on('gamePhase', function(msg) {
      // $('.bids').empty(); -- set up for future

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
        dealerPlay(data.dealer.hand);
      }
    })

    // when game update information is received
    socket.on('gameUpdate', function(msg){
    const update = JSON.parse(msg);
    // console.log('update recieved');
    // console.log(update);

      if (data.player_id !== update.player * 1) {
        if (update.item === "bid") {
          // find location of opponent card that is sent to bid
          cardValue = update.value;
          cardIndex = jQuery.inArray(cardValue * 1, data.opponent.hand);

          // remove opponent card from hand in data
          data.opponent.hand.splice(cardIndex, 1);
          // update opponent current bid in data
          data.opponent.currentBid = update.value;
          // place opponent card in bid
          for (let i = 0; i < handDivs.opponent.length; i++) {
            if (handDivs.opponent[i].attr("value") === cardValue) {
              $(handDivs.opponent[i]).prependTo('.bids');
              $(handDivs.opponent[i]).removeClass('cards');
              $(handDivs.opponent[i]).addClass('row bid-card');
            }
          }
          console.log('opponent bid: ' + data.opponent.currentBid);
          console.log('opponent hand: ' + data.opponent.hand);
          // console.log(data);
        }
      } else {
        if (update.item === "bid") {
          // find location of opponent card that is sent to bid
          cardValue = update.value;
          cardIndex = jQuery.inArray(cardValue * 1, data.player.hand);

          // remove opponent card from hand in data
          data.player.hand.splice(cardIndex, 1);
          // update opponent current bid in data
          data.player.currentBid = update.value;
          // place opponent card in bid
          for (let i = 0; i < handDivs.player.length; i++) {
            if (handDivs.player[i].attr("value") === cardValue) {
              $(handDivs.player[i]).appendTo('.bids');
              $(handDivs.player[i]).removeClass('cards');
              $(handDivs.player[i]).addClass('row bid-card');
            }
          }
          console.log('opponent bid: ' + data.player.currentBid);
          console.log('opponent hand: ' + data.player.hand);
          // console.log(data);
        }
      }
    })

    //-------------------------------------------------------/
    // document ready events --------------------------------/
    //-------------------------------------------------------/

    // when player picks a card
    $(".p1-hand").on('click', function(event) {
      if (data.player.currentBid === "") {
        // pick a card
        cardValue = $(event.target.parentNode).attr("value");
        // cardIndex = jQuery.inArray(cardValue * 1, data.player.hand);

        // // remove card from hand in data
        // data.player.hand.splice(cardIndex, 1);
        // // update current bid in data
        // data.player.currentBid = cardValue;
        // // place card div in bid
        // $(event.target.parentNode).appendTo('.bids');
        // $(event.target.parentNode).removeClass('cards bot');
        // $(event.target.parentNode).addClass('row bid-card');
        // console.log('player bid: ' + data.player.currentBid);
        // console.log('player hand: ' + data.player.hand);
        // // console.log(data);

        socket.emit('gameUpdate', `{"player": "${data.player_id}", "item": "bid", "value": "${cardValue}" }`);
      }
    });

  })
});
