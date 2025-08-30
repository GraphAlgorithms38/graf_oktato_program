// Animáció léptetés vezérlő osztály
export class Stepper {
  constructor() {
    this.steps = []; // Lépések listája
    this.index = 0; // Aktuális lépés indexe
    this.timer = null; // Automatikus lejátszás időzítője
    this.onApply = () => {}; // Callback a lépés alkalmazásakor
  }

  // Lépéssorozat betöltése
  load(steps) {
    this.steps = steps || [];
    this.index = 0;
    this.apply();
  }

  // Aktuális lépés alkalmazása
  apply() {
    const s = this.steps[this.index];
    this.onApply(s, this.index, this.steps.length);
  }

  // Ugrás a következő lépésre
  next() {
    if (this.index < this.steps.length - 1) {
      this.index++;
      this.apply();
    }
  }

  // Előző lépésre ugrás
  prev() {
    if (this.index > 0) {
      this.index--;
      this.apply();
    }
  }

  // Visszaállítás
  reset() {
    this.index = 0;
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
      if (this.index < this.steps.length - 1) this.next();
      else this.play();
    }, 900);
  }
}
