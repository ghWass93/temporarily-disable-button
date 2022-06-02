import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'temporarily-disable-button',
  templateUrl: 'temporarily-disable-button.component.html',
  styleUrls: ['temporarily-disable-button.component.scss'],
})
export class TemporarilyDisableBbutton implements OnInit {
  isEnabled = true;
  lastClick?: Date;
  nextActivation?: Date;
  /** By seconds */
  waitFor: number = 10;
  private requiredTime!: number;
  private counter: number = 10;
  private counterHandler: any;

  ngOnInit() {}

  waitForFormat(value: number) {
    if (value <= 60) return `${value}s`;
    const m = Math.floor(value / 60) + (value % 60) / 100;
    return `${m.toFixed(1)}m`;
  }

  get remainedTimeByPercent() {
    if (this.isEnabled) return 0;
    return (1 - this.counter / this.requiredTime) * 100;
  }

  onAction() {
    this.isEnabled = false;
    this.lastClick = new Date();
    this.createCounter();
  }

  createCounter() {
    this.nextActivation = new Date();
    /** Calcaute next activation date */
    this.lastClick &&
      this.nextActivation.setSeconds(
        this.lastClick.getSeconds() + this.waitFor
      );
    /** Calcaute the required time for next activation */
    this.counter = this.requiredTime =
      (this.nextActivation?.getTime() || 0) - (this.lastClick?.getTime() || 0);
    /** Waiting for Next Activation using setTimeout*/
    setTimeout(() => this.onActivation(), this.requiredTime);
    /** Update counter each 100 milliseconds */
    this.counterHandler = setInterval(() => {
      this.counter -= 100;
    }, 100);
  }

  onActivation() {
    this.isEnabled = true;
    this.counter = 0;
    this.requiredTime = 0;
    this.counterHandler && delete this.counterHandler;
  }

  reset() {
    this.onActivation();
    delete this.lastClick;
    delete this.nextActivation;
  }
}
