import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './data/apod-data.service';
import { fromEvent, interval, merge } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'apod-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('starBtn', { static: false }) starBtn;

  constructor(public data: DataService) { }

  ngOnInit() {
    this.data.init$().subscribe(
      () => this.setupStars()
    );
  }

  private setupStars() {
    const newVal = { stars: 0 };
    const addStar = () => {
      newVal.stars++;
      this.data.addStars(newVal);
    };
    // Click to add a single star
    const click$ = fromEvent(this.starBtn.nativeElement, 'click');
    click$.subscribe(addStar);
    // Hold mouse down to add stars continuously until mouse up or leave button
    const mousedown$ = fromEvent(this.starBtn.nativeElement, 'mousedown');
    const mouseup$ = fromEvent(this.starBtn.nativeElement, 'mouseup');
    const mouseleave$ = fromEvent(this.starBtn.nativeElement, 'mouseleave');
    const hold$ = mousedown$.pipe(
      switchMap(() => interval(200).pipe(
        takeUntil(
          merge(mouseup$, mouseleave$)
        )
      ))
    );
    hold$.subscribe(addStar);
  }
}
