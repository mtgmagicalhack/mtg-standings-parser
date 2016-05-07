import _ from "lodash"
import fs from "fs"
import mkdirp from "mkdirp"
import minimist from "minimist"
import GooseParser from "goose-parser"
import Transforms from "./transforms.js"

const argv = minimist(process.argv.slice(2))
let uri = argv._[0]

const env = new GooseParser.PhantomEnvironment({
  url: uri,
  resources: {
    denied: [
      "http://cdn.datatables.net/1.10.5/js/jquery.dataTables.min.js",
      "http://cdn.datatables.net/responsive/1.0.4/js/dataTables.responsive.js",
    ],
  },
})

const parser = new GooseParser.Parser({
  environment: env,
})

parser.parse({
  rules: {
    scope: ".sortable-table tbody tr",
    collection: [[
      {
        name: "name",
        scope: "td:nth-child(2)",
      },
      {
        name: "money",
        scope: "td:nth-child(5)",
      },
      {
        name: "propoints",
        scope: "td:nth-child(4)",
      },
    ]],
  },
}).done(results => {
  results = _.map(results, function (n) {
    let o = {
      id: Transforms.id(Transforms.name(n.name)),
      name: Transforms.name(n.name),
      propoints: Transforms.propoints(n.propoints),
    }

    if (Transforms.money(n.money)) {
      o.money = Transforms.money(n.money)
    }

    return o
  })

  const folder = "./output"
  const json = JSON.stringify(results, null, 4)
  const file = `${folder}/${_.kebabCase(uri)}.json`

  mkdirp(folder, function (err) {
    if (err) {
      console.error(err)
    } else {
      fs.writeFile(file, json, function (err) {
        if (err) {
          return console.log(err)
        }
        console.log(`Successfully saved to ${file}`)
      })
    }
  })
})
