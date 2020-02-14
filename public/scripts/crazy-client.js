const reverser = function(suit, val) {
  const reverse = {
    'club': {
      'A': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9, 'J': 10, 'Q': 11, 'K': 12
    },
    'spade': {
      'A': 13, '2': 14, '3': 15, '4': 16, '5': 17, '6': 18, '7': 19, '8': 20, '9': 21, '10': 22, 'J': 23, 'Q': 24, 'K': 25
    },
    'heart': {
      'A': 26, '2': 27, '3': 28, '4': 29, '5': 30, '6': 31, '7': 32, '8': 33, '9': 34, '10': 35, 'J': 36, 'Q': 37, 'K': 38
    },
    'diamond': {
      'A': 39, '2': 40, '3': 41, '4': 42, '5': 43, '6': 44, '7': 45, '8': 46, '9': 47, '10': 48, 'J': 49, 'Q': 50, 'K': 51
    }
  }
  return reverse[suit][val];
};

let data = {};
const handDivs = {player: [], opponent: []};
let result = [];
let message = "";
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
    console.log(translateCard(card[0][0]).suit, translateCard(card[0][0]).n);
    $('.place-pile').append($(
      cardImage
      [translateCard(card[0][0]).suit]
      [translateCard(card[0][0]).n]
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
      console.log('picked card:');
      console.log($(event.target.parentNode).attr("value"), $(event.target.parentNode).attr("suit"));

      console.log('adding class');
      $(event.target.parentNode).addClass("pick");
      result.push(reverser(
        $(event.target.parentNode).attr("suit"),
        $(event.target.parentNode).attr("value")
      ));
      console.log(result);


      message = `{ "room_id": "${room_id}", "player": "${parseInt(data.playerNum)}", "item": "", "result": ${ JSON.stringify(result) } }`;

      data.ready = true;
    } else if ($(event.target.parentNode).attr("value") === undefined) {
      console.log('removing class');
      $($(".pick")).removeClass("pick");
      result = [];
    }
  });

  $(".turn-button").on('click', function(event) {
    console.log('sending message: ', message);
    socket.emit('gameUpdate:crazy-picks', message);
  })

  // when player draws a card

});
