# mtg-standings-parser

> Create a JSON file from a MTG standings website.

**mtg-standings-parser** is a little script on top of 
[goose-parser](https://github.com/redco/goose-parser) that extracts structured data from a standings website.

## Installation

    yarn install

## Usage

Run the parser, pass a complete url as parameter.

    yarn run parse -- url

### Example 

    yarn run parse -- http://magic.wizards.com/en/events/coverage/ptsoi/final-standings-2016-04-24

will create a JSON file with the following structure: 

    [
        {
            "id": "steve-rubin",
            "name": "Steve Rubin",
            "propoints": 30,
            "matchpoints": 37,
            "money": 40000
        },
        …
    ]

## Development 

Run basic test coverage your code.

    yarn test
