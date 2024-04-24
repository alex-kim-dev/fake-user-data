# Fake user data generator

A client-server web app that generates user data with mistakes based on a given seed.

## Requirements

- [ ] key features
  - [ ] select region (at least 3 different)
  - [ ] specify the number of errors per record (two "linked" controls — slider 0..10 + binded number field 0..1000)
  - [ ] define seed value and "random" button to generate a random seed
    - [ ] must be a combination of user seed and a page number to skip generating previous pages
- [ ] if the user changes anything, the table below automatically updates (20 records are generated again)
- [ ] infinite scrolling +10 records
- [ ] the table
  - [ ] index (1, 2, 3, ...) - no errors
  - [ ] random id - no errors
  - [ ] first, middle, last names (in the region format)
  - [ ] address (in several possible formats)
  - [ ] phone (several formats)
- [ ] support 3 types of errors, chosen randomly
  - [ ] delete character at a random position
  - [ ] add a random character at a random position
  - [ ] swap adjacent characters
  - [ ] noisy user data shouldn't be too long or too short
- [ ] generate data on a server
- [ ] avoid full user data duplication in ~10_000_000 records
- [ ] optional: add "Export to CSV" button (generate the number of pages which is displayed to a user currently)
