import { Position } from "@/domain/entities/Player";

export class PlayerPerformanceService {
  private baseValues: Record<Position, number[]> = {
    fwd: [80, 80, 80, 80, 80, 60, 51, 56, 75, 80, 80, 38],
    mid: [80, 65, 80, 80, 80, 80, 59, 60, 64, 74, 80, 38],
    def: [80, 52, 60, 80, 55, 80, 80, 80, 77, 78, 80, 38],
    gk: [80, 38, 55, 80, 58, 55, 80, 80, 74, 80, 80, 80],
  };

  private basePerformanceCalculation(
    position: Position,
    age: number,
    statIndex: number
  ): number {
    const base = this.baseValues[position][statIndex];
    const ageModifier = -Math.abs(age - 27);
    const randomMod = Math.floor(Math.random() * 31) - 15;
    return base + ageModifier + randomMod;
  }

  generatePerformance(position: keyof typeof this.baseValues, age: number) {
    return {
      speed: this.basePerformanceCalculation(position, age, 0),
      shooting: this.basePerformanceCalculation(position, age, 1),
      crossing: this.basePerformanceCalculation(position, age, 2),
      passing: this.basePerformanceCalculation(position, age, 3),
      dribbling: this.basePerformanceCalculation(position, age, 4),
      interceptions: this.basePerformanceCalculation(position, age, 5),
      block: this.basePerformanceCalculation(position, age, 6),
      tackling: this.basePerformanceCalculation(position, age, 7),
      strength: this.basePerformanceCalculation(position, age, 8),
      stamina: this.basePerformanceCalculation(position, age, 9),
      talent: this.basePerformanceCalculation(position, age, 10),
      save: this.basePerformanceCalculation(position, age, 11),
    };
  }
}
