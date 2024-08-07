import { Locale, type Seed, type User } from '@fake-user-data/shared';

import { CHAR_SET, Mistake, UNIQUE_MISTAKES } from '~/constants';
import { SeededRandom } from '~/lib/SeededRandom';
import type { CharSet } from '~/types';

export class MistakesGenerator {
  private random: SeededRandom;

  /** User fields to modify */
  private keys: (keyof User)[] = ['fullName', 'address', 'phone'];

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

  private [Mistake.addChar](str: string, type: CharSet) {
    const i = this.random.int(str.length);

    const charSet = CHAR_SET[this.locale][type];
    const j = this.random.int(charSet.length - 1);
    const char = charSet[j];

    return `${str.slice(0, i)}${char}${str.slice(i)}`;
  }

  private [Mistake.swapAdjacentChars](str: string) {
    if (str.length <= 1) return str;

    const i = this.random.int(str.length - 2);
    return `${str.slice(0, i)}${str[i + 1]}${str[i]}${str.slice(i + 2)}`;
  }

  private addMistakeToUser(user: User) {
    const randomMistake = this.random.int(UNIQUE_MISTAKES - 1) as Mistake;
    const numOfKeys = this.keys.length - 1;
    const randomKey = this.keys[this.random.int(numOfKeys)]!;
    const type: CharSet = randomKey === 'phone' ? 'phone' : 'text';

    user[randomKey] = this[randomMistake](user[randomKey], type);
  }

  add(users: User[], numOfMistakes: number) {
    const extra = Number(this.random.quick() < numOfMistakes % 1);
    const timesToRepeat = Math.trunc(numOfMistakes) + extra;

    users.forEach((user) => {
      for (let i = 1; i <= timesToRepeat; i += 1) {
        this.addMistakeToUser(user);
      }
    });

    return users;
  }
}
