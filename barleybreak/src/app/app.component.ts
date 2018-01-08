import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'barley-break';
  valueX = 4;
  valueY = 4;
  public cells: number[][] = [];
  numbers: number[] = [];

  ngOnInit() {
    this.start();
  }
  public start() {
    for (let i = 0; i < this.valueX * this.valueY; i++) {
      this.numbers.push(i);
    }

    for (let i = 0; i < this.valueX; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.valueY; j++) {
        const randomIndex = Math.floor( Math.random() * this.numbers.length);
        this.cells[i][j] = this.numbers[randomIndex];
        this.numbers.splice(randomIndex, 1);
      }
    }
  }

  selectOption(x, y) {
    this.valueX = x;
    this.valueY = y;
    this.start();
  }

  public makeMove(row, col) {
    if ((col < this.valueY - 1) && (this.cells[row][col + 1] === 0)) {
      this.cells[row][col + 1] = this.cells[row][col];
      this.cells[row][col] = 0;
    } else {
      if ((col > 0) && (this.cells[row][col - 1] === 0)) {
        this.cells[row][col - 1] = this.cells[row][col];
        this.cells[row][col] = 0;
      } else {
        if ((row < this.valueX - 1) && (this.cells[row + 1][col] === 0)) {
          this.cells[row + 1][col] = this.cells[row][col];
          this.cells[row][col] = 0;
        } else {
          if ((row > 0) && (this.cells[row - 1][col] === 0)) {
            this.cells[row - 1][col] = this.cells[row][col];
            this.cells[row][col] = 0;
          }
        }
      }
    }
  }
}

