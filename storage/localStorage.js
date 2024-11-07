// const Utils = {
//     saveScore: function(name, score) {
//         const highScores = this.getHighScores();
//         const newScore = {
//             name: name,
//             score: score,
//             date: new Date().toISOString()
//         };
        
//         highScores.push(newScore);
//         highScores.sort((a, b) => b.score - a.score);
        
//         const topScores = highScores.slice(0, 5);
//         localStorage.setItem('highScores', JSON.stringify(topScores));
//     },
  
//     getHighScores: function() {
//         const scores = localStorage.getItem('highScores');
//         return scores ? JSON.parse(scores) : [];
//     },
  
//     saveName: function(name) {
//         localStorage.setItem('currentPlayer', name);
//     },
  
//     getCurrentPlayer: function() {
//         return localStorage.getItem('currentPlayer');
//     }
//   };

//   export{Utils}
  