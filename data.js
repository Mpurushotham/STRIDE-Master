// Enhanced Constants and Data
const STRIDE_CATEGORY = {
    S: "Spoofing",
    T: "Tampering", 
    R: "Repudiation",
    I: "Information Disclosure",
    D: "Denial of Service",
    E: "Elevation of Privilege"
};

const THREATS = [
    {
        id: 'S-1',
        category: STRIDE_CATEGORY.S,
        title: "TCU Identity Spoofing",
        definition: "An attacker masquerades as a legitimate vehicle to inject false telemetry.",
        context: "A rogue device uses a cloned VIN (Vehicle Identification Number) to connect to the Cloud Gateway. If successful, it sends fake 'Crash Detected' alerts.",
        mitigation: "Implement Mutual TLS (mTLS). Provision each TCU with a unique X.509 certificate stored in a Hardware Security Module (HSM).",
        affectedComponents: ['attacker', 'cloud-gateway'],
        mitigated: false,
        impact: 'High'
    },
    {
        id: 'T-1',
        category: STRIDE_CATEGORY.T,
        title: "Telemetry Man-in-the-Middle",
        definition: "Modifying data in transit between the car and cloud.",
        context: "The attacker intercepts cellular packets using a rogue base station (IMSI catcher) and alters the GPS coordinates to hide the vehicle's location.",
        mitigation: "Enforce TLS 1.3 for transport security and sign the data payload (HMAC) at the application layer.",
        affectedComponents: ['network', 'attacker'],
        mitigated: false,
        impact: 'High'
    },
    {
        id: 'R-1',
        category: STRIDE_CATEGORY.R,
        title: "Driver Action Repudiation",
        definition: "A user denies performing an action, and the system cannot prove otherwise.",
        context: "A user claims they did not unlock the car remotely via the app. The system lacks signed logs to prove the command came from their phone.",
        mitigation: "Implement Non-Repudiation logging. All commands must be digitally signed by the user's private key before execution.",
        affectedComponents: ['cloud-gateway', 'db'],
        mitigated: false,
        impact: 'Medium'
    },
    {
        id: 'I-1',
        category: STRIDE_CATEGORY.I,
        title: "GPS History Leak",
        definition: "Unwanted exposure of sensitive data.",
        context: "The database is compromised via SQL Injection, leaking the travel history (locations, times) of VIP customers.",
        mitigation: "Encrypt data at rest (AES-256). Use parameterized queries to prevent injection. Implement Column-level encryption for GPS data.",
        affectedComponents: ['db'],
        mitigated: false,
        impact: 'High'
    },
    {
        id: 'D-1',
        category: STRIDE_CATEGORY.D,
        title: "Gateway DDoS",
        definition: "Degrading service availability for legitimate users.",
        context: "A botnet floods the MQTT broker with connection attempts, preventing legitimate cars from reporting emergency status.",
        mitigation: "Deploy Cloud WAF/Shield. Implement rate limiting per IP and per Client ID at the ingress gateway.",
        affectedComponents: ['cloud-gateway', 'network'],
        mitigated: false,
        impact: 'High'
    },
    {
        id: 'E-1',
        category: STRIDE_CATEGORY.E,
        title: "Remote Code Execution (RCE)",
        definition: "An attacker gains elevated access permissions.",
        context: "An unpatched vulnerability in the OTA (Over-the-Air) update service allows an attacker to push a malicious firmware update, gaining root on the TCU.",
        mitigation: "Code Signing for all firmware images. Secure Boot validation on the TCU. Least Privilege principles for OTA service accounts.",
        affectedComponents: ['car-tcu', 'cloud-gateway'],
        mitigated: false,
        impact: 'High'
    }
];

const DIAGRAM_NODES = [
    { id: 'car-tcu', label: 'Car TCU', x: 100, y: 150, type: 'actor', trustZone: 'car' },
    { id: 'network', label: 'Cellular (4G/5G)', x: 300, y: 150, type: 'external', trustZone: 'public' },
    { id: 'attacker', label: 'Attacker', x: 300, y: 260, type: 'attacker', trustZone: 'public' },
    { id: 'cloud-gateway', label: 'IoT Gateway', x: 500, y: 150, type: 'process', trustZone: 'cloud' },
    { id: 'db', label: 'Telemetry DB', x: 700, y: 150, type: 'datastore', trustZone: 'cloud' },
];

const DIAGRAM_LINKS = [
    { source: 'car-tcu', target: 'network', label: 'MQTT' },
    { source: 'network', target: 'cloud-gateway', label: 'Ingress' },
    { source: 'cloud-gateway', target: 'db', label: 'Write' },
    { source: 'attacker', target: 'network', label: 'Intercept' }
];
