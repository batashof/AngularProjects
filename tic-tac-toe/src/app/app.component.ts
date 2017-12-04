import {Component, OnInit} from '@angular/core';
import {GridDataService, IRow, ICell, GameState, CellState} from './griddata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GridDataService]

})
export class AppComponent implements OnInit {
  title = 'TIC-TAC-TOE';
  public rows: IRow[] = [];
  public userX: boolean;


  constructor(private grid: GridDataService) {
    this.rows = grid.rows;
    this.grid.gameState = GameState.NotStarted;
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
  }

  public updateUserX(userX: boolean) {
    // when user click radio button X or O
    this.userX = userX;
    if (userX) {
      this.grid.gameState = GameState.UserTurn;
    } else {
      this.grid.gameState = GameState.ComputerTurn;
      this.grid.computerMove(this.userX);
    }
  }

  public userMove(cell: ICell) {
    //    if (cell.cellState != CellState.None) {return;}

    if ((cell.cellState !== CellState.None)
      || (this.grid.gameState === GameState.XWin)
      || (this.grid.gameState === GameState.OWin)) {
      return;
    }
    if (this.userX) {
      cell.cellState = CellState.X;
    } else {
      cell.cellState = CellState.O;
    }
    this.grid.gameState = GameState.ComputerTurn;
    this.grid.computerMove(this.userX);
  }

}
