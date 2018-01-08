import {ElementRef, Injectable} from '@angular/core';

export interface ICell {
  row: number;
  col: number;
  cellState: CellState;
  cellRating: number;
  winningCell: boolean;
  bestCell: boolean;
}

export type IRow = ICell[];

export enum CellState {
  None = 0,
  X = 1,
  O = -1
}

export enum GameState {
  NotStarted = 0,
  UserTurn = 1,
  ComputerTurn = 2,
  XWin = 3,
  OWin = 4,
  Draw = 5
}

@Injectable()
export class GridDataService {
  public SIZE = 5;
  public rows: IRow[] = [];
  public gameState: GameState;
  public bestCell: ICell;
  public lines: IRow[] = [];
  private gameHistory: string;

  constructor() {
  }

  public resetGrid() {
    // remove all rows and cells, command pop delete item from list
    while (this.rows.pop()) {
    }
    while (this.lines.pop()) {
    }
    // create new rows
    for (let row = 0; row < this.SIZE; row += 1) {
      const newRow = [];
      for (let col = 0; col < this.SIZE; col += 1) {
        const newCell = {
          row: row, col: col, cellState: CellState.None, cellRating: 0, winningCell: false, bestCell: false
        };
        newRow.push(newCell);
      }
      this.rows.push(newRow);
    }
    this.gameHistory = '';

    // define all lines
    // 1 row
    for (let i = 0; i < this.SIZE; i++) {
      const row = [];
      for (let j = 0; j < this.SIZE; j++) {
        row.push(this.rows[i][j]);
      }
      this.lines.push(row);
    }
    for (let i = 0; i < this.SIZE; i++) {
      const col = [];
      for (let j = 0; j < this.SIZE; j++) {
        col.push(this.rows[j][i]);
      }
      this.lines.push(col);
    }

    // 1 diagonal
    const diag1 = [];
    for (let i = 0; i < this.SIZE; i++) {
      diag1.push(this.rows[i][i]);
    }
    this.lines.push(diag1);

// 2 diagonal
    const diag2 = [];
    for (let i = 0; i < this.SIZE; i++) {
      diag2.push(this.rows[i][this.SIZE - i - 1]);
    }
    this.lines.push(diag2);
  }

  public getBestCell() {
    let bestRating = -1;
    for (let row = 0; row < this.SIZE; row += 1) {
      for (let col = 0; col < this.SIZE; col += 1) {
        if (this.rows[row][col].cellRating > bestRating) {
          bestRating = this.rows[row][col].cellRating;
          this.bestCell = this.rows[row][col];
        }
      }
    }
    // rule: bestRating is -1 it means all cells are taken = Draw
    if (bestRating === -1) {
      this.gameState = GameState.Draw;
      this.finishGame();
    }
  }

  public showBestCell() {
    this.bestCell.bestCell = true;
  }

  public computerMove(userX: boolean) {
    this.checkWin(false);
    this.updateRating(userX);
    this.getBestCell();
    if (this.gameState !== GameState.ComputerTurn) {
      return;
    }
    if (userX) {
      this.bestCell.cellState = CellState.O;
      this.updateHistory(this.bestCell, 'O');
    } else {
      this.bestCell.cellState = CellState.X;
      this.updateHistory(this.bestCell, 'X');
    }
    this.gameState = GameState.UserTurn;
    this.updateRating(userX);
    this.getBestCell();
    this.checkWin(false);
  }

  public сompare(arr1, arr2) {
    let idx = 0;
    for (let i = 0; i < arr2.length; i++) {
      idx = arr1.indexOf(arr2[i]);
      if (idx >= 0) {
        return arr2[i];
      }
    }
  }

  public updateRating(userX: boolean) {
    let userSign = CellState.O;
    let compSign = CellState.X;
    if (userX) {
      userSign = CellState.X;
      compSign = CellState.O;
    }
    let emptyLine = 0;


    // clear rating
    for (let row = 0; row < this.SIZE; row += 1) {
      for (let col = 0; col < this.SIZE; col += 1) {
        this.rows[row][col].bestCell = false;
        this.rows[row][col].cellRating = 0;
      }
    }
    for (let i = 0; i < this.lines.length; i += 1) {
      const line = this.lines[i];
      let OCount = 0;
      let XCount = 0;
      const pos = [];
      for (let j = 0; j < this.SIZE; j += 1) {
        if (this.lines[i][j].cellState === CellState.None) {
          pos.push(j);
        }
        if (this.lines[i][j].cellState === userSign) {
          XCount++;
        }
        if (this.lines[i][j].cellState === compSign) {
          OCount++;
        }
      }
      if (OCount === this.SIZE - 1) {
        this.lines[i][pos[0]].cellRating = this.SIZE * this.SIZE + 1;
        break;
      }
      if (XCount === this.SIZE - 1) {
        this.lines[i][pos[0]].cellRating = this.SIZE * this.SIZE;
        break;
      }
      if (XCount === 0 && OCount > 0) {
        for (let j = 0; j < pos.length; j += 1) {
          this.lines[i][pos[j]].cellRating = OCount + 1;
        }
      }
      if (XCount === 0 && OCount === 0) {
        for (let j = 0; j < pos.length; j += 1) {
          this.lines[i][pos[j]].cellRating = OCount;
        }
      }
      if (XCount !== 0) {
        emptyLine++;
      }

      if (emptyLine === this.SIZE * 2 + 2) {
        this.lines[i][pos[0]].cellRating = OCount;
      }
      // if line is empty or has only comp sign - every cell gets +1 rating
      /* if (((line[0].cellState === CellState.None) || (line[0].cellState === compSign))
         && ((line[1].cellState === CellState.None) || (line[1].cellState === compSign))
       && ((line[2].cellState === CellState.None) || (line[2].cellState === compSign))) {
         line[0].cellRating += 1;
         line[1].cellRating += 1;
         line[2].cellRating += 1;
       }*/

      // check if cell can prevent user win - set 9
      /*if ((line[0].cellState === userSign) && (line[1].cellState === userSign)) {
        line[2].cellRating = 9;
      }
      if ((line[0].cellState === userSign) && (line[2].cellState === userSign)) {
        line[1].cellRating = 9;
      }
      if ((line[1].cellState === userSign) && (line[2].cellState === userSign)) {
        line[0].cellRating = 9;
      }

      // check if cell is winning - set 10
      if ((line[0].cellState === compSign) && (line[1].cellState === compSign)) {
        line[2].cellRating = 10;
      }
      if ((line[0].cellState === compSign) && (line[2].cellState === compSign)) {
        line[1].cellRating = 10;
      }
      if ((line[1].cellState === compSign) && (line[2].cellState === compSign)) {
        line[0].cellRating = 10;
      }*/
      // taken cell has rating -1
      for (let y = 0; y < line.length; y += 1) {
        if (line[y].cellState !== CellState.None) {
          line[y].cellRating = -1;
        }
      }
    }

  }

  public checkWin(isReplay: boolean) {
    for (let j = 0; j < this.lines.length; j += 1) {
      const line = this.lines[j];
      let isLineWinning = true;
      for (let k = 1; k < this.SIZE; k++) {
        if ((line[0].cellState === CellState.None)
          || (line[0].cellState !== line[k].cellState)) {
          isLineWinning = false;
          break;
        }
      }
      if (isLineWinning) {
        for (let i = 0; i < this.SIZE; i++) {
          line[i].winningCell = true;
        }
        if (line[0].cellState === CellState.X) {
          this.gameState = GameState.XWin;
          if (!isReplay) {
            this.finishGame();
          }
        }
        if (line[0].cellState === CellState.O) {
          this.gameState = GameState.OWin;
          if (!isReplay) {
            this.finishGame();
          }
        }
      }
    }
  }

  public updateHistory(cell: ICell, sign: String) {
    this.gameHistory += sign + ',' + cell.row.toString() + ',' + cell.col.toString() + ';';
  }

  public finishGame() {
    let value: string;
    let nextIndex: number;
    for (let x = 9; x > 0; x -= 1) {
      value = window.localStorage.getItem('Game' + x);
      if (value != null) {
        nextIndex = x + 1;
        window.localStorage.setItem('Game' + nextIndex, value);
      }
    }
    window.localStorage.setItem('Game1', this.gameHistory);

  }
}
