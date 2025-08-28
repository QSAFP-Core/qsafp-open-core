// v2.1/index.js

const {
  QSAFPv21SafetyAnalyzer,
  QSAFPv21ConsensusEngine
} = require('./basic-threat-detection.js');

module.exports = {
  safetyAnalyzer: new QSAFPv21SafetyAnalyzer(),
  consensusEngine: new QSAFPv21ConsensusEngine(),
  initialize: async function () {
    console.log('QSAFP v2.1 initialized with Basic Threat Detection');
  }
};
