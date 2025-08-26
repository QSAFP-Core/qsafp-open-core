1  async function verifyV21Basics() {
2    const v21 = globalThis?.v21 ?? (typeof window !== 'undefined' ? window.v21 : undefined);
3    const hasExport = !!(v21 && v21.QSAFPv21Demo);
4    console.log('[Verify] QSAFPv21Demo export present:', hasExport);
5    if (!hasExport) return false;
6
7    let demo;
8    try {
9      demo = new v21.QSAFPv21Demo();
10     if (typeof demo.initialize === 'function') await demo.initialize();
11   } catch (e) {
12     console.error('[Verify] Failed to construct/initialize QSAFPv21Demo:', e);
13     return false;
14   }
15
16   const hasSA = !!demo?.safetyAnalyzer;
17   const hasCE = !!demo?.consensusEngine;
18   console.log('[Verify] safetyAnalyzer present:', hasSA);
19   console.log('[Verify] consensusEngine present:', hasCE);
20   if (!hasSA || !hasCE) return false;
21
22   const hasAnalyze = typeof demo?.safetyAnalyzer?.analyzeSafety === 'function';
23   const hasConsensus = typeof demo?.consensusEngine?.getMultiProviderConsensus === 'function';
24   console.log('[Verify] analyzeSafety() present:', hasAnalyze);
25   console.log('[Verify] getMultiProviderConsensus() present:', hasConsensus);
26
27   return hasAnalyze && hasConsensus;
28 }
29
30 module.exports = { verifyV21Basics };  // <-- CommonJS export
