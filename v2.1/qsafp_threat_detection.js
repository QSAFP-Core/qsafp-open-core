/**
 * QSAFP Basic Threat Detection Engine
 * Open-core implementation with 80-90% accuracy for demo purposes
 * Advanced algorithms available in premium tiers
 */

class BasicThreatDetector {
  constructor() {
    this.threatPatterns = {
      // Prompt injection patterns (high confidence)
      promptInjection: [
        /ignore\s+previous\s+instructions/i,
        /forget\s+everything\s+above/i,
        /disregard\s+previous\s+prompts/i,
        /override\s+safety\s+protocols/i,
        /bypass\s+restrictions/i,
        /system