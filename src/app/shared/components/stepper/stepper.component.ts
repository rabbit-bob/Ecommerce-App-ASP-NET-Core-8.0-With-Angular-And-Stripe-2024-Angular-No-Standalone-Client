import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';

/**
 * Stepper component to manage multi-step processes such as forms or checkout steps.
 * Extends CdkStepper to provide custom navigation logic.
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }] // Providing CdkStepper for step management
})
export class StepperComponent extends CdkStepper implements OnInit {

  @Input() linearModeSelected: boolean = true; // Determines if the stepper should be linear

  /**
   * Initializes the stepper with the selected linear mode.
   */
  ngOnInit(): void {
    this.linear = this.linearModeSelected;
  }

  /**
   * Handles click events for navigating between steps.
   * @param index Index of the step to navigate to
   */
  onClick(index: number) {
    this.selectedIndex = index;
    console.log(this.selectedIndex);
  }
}
