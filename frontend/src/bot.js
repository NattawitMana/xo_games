import { calculateWinner } from "./gameLogic";

function ACTIONS(board) {
    // return array ของ index ที่เป็น null
    let emptySpots = [];
    for (let i=0; i<board.length; i++) {
        if (board[i] === null) {
            emptySpots.push(i);
        }
    }
    return emptySpots;
}

function RESULT(board, action, player) {
    const newBoard = [...board];
    newBoard[action] = player;
    return newBoard;
}

// ให้คะแนน  board
function UTILITY(board, depth) {
    const size = Math.sqrt(board.length);
    const winner = calculateWinner(board, size); // ส่ง board ไปเช็ค
    
    if (winner && winner[0] === 'O') return 10;
    else if (winner && winner[0] === 'X') return -10;
    else return 0;
}

// เช็คว่าจบเกม ?
function TERMINAL_TEST(board) {
    const size = Math.sqrt(board.length);
    const winner = calculateWinner(board, size);
    if (winner && winner[1]) {
        return true;
    } else if (winner && winner[0] === 'D') {
        return true;
    }
    return false;
}

// MAX-VALUE
function maxValue(board, depth, alpha, beta, maxDepth) {
    if (TERMINAL_TEST(board) || depth >= maxDepth) {
        return UTILITY(board, depth);
    }

    let v = -10000000;

    for (let action of ACTIONS(board)) {
        v = Math.max(v, minValue(RESULT(board, action, 'O'), depth + 1, alpha, beta, maxDepth));

        if (v >= beta) {
            return v;
        }   
        alpha = Math.max(alpha, v);
    }
    return v;
}

// MIN-VALUE
function minValue(board, depth, alpha, beta, maxDepth) {
    if (TERMINAL_TEST(board) || depth >= maxDepth) {
        return UTILITY(board, depth);
    }

    let v = 10000000;

    for (let action of ACTIONS(board)) {
        v = Math.min(v, maxValue(RESULT(board, action, 'X'), depth + 1, alpha, beta, maxDepth));

        if (v <= alpha) {
            return v;
        }

        beta = Math.min(beta, v);
    }

    return v;
}

export function getBestMove(board) {
    let bestMove = -1;
    let bestScore = -10000000;

    let alpha = -10000000;
    let beta = 10000000;

    const size = Math.sqrt(board.length);
    const maxDepth = (size === 3) ? 9 : 5;

    const actions = ACTIONS(board);
    if (actions.length === board.length) return Math.floor(board.length / 2);

    for (let act of actions) {
        const nextBoard = RESULT(board, act, 'O');
        const score = minValue(nextBoard, 0, alpha, beta, maxDepth); 
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = act;
        }

        alpha = Math.max(alpha, bestScore);
    }
    return bestMove;
}