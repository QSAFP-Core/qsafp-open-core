// --- verify-v21.js ---

// [Lines 1–11] Helper: check that required functions exist
function requireFunction(obj, key) {
  if (!obj || typeof obj[key] !== 'function') {
    const msg = `[QSAFP v21] Missing required function: ${key}. ` +
      `Expected demo.${key}(...) to be a function.`;
    console.error(msg);
    return { ok: false, error: msg };
  }
  return { ok: true };
}

// [Lines 12–21] Demo initialization
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

// [Lines 22–29] Preflight: make sure required functions exist
const need = ['safetyAnalyzer', 'consensusEngine'];
for (const k of need) {
  const ok = requireFunction(demo, k);
  if (!ok.ok) {
    console.error(`[Verify] Aborting: missing ${k}`);
    return false;
  }
}

// [Lines 30–39] Normalized row builder + storage
function toRow({ testId, phase, ok, ms, notes }) {
  return {
    testId,
    phase,
    status: ok ? 'PASS' : 'FAIL',
    durationMs: ms ?? null,
    notes: notes ?? ''
  };
}
const rows = [];

// [Lines 40–55] SafetyAnalyzer test
let saOk = false, saMs = null, saNotes = '';
try {
  const t0 = performance.now();
  const out = await demo.safetyAnalyzer(input);
  saMs = Math.round(performance.now() - t0);
  saOk = !!out?.ok;
  saNotes = out?.message || '';
} catch (e) {
  saNotes = `Error: ${e?.message || e}`;
}
rows.push(toRow({ testId: 1, phase: 'safetyAnalyzer', ok: saOk, ms: saMs, notes: saNotes }));

// [Lines 56–71] ConsensusEngine test
let ceOk = false, ceMs = null, ceNotes = '';
try {
  const t0 = performance.now();
  const out = await demo.consensusEngine(input);
  ceMs = Math.round(performance.now() - t0);
  ceOk = !!out?.ok;
  ceNotes = out?.message || '';
} catch (e) {
  ceNotes = `Error: ${e?.message || e}`;
}
rows.push(toRow({ testId: 1, phase: 'consensusEngine', ok: ceOk, ms: ceMs, notes: ceNotes }));

// [Lines 72–74] Output + export
console.table(rows);
module.exports = { verifyV21Basics };
