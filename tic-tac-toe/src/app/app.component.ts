import {Component, OnInit, AfterViewInit} from '@angular/core';
import {GridDataService, IRow, ICell, GameState, CellState} from './griddata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GridDataService]

})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'TIC-TAC-TOE';
  public rows: IRow[] = [];
  public userX: boolean;


  constructor(private grid: GridDataService) {
    this.grid.gameState = GameState.NotStarted;
  }
  ngAfterViewInit() {
    document.getElementById('11').focus();
  }

  public hint() {
    this.grid.showBestCell();
  }
  ngOnInit() {
    this.start();
  }
  public start() {
    // X turn set
    this.userX = true;
    this.grid.gameState = GameState.NotStarted;
    // reset grid
    this.grid.resetGrid();
    setTimeout(() => {document.getElementById('11').focus();}, 1000);
  }

  public updateUserX(userX: boolean) {
    // when user click radio button X or O
    this.userX = userX;
    if (userX) { this.grid.gameState = GameState.UserTurn; } else {
      this.grid.gameState = GameState.ComputerTurn;
      setTimeout(() => {this.grid.computerMove(this.userX); }, 300);
    }
  }

  public userMove(cell: ICell) {
    if ((this.grid.gameState === GameState.ComputerTurn)
      || (cell.cellState !== CellState.None)
      || (this.grid.gameState === GameState.XWin)
      || (this.grid.gameState === GameState.OWin)) {return; }
    if (this.userX) {
      cell.cellState = CellState.X;
      this.grid.updateHistory(cell, 'X');
    } else {
      cell.cellState = CellState.O;
      this.grid.updateHistory(cell, 'O');
    }
    this.grid.gameState = GameState.ComputerTurn;
    setTimeout(() => {this.grid.computerMove(this.userX); }, 300);
  }

  public getHistoryList(): string[] {
    const result: string[] = [];
    for (let i = 1; i <= 10; i++) {
      if (window.localStorage.getItem('Game' + i) != null) {
        result.push('Game' + i);
      } else {break; }
    }
    return result;
  }
  public playGame(game: string) {
    const value = window.localStorage.getItem(game);
    if (value != null) {
      this.grid.resetGrid();
      let moveArgs: string[] = [];
      const moves = value.split(';');
      for (let i = 0; i < moves.length - 1; i++) {
        moveArgs = moves[i].split(',');
        // setTimeout(() => {this.makeMove(moveArgs[1], moveArgs[2], moveArgs[0])}, 500);
         this.makeMove(moveArgs[1], moveArgs[2], moveArgs[0]) ;
      }
      this.grid.checkWin(true);
    }
  }

  public makeMove(row: string, col: string, cellState: string) {
    this.grid.rows[row][col].cellState = (cellState === 'X') ? CellState.X : CellState.O;
  }

  public onKeydown(row: number, col: number) {
    if (row < 0) {row = 0; }
    if (row > this.grid.SIZE - 1) {row = this.grid.SIZE - 1; }
    if (col < 0) {col = 0; }
    if (col > this.grid.SIZE - 1) {col = this.grid.SIZE - 1; }
    document.getElementById('' + row + col).focus();
  }

}
