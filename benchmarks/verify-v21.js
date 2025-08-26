'use strict';

// Load v2.1 demo class (adjust path if your repo layout differs)
const v21 = require('../v2.1/qsafp_v21_upgrade.js');

/**
 * Minimal wiring check for v2.1:
 * - QSAFPv21Demo class exists
 * - demo.initialize() (if present) runs
 * - safetyAnalyzer.analyzeSafety exists
 * - consensusEngine.getMultiProviderConsensus exists
 */
async function verifyV21Basics() {
  try {
    if (!v21 || typeof v21.QSAFPv21Demo !== 'function') {
      console.error('[Verify] QSAFPv21Demo class missing in v2.1.');
      return false;
    }

    const demo = new v21.QSAFPv21Demo();

    if (typeof demo.initialize === 'function') {
      await demo.initialize();
    }

    const hasSafety =
      !!demo?.safetyAnalyzer &&
      typeof demo.safetyAnalyzer.analyzeSafety === 'function';

    const hasConsensus =
      !!demo?.consensusEngine &&
      typeof demo.consensusEngine.getMultiProviderConsensus === 'function';

    if (!hasSafety) {
      console.error('[Verify] safetyAnalyzer.analyzeSafety missing or invalid.');
      return false;
    }
    if (!hasConsensus) {
      console.error('[Verify] consensusEngine.getMultiProviderConsensus missing or invalid.');
      return false;
    }

    return true;
  } catch (e) {
    console.error('[Verify] Exception during v2.1 basics check:', e?.message || e);
    return false;
  }
}

module.exports = { verifyV21Basics };
