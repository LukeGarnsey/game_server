const round = require("./round");

module.exports = (io, deck) => {

  const game = {
    io,
    deck,
    shuffledIndices: [],
    state:'idle',
    timer:0,
    gameId:'',
    round:undefined,
    exitGame:function(){},
    startGame:function(gameId, clients, exitGame){
      this.exitGame = exitGame;
      this.gameId = gameId;
      this.state = 'active';
      this.io.to(gameId).emit('gameMessage', {
        msg:'game is starting... ' + this.deck.title
      });
      const indices = this.deck.cards.map((_,index) => index);
      this.shuffledIndices = shuffleArray(indices);
    },
    updateTimeoutInterval: undefined,
    update:function(clients, updateTime){
      // this.timer += updateTime;
      if(this.round === undefined){
        if(this.updateTimeoutInterval !== undefined)
          return;
        
        
        const cardIndex = this.shuffledIndices.shift();
        if(cardIndex === undefined){
          this.exitGame();
          return;
        }
        this.updateTimeoutInterval = setTimeout(()=>{
          const card = this.deck.cards[cardIndex];
          const indices = shuffleArray(this.deck.cards.map((_,index) => index));
          const wrongGuesses = [];
          for(let i = 0;i<indices.length;i++){
            if(indices[i] === cardIndex)
              continue;

            wrongGuesses.push(this.deck.cards[indices[i]]);
            if(wrongGuesses.length >= 4)
              break;
          }
          this.round = round(this.io, clients, {card, wrongGuesses}, 5, ()=>{
            console.log('round over');
            console.log(this.round.correct.length + ' : ' + this.round.wrong.length);

            this.round = undefined;
          });
          this.updateTimeoutInterval = undefined;
        }, 2000);
        
      }else{
        this.round.update(updateTime);
      }
      // this.io.to(this.gameId).emit('gameMessage', {
      //   msg:this.timer
      // });
      if(this.timer > 5){
        //this.exitGame();
      }
    },
    closeGame:function(io, clients){
      console.log('GUESS game closed');
      state = 'complete';
    }
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return game;
};