// benchmarks/verify-v21.js

export async function verifyV21Basics() {
  const v21 = globalThis?.v21 ?? (typeof window !== 'undefined' ? window.v21 : undefined);
  const hasExport = !!(v21 && v21.QSAFPv21Demo);
  console.log('[Verify] QSAFPv21Demo export present:', hasExport);
  if (!hasExport) return false;

  let demo;
  try {
    demo = new v21.QSAFPv21Demo();
    if (typeof demo.initialize === 'function') await demo.initialize();
  } catch (e) {
    console.error('[Verify] Failed to construct/initialize QSAFPv21Demo:', e);
    return false;
  }

  const hasSA = !!demo?.safetyAnalyzer;
  const hasCE = !!demo?.consensusEngine;
  console.log('[Verify] safetyAnalyzer present:', hasSA);
  console.log('[Verify] consensusEngine present:', hasCE);
  if (!hasSA || !hasCE) return false;

  const hasAnalyze = typeof demo.safetyAnalyzer.analyzeSafety === 'function';
  const hasConsensus = typeof demo.consensusEngine.getMultiProviderConsensus === 'function';
  console.log('[Verify] analyzeSafety() present:', hasAnalyze);
  console.log('[Verify] getMultiProviderConsensus() present:', hasConsensus);

  return hasAnalyze && hasConsensus;
}

