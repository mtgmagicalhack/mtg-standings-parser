import test from "ava"
import Transforms from "../build/transforms.js"

test("creates player id", t => {
  t.is(Transforms.id("Rapha\u00ebl L\u00e9vy"), "rapha-l-l-vy", "converts special characters to hyphens")
  t.is(Transforms.id("Nicolai Herzog"), "nicolai-herzog", "dasherizes player name")
  t.is(Transforms.id("Aaron D. Jackson"), "aaron-d--jackson", "handles spaces and dots")
  t.is(Transforms.id("\u00d8ystein Hasnes"), "-ystein-hasnes", "converts special characters to hyphens")
})

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
