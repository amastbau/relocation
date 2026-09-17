const test = require('node:test');
const assert = require('node:assert/strict');

const { estimateMonthlyTotal, rankTowns } = require('../wizard.js');

const basePreferences = {
  budget: 4500,
  carCost: 700,
  community: 0,
  space: 0,
  schools: 0,
  transit: 0,
  commute: 0,
};

test('estimates monthly rent plus required car cost', () => {
  const town = { rentMin: 3300, rentMax: 4000, cars: 1 };

  assert.equal(estimateMonthlyTotal(town, 700), 4350);
});

test('ranks a stronger Hebrew-speaking community higher when it matters most', () => {
  const towns = [
    { name: 'Quiet', rentMin: 3000, rentMax: 3000, cars: 1, community: 1, space: 2, schools: 2, transit: 2, commute: 2 },
    { name: 'Hebrew', rentMin: 3000, rentMax: 3000, cars: 1, community: 3, space: 2, schools: 2, transit: 2, commute: 2 },
  ];

  const ranked = rankTowns(towns, { ...basePreferences, community: 2 });

  assert.equal(ranked[0].name, 'Hebrew');
});

test('ranks an in-budget town ahead of an otherwise identical over-budget town', () => {
  const towns = [
    { name: 'Over budget', rentMin: 4000, rentMax: 4000, cars: 1, community: 2, space: 2, schools: 2, transit: 2, commute: 2 },
    { name: 'Within budget', rentMin: 3000, rentMax: 3000, cars: 1, community: 2, space: 2, schools: 2, transit: 2, commute: 2 },
  ];

  const ranked = rankTowns(towns, basePreferences);

  assert.equal(ranked[0].name, 'Within budget');
});
