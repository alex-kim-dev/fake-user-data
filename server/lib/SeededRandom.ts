import seedrandom from 'seedrandom';

import { Seed } from '../../shared/types';

export class SeededRandom {
  private random: seedrandom.PRNG;

  constructor(seed: Seed) {
    this.random = seedrandom(String(seed));
  }

  quick() {
    return this.random.quick();
  }

  int(max: number) {
    const min = 0;

    if (
      !Number.isInteger(max) ||
      Number.isNaN(max) ||
      max > Number.MAX_SAFE_INTEGER
    )
      throw new RangeError(
        `The max argument must be a safe integer, got ${max}`,
      );
    if (max < min)
      throw new RangeError(
        `The max argument must be greater than 0, got ${max}`,
      );

    return Math.floor(min + this.random.quick() * (max - min + 1));
  }
}
