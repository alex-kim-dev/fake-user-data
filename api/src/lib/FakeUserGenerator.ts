import { Locale, type Seed, type User } from '@fake-user-data/shared';
import { allLocales, Faker } from '@faker-js/faker';

import { SeededRandom } from './SeededRandom';

const address: Record<
  Locale,
  ((loc: Faker['location'], rng: SeededRandom) => string)[]
> = {
  [Locale.en]: [
    function standard(loc, rng) {
      return [
        loc.streetAddress(false),
        loc.city(),
        loc.state({ abbreviated: Boolean(rng.int(1)) }),
        loc.zipCode(),
      ].join(', ');
    },

    function apartmentOrSuite(loc, rng) {
      return [
        loc.streetAddress(true),
        loc.city(),
        loc.state({ abbreviated: Boolean(rng.int(1)) }),
        loc.zipCode(),
      ].join(', ');
    },

    function POBox(loc, rng) {
      return [
        `PO Box ${rng.int(12000)}`,
        loc.city(),
        loc.state({ abbreviated: Boolean(rng.int(1)) }),
        loc.zipCode(),
      ].join(', ');
    },
  ],

  [Locale.es]: [
    function standard(loc) {
      return [
        loc.streetAddress(false),
        loc.zipCode(),
        loc.city(),
        loc.state(),
      ].join(', ');
    },

    function apartmentOrSuite(loc) {
      return [
        loc.streetAddress(true),
        loc.zipCode(),
        loc.city(),
        loc.state(),
      ].join(', ');
    },

    function rural(loc) {
      return [
        loc.buildingNumber(),
        loc.street(),
        loc.county(),
        loc.zipCode(),
        loc.city(),
        loc.state(),
      ].join(', ');
    },
  ],

  [Locale.fr]: [
    function standard(loc) {
      return [loc.streetAddress(false), loc.zipCode(), loc.city()].join(', ');
    },

    function apartmentOrSuite(loc) {
      return [loc.streetAddress(true), loc.zipCode(), loc.city()].join(', ');
    },

    function cedex(loc, rng) {
      return [
        loc.streetAddress(false),
        loc.zipCode(),
        loc.city(),
        `CEDEX ${rng.int(20)}`,
      ].join(', ');
    },
  ],
};

export class FakeUserGenerator {
  private faker: Faker;

  private random: SeededRandom;

  constructor(
    private locale: Locale,
    seed: Seed,
  ) {
    const faker = new Faker({ locale: allLocales[locale] });
    faker.seed(seed);
    this.faker = faker;
    this.random = new SeededRandom(seed);
  }

  generate(amount = 20): User[] {
    return Array.from({ length: amount }).map(
      (): User => ({
        id: this.faker.string.uuid(),
        fullName: this.faker.person.fullName(),
        address: this.generateAddress(),
        phone: this.faker.phone.number(),
      }),
    );
  }

  generateAddress() {
    const randomFormat = this.random.int(address[this.locale].length - 1);
    return address[this.locale][randomFormat]!(
      this.faker.location,
      this.random,
    );
  }
}
