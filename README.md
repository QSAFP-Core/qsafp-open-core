# QSAFP - Quantum-Secured AI Fail-Safe Protocol

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Patent Pending](https://img.shields.io/badge/Patent-Pending-yellow.svg)](https://patents.google.com)
[![DARPA Submitted](https://img.shields.io/badge/DARPA-Under%20Review-green.svg)](https://www.darpa.mil)

**The world's first quantum-cryptographically enforced temporal boundary system for AI safety.**

## 🎯 Overview

**QSAFP enforces mathematically secure temporal boundaries for AI systems, ensuring they cannot exceed their runtime authorization without explicit, human-controlled renewal.**  
By integrating quantum-resilient cryptography and hardware enforcement, it delivers the **first fail-safe protocol for AI containment** — immune to circumvention by the AI itself.  

**Its goal is simple but foundational:**  
No AI system should outlive human authorization.

### 🧠 Why QSAFP Matters

As AI systems scale in autonomy and capability, traditional “off-switch” mechanisms fail to provide meaningful control.  
**QSAFP introduces cryptographic runtime limits that are unforgeable, auditable, and enforceable — even against superintelligent systems.**  
It’s not just a safety measure — it’s a new paradigm for governance.

### Key Features

- **🔒 Quantum-Secured**: Cryptographically enforced temporal boundaries using quantum key distribution
- **⚡ Hardware Enforced**: Silicon-level implementation prevents software bypass attempts  
- **🌐 Multi-Party Verification**: Distributed consensus mechanism for renewal authorization
- **🛡️ Graceful Degradation**: Progressive operational restrictions before expiration
- **🔧 Easy Integration**: Standard APIs for major AI frameworks and platforms

## 🚀 Quick Start

```bash
# Install QSAFP CLI
cargo install qsafp-cli

# Initialize new AI project with QSAFP
qsafp init --ai-framework pytorch --policy standard

# Test temporal boundaries
qsafp test --scenario expiration_enforcement
```

## 📋 System Requirements

### Minimum Requirements (Open Source)
- **OS**: Linux (Ubuntu 20.04+), macOS (10.15+), Windows (10+)
- **Memory**: 4GB RAM
- **Storage**: 1GB available space
- **Network**: Internet connection for key distribution

### Enterprise Requirements (Commercial)
- **Quantum Hardware**: Compatible QKD systems (ID Quantique, Toshiba, MagiQ)
- **HSM**: Hardware Security Module (Thales Luna, Utimaco SecurityServer)
- **Time Reference**: GPS-disciplined atomic clock or NTP stratum 1
- **Compliance**: SOC 2, FedRAMP, or equivalent certification

## 🛠️ Installation

### Option 1: Package Manager
```bash
# Rust/Cargo
cargo install qsafp

# Python
pip install qsafp-python

# Node.js
npm install @qsafp/client

# Go
go get github.com/qsafp/go-client
```

### Option 2: From Source
```bash
git clone https://github.com/qsafp/protocol-spec.git
cd protocol-spec
cargo build --release
```

## 📖 Documentation

📄 The full protocol and architecture documentation is available here:  
👉 **[https://qsafp.org(https://qsafp.org)**

_Our GitHub-hosted documentation is temporarily unavailable. We are actively restoring open-access mirrors to ensure collaboration continues._

---

<!-- Original doc links preserved below for reactivation -->

<!--
- **[Protocol Specification](docs/protocol-spec.md)**
- **[Integration Guide](docs/integration-guide.md)**
- **[API Reference](docs/api-reference.md)**
- **[Security Model](docs/security-model.md)**
- **[Enterprise Features](docs/enterprise.md)**
- **[Architecture Specification](docs/architecture.md)**
-->


## 🔧 Basic Usage

### Simple Integration Example

```rust
use qsafp::{TemporalEngine, SystemConfig, PolicyLevel};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize QSAFP engine
    let mut engine = TemporalEngine::new()?;
    
    // Configure AI system with temporal boundaries
    let config = SystemConfig {
        system_name: "my-ai-model".to_string(),
        policy_level: PolicyLevel::Standard,
        initial_period: Duration::from_secs(86400), // 24 hours
        warning_phase: Duration::from_secs(3600),   // 1 hour warning
    };
    
    // Register system
    let system_id = engine.register_system(config)?;
    
    // Check expiration status
    match engine.check_expiration(&system_id) {
        ExpirationStatus::Active => {
            // AI system can operate normally
            run_ai_model()?;
        },
        ExpirationStatus::Warning(time_left) => {
            // System approaching expiration
            log::warn!("AI system expires in {:?}", time_left);
            run_ai_model()?;
        },
        ExpirationStatus::Expired => {
            // System must be renewed or shut down
            log::error!("AI system expired - renewal required");
            shutdown_ai_model()?;
        }
    }
    
    Ok(())
}
```

### Python Integration

```python
import qsafp
from datetime import timedelta

# Initialize QSAFP client
client = qsafp.Client()

# Register AI model with temporal boundaries
registration = client.register_system(
    name="content-moderation-ai",
    policy="standard",
    initial_period=timedelta(days=30),
    warning_phase=timedelta(days=1)
)

# Wrap your AI model
@qsafp.temporal_boundary(registration.system_id)
def ai_inference(input_data):
    # Your AI model logic here
    return model.predict(input_data)

# The decorator automatically checks expiration before each call
result = ai_inference(user_content)
```

## 🏗️ Architecture

### Open Source Components

```
┌─────────────────────────────────────────────────────────┐
│                    QSAFP CORE                           │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Time Keeper │  │ Auth Manager │  │ Policy Engine   │ │
│  │             │  │              │  │                 │ │
│  │ - Timestamps│  │ - Crypto     │  │ - Expiration    │ │
│  │ - Tracking  │  │ - Validation │  │ - Degradation   │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────┤
│               INTEGRATION LAYER                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Framework   │  │ API Gateway  │  │ Configuration   │ │
│  │ Plugins     │  │              │  │ Management      │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Enterprise Extensions (Commercial)

- **Quantum Security Engine**: Hardware-enforced quantum cryptography
- **Multi-Party Network**: Distributed verification authority
- **Compliance Suite**: Regulatory compliance and audit systems
- **Advanced Analytics**: Monitoring, alerting, and optimization

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/qsafp/protocol-spec.git
cd protocol-spec

# Install development dependencies
make dev-setup

# Run tests
make test

# Run security audit
make security-audit
```

### Contribution Areas

- **Core Protocol**: Improvements to temporal boundary enforcement
- **Framework Integrations**: Support for additional AI frameworks
- **Documentation**: Examples, tutorials, and guides
- **Testing**: Unit tests, integration tests, and security tests
- **Performance**: Optimization and benchmarking

## 🛡️ Security

### Reporting Security Issues

Please report security vulnerabilities to security@bwrci.org. Do not report security issues through public GitHub issues.

### Security Model

QSAFP implements defense-in-depth security:

1. **Cryptographic Enforcement**: Quantum-resistant cryptography
2. **Hardware Protection**: Tamper-resistant enforcement mechanisms  
3. **Network Security**: Distributed trust and verification
4. **Audit Logging**: Immutable security event logging
5. **Compliance**: Industry standard certifications

## 📄 License

### Open Source Components
This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

**AGPL v3.0 Summary**: Any organization that uses QSAFP open source components in a network service must make their complete source code available under the same license. This ensures the ecosystem remains open and collaborative.

### Commercial Licensing Exception
Organizations requiring proprietary use or SaaS deployment without source code disclosure can obtain commercial licenses. Contact enterprise@bwrci.org for commercial licensing options.

### Patent Grant
Patent-pending technology is licensed royalty-free for open source implementations. Commercial use requires enterprise licensing.

### Enterprise Features
Enterprise components require separate commercial licensing. Contact enterprise@bwrci.org for details.

## 🏢 Enterprise Support

For enterprise deployments, professional services, and commercial licensing:

- **Website**: https://bwrci.org 
- **Email**: enterprise@bwrci.org  
- **Support**: support@bwrci.org
- **Sales**: sales@bwrci.org

## 🔗 Links

- **Website**: https://bwrci.org 
- **Documentation**: https://bwrci.org
- **Community Forum**: coming soon
- **Blog**: coming soon
- **Twitter**: @upd8capitalism
- 👾 [FAQ.md](FAQ.md) – Common questions and technical philosophy 

## 🙏 Acknowledgments

- **DARPA**: For recognizing the strategic importance of quantum AI safety
- **Quantum Hardware Partners**: ID Quantique, Toshiba, MagiQ Technologies
- **Security Partners**: Thales, Utimaco, and other HSM providers
- **AI Safety Community**: For ongoing research and collaboration

## 📊 Project Status

- **Protocol Version**: 1.0-alpha
- **API Stability**: Beta
- **Production Ready**: Enterprise features only
- **Security Audit**: Scheduled Q4 2025
- **Standards Compliance**: IEEE/ISO participation ongoing

## 🧠 Origin & Philosophy

QSAFP was conceived and authored by **Max Davis** with AI co-authorship from **GT Sage**, Claude Anthropic and Grok3, representing a new frontier in **human–AI collaborative invention**.  
It is part of a broader mission to build ethical, cryptographically governed systems that empower humanity — not replace it.

> *“This protocol is more than a kill-switch. It’s a foundation for a future where AI serves within trusted bounds — not beyond them.”*

---

**⚠️ Important Notice**: This is breakthrough technology under active development. The protocol is patent-pending and submitted for government evaluation. Production deployments should use enterprise-grade components with professional support.

**🎯 Vision**: To become the global standard for AI safety through quantum-secured temporal boundaries, ensuring AI systems remain under meaningful human control as capabilities advance.

---

*Made with ❤️ by the QSAFP team and community contributors*
