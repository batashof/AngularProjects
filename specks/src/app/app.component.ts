import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  squares: number[][] = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];

  public makeMove(col, row) {
    if (this.squares[col][row + 1] === 0) {this.squares[col][row + 1] = this.squares[col][row]; this.squares[col][row] = 0; } else {
    if (this.squares[col + 1][row] === 0) {this.squares[col + 1][row] = this.squares[col][row]; this.squares[col][row] = 0; }else {
    if (this.squares[col - 1][row] === 0) {this.squares[col - 1][row] = this.squares[col][row]; this.squares[col][row] = 0; } else {
    if (this.squares[col][row - 1] === 0) {this.squares[col][row - 1] = this.squares[col][row]; this.squares[col][row] = 0; }}}}
  }
}

