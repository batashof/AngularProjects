import {Injectable} from '@angular/core';

export interface ICell {
  row: number;
  col: number;
  cellState: CellState;
  cellRating: number;
  winningCell: boolean;
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
  public SIZE = 3;
  public rows: IRow[] = [];
  private _cells: ICell[] = [];
  public gameState: GameState;
  private bestCell: ICell;
  public lines: IRow[] = [];

  constructor() {
  }

  public resetGrid() {
    // remove all rows and cells, command pop delete item from list
    while (this.rows.pop()) {
    }
    while (this._cells.pop()) {
    }
    while (this.lines.pop()) {
    }
    // create new rows
    for (let row = 0; row < this.SIZE; row += 1) {
      const newRow = [];
      this.rows.push(newRow);
      for (let col = 0; col < this.SIZE; col += 1) {
        const newCell = {row: row, col: col, cellState: CellState.None, cellRating: 0, winningCell: false};
        newRow.push(newCell);
        this._cells.push(newCell);
      }
    }

    // define all lines
    // 1 row
    const row1 = this.rows[0];
    this.lines.push(row1);

    // 2 row
    const row2 = this.rows[1];
    this.lines.push(row2);
    // 3 row

    const row3 = this.rows[2];
    this.lines.push(row3);

    // 1 column
    const col1 = [this.rows[0][0], this.rows[1][0], this.rows[2][0]];
    this.lines.push(col1);

    // 2 column
    const col2 = [this.rows[0][1], this.rows[1][1], this.rows[2][1]];
    this.lines.push(col2);

    // 3 column
    const col3 = [this.rows[0][2], this.rows[1][2], this.rows[2][2]];
    this.lines.push(col3);

    // 1 diagonal
    const diag1 = [this.rows[0][0], this.rows[1][1], this.rows[2][2]];
    this.lines.push(diag1);

    // 2 diagonal
    const diag2 = [this.rows[0][2], this.rows[1][1], this.rows[2][0]];
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
    }
  }

  public computerMove(userX: boolean) {
    this.checkWin();
    this.updateRating(userX);
    this.getBestCell();
    if (this.gameState !== GameState.ComputerTurn) {
      return;
    }
    if (userX) {
      this.bestCell.cellState = CellState.O;
    } else {
      this.bestCell.cellState = CellState.X;
    }
    this.gameState = GameState.UserTurn;
    this.updateRating(userX);
    this.getBestCell();
    this.checkWin();
  }

  public updateRating(userX: boolean) {
    let userSign = CellState.O;
    let compSign = CellState.X;
    if (userX) {
      userSign = CellState.X;
      compSign = CellState.O;
    }
    // clear rating
    for (let row = 0; row < this.SIZE; row += 1) {
      for (let col = 0; col < this.SIZE; col += 1) {
        this.rows[row][col].cellRating = 0;
      }
    }
    for (let x = 0; x < this.lines.length; x += 1) {
      const line = this.lines[x];

      // if line is empty or has only comp sign - every cell gets +1 rating
      if (((line[0].cellState === CellState.None) || (line[0].cellState === compSign))
        && ((line[1].cellState === CellState.None) || (line[1].cellState === compSign))
        && ((line[2].cellState === CellState.None) || (line[2].cellState === compSign))) {
        line[0].cellRating += 1;
        line[1].cellRating += 1;
        line[2].cellRating += 1;
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
      }

      // check if cell can prevent user win - set 9
      if ((line[0].cellState === userSign) && (line[1].cellState === userSign)) {
        line[2].cellRating = 9;
      }
      if ((line[0].cellState === userSign) && (line[2].cellState === userSign)) {
        line[1].cellRating = 9;
      }
      if ((line[1].cellState === userSign) && (line[2].cellState === userSign)) {
        line[0].cellRating = 9;
      }

      // taken cell has rating -1
      for (let y = 0; y < line.length; y += 1) {
        if (line[y].cellState !== CellState.None) {
          line[y].cellRating = -1;
        }
      }
    }
  }

  public checkWin() {
    for (let x = 0; x < this.lines.length; x += 1) {
      const line = this.lines[x];
      if ((line[0].cellState !== CellState.None)
        && (line[0].cellState === line[1].cellState)
        && (line[0].cellState === line[2].cellState)) {
        line[0].winningCell = true;
        line[1].winningCell = true;
        line[2].winningCell = true;
        if (line[0].cellState === CellState.X) {
          this.gameState = GameState.XWin;
        }
        if (line[0].cellState === CellState.O) {
          this.gameState = GameState.OWin;
        }
      }
    }
  }
}
