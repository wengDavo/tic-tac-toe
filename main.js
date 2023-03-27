class TicTacToe{
    constructor(){
        this.player = {player_1:"player1",player_2:"player2"};
        this.marker = {player_1:'X',player_2:'O'};
        this.color = {player_1:'#5BC0EB',player_2:'#FF3864'};
        this.playerMoves = {
            player_1:[],
            player_2:[]
        };
        this.generalMoves = [this.playerMoves['player_1'],this.playerMoves['player_2']];
        this.count = 0;
        this.countWin = {player_1:0,player_2:0};
    }

    internalCounter(){
        this.count += 1;
        let curIndex  = 2 ? game.count%2===0 : 1;
        return Number(curIndex+1);
    }

    BoardIsFull(){
        let sum = 0;
        let allMoves = [...this.generalMoves[0], ...this.generalMoves[1]]
        allMoves.forEach((item)=>sum+=item);
        return sum >= 45 ? true : false;
    }

    moveBeenMade(move){
        let filled = false;
        let allMoves = [...this.generalMoves[0], ...this.generalMoves[1]]
        allMoves.forEach((item)=>{
            if(item===move)filled = true;
        })
        return filled;
    }

    permutations(str){
        if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
        return str
          .split('')
          .reduce(
            (acc, letter, i) =>
              acc.concat(this.permutations(str.slice(0, i) + str.slice(i + 1)).map(val => letter + val)),
            []
          );
      };
        
    gameWon(curPlayer){
        let cur_moves = '';
        let has_won = false;
        let win_combo;

        let moves = this.playerMoves[curPlayer].sort((a,b)=>a-b);
        moves.forEach((item)=>cur_moves+=item);
        cur_moves = this.permutations(cur_moves);
    
        let possibleWin = ['123','456','789','147','258','369','159','357',]
        possibleWin.forEach((possible)=>{
            cur_moves.forEach((moves)=>{
                if(moves.includes(possible)){
                    has_won = true;
                    win_combo = possible;
                }
            })
        })
        return [has_won, win_combo];     
    }

    gameReset(button){
        this.count = 0;
        let resetArray = [this.playerMoves['player_1'], this.playerMoves['player_2'], this.generalMoves[0], this.generalMoves[1]]
        
        resetArray.forEach((item)=>{
            item.splice(0,item.length);
        })
        button.forEach((item)=>{
            item.innerHTML = "&nbsp;";
        });
    }
}
// GAME LOGIC
const game = new TicTacToe();

// ICONS
const dropDownBtn = document.querySelector("#dropdown--btn");
const resetBtn = document.querySelector("#reset--btn");
const dropDownMenu = document.querySelector("#dropdown__menu");
const scoreIcon = document.querySelector("#settings-icon");
const resetIcon = document.querySelector("#reset-icon");
let player_1_score = dropDownMenu.querySelector("#player_1-score")
let player_2_score = dropDownMenu.querySelector("#player_2-score")
toggleMenu =()=>{
    dropDownMenu.classList.toggle("show");
    scoreIcon.classList.toggle("rotate-back");
    player_1_score.textContent = `Player 1:${game.countWin['player_1']}`;
    player_2_score.textContent = `Player 2:${game.countWin['player_2']}`;
}
resetGame = ()=>{
    resetIcon.classList.toggle("rotate-front")
    game.gameReset(boardBtn);
    game.countWin['player_1'] = 0;
    game.countWin['player_2'] = 0;
}
dropDownBtn.addEventListener("click",()=>{toggleMenu();});
dropDownMenu.addEventListener("click",()=>{toggleMenu();});
resetBtn.addEventListener("click",()=>{resetGame();})

// BOARD
const btnConatiner = document.querySelector("#btn-container");
let boardBtn = btnConatiner.querySelectorAll("button");
let display = document.querySelector(".display");
let displayMessage = `${game.player["player_1"]}-VS-${game.player["player_2"]}`;
display.textContent = displayMessage;

btnConatiner.addEventListener('click',(e)=>{playGame(e)});
playGame = (e) => {
   let curIdx = game.internalCounter();
   let [btn, curPlayer] = [e.target, `player_${curIdx}`];
   let color,delay;

   if(game.moveBeenMade(Number(btn.value))){
        [color, delay] = ["#C3423F", 250];
        game.count -= 1;
        display.classList.add("alert");
        display.classList.add("shake")
        display.textContent = 'Move Has Been Made';  
        boardBtn.forEach((item)=>{
            item.style.borderColor = color;
        })
        setTimeout(()=>{
            display.classList.remove("alert");
            display.classList.remove("shake");
            boardBtn.forEach((item)=>{
                item.style.borderColor = "";
            })

        },delay)      
   }
   else{
    btn.style.color = game.color[curPlayer];
    btn.innerHTML = game.marker[curPlayer];
    display.textContent = `${game.player[curPlayer]} played`;
    game.playerMoves[curPlayer].push(Number(btn.value));
    }

    if(game.gameWon(curPlayer)[0]){
        [color,delay] = [game.color[curPlayer],1300]
        game.countWin[`${curPlayer}`] += 1;
        display.textContent = `${game.player[curPlayer]} WINS`;
        display.classList.add("enlarge");
        display.style.color = color;

        let winCombo = (game.gameWon(curPlayer)[1]);
        let horizontalWin = ['123','456','789'];
        let verticalWin = ['147','258','369'];
        let tiltedRight = ['357'];
        let tiltedLeft = ['159'];
        let winArrays = [horizontalWin, verticalWin, tiltedRight, tiltedLeft];
        let winStyle = ["horizontal-line","vertical-line","tilt-line-right","tilt-line-left"]
        let winSequence, winIndex;

        for(let array = 0; array<winArrays.length; array++){
            winArrays[array].forEach((item)=>{
                if(item === winCombo) {
                    winSequence = item
                    winIndex = array;
                };
            })
        }

        for(let array = 0; array<winArrays.length; array++){
            if(winIndex === array){
                for(let i of winSequence){
                    boardBtn.forEach((item)=>{
                        if(item.value==i){
                            item.style.borderBottomColor = game.color[`${curPlayer}`];
                            item.classList.add(winStyle[array])
                        };
                    })
                }
            }
        }

        setTimeout(()=>{
            display.classList.remove("enlarge");
            display.textContent = displayMessage;
            boardBtn.forEach((item)=>{
                item.style.borderBottomColor = "";
                item.classList.remove(winStyle[winIndex]);
            })
            display.style.color = "";
            game.gameReset(boardBtn);
        },delay);         
    }

    if(game.BoardIsFull()){
        [color,delay] = ["#EB5E28",700]
            display.textContent = "Board Full";
            display.style.color = color;
            boardBtn.forEach((item)=>{
                item.style.borderColor = color;
            })
            setTimeout(()=>{
                display.textContent = "PLAY";
                display.style.color = "";
                boardBtn.forEach((item)=>{
                    item.style.borderColor = "";
                })
                game.gameReset(boardBtn);
            },delay);           
    }
}

