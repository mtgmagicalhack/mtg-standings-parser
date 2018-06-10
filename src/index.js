const _ = require("lodash");
const fs = require("fs");
const mkdirp = require("mkdirp");
const minimist = require("minimist");
const GooseParser = require("goose-parser");
const Transforms = require("./transforms.js");
const argv = minimist(process.argv.slice(2));

let uri = argv._[0];

const env = new GooseParser.PhantomEnvironment({
  url: uri,
  resources: {
    denied: [
      "https://cdn.datatables.net/1.10.5/js/jquery.dataTables.min.js",
      "https://cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js",
      "https://cdn.datatables.net/responsive/1.0.4/js/dataTables.responsive.js",
      "https://cdn.datatables.net/responsive/2.1.1/js/dataTables.responsive.min.js"
    ]
  },
  webSecurity: false
});

const parser = new GooseParser.Parser({
  environment: env
});

parser
  .parse({
    rules: {
      // :not(:first-child) ignores first row in table, which currently contains
      // table headers.
      scope: ".sortable-table tbody tr:not(:first-child)",
      collection: [
        [
          {
            name: "name",
            scope: "td:nth-child(2)"
          },
          {
            name: "money",
            scope: "td:nth-child(5)"
          },
          {
            name: "propoints",
            scope: "td:nth-child(4)"
          },
          {
            name: "matchpoints",
            scope: "td:nth-child(3)"
          }
        ]
      ]
    }
  })
  .done(results => {
    results = _.map(results, function(n) {
      let o = {
        name: Transforms.name(n.name),
        propoints: Transforms.points(n.propoints),
        matchpoints: Transforms.points(n.matchpoints)
      };

      if (Transforms.money(n.money)) {
        o.money = Transforms.money(n.money);
      }

      return o;
    });

    const folder = "./output";
    const json = JSON.stringify(results, null, 4);
    const file = `${folder}/${_.kebabCase(uri)}.json`;

    mkdirp(folder, function(err) {
      if (err) {
        console.error(err); // eslint-disable-line
      } else {
        fs.writeFile(file, json, function(err) {
          if (err) {
            return console.log(err); // eslint-disable-line
          }
          console.log(`Successfully saved to ${file}`); // eslint-disable-line
        });
      }
    });
  });
