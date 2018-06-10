const test = require("ava");
const Transforms = require("../src/transforms.js");

test("converts money", t => {
  t.is(Transforms.money("$40,000"), 40000, "removes $ and ,")
  t.is(Transforms.money("$1,500"), 1500, "removes $ and ,")
  t.is(Transforms.money(" "), 0, "returns 0 when empty string")
})

test("converts player name", t => {
  t.is(Transforms.name("Rubin, Steve [US]"), "Steve Rubin", "removes country")
  t.is(Transforms.name("(2) Manfield, Seth [US]"), "Seth Manfield", "removes player of the year rank")
  t.is(Transforms.name("(23) Nelson, Brad [US]"), "Brad Nelson")
})

test("converts points", t => {
  t.is(Transforms.points("30"), 30)
  t.is(Transforms.points("18"), 18)
  t.is(Transforms.points("3"), 3)
})
