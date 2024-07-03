/* eslint-disable @typescript-eslint/ban-types */

import { type Seed, Locale, chars } from '@fake-user-data/shared';

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

  private [Mistake.addChar](str: string, type: 'text' | 'phone') {
    const i = this.random.int(str.length);

    const charSet = chars[this.locale][type];
    const j = this.random.int(charSet.length - 1);
    const char = charSet[j];

    return `${str.slice(0, i)}${char}${str.slice(i)}`;
  }

  private [Mistake.swapAdjacentChars](str: string) {
    if (str.length <= 1) return str;

    const i = this.random.int(str.length - 2);
    return `${str.slice(0, i)}${str[i + 1]}${str[i]}${str.slice(i + 2)}`;
  }

  private addMistakeToRecord<T extends {}>(record: T, keys: (keyof T)[]) {
    const randomMistake = this.random.int(uniqueMistakes);
    const randomKey = keys[this.random.int(keys.length - 1)];
    const type = randomKey === 'phone' ? 'phone' : 'text';

     
    record[randomKey] = this[randomMistake](record[randomKey], type);
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

  add<T extends {}>(records: T[], keys: (keyof T)[], numOfMistakes: number) {
    records.forEach((record) =>
      this.repeat(this.addMistakeToRecord, numOfMistakes)(record, keys),
    );
    return records;
  }
}
