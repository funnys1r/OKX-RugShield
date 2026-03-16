function filterExposure(positions, riskyToken) {
  return (positions || []).filter((p) => p.token === riskyToken);
}
module.exports = { filterExposure };
