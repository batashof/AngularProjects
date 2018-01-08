import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  squares = Array(16);
  
  public  makeMove(pos) {
    return this.squares[pos];
  }
}

