module.exports = (io, clients, {card, wrongGuesses}, roundTime, finished) =>{
  
  const round = {
    roundTime,
    question:card.frontText,
    answer:card.backText,
    wrongGuesses,
    timer:0,
    correct:[],
    wrong:[],
    update:function(gameTime){
      this.timer += gameTime;
      const roundOver = (this.timer >= this.roundTime);
      clients.forEach(c=>{
        const client = io.sockets.sockets.get(c.id);
        if(client === undefined)
          return;
        client.emit('timer', {timer:this.timer});
        if(roundOver){
          client.emit('gameMessage', {state:'roundOver', msg:'ROUND OVER'});
        }
      });
      if(roundOver){
        finished();
      }
    },
    sendQuestion:function(client){
      // let msg = this.question;
      // for(let i = 0;i<this.wrongGuesses.length;i++){
      //   msg += i + ': ' + this.wrongGuesses[i];
      // }
      client.emit('gameMessage', {state:'game', msg:'Game on'});
      const indices = [
        ...this.wrongGuesses.map((_, index)=>index + 1)
      ];
      const answers = [
        ...this.wrongGuesses.map(item => item.backText)
      ];
      const randomIndex = Math.floor(Math.random() * (indices.length + 1));
      indices.splice(randomIndex, 0, 0);
      answers.splice(randomIndex, 0, this.answer);
      client.emit('question', {
        question: this.question,
        indices,
        answers
      });
    },
    clientGuess:function(client){
      
      client.on('guess', ({guess})=>{
        console.log('guess');
        if(this.correct.includes(client.id) || this.wrong.includes(client.id)){
          console.log('client already guessed');
          return;
        }
        
        if(guess === 0){
          console.log('correct guess');
          this.correct.push(client.id);
        }
        else{
          console.log('Wrong Guess');
          this.wrong.push(client.id);
        }
      });
    }
  }
  clients.forEach(c=>{
    const client = io.sockets.sockets.get(c.id);
    if(client === undefined)
      return;
    round.sendQuestion(client);
    round.clientGuess(client);

  });

  return round
}