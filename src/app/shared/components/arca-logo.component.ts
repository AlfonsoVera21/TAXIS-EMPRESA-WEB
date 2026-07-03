import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-arca-logo',
  standalone: true,
  template: `
    <img
      class="w-auto object-contain object-left"
      [style.height.px]="size"
      alt="Arca Continental"
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDQU5ySplNzEPh-INNQ6-E0OF9OAbmA5Zl4nJoXqo-OEFN1bJySmezoIswmcBtY6v2Y6INFnlZMNY6ZtaVYOpQXO0PSsdcVZ4WICIlC--0o8450lhp0pm6zP4-wgsG2KUG47sDJELGj9NWe4Yh1mNljzN0BgguqxQJIY7kPqv1gqxPVycdybJddQd6s0tBBhURAFmXdBDkSTmegDtX8U6Dzwk2WJZAYkpYmhghjEXJswUxaySbNLNIBCXxcel9zVeBAtc"
    />
  `,
})
export class ArcaLogoComponent {
  @Input() size = 48;
  @Input() showText = true;
}
