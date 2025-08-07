# 🛡️ QSAFP – Quantum-Secured AI Fail-Safe Protocol

QSAFP (Quantum-Secured AI Fail-Safe Protocol) is a cryptographic enforcement system designed to ensure runtime accountability for autonomous AI systems. It offers a robust, sovereign-grade fallback that safeguards national and enterprise infrastructure against catastrophic AI misalignment or external compromise.

## 🚀 Features
- Quantum-secured policy logic
- AI runtime fail-safe enforcement
- Mutual accountability model between humans and AI systems
- AEGES-compatible ecosystem

## 📦 Repository Structure
```
/qsafp
├── integration-kits/
│   ├── qsafp_api_spec.json
│   ├── qsafp_integration_examples.js
│   └── qsafp_mock_implementation.js
├── LLMAdapter.js
├── .env.example
├── README.md
```

## 📘 Documentation
- [Research Preprint (v2)](./QSAFP_Research_Gate_Paper-1-v2.pdf)
- [Integration Kit Overview](./README%20-%20QSAFP%20xAI%20Integration%20Kit.pdf)

## 🧠 LLM Integration Support

The integration kits now support a modular AI provider switch, enabling developers to use their preferred LLM (OpenAI, Claude, Grok, etc.) or fall back to mock mode.

### 🔧 How It Works

The `LLMAdapter.js` file provides a simple switchboard:

```js
import { getLLMResponse } from './LLMAdapter.js';

const response = await getLLMResponse("Explain the core idea", "openai");
```

- Default provider is set via `.env` (`LLM_PROVIDER=mock`)
- Can be overridden per-call via a function argument

### 🛠️ Setup Instructions

1. Copy the example `.env` file and configure your keys:

```bash
cp .env.example .env
```

2. Fill in your preferred provider and credentials:

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key
```

3. Run a demo:

```bash
node integration-kits/qsafp_integration_examples.js
```

### 🤖 Supported Providers
- `mock` (default, no API required)
- `openai`
- `claude`
- `grok`

Feel free to extend `LLMAdapter.js` to support more providers.

---

## 📫 Contributions
We welcome contributions across:
- Cryptographic enforcement layers
- LLM adapters and audit logic
- Developer tooling and testing

Fork the repo, submit a PR, and let’s safeguard the future together.

---

Max Davis · 2025 · DigiPie International / BWRCI
