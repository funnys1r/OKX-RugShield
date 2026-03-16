function buildExitStrategy(riskLevel = 'HIGH') {
  if (riskLevel === 'CRITICAL') return [0.6, 0.3, 0.1];
  if (riskLevel === 'HIGH') return [0.5, 0.3, 0.2];
  if (riskLevel === 'MEDIUM') return [0.3, 0.3, 0.4];
  return [0.2, 0.3, 0.5];
}
module.exports = { buildExitStrategy };
