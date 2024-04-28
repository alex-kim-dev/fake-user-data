import { Faker, allLocales } from '@faker-js/faker';
import { random } from 'underscore';

import { Seed, User } from '../../shared/types';
import { Locale } from '../../shared/constants';

const address: Record<Locale, ((loc: Faker['location']) => string)[]> = {
  [Locale.en]: [
    function standard(loc) {
      return [
        loc.streetAddress(false),
        loc.city(),
        loc.state({ abbreviated: Boolean(random(1)) }),
        loc.zipCode(),
      ].join(', ');
    },

    function apartmentOrSuite(loc) {
      return [
        loc.streetAddress(true),
        loc.city(),
        loc.state({ abbreviated: Boolean(random(1)) }),
        loc.zipCode(),
      ].join(', ');
    },

    function POBox(loc) {
      return [
        `PO Box ${random(12000)}`,
        loc.city(),
        loc.state({ abbreviated: Boolean(random(1)) }),
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

    function cedex(loc) {
      return [
        loc.streetAddress(false),
        loc.zipCode(),
        loc.city(),
        `CEDEX ${random(20)}`,
      ].join(', ');
    },
  ],
};

export class FakeUserGenerator {
  private faker: Faker;

  private locale: Locale;

  constructor(locale: Locale, seed: Seed) {
    const faker = new Faker({ locale: allLocales[locale] });
    faker.seed(seed);
    this.faker = faker;
    this.locale = locale;
  }

  generate(amount = 20): User[] {
    return Array.from({ length: amount }).map((_, i) => {
      return {
        index: i + 1,
        id: this.faker.string.uuid(),
        fullName: this.faker.person.fullName(),
        address: this.generateAddress(),
        phone: this.faker.phone.number(),
      };
    });
  }

  generateAddress() {
    const randomFormat = random(address[this.locale].length - 1);
    return address[this.locale][randomFormat](this.faker.location);
  }
}
