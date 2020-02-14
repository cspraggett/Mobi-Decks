/* global variables */
// for socket connection
const socket = io('http://localhost:8080/crazy');
const room_id = window.location.pathname;
let user_id = null;
// for client side memory
let data = {};
const handDivs = {player: [], opponent: []};
// update submit items
let result = [];
let message = "";

//---------------------------------------------------------/
// socket specific events ---------------------------------/
//---------------------------------------------------------/

$(function () {
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
    console.log(translateCard(card[0][0]).suit, translateCard(card[0][0]).n);
    $('.place-pile').append($(
      cardImage
      [translateCard(card[0][0]).suit]
      [translateCard(card[0][0]).n]
    ))
  };

  // shift player turns
  const turnOver = function() {
    if (data.playerNum === data.crazy8.currentPlayer) {
      data.ready = true;
      $('.turn-alert').slideDown(300, 'swing');
    } else {
      data.ready = false;
      $('.turn-alert').slideUp(300, 'swing');
    }
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

        console.log(translateCard(playerCards[index]).suit, translateCard(playerCards[index]).value);
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
      data.phase = 1;
      console.log('new gamePhase: phase: ' + data.phase);
      placeFaceUpCard(data.crazy8.faceUpCard);
      turnOver();
      console.log('ready status: ', data.ready);
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

  const pickConfirmation = function(card) {
    $('.pop-up').css('display', 'flex');
    // result data.crazy8.faceUpCard[0]
    confirmation = false;
    // if first card pick
    if (result.length === 0) {
      if (translateCard(data.crazy8.faceUpCard[0][0]).suit === card.suit) {
        console.log(1);
        confirmation = true;
      } else if (translateCard(data.crazy8.faceUpCard[0][0]).value === card.value) {
        confirmation = true;
        console.log(2);
      } else if (card.value === '8') {
        confirmation = true;

        console.log(3);
      } else {
        console.log(4);
      }
    // if second + card pick
    } else {
      if (
        translateCard(data.crazy8.faceUpCard[0][0]).value === translateCard(result[result.length - 1]).value
        && translateCard(data.crazy8.faceUpCard[0][0]).value === card.value
      ) {
        console.log(5);
        // confirmation = true;
      } else if (card.value === '8') {
        console.log(6);
        // confirmation = true;
      } else {
        console.log(7);
      }
    }
    return confirmation;
  }

  // when player picks a card
  $(".p1-hand").on('click', function(event) {
    // check if turn is ready
    console.log('ready status: ', data.ready);

    // if player hand card is clicked when play is enabled
    if (
      data.ready === true
      && $(event.target.parentNode).attr("value") !== undefined
      ) {
      //run confirmation
      if (pickConfirmation({
        suit: $(event.target.parentNode).attr("suit"),
        value: $(event.target.parentNode).attr("value")
      }) === true) {
        $(event.target.parentNode).addClass("pick");
        result.push(reverser(
          $(event.target.parentNode).attr("suit"),
          $(event.target.parentNode).attr("value")
        ));
        console.log('result hand: ', result);

        // form message
        message = `{ "room_id": "${room_id}", "player": "${data.playerNum}", "result": ${ JSON.stringify(result) } }`;
      } else {
        console.log('invalid move!');
      }

      // if board is clicked cancel all picks
    } else if ($(event.target.parentNode).attr("value") === undefined) {
      $($(".pick")).removeClass("pick");
      result = [];
      console.log('result hand: ', result);
    }
  });

  $(".turn-button").on('click', function(event) {
    // submit picks
    console.log('sending message: ', message);
    socket.emit('gameUpdate:crazy-picks', message);
    data.ready === false;
  })

  // when player draws a card
  $("#draw-pile-img").on('click', function(event) {
    // cancel all picks
    $($(".pick")).removeClass("pick");
    result = [];
    console.log('result hand: ', result);

    // form message
    message = `{ "room_id": "${room_id}", "player": ${data.playerNum}, pickUp": "true" }`;

    // send message and wait
    console.log('sending message: ', message);
    socket.emit('gameUpdate:crazy-draws', message);
    data.ready === false;
  })

});
