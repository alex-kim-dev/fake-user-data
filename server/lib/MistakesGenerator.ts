/* eslint-disable @typescript-eslint/ban-types */

import { Locale, letters } from '../../shared/constants';
import { Seed } from '../../shared/types';

import { SeededRandom } from './SeededRandom';

enum Mistake {
  deleteChar,
  addChar,
  swapAdjacentChars,
}

const uniqueMistakes = Object.keys(Mistake).length / 2 - 1;

export class MistakesGenerator {
  private random: SeededRandom;

  constructor(
    private locale: Locale,
    seed: Seed,
  ) {
    this.random = new SeededRandom(seed);
  }

  private [Mistake.deleteChar](str: string) {
    if (str.length <= 1) return str;
    const i = this.random.int(str.length - 1);
    return `${str.slice(0, i)}${str.slice(i + 1)}`;
  }

  private [Mistake.addChar](str: string) {
    const i = this.random.int(str.length);
    const j = this.random.int(letters[this.locale].length - 1);
    const char = letters[this.locale][j];
    return `${str.slice(0, i)}${char}${str.slice(i)}`;
  }

  private [Mistake.swapAdjacentChars](str: string) {
    if (str.length <= 1) return str;
    const i = this.random.int(str.length - 2);
    return `${str.slice(0, i)}${str[i + 1]}${str[i]}${str.slice(i + 2)}`;
  }

  private addMistakeToRecord(record: string[]) {
    const i = this.random.int(uniqueMistakes);
    const j = this.random.int(record.length - 1);
    // eslint-disable-next-line no-param-reassign
    record[j] = this[i](record[j]);
  }

  private repeat(fn: Function, times: number) {
    const n = Number.isNaN(times) || times < 0 ? 0 : times;
    const extra = Number(this.random.quick() < n % 1);
    const timesToRepeat = Math.trunc(n) + extra;

    return (...args) => {
      for (let i = 1; i <= timesToRepeat; i += 1) {
        fn.apply(this, args);
      }
    };
  }

  add(strings: string[][], numOfMistakes: number) {
    console.log(`n of mistakes in add() is ${numOfMistakes}`);
    return strings.forEach((record) =>
      this.repeat(this.addMistakeToRecord, numOfMistakes)(record),
    );
  }
}
