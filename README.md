# Fake user data generator

A client-server web app that generates user data with human-like mistakes based on the given seed.

## Built with

- Typescript, Zod
- React, Axios, Bootstrap
- Express, Faker.js, SeedRandom

Hosted on Vercel and Render.

## I've learned how to

- develop back-end apps with Express.js
- generate fake user data based on a seed
- organize a monorepo with pnpm workspaces

## Requirements

- [x] key features
  - [x] select region (at least 3 different)
  - [x] specify the number of errors per record (two "linked" controls — slider 0..10 + binded number field 0..1000)
  - [x] define seed value and "random" button to generate a random seed
    - [x] must be a combination of user seed and a page number to skip generating previous pages
- [x] if the user changes anything, the table below automatically updates (20 records are generated again)
- [x] infinite scrolling
- [x] the table
  - [x] index (1, 2, 3, ...) - no errors
  - [x] random id - no errors
  - [x] first, middle, last names (in the region format)
  - [x] address (in several possible formats)
  - [x] phone (several formats)
- [x] support 3 types of errors, chosen randomly
  - [x] delete character at a random position
  - [x] add a random character at a random position
  - [x] swap adjacent characters
- [x] noisy user data shouldn't be too long or too short
- [x] generate data on a server
- [x] avoid full user data duplication in ~10_000_000 records
- [x] optional: add "Export to CSV" button (generate the number of pages which is displayed to a user currently)
