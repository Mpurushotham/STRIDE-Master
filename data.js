// Enhanced Constants and Data
const STRIDE_CATEGORY = {
    S: { 
        name: "Spoofing", 
        icon: "fas fa-user-secret",
        color: "from-purple-500 to-pink-500",
        description: "Impersonating something or someone else"
    },
    T: { 
        name: "Tampering", 
        icon: "fas fa-edit",
        color: "from-orange-500 to-red-500",
        description: "Modifying data or code improperly"
    },
    R: { 
        name: "Repudiation", 
        icon: "fas fa-user-times",
        color: "from-yellow-500 to-amber-500",
        description: "Denying an action occurred"
    },
    I: { 
        name: "Information Disclosure", 
        icon: "fas fa-eye",
        color: "from-blue-500 to-cyan-500",
        description: "Exposing information to unauthorized parties"
    },
    D: { 
        name: "Denial of Service", 
        icon: "fas fa-ban",
        color: "from-red-500 to-pink-500",
        description: "Denying or degrading service to users"
    },
    E: { 
        name: "Elevation of Privilege", 
        icon: "fas fa-shield-alt",
        color: "from-green-500 to-emerald-500",
        description: "Gaining capabilities without proper authorization"
    }
};

const ARCHITECTURE_COMPONENTS = {
    "car-tcu": {
        name: "Telematics Control Unit",
        description: "Embedded system in vehicle collecting and transmitting telemetry data",
        trustLevel: "High",
        securityControls: ["Secure Boot", "Hardware Security Module", "Firmware Signing"]
    },
    "network": {
        name: "Cellular Network (4G/5G)",
        description: "Public wireless communication infrastructure",
        trustLevel: "None",
        securityControls: ["TLS 1.3", "Network Segmentation", "VPN"]
    },
    "cloud-gateway": {
        name: "IoT Cloud Gateway",
        description: "Cloud-based message broker and protocol translator",
        trustLevel: "Medium",
        securityControls: ["mTLS", "API Gateway", "WAF"]
    },
    "db": {
        name: "Telemetry Database",
        description: "Time-series database storing vehicle telemetry and analytics",
        trustLevel: "High",
        securityControls: ["Encryption at Rest", "RBAC", "Backup & Recovery"]
    }
};

const SECURITY_CONTROLS = {
    "encryption": {
        name: "Data Encryption",
        categories: ["I", "T"],
        implementation: ["AES-256 for data at rest", "TLS 1.3 for data in transit"]
    },
    "authentication": {
        name: "Strong Authentication",
        categories: ["S", "E"],
        implementation: ["mTLS for device authentication", "OAuth 2.0 for user access"]
    },
    "integrity": {
        name: "Data Integrity",
        categories: ["T"],
        implementation: ["Digital signatures", "HMAC for message authentication"]
    },
    "availability": {
        name: "High Availability",
        categories: ["D"],
        implementation: ["Load balancing", "Auto-scaling", "DDoS protection"]
    }
};

const THREATS = [
    {
        id: 'S-1',
        category: STRIDE_CATEGORY.S,
        title: "TCU Identity Spoofing Attack",
        definition: "Unauthorized entity masquerades as legitimate vehicle telematics unit",
        context: "Malicious actor clones VIN and security credentials to establish unauthorized connection to telemetry cloud, potentially injecting false safety-critical data",
        mitigation: "Implement Mutual TLS with X.509 certificates provisioned via secure manufacturing process. Utilize Hardware Security Modules for key storage. Implement certificate revocation mechanisms.",
        affectedComponents: ['car-tcu', 'cloud-gateway'],
        mitigated: false,
        impact: 'High',
        likelihood: 'Medium',
        riskLevel: 'High',
        cvssScore: 8.2,
        attackVector: "Network",
        securityControls: ["mTLS Authentication", "Certificate Management", "HSM Integration"],
        compliance: ["UN R155", "ISO 21434", "WP.29"]
    },
    {
        id: 'T-1',
        category: STRIDE_CATEGORY.T,
        title: "Telemetry Data Tampering in Transit",
        definition: "Unauthorized modification of telemetry data during transmission",
        context: "Adversary intercepts cellular communication using rogue base station, modifying GPS coordinates, speed data, or engine status to create false operational picture",
        mitigation: "Implement end-to-end encryption with TLS 1.3. Apply application-layer signing using HMAC-SHA256. Implement secure time-stamping and sequence numbers.",
        affectedComponents: ['network', 'attacker'],
        mitigated: false,
        impact: 'High',
        likelihood: 'Medium',
        riskLevel: 'High',
        cvssScore: 7.5,
        attackVector: "Adjacent Network",
        securityControls: ["TLS 1.3", "Data Signing", "Message Authentication"],
        compliance: ["ISO 27001", "NIST CSF"]
    },
    {
        id: 'R-1',
        category: STRIDE_CATEGORY.R,
        title: "Remote Command Repudiation",
        definition: "User denies executing remote vehicle commands",
        context: "Vehicle owner disputes remote door unlock command, claiming unauthorized access. System lacks cryptographic proof of user authorization for the action.",
        mitigation: "Implement non-repudiation through digital signatures. Maintain cryptographically signed audit logs. Use secure timestamping services.",
        affectedComponents: ['cloud-gateway', 'db'],
        mitigated: false,
        impact: 'Medium',
        likelihood: 'Low',
        riskLevel: 'Medium',
        cvssScore: 5.3,
        attackVector: "Network",
        securityControls: ["Digital Signatures", "Audit Logging", "Secure Timestamping"],
        compliance: ["GDPR", "SOX", "ISO 27001"]
    },
    {
        id: 'I-1',
        category: STRIDE_CATEGORY.I,
        title: "Sensitive Telemetry Data Exposure",
        definition: "Unauthorized access to confidential vehicle and driver data",
        context: "Database compromised through SQL injection vulnerability, exposing detailed travel patterns, location history, and driver behavior analytics of high-profile customers",
        mitigation: "Implement field-level encryption for sensitive data. Deploy database activity monitoring. Apply strict access controls and data masking. Conduct regular security assessments.",
        affectedComponents: ['db'],
        mitigated: false,
        impact: 'High',
        likelihood: 'Medium',
        riskLevel: 'High',
        cvssScore: 8.8,
        attackVector: "Network",
        securityControls: ["Encryption at Rest", "Database Security", "Access Controls"],
        compliance: ["GDPR", "CCPA", "ISO 27001"]
    },
    {
        id: 'D-1',
        category: STRIDE_CATEGORY.D,
        title: "Distributed Denial of Service on Telemetry Gateway",
        definition: "Coordinated attack rendering telemetry services unavailable",
        context: "Botnet orchestrates massive connection attempts to MQTT brokers, exhausting resources and preventing legitimate vehicles from reporting critical safety events or receiving updates",
        mitigation: "Deploy cloud-based DDoS protection services. Implement rate limiting and connection throttling. Design for graceful degradation and emergency communication channels.",
        affectedComponents: ['cloud-gateway', 'network'],
        mitigated: false,
        impact: 'High',
        likelihood: 'High',
        riskLevel: 'High',
        cvssScore: 7.8,
        attackVector: "Network",
        securityControls: ["DDoS Protection", "Rate Limiting", "High Availability"],
        compliance: ["ISO 27001", "NIST CSF"]
    },
    {
        id: 'E-1',
        category: STRIDE_CATEGORY.E,
        title: "Remote Code Execution via OTA Updates",
        definition: "Unauthorized privilege escalation through update mechanism",
        context: "Vulnerability in over-the-air update process allows attacker to deploy malicious firmware with elevated privileges, potentially gaining root access to vehicle control systems",
        mitigation: "Implement code signing with hardware-backed keys. Enable secure boot verification. Apply principle of least privilege to update services. Conduct third-party security audits.",
        affectedComponents: ['car-tcu', 'cloud-gateway'],
        mitigated: false,
        impact: 'Critical',
        likelihood: 'Medium',
        riskLevel: 'High',
        cvssScore: 9.1,
        attackVector: "Network",
        securityControls: ["Code Signing", "Secure Boot", "Privilege Management"],
        compliance: ["UN R155", "ISO 21434", "SAE J3061"]
    }
];

const DIAGRAM_NODES = [
    { id: 'car-tcu', label: 'Car TCU', x: 100, y: 150, type: 'actor', trustZone: 'car' },
    { id: 'network', label: 'Cellular (4G/5G)', x: 300, y: 150, type: 'external', trustZone: 'public' },
    { id: 'attacker', label: 'Threat Actor', x: 300, y: 260, type: 'attacker', trustZone: 'public' },
    { id: 'cloud-gateway', label: 'IoT Gateway', x: 500, y: 150, type: 'process', trustZone: 'cloud' },
    { id: 'db', label: 'Telemetry DB', x: 700, y: 150, type: 'datastore', trustZone: 'cloud' },
];

const DIAGRAM_LINKS = [
    { source: 'car-tcu', target: 'network', label: 'MQTT Telemetry' },
    { source: 'network', target: 'cloud-gateway', label: 'TLS 1.3' },
    { source: 'cloud-gateway', target: 'db', label: 'Secure Write' },
    { source: 'attacker', target: 'network', label: 'Attack Vector' }
];

const DEFENSE_IN_DEPTH_LAYERS = [
    {
        layer: "Physical Security",
        controls: ["Hardware Security Modules", "Secure Element", "Tamper Detection"]
    },
    {
        layer: "Network Security", 
        controls: ["TLS 1.3", "VPN", "Network Segmentation", "Firewalls"]
    },
    {
        layer: "Application Security",
        controls: ["Input Validation", "Secure Coding", "API Security", "mTLS"]
    },
    {
        layer: "Data Security",
        controls: ["Encryption at Rest", "Encryption in Transit", "Data Masking", "Key Management"]
    },
    {
        layer: "Identity & Access",
        controls: ["RBAC", "MFA", "Certificate-based Auth", "Principle of Least Privilege"]
    },
    {
        layer: "Monitoring & Response",
        controls: ["SIEM", "Audit Logging", "Incident Response", "Threat Intelligence"]
    }
];
