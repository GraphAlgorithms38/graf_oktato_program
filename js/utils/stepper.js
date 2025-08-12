// Animáció léptetés vezérlő osztály
export class Stepper {
  constructor() {
    this.steps = []; // Lépések listája
    this.idx = 0; // Aktuális lépés indexe
    this.timer = null; // Automatikus lejátszás időzítője
    this.onApply = () => {}; // Callback a lépés alkalmazásakor
  }

  // Lépéssorozat betöltése
  load(steps) {
    this.steps = steps || [];
    this.idx = 0;
    this.apply();
  }

  // Aktuális lépés alkalmazása
  apply() {
    const s = this.steps[this.idx];
    this.onApply(s, this.idx, this.steps.length);
  }

  // Ugrás a következő lépésre
  next() {
    if (this.idx < this.steps.length - 1) {
      this.idx++;
      this.apply();
    }
  }

  // Előző lépésre ugrás
  prev() {
    if (this.idx > 0) {
      this.idx--;
      this.apply();
    }
  }

  // Visszaállítás
  reset() {
    this.idx = 0;
    this.apply();
  }

  // Automatikus lejátszás indítása/leállítása
  play() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      document.querySelector("#play").textContent = "Auto";
      return;
    }
    document.querySelector("#play").textContent = "Szünet";
    this.timer = setInterval(() => {
      if (this.idx < this.steps.length - 1) this.next();
      else this.play();
    }, 900);
  }
}
