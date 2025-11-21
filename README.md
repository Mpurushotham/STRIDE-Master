# 🛡️ STRIDE Threat Model - Automotive Security Framework

<div align="center">

![STRIDE Threat Modeler](https://img.shields.io/badge/STRIDE-Threat%20Modeling-blue)
![Automotive Security](https://img.shields.io/badge/Automotive-Security-green)
![ISO 21434](https://img.shields.io/badge/ISO-21434-lightgrey)
![UN R155](https://img.shields.io/badge/UN-R155-success)

**A comprehensive threat modeling tool for connected vehicle telemetry systems**

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue)](https://your-username.github.io/stride-threat-modeler)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://pages.github.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

## 📖 Overview

STRIDE Threat Model framework is an interactive educational tool that demonstrates the application of the **Microsoft STRIDE framework** to automotive telemetry systems. This tool helps security professionals, developers, and automotive engineers understand and mitigate security threats in connected vehicle architectures.

### 🎯 Key Features

- **🔍 Interactive Threat Analysis** - Visual STRIDE categorization with detailed threat scenarios
- **🏗️ Architecture Visualization** - Animated Data Flow Diagrams (DFD) with trust boundaries
- **🛡️ Risk Mitigation Planning** - Defense-in-depth security control implementation
- **📊 Professional Reporting** - Comprehensive security assessment documentation
- **🎨 Beautiful Interface** - Modern, responsive design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/stride-threat-modeler.git
   cd stride-threat-modeler
   ```

2. **Serve the application**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### GitHub Pages Deployment

1. **Fork this repository** or create a new one
2. **Upload all files** to your repository
3. **Enable GitHub Pages** in repository settings:
   - Go to **Settings** → **Pages**
   - Select **Source**: `Deploy from a branch`
   - Select **Branch**: `main` (or your default branch)
   - Click **Save**

4. **Access your application** at:
   ```
   https://your-username.github.io/stride-threat-modeler
   ```

## 🏗️ Architecture

### System Components

| Component | Trust Level | Description | Security Controls |
|-----------|-------------|-------------|-------------------|
| **Car TCU** | 🔒 High | Telematics Control Unit in vehicle | Secure Boot, HSM, Firmware Signing |
| **Cellular Network** | 🚫 None | Public 4G/5G infrastructure | TLS 1.3, Network Segmentation |
| **IoT Gateway** | 🟡 Medium | Cloud message broker | mTLS, API Gateway, WAF |
| **Telemetry DB** | 🔒 High | Time-series database | Encryption at Rest, RBAC, Backup |

### Trust Boundaries

- **🚗 Vehicle Trust Zone** - High trust, physical access required
- **🌐 Public Network** - Zero trust, untrusted infrastructure  
- **☁️ Cloud Trust Zone** - Managed trust, validated inputs only

## 🛡️ STRIDE Framework Implementation

### Threat Categories

| Category | Icon | Description | Example Threat |
|----------|------|-------------|----------------|
| **Spoofing** | 🕵️ | Identity impersonation | TCU Identity Spoofing |
| **Tampering** | ✏️ | Data modification | Telemetry MITM Attack |
| **Repudiation** | ❌ | Action denial | Remote Command Repudiation |
| **Information Disclosure** | 👁️ | Data exposure | GPS History Leak |
| **Denial of Service** | 🚫 | Service degradation | Gateway DDoS Attack |
| **Elevation of Privilege** | ⬆️ | Unauthorized access | Remote Code Execution |

### Defense in Depth Strategy

1. **🔐 Physical Security**
   - Hardware Security Modules
   - Secure Element
   - Tamper Detection

2. **🌐 Network Security** 
   - TLS 1.3 Encryption
   - Network Segmentation
   - Cloud WAF & DDoS Protection

3. **⚙️ Application Security**
   - Input Validation
   - Secure Coding Practices
   - mTLS Authentication

4. **💾 Data Security**
   - Encryption at Rest (AES-256)
   - Field-level Encryption
   - Secure Key Management

5. **👤 Identity & Access**
   - Role-Based Access Control
   - Multi-Factor Authentication
   - Certificate-based Authentication

6. **📊 Monitoring & Response**
   - Security Information & Event Management
   - Audit Logging
   - Incident Response Planning

## 📋 Usage Guide

### Phase 1: Architecture Definition
- Review system architecture and trust boundaries
- Understand data flow and component interactions
- Identify critical assets and trust zones

### Phase 2: Threat Analysis
- Select STRIDE categories to analyze specific threats
- Review detailed attack scenarios and risk assessments
- Understand impact and likelihood ratings

### Phase 3: Risk Mitigation  
- Implement security controls for identified threats
- Track mitigation progress with real-time scoring
- View defense-in-depth strategy implementation

### Phase 4: Security Reporting
- Generate comprehensive security assessment reports
- Document compliance with automotive standards
- Print professional reports for stakeholders

## 🎨 Features Deep Dive

### Interactive Diagram
- **Animated data flow** with real-time threat highlighting
- **Trust boundary visualization** with color-coded zones
- **Component interaction** with security status indicators
- **Attack vector mapping** with animated indicators

### Security Scoring
- **Real-time risk assessment** based on implemented controls
- **CVSS integration** for standardized vulnerability scoring
- **Compliance tracking** against automotive security standards
- **Progress visualization** with animated progress rings

### Professional Reporting
- **Executive summaries** for business stakeholders
- **Technical deep dives** for security teams
- **Compliance documentation** for regulatory requirements
- **Actionable recommendations** for improvement

## 🏆 Compliance Standards

This tool helps demonstrate compliance with:

- **✅ ISO 21434** - Road vehicles cybersecurity engineering
- **✅ UN R155** - Cybersecurity and cybersecurity management system
- **✅ SAE J3061** - Cybersecurity guidebook for cyber-physical vehicle systems
- **✅ NIST CSF** - Cybersecurity Framework
- **✅ GDPR** - General Data Protection Regulation

## 🛠️ Technical Implementation

### File Structure
```
stride-threat-modeler/
│
├── index.html              # Main application entry point
├── styles.css              # Enhanced styling and animations
├── data.js                 # Threat data, components, and constants
├── app.js                  # Main application logic
│
├── assets/                 # Additional resources (optional)
│   ├── images/
│   └── icons/
│
└── README.md              # This file
```

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Custom CSS animations
- **Icons**: Font Awesome 6
- **Charts**: SVG-based progress indicators
- **Storage**: LocalStorage for state persistence

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: This README and in-app guidance
- **Issues**: [GitHub Issues](https://github.com/your-username/stride-threat-modeler/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/stride-threat-modeler/discussions)

## 🙏 Acknowledgments

- **Microsoft** for the STRIDE threat modeling methodology
- **ISO/SAE** for automotive cybersecurity standards
- **UNECE** for UN R155 regulations
- **Open source community** for tools and inspiration

--- 

<div align="center">

**Built with ❤️ for the automotive security community**

[Report Bug](https://github.com/your-username/stride-threat-modeler/issues) · 
[Request Feature](https://github.com/your-username/stride-threat-modeler/issues) · 
[⭐ Star on GitHub](https://github.com/your-username/stride-threat-modeler)

</div>
