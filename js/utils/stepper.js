export class Stepper {
  constructor() {
    this.steps = [];
    this.idx = 0;
    this.timer = null;
    this.onApply = () => {};
  }

  load(steps) {
    this.steps = steps || [];
    this.idx = 0;
    this.apply();
  }

  apply() {
    const s = this.steps[this.idx];
    this.onApply(s, this.idx, this.steps.length);
  }

  next() {
    if (this.idx < this.steps.length - 1) {
      this.idx++;
      this.apply();
    }
  }

  prev() {
    if (this.idx > 0) {
      this.idx--;
      this.apply();
    }
  }

  reset() {
    this.idx = 0;
    this.apply();
  }

  play() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      document.querySelector("#play").textContent = "▶ Auto";
      return;
    }
    document.querySelector("#play").textContent = "⏸ Szünet";
    this.timer = setInterval(() => {
      if (this.idx < this.steps.length - 1) this.next();
      else this.play();
    }, 900);
  }
}
