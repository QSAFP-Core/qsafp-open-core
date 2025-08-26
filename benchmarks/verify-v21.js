async function verifyV21Basics() {
  // Resolve v21 from global/window (no fancy syntax to avoid parser quirks)
  var v21 = (typeof globalThis !== 'undefined' && globalThis.v21)
    ? globalThis.v21
    : ((typeof window !== 'undefined' && window.v21) ? window.v21 : null);

  var hasExport = !!(v21 && v21.QSAFPv21Demo);
  console.log('[Verify] QSAFPv21Demo export present:', hasExport);
  if (!hasExport) return false;

  var demo;
  try {
    demo = new v21.QSAFPv21Demo();
    if (demo && typeof demo.initialize === 'function') {
      await demo.initialize();
    }
  } catch (e) {
    console.error('[Verify] Failed to construct/initialize QSAFPv21Demo:', e);
    return false;
  }

  var hasSA = !!(demo && demo.safetyAnalyzer);
  var hasCE = !!(demo && demo.consensusEngine);
  console.log('[Verify] safetyAnalyzer present:', hasSA);
  console.log('[Verify] consensusEngine present:', hasCE);
  if (!hasSA || !hasCE) return false;

  var hasAnalyze = !!(demo.safetyAnalyzer && typeof demo.safetyAnalyzer.analyzeSafety === 'function');
  var hasConsensus = !!(demo.consensusEngine && typeof demo.consensusEngine.getMultiProviderConsensus === 'function');
  console.log('[Verify] analyzeSafety() present:', hasAnalyze);
  console.log('[Verify] getMultiProviderConsensus() present:', hasConsensus);

  return hasAnalyze && hasConsensus;
}

module.exports = { verifyV21Basics };
