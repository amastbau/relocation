(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RelocationWizard = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const preferenceKeys = ['community', 'space', 'schools', 'transit', 'commute'];

  function estimateMonthlyTotal(town, carCost) {
    return (town.rentMin + town.rentMax) / 2 + town.cars * carCost;
  }

  function scoreTown(town, preferences) {
    const total = estimateMonthlyTotal(town, preferences.carCost);
    const preferenceScore = preferenceKeys.reduce(
      (score, key) => score + town[key] * preferences[key],
      0,
    );
    const budgetPenalty = preferences.budget && total > preferences.budget
      ? (total - preferences.budget) / 100
      : 0;

    return { ...town, total, score: preferenceScore - budgetPenalty };
  }

  function rankTowns(towns, preferences) {
    return towns
      .map((town) => scoreTown(town, preferences))
      .sort((left, right) => right.score - left.score || left.total - right.total);
  }

  return { estimateMonthlyTotal, scoreTown, rankTowns };
});
