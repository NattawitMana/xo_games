export function calculateWinner(board, size) {
    // console.log('Calculating winner for board:', board, 'with size:', size);
    // Check rows
    function checkSame(cells1, cells2) {
        if (board[cells1] === null || board[cells2] === null) return false;
        if (board[cells1] === board[cells2]) {
            return true;
        }
        return false;
    }

    // check columns
    for (let i=0; i<size; i++) {
        let count_col = 0;

        for (let j=i; j<size*size; j+=size) {
            if (checkSame(i,j)) count_col += 1
            else break;
        }
        // console.log(board, 'count_col:', count_col)
        if (count_col === size) {
            return [board[i], true];
        } else {
            count_col = 0;
        }
    }

    // check rows
    for (let i=0; i<size*size; i+=size) {
        let count_row = 0;

        for (let j=0; j<size; j++) {
            if (checkSame(i, i+j)) count_row += 1
            else break;
        }
        // console.log(board, 'count_row:', count_row)
        if (count_row === size) {
            return [board[i], true];
        } else {
            count_row = 0;
        }
    }

    // check main diagonal
    let count_main_dia = 0;
    for (let i=0; i<size*size; i+=size+1) {
        if (checkSame(i,i+size+1)) {
            count_main_dia += 1
            // console.log('count_main_dia:', count_main_dia)
        }
        else break;
    }
    if (count_main_dia === size -1) {
        return [board[0], true];
    }

    // check anti diagonal
    let count_anti_dia = 0;
    for (let i=size-1; i<size*size-size; i+=size-1) {
        if (checkSame(i,i+size-1)) count_anti_dia += 1
        else break;
    }
    if (count_anti_dia === size -1) {
        return [board[size-1], true];
    }

    const isDraw = board.every(cell => cell !== null);
    if (isDraw) {
        return ['D', true];
    }

    return null;    
}