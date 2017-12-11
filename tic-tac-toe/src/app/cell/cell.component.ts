import {Component, Input, ViewChild} from '@angular/core';
import {CellState} from '../griddata.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})

export class CellComponent {

  @ViewChild('itemId') itemId;

  @Input() public row: number;
  @Input() public col: number;
  @Input() public cellState: CellState;
  @Input() public cellRating: number;
  @Input() public winningCell: boolean;
  @Input() public bestCell: boolean;

  public get cellText(): string {
    // const text = this.cellRating + '';
    if (this.cellState === -1) {
      return 'O';
    }
    if (this.cellState === 1) {
      return 'X';
    }
    // return text;
  }
  public get cellId(): string {
    return '' + this.row + this.col;
  }


}
