let data = {};
const handDivs = {player: [], opponent: []};
const socket = io('http://localhost:8080/crazy');
const room_id = window.location.pathname;
let user_id = null;

//---------------------------------------------------------/
// socket specific events ---------------------------------/
//---------------------------------------------------------/

$(function () {
  $('.pop-up').css('z-index', -1);

  if ($('#username')) {
    user_id = ($('#username').text());
    $('#playerName').text(user_id);
    if ($('#username') === 'guest') $('#username').empty();
  } else user_id = 'guest';


  //socket initialization
  socket.on('connect', () => {
    socket.emit('join', `{ "username": "${user_id}", "room_id": "${room_id}" }`);
  })

  // system message: include clear table at start of game
  socket.on('system', function(msg){
    const text = JSON.parse(msg);
    console.log('system: ' + text.msg);

    if (text.type === 'start') {
      $('.p2-won').empty();
      $('.p2-hand').empty();
      $('.bids').empty();
      $('.dealer-bid').empty();
      $('.p1-hand').empty();
      $('.p1-won').empty();
      // $('.p2-score').text(0);
      // $('.p1-score').text(0);
    }

    if(text.type === 'opponent') {
      $('#opponentName').text(text.msg);
    }

  });

  // display current face up card
  const placeFaceUpCard = function(card) {
    $('.place-pile').empty();
    console.log(translateCard(card[0][0]).suit);
    console.log(card[0][0] % 13);
    $('.place-pile').append($(
      cardImage
      [translateCard(card[0][0]).suit]
      [card[0][0] % 13]
    ))
  };

  // place cards at the beginning at the start of a game
  const spawnCardsWithDelay = function(index) {
    if (index < 8) {
      setTimeout(() => {
        let num = index.toString();
        let playerCards = [];
        let opponentCards = [];
        if (data.playerNum === 0) {
          playerCards = data.crazy8.players['0']._hand;
          opponentCards = data.crazy8.players['1']._hand;
        } else {
          playerCards = data.crazy8.players['1']._hand;
          opponentCards = data.crazy8.players['0']._hand;
        }

        // make new divs and place image inside
        let innerDivTop = $(`<div class="cards">`).append($(
          cardImage[translateCard(opponentCards[index]).suit][translateCard(opponentCards[index]).n]
          ));
        let innerDivBot = $(`<div class="cards bot">`).append($(
          cardImage[translateCard(playerCards[index]).suit][translateCard(playerCards[index]).n]
          ));
        // this assigns a hidden value to div that holds imgs, required to track specific card in handDivs
        $(innerDivTop).attr({
          value: translateCard(opponentCards[index]).value,
          suit: translateCard(opponentCards[index]).suit,
          style: `z-index: ${index}`
        });
        $(innerDivBot).attr({
          value: translateCard(playerCards[index]).value,
          suit: translateCard(playerCards[index]).suit,
          style: `z-index: ${index}`
        });
        // push newly made divs(cards) into handDivs, array that holds divs equal to hand cards
        handDivs.opponent.push(innerDivTop);
        handDivs.player.push(innerDivBot);
        // append newly made divs to appropriate div in html
        $(".p2-hand").append($(innerDivTop));
        $(".p1-hand").append($(innerDivBot));

        spawnCardsWithDelay(index + 1);
      }, 30);
    } else {
      placeFaceUpCard(data.crazy8.faceUpCard);
      data.phase = 1;
      console.log('new gamePhase: phase: ' + data.phase);
      if (data.playerNum === 0) data.ready = true;
    }
  }

  // when game phase changing data is received
  socket.on('gamePhase', function(msg) {
    data = JSON.parse(msg);
    console.log('new gamePhase: phase: ' + data.phase);
    console.log(data);

    //initialization
    if (data.phase === 0) {
      handDivs.player = [];
      handDivs.opponent = [];
      spawnCardsWithDelay(0);
      console.log('initialization');
//     } else if (data.phase < 14) {
//       // at the start of each phase
//       setTimeout(() => {
//         $('.bids').empty();
//         $('.dealer-bid').empty();
//         $('.p2-score').text(' ' + data.oScore);
//         $('.p1-score').text(' ' + data.pScore);
//         dealerPlay(data.dealer._hand[0]);
//       }, 1000);
//     } else if (data.phase === 14) {
//       let innerDivTop = $(`<div>`).append(`<p>opponent won cards: ${data.player._wonBids} </p>`);
//       let innerDivBot = $(`<div>`).append(`<p>player won cards: ${data.opponent._wonBids} </p>`);
//       $($(innerDivTop)).prependTo('.bids');
//       $($(innerDivBot)).appendTo('.bids');
    }
  })

//   // when game update information is received
//   socket.on('gameUpdate:goof', function(msg){
//   const update = JSON.parse(msg);

//     if (data.player._id !== update.player * 1) {
//       if (update.item === "bid") {
//         // find location of opponent card that is sent to bid
//         cardValue = update.value;
//         cardIndex = jQuery.inArray(cardValue * 1, data.opponent._hand);

//         // remove opponent card from hand in data
//         data.opponent._hand.splice(cardIndex, 1);
//         // update opponent current bid in data
//         data.opponent._currentBid = update.value;
//         // place opponent card in bid
//         for (let i = 0; i < handDivs.opponent.length; i++) {
//           if (handDivs.opponent[i].attr("value") === cardValue) {
//             $(handDivs.opponent[i]).prependTo('.bids');
//             $(handDivs.opponent[i]).removeClass('cards');
//             $(handDivs.opponent[i]).addClass('row bid-card');
//           }
//         }
//         console.log('opponent bid: ' + data.opponent._currentBid);
//       }
//     } else {
//       if (update.item === "bid") {
//         // find location of opponent card that is sent to bid
//         cardValue = update.value;
//         cardIndex = jQuery.inArray(cardValue * 1, data.player._hand);

//         // remove opponent card from hand in data
//         data.player._hand.splice(cardIndex, 1);
//         // update opponent current bid in data
//         data.player._currentBid = update.value;
//         // place opponent card in bid
//         for (let i = 0; i < handDivs.player.length; i++) {
//           if (handDivs.player[i].attr("value") === cardValue) {
//             $(handDivs.player[i]).appendTo('.bids');
//             $(handDivs.player[i]).removeClass('cards bot');
//             $(handDivs.player[i]).addClass('row bid-card');
//           }
//         }
//         console.log('player bid: ' + data.player._currentBid);
//       }
//     }
//   })

  //-------------------------------------------------------/
  // document ready events --------------------------------/
  //-------------------------------------------------------/

  // when player picks a card
  $(".p1-hand").on('click', function(event) {
    console.log('data.ready: ', data.ready);
    if (
      data.ready === true
      && $(event.target.parentNode).attr("value") !== undefined
      ) {
      console.log($(event.target.parentNode).attr("value"), $(event.target.parentNode).attr("suit"));

      socket.emit(
      'gameUpdate:crazy',
      `{"room_id": "${room_id}",
      "player": "${data.playerNum}", "item": "",
      "value": "${ $(event.target.parentNode).attr("value") }",
      "suit": "${ $(event.target.parentNode).attr("suit") }"}`
      );
      data.ready = false;
    }
  });
});

