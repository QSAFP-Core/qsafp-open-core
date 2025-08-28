// v2.1/index.js
const api = require('./basic-threat-detection.js');

module.exports = Object.assign(
  {
    // instance-style (what your current perf-test expects)
    safetyAnalyzer: new api.QSAFPv21SafetyAnalyzer(),
    consensusEngine: new api.QSAFPv21ConsensusEngine(),
    initialize: async function () {
      console.log('QSAFP v2.1 initialized with Basic Threat Detection');
    },
  },
  // class-style (so code that does `new v21.QSAFPv21Demo()` also works)
  api
);
