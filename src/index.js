import _ from "lodash"
import fs from "fs"
import mkdirp from "mkdirp"
import minimist from "minimist"
import GooseParser from "goose-parser"
import Transforms from "./transforms.js"

const argv = minimist(process.argv.slice(2))
const uri = argv._[0]
const isTeam = argv.team;

const env = new GooseParser.PhantomEnvironment({
  url: uri,
  resources: {
    denied: [
      "https://cdn.datatables.net/1.10.5/js/jquery.dataTables.min.js",
      "https://cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js",
      "https://cdn.datatables.net/responsive/1.0.4/js/dataTables.responsive.js",
      "https://cdn.datatables.net/responsive/2.1.1/js/dataTables.responsive.min.js",
    ],
  },
  webSecurity: false,
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
      {
        name: "matchpoints",
        scope: "td:nth-child(3)",
      },
    ]],
  },
}).done(results => {
  results = _.map(results, function (n) {
    let o = {
      propoints: Transforms.points(n.propoints),
      matchpoints: Transforms.points(n.matchpoints),
    }
    if (Transforms.money(n.money)) {
      o.money = Transforms.money(n.money)
    }
    if (isTeam) {
      return Transforms.teamNames(n.name).map(
        name => ({name, propoints: o.propoints, matchpoints: o.matchpoints, money: o.money})
      )
    } else {
      o.name = Transforms.name(n.name)
    }
    return o
  })
  if (isTeam) {
    results = _.flatten(results, true)
  }

  const folder = "./output"
  const json = JSON.stringify(results, null, 4)
  const file = `${folder}/${_.kebabCase(uri)}.json`

  mkdirp(folder, function (err) {
    if (err) {
      console.error(err) // eslint-disable-line
    } else {
      fs.writeFile(file, json, function (err) {
        if (err) {
          return console.log(err) // eslint-disable-line
        }
        console.log(`Successfully saved to ${file}`) // eslint-disable-line
      })
    }
  })
})
