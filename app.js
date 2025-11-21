// Global constants
const PHASES = ['definition', 'analysis', 'mitigation', 'reporting'];

class ThreatModelerApp {
    constructor() {
        console.log('Initializing ThreatModelerApp...');
        this.phase = 'definition';
        this.activeCategory = null;
        this.threats = this.loadThreats();
        this.init();
    }

    loadThreats() {
        try {
            const saved = localStorage.getItem('threatModeler_threats');
            if (saved) {
                return JSON.parse(saved);
            }
            // Return a fresh copy of threats
            return THREATS.map(t => ({...t}));
        } catch (error) {
            console.error('Error loading threats:', error);
            return THREATS.map(t => ({...t}));
        }
    }

    saveThreats() {
        try {
            localStorage.setItem('threatModeler_threats', JSON.stringify(this.threats));
        } catch (error) {
            console.error('Error saving threats:', error);
        }
    }

    init() {
        console.log('Starting application initialization...');
        this.renderPhaseNavigation();
        this.renderCurrentPhase();
        this.renderDiagram();
        console.log('Application initialized successfully');
    }

    setPhase(newPhase) {
        console.log('Setting phase to:', newPhase);
        this.phase = newPhase;
        this.activeCategory = null;
        this.renderPhaseNavigation();
        this.renderCurrentPhase();
        this.renderDiagram();
    }

    setActiveCategory(category) {
        console.log('Setting active category:', category);
        this.activeCategory = category;
        this.renderCurrentPhase();
        this.renderDiagram();
    }

    toggleMitigation(threatId) {
        console.log('Toggling mitigation for:', threatId);
        this.threats = this.threats.map(t => 
            t.id === threatId ? { ...t, mitigated: !t.mitigated } : t
        );
        this.saveThreats();
        this.renderCurrentPhase();
        this.renderDiagram();
        this.renderPhaseNavigation();
    }

    renderPhaseNavigation() {
        const container = document.getElementById('phaseNavigation');
        if (!container) {
            console.error('Phase navigation container not found!');
            return;
        }

        const mitigatedCount = this.threats.filter(t => t.mitigated).length;
        const totalThreats = this.threats.length;
        const securityScore = Math.round((mitigatedCount / totalThreats) * 100);

        const phaseConfig = {
            'definition': { icon: 'fas fa-blueprint', label: 'Architecture', description: 'System Overview' },
            'analysis': { icon: 'fas fa-search', label: 'Threat Analysis', description: 'STRIDE Assessment' },
            'mitigation': { icon: 'fas fa-shield-alt', label: 'Risk Mitigation', description: 'Security Controls' },
            'reporting': { icon: 'fas fa-file-alt', label: 'Security Report', description: 'Compliance Documentation' }
        };

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                ${PHASES.map(phase => {
                    const config = phaseConfig[phase];
                    return `
                        <div class="relative group">
                            <button
                                onclick="app.setPhase('${phase}')"
                                class="w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                    this.phase === phase 
                                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/30'
                                }"
                            >
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br ${
                                        this.phase === phase ? 'from-blue-500 to-cyan-500' : 'from-slate-600 to-slate-700'
                                    } flex items-center justify-center shadow-lg">
                                        <i class="${config.icon} text-white text-lg"></i>
                                    </div>
                                    <div class="flex-1">
                                        <div class="font-semibold text-white">${config.label}</div>
                                        <div class="text-xs text-slate-400 mt-1">${config.description}</div>
                                    </div>
                                    ${this.phase === phase ? `
                                        <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                                    ` : ''}
                                </div>
                            </button>
                            ${this.phase === phase ? `
                                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-3 h-3 bg-blue-500 rotate-45"></div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- Security Score Card -->
            <div class="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <div class="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                                <svg class="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" 
                                            fill="none" class="text-slate-700"/>
                                    <circle cx="32" cy="32" r="28" stroke="url(#scoreGradient)" stroke-width="4" 
                                            fill="none" stroke-dasharray="176" 
                                            stroke-dashoffset="${176 - (176 * securityScore / 100)}"
                                            class="transition-all duration-1000"/>
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <span class="text-2xl font-bold ${
                                        securityScore === 100 ? 'text-emerald-400' : 
                                        securityScore > 70 ? 'text-green-400' :
                                        securityScore > 40 ? 'text-yellow-400' : 'text-red-400'
                                    }">${securityScore}%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-white">Security Posture</h3>
                            <p class="text-slate-400 text-sm">
                                ${mitigatedCount} of ${totalThreats} threats mitigated
                            </p>
                            <div class="flex items-center gap-2 mt-2">
                                <div class="flex-1 bg-slate-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-1000" 
                                         style="width: ${securityScore}%"></div>
                                </div>
                                <span class="text-xs text-slate-400 font-mono">${securityScore}/100</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-slate-400">Compliance Status</div>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">ISO 21434</span>
                            <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">UN R155</span>
                            <span class="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold">NIST CSF</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add SVG gradients
        this.addSvgGradients();
    }

    addSvgGradients() {
        // This ensures SVG gradients are available
        const existingDefs = document.getElementById('svg-defs');
        if (!existingDefs) {
            const defs = `
                <svg style="position: absolute; width: 0; height: 0;" aria-hidden="true">
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#10b981" />
                            <stop offset="100%" stop-color="#3b82f6" />
                        </linearGradient>
                    </defs>
                </svg>
            `;
            document.body.insertAdjacentHTML('afterbegin', defs);
        }
    }

    renderCurrentPhase() {
        const container = document.getElementById('mainContent');
        const diagramSection = document.getElementById('diagramSection');
        
        if (!container) {
            console.error('Main content container not found!');
            return;
        }

        // Show/hide diagram based on phase
        if (diagramSection) {
            diagramSection.style.display = this.phase === 'reporting' ? 'none' : 'block';
        }
        
        let content = '';
        switch(this.phase) {
            case 'definition':
                content = this.renderDefinitionPhase();
                break;
            case 'analysis':
                content = this.renderAnalysisPhase();
                break;
            case 'mitigation':
                content = this.renderMitigationPhase();
                break;
            case 'reporting':
                content = this.renderReportingPhase();
                break;
        }
        
        container.innerHTML = content;
    }

    renderDefinitionPhase() {
        return `
            <div class="space-y-6 animate-fadeIn">
                <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h2 class="text-2xl font-bold text-white mb-4">Vehicle-to-Cloud Telemetry Architecture</h2>
                    <p class="text-slate-300 mb-4 leading-relaxed">
                        This Data Flow Diagram (DFD) represents a standard IoT architecture for a connected vehicle.
                        The Telemetry Control Unit (TCU) collects sensor data (Speed, GPS, Engine Status) and transmits it
                        via a public cellular network (4G/5G) to a Cloud Gateway, which then persists it to a Database.
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div class="bg-slate-900 p-4 rounded-lg border border-slate-700 border-l-4 border-l-yellow-500">
                            <h4 class="text-white font-bold mb-1">Vehicle Trust Zone</h4>
                            <p class="text-xs text-slate-400">High trust. Physical access usually required for compromise, but connects to untrusted networks.</p>
                        </div>
                        <div class="bg-slate-900 p-4 rounded-lg border border-slate-700 border-l-4 border-l-red-500">
                            <h4 class="text-white font-bold mb-1">Public Network</h4>
                            <p class="text-xs text-slate-400">Zero trust. Data traverses public infrastructure subject to interception and spoofing.</p>
                        </div>
                        <div class="bg-slate-900 p-4 rounded-lg border border-slate-700 border-l-4 border-l-blue-500">
                            <h4 class="text-white font-bold mb-1">Cloud Trust Zone</h4>
                            <p class="text-xs text-slate-400">Managed trust. Validated inputs only. Strict access controls required.</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center">
                    <button onclick="app.setPhase('analysis')" class="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105">
                        Start Threat Analysis &rarr;
                    </button>
                </div>
            </div>
        `;
    }

    renderAnalysisPhase() {
        const activeThreat = this.activeCategory ? 
            this.threats.find(t => t.category === this.activeCategory) || null : null;

        console.log('Rendering analysis phase, active category:', this.activeCategory);
        console.log('Active threat:', activeThreat);
        console.log('All threats:', this.threats);

        return `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="col-span-1 space-y-2">
                    <p class="text-sm text-slate-400 mb-2">Select a STRIDE category to analyze:</p>
                    ${Object.values(STRIDE_CATEGORY).map(cat => {
                        console.log('Processing category:', cat);
                        const threat = this.threats.find(x => x.category === cat);
                        console.log('Found threat for category:', cat, threat);
                        return `
                            <button
                                onclick="app.setActiveCategory('${cat}')"
                                class="w-full text-left px-4 py-3 rounded-lg border transition-all ${
                                    this.activeCategory === cat 
                                        ? 'bg-blue-600/20 border-blue-500 text-white' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }"
                            >
                                <div class="flex justify-between items-center">
                                    <span class="font-bold">${cat}</span>
                                    <span class="text-xs px-2 py-0.5 rounded ${
                                        threat && threat.impact === 'High' ? 'bg-red-500/20 text-red-400' : 
                                        threat && threat.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                                        'bg-green-500/20 text-green-400'
                                    }">
                                        ${threat ? threat.impact : 'Unknown'}
                                    </span>
                                </div>
                                <div class="text-xs mt-1 opacity-70 truncate">${threat ? threat.title : 'No threat found'}</div>
                            </button>
                        `;
                    }).join('')}
                </div>
                <div class="col-span-1 md:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 overflow-y-auto h-[500px]">
                    ${activeThreat ? this.renderThreatDetails(activeThreat) : `
                        <div class="h-full flex flex-col items-center justify-center text-slate-500">
                            <span class="text-4xl mb-4">🛡️</span>
                            <p>Select a category from the left to analyze threats.</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    renderThreatDetails(threat) {
        return `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-2xl font-bold text-white">${threat.title}</h3>
                    <span class="text-sm font-mono text-slate-500">ID: ${threat.id}</span>
                </div>
                
                <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 class="text-red-400 font-bold text-sm uppercase mb-2">Attack Scenario</h4>
                    <p class="text-slate-200">${threat.context}</p>
                </div>

                <div>
                    <h4 class="text-slate-400 font-bold text-sm uppercase mb-2">Definition</h4>
                    <p class="text-slate-300 text-sm">${threat.definition}</p>
                </div>

                <div class="pt-4 border-t border-slate-700">
                    <h4 class="text-emerald-400 font-bold text-sm uppercase mb-2">Recommended Mitigation</h4>
                    <p class="text-slate-300 text-sm">${threat.mitigation}</p>
                </div>

                <div class="mt-6">
                    <h4 class="text-blue-400 font-bold text-sm uppercase mb-4">Security Advisor</h4>
                    <div class="h-64 bg-slate-800 rounded-lg border border-slate-700 p-4 flex flex-col justify-center items-center text-center text-slate-400">
                        <span class="text-2xl mb-2">✨</span>
                        <p class="text-sm">AI Security Advisor requires backend integration.</p>
                        <p class="text-xs mt-2">For static deployment, refer to the mitigation guidelines above.</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderDiagram() {
        const container = document.getElementById('diagramContainer');
        if (!container) {
            console.error('Diagram container not found!');
            return;
        }

        const activeThreat = this.activeCategory ? 
            this.threats.find(t => t.category === this.activeCategory) || null : null;
        
        const mitigatedThreatIds = this.threats.filter(t => t.mitigated).map(t => t.id);

        const isNodeActive = (id) => {
            if (!activeThreat) return false;
            return activeThreat.affectedComponents.includes(id);
        };

        const isLinkSecure = (source, target) => {
            if (source === 'car-tcu' && target === 'network') {
                return mitigatedThreatIds.includes('S-1') && mitigatedThreatIds.includes('T-1');
            }
            if (source === 'network' && target === 'cloud-gateway') {
                return mitigatedThreatIds.includes('D-1');
            }
            if (source === 'cloud-gateway' && target === 'db') {
                return mitigatedThreatIds.includes('I-1');
            }
            return false;
        };

        container.innerHTML = `
            <div class="w-full h-80 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative shadow-inner select-none">
                <!-- Legend -->
                <div class="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-xs text-slate-400">Secure Trust Zone</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-xs text-slate-400">Public/Untrusted</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-1 bg-blue-500"></div>
                        <span class="text-xs text-slate-400">Data Flow</span>
                    </div>
                </div>

                <svg class="w-full h-full" viewBox="0 0 800 350">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                        <marker id="arrowhead-secure" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                        </marker>
                        <marker id="arrowhead-attack" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                        </marker>
                    </defs>

                    <!-- Trust Boundaries -->
                    <rect x="40" y="80" width="120" height="160" rx="10" fill="none" stroke="#fbbf24" stroke-dasharray="5,5" stroke-width="2" opacity="0.3" />
                    <text x="100" y="70" text-anchor="middle" fill="#fbbf24" font-size="10" opacity="0.8" font-weight="bold">VEHICLE TRUST ZONE</text>

                    <rect x="450" y="80" width="310" height="160" rx="10" fill="none" stroke="#3b82f6" stroke-dasharray="5,5" stroke-width="2" opacity="0.3" />
                    <text x="605" y="70" text-anchor="middle" fill="#3b82f6" font-size="10" opacity="0.8" font-weight="bold">CLOUD TRUST ZONE</text>

                    <rect x="220" y="100" width="180" height="200" rx="20" fill="#ef4444" opacity="0.05" />
                    <text x="310" y="315" text-anchor="middle" fill="#ef4444" font-size="10" opacity="0.6" font-weight="bold">UNTRUSTED NETWORK</text>

                    <!-- Links -->
                    ${DIAGRAM_LINKS.map((link, idx) => {
                        const sourceNode = DIAGRAM_NODES.find(n => n.id === link.source);
                        const targetNode = DIAGRAM_NODES.find(n => n.id === link.target);
                        const isAttack = sourceNode.id === 'attacker';
                        const secure = isLinkSecure(link.source, link.target);
                        
                        const strokeColor = isAttack ? '#ef4444' : secure ? '#10b981' : '#64748b';
                        const marker = isAttack ? 'url(#arrowhead-attack)' : secure ? 'url(#arrowhead-secure)' : 'url(#arrowhead)';
                        
                        return `
                            <g>
                                <path
                                    d="M ${sourceNode.x + 30} ${sourceNode.y} L ${targetNode.x - 30} ${targetNode.y}"
                                    stroke="${strokeColor}"
                                    stroke-width="${isAttack ? 2 : 3}"
                                    fill="none"
                                    marker-end="${marker}"
                                    class="transition-colors duration-500"
                                />
                                
                                ${!isAttack ? `
                                    <circle r="3" fill="${secure ? '#10b981' : '#3b82f6'}">
                                        <animateMotion 
                                            dur="${secure ? '1.5s' : '3s'}" 
                                            repeatCount="indefinite"
                                            path="M ${sourceNode.x + 30} ${sourceNode.y} L ${targetNode.x - 35} ${targetNode.y}"
                                        />
                                    </circle>
                                ` : ''}

                                <text 
                                    x="${(sourceNode.x + targetNode.x) / 2}" 
                                    y="${(sourceNode.y + targetNode.y) / 2 - 10}" 
                                    text-anchor="middle" 
                                    fill="${strokeColor}"
                                    font-size="10"
                                >
                                    ${link.label}
                                </text>
                                
                                ${secure ? `
                                    <text 
                                        x="${(sourceNode.x + targetNode.x) / 2 + 10}" 
                                        y="${(sourceNode.y + targetNode.y) / 2 - 10}" 
                                        font-size="12"
                                    >🔒</text>
                                ` : ''}
                            </g>
                        `;
                    }).join('')}

                    <!-- Nodes -->
                    ${DIAGRAM_NODES.map((node) => {
                        const isActive = isNodeActive(node.id);
                        const isAttacker = node.id === 'attacker';
                        
                        let fill = '#1e293b';
                        let stroke = '#475569';
                        let icon = '';

                        if (node.trustZone === 'car') { stroke = '#fbbf24'; icon = '🚗'; }
                        else if (node.trustZone === 'cloud') { stroke = '#3b82f6'; icon = '⚙️'; }
                        else if (node.type === 'datastore') { stroke = '#3b82f6'; icon = '💾'; }
                        else if (isAttacker) { fill = '#450a0a'; stroke = '#ef4444'; icon = '🥷'; }
                        else { stroke = '#94a3b8'; icon = '📡'; }

                        if (isActive) {
                            stroke = '#ef4444';
                            fill = '#450a0a';
                        }

                        return `
                            <g class="cursor-pointer transition-all duration-300">
                                ${isActive ? `
                                    <circle cx="${node.x}" cy="${node.y}" r="45" class="threat-pulse" />
                                ` : ''}
                                
                                ${node.type === 'datastore' ? `
                                    <g>
                                        <path d="M ${node.x - 25} ${node.y - 20} h 50 v 40 h -50 Z" fill="${fill}" stroke="${stroke}" stroke-width="2" />
                                        <line x1="${node.x - 25}" y1="${node.y - 10}" x2="${node.x + 25}" y2="${node.y - 10}" stroke="${stroke}" stroke-width="1" />
                                    </g>
                                ` : node.type === 'actor' || node.type === 'attacker' ? `
                                    <rect x="${node.x - 25}" y="${node.y - 20}" width="50" height="40" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2" />
                                ` : `
                                    <circle cx="${node.x}" cy="${node.y}" r="30" fill="${fill}" stroke="${stroke}" stroke-width="2" />
                                `}

                                <text 
                                    x="${node.x}" 
                                    y="${node.y + 50}" 
                                    text-anchor="middle" 
                                    fill="${isActive ? '#ef4444' : '#e2e8f0'}" 
                                    font-size="11" 
                                    font-weight="bold"
                                >
                                    ${node.label}
                                </text>
                                
                                <text x="${node.x}" y="${node.y + 5}" text-anchor="middle" font-size="18" fill="#94a3b8">
                                    ${icon}
                                </text>
                            </g>
                        `;
                    }).join('')}
                </svg>
            </div>
        `;
    }

    renderMitigationPhase() {
        const mitigatedCount = this.threats.filter(t => t.mitigated).length;
        const totalThreats = this.threats.length;
        const securityScore = Math.round((mitigatedCount / totalThreats) * 100);

        console.log('Rendering mitigation phase, threats:', this.threats);

        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">Vulnerability Checklist</h3>
                    <p class="text-sm text-slate-400">Review recommendations and apply controls to secure the architecture.</p>
                    <div class="space-y-3 h-[400px] overflow-y-auto pr-2">
                        ${this.threats.map(t => {
                            console.log('Rendering threat:', t);
                            return `
                                <div class="p-4 rounded-lg border transition-all ${
                                    t.mitigated 
                                        ? 'bg-emerald-900/20 border-emerald-500/50' 
                                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                                }">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-bold text-sm ${
                                                    t.mitigated ? 'text-emerald-400' : 'text-white'
                                                }">
                                                    ${t.id}: ${t.title}
                                                </span>
                                                ${t.mitigated ? '<span class="text-xs bg-emerald-500 text-slate-900 px-1.5 rounded font-bold">FIXED</span>' : ''}
                                            </div>
                                            <p class="text-xs text-slate-400 mt-1 line-clamp-2">${t.mitigation}</p>
                                        </div>
                                        <button
                                            onclick="app.toggleMitigation('${t.id}')"
                                            class="px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                                                t.mitigated
                                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                                            }"
                                        >
                                            ${t.mitigated ? 'Undo' : 'Apply Fix'}
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center">
                    <h3 class="text-lg font-bold text-white mb-4">Impact Preview</h3>
                    <div class="w-full max-w-xs bg-slate-700 rounded-full h-4 overflow-hidden mb-2">
                        <div 
                            class="bg-emerald-500 h-full transition-all duration-1000 ease-out"
                            style="width: ${securityScore}%"
                        ></div>
                    </div>
                    <p class="text-slate-400 text-sm">
                        System Security Score: <span class="text-white font-bold">${securityScore}/100</span>
                    </p>
                    <div class="mt-8 p-4 bg-slate-800 rounded text-xs text-slate-400 text-left w-full">
                        <strong>Changes applied:</strong>
                        <ul class="list-disc pl-4 mt-2 space-y-1">
                            ${this.threats.filter(t => t.mitigated).map(t => `
                                <li class="text-emerald-400">Applied ${t.mitigation.split('.')[0]}</li>
                            `).join('')}
                            ${this.threats.filter(t => !t.mitigated).length > 0 ? `
                                <li class="text-red-400 italic">
                                    ${this.threats.filter(t => !t.mitigated).length} vulnerabilities remaining.
                                </li>
                            ` : ''}
                        </ul>
                    </div>
                    <button 
                        onclick="app.setPhase('reporting')" 
                        class="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        View Security Report &rarr;
                    </button>
                </div>
            </div>
        `;
    }

   renderReportingPhase() {
    const mitigatedCount = this.threats.filter(t => t.mitigated).length;
    const totalThreats = this.threats.length;
    const securityScore = Math.round((mitigatedCount / totalThreats) * 100);
    const highRisks = this.threats.filter(t => !t.mitigated && t.impact === 'High');
    const mitigatedThreats = this.threats.filter(t => t.mitigated);
    const openThreats = this.threats.filter(t => !t.mitigated);

    // Get current date for report
    const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <div class="max-w-6xl mx-auto">
            <!-- Report Header -->
            <div class="bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden no-print">
                <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 print:bg-white print:text-black">
                    <div class="flex justify-between items-start">
                        <div>
                            <h1 class="text-4xl font-bold mb-2 print:text-3xl print:text-black">Threat Model Assessment Report</h1>
                            <p class="text-blue-100 text-lg print:text-gray-700">Connected Vehicle Telemetry System v2.0</p>
                            <div class="flex items-center gap-4 mt-4 text-sm print:text-xs">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-calendar print:text-gray-600"></i>
                                    <span class="print:text-gray-600">${reportDate}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-tag print:text-gray-600"></i>
                                    <span class="print:text-gray-600">Assessment ID: TM-${Date.now().toString().slice(-6)}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-user-shield print:text-gray-600"></i>
                                    <span class="print:text-gray-600">Automotive Security Team</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-right print:text-black">
                            <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 print:bg-gray-100 print:border">
                                <div class="text-2xl font-black print:text-xl">${securityScore}%</div>
                                <div class="text-sm opacity-90 print:text-xs">Security Score</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-8 space-y-8 print:p-6 print:space-y-6">
                    <!-- Executive Summary -->
                    <section class="border-b border-gray-200 pb-6 print:pb-4">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 print:text-xl">
                            <i class="fas fa-chart-line text-blue-500 print:text-gray-600"></i>
                            Executive Summary
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2">
                            <div class="text-center p-4 bg-blue-50 rounded-lg print:bg-white print:border">
                                <div class="text-3xl font-bold text-blue-600 print:text-2xl">${totalThreats}</div>
                                <div class="text-sm text-gray-600 print:text-xs">Total Threats</div>
                            </div>
                            <div class="text-center p-4 bg-green-50 rounded-lg print:bg-white print:border">
                                <div class="text-3xl font-bold text-green-600 print:text-2xl">${mitigatedCount}</div>
                                <div class="text-sm text-gray-600 print:text-xs">Mitigated</div>
                            </div>
                            <div class="text-center p-4 bg-${highRisks.length > 0 ? 'red' : 'green'}-50 rounded-lg print:bg-white print:border">
                                <div class="text-3xl font-bold text-${highRisks.length > 0 ? 'red' : 'green'}-600 print:text-2xl">${highRisks.length}</div>
                                <div class="text-sm text-gray-600 print:text-xs">High Risk Open</div>
                            </div>
                            <div class="text-center p-4 bg-purple-50 rounded-lg print:bg-white print:border">
                                <div class="text-3xl font-bold text-purple-600 print:text-2xl">${securityScore}%</div>
                                <div class="text-sm text-gray-600 print:text-xs">Overall Score</div>
                            </div>
                        </div>
                        <p class="text-gray-700 leading-relaxed print:text-sm">
                            This comprehensive threat modeling assessment of the <strong>Connected Vehicle Telemetry System</strong> 
                            identified <strong>${totalThreats} potential security threats</strong> across all STRIDE categories. 
                            Through systematic analysis and implementation of security controls, 
                            <strong>${mitigatedCount} threats have been effectively mitigated</strong>, achieving a security posture score of 
                            <strong>${securityScore}%</strong>.
                            ${highRisks.length > 0 ? 
                                `<br><br><strong class="text-red-600 print:text-red-800">CRITICAL: ${highRisks.length} high-risk vulnerabilities require immediate attention.</strong>` : 
                                '<br><br>The system architecture meets baseline security requirements with all critical threats addressed.'
                            }
                        </p>
                    </section>

                    <!-- System Architecture -->
                    <section class="border-b border-gray-200 pb-6 print:pb-4">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 print:text-xl">System Architecture Overview</h2>
                        <div class="bg-gray-50 rounded-lg p-6 mb-4 print:p-4 print:bg-white print:border">
                            <h3 class="text-lg font-semibold mb-3 print:text-base">Architecture Components & Trust Boundaries</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                                <div class="border-l-4 border-yellow-500 pl-4 py-2 print:py-1">
                                    <h4 class="font-semibold text-gray-800 print:text-sm">Vehicle Trust Zone</h4>
                                    <p class="text-sm text-gray-600 print:text-xs">Car TCU - Embedded telematics unit with secure boot and HSM</p>
                                    <div class="text-xs text-gray-500 mt-1 print:text-xs">
                                        Trust Level: <span class="font-medium">High</span>
                                    </div>
                                </div>
                                <div class="border-l-4 border-red-500 pl-4 py-2 print:py-1">
                                    <h4 class="font-semibold text-gray-800 print:text-sm">Public Network</h4>
                                    <p class="text-sm text-gray-600 print:text-xs">Cellular (4G/5G) - Untrusted public infrastructure</p>
                                    <div class="text-xs text-gray-500 mt-1 print:text-xs">
                                        Trust Level: <span class="font-medium">None</span>
                                    </div>
                                </div>
                                <div class="border-l-4 border-blue-500 pl-4 py-2 print:py-1">
                                    <h4 class="font-semibold text-gray-800 print:text-sm">Cloud Trust Zone</h4>
                                    <p class="text-sm text-gray-600 print:text-xs">IoT Gateway & Database - Managed cloud infrastructure</p>
                                    <div class="text-xs text-gray-500 mt-1 print:text-xs">
                                        Trust Level: <span class="font-medium">Medium-High</span>
                                    </div>
                                </div>
                                <div class="border-l-4 border-purple-500 pl-4 py-2 print:py-1">
                                    <h4 class="font-semibold text-gray-800 print:text-sm">Data Flow</h4>
                                    <p class="text-sm text-gray-600 print:text-xs">MQTT Telemetry → TLS 1.3 → Secure Write</p>
                                    <div class="text-xs text-gray-500 mt-1 print:text-xs">
                                        Encryption: <span class="font-medium">End-to-End</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Threat Analysis Summary -->
                    <section class="border-b border-gray-200 pb-6 print:pb-4">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 print:text-xl">Threat Analysis Summary</h2>
                        
                        <!-- STRIDE Categories Overview -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold mb-3 print:text-base">STRIDE Categories Assessment</h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
                                ${Object.values(STRIDE_CATEGORY).map(cat => {
                                    const categoryThreats = this.threats.filter(t => t.category === cat);
                                    const mitigated = categoryThreats.filter(t => t.mitigated).length;
                                    const total = categoryThreats.length;
                                    const score = total > 0 ? Math.round((mitigated / total) * 100) : 0;
                                    
                                    return `
                                        <div class="border rounded-lg p-4 text-center print:p-2">
                                            <div class="font-semibold text-gray-800 print:text-sm">${cat}</div>
                                            <div class="text-2xl font-bold ${
                                                score === 100 ? 'text-green-600' : 
                                                score >= 70 ? 'text-yellow-600' : 'text-red-600'
                                            } print:text-xl">${score}%</div>
                                            <div class="text-xs text-gray-600 print:text-xs">${mitigated}/${total} Mitigated</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Detailed Threat Findings -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3 print:text-base">Detailed Threat Findings</h3>
                            <div class="space-y-4 print:space-y-3">
                                ${this.threats.map(threat => `
                                    <div class="border rounded-lg overflow-hidden ${
                                        threat.mitigated ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                    } print:break-inside-avoid">
                                        <div class="px-4 py-3 ${
                                            threat.mitigated ? 'bg-green-100' : 'bg-red-100'
                                        } border-b print:px-3 print:py-2">
                                            <div class="flex items-center justify-between print:flex-col print:items-start print:gap-1">
                                                <h3 class="font-semibold text-gray-800 print:text-sm">${threat.id}: ${threat.title}</h3>
                                                <div class="flex items-center gap-2 print:gap-1">
                                                    <span class="px-2 py-1 text-xs rounded ${
                                                        threat.mitigated ? 
                                                        'bg-green-200 text-green-800' : 
                                                        'bg-red-200 text-red-800'
                                                    } print:text-xs">
                                                        ${threat.mitigated ? 'MITIGATED' : 'OPEN - ' + threat.impact + ' RISK'}
                                                    </span>
                                                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded print:text-xs">
                                                        ${threat.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="p-4 print:p-3">
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 print:grid-cols-2 print:gap-3">
                                                <div>
                                                    <h4 class="font-semibold text-sm text-gray-700 mb-2 print:text-xs">Risk Assessment</h4>
                                                    <div class="space-y-1 text-sm print:text-xs">
                                                        <div class="flex justify-between">
                                                            <span>Impact:</span>
                                                            <span class="font-medium ${
                                                                threat.impact === 'High' ? 'text-red-600' : 
                                                                threat.impact === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                                            }">${threat.impact}</span>
                                                        </div>
                                                        <div class="flex justify-between">
                                                            <span>Affected Components:</span>
                                                            <span class="font-medium text-right">${threat.affectedComponents.map(comp => 
                                                                DIAGRAM_NODES.find(n => n.id === comp)?.label || comp
                                                            ).join(', ')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 class="font-semibold text-sm text-gray-700 mb-2 print:text-xs">${threat.mitigated ? 'Implemented' : 'Required'} Controls</h4>
                                                    <p class="text-sm text-gray-600 print:text-xs">${threat.mitigation}</p>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <h4 class="font-semibold text-sm text-gray-700 mb-2 print:text-xs">Attack Scenario</h4>
                                                <p class="text-sm text-gray-600 print:text-xs">${threat.context}</p>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </section>

                    <!-- Risk Mitigation Progress -->
                    <section class="border-b border-gray-200 pb-6 print:pb-4">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 print:text-xl">Risk Mitigation Progress</h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                            <!-- Mitigation Status -->
                            <div>
                                <h3 class="text-lg font-semibold mb-3 print:text-base">Mitigation Status</h3>
                                <div class="space-y-3 print:space-y-2">
                                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span class="text-gray-700 print:text-sm">Total Threats Identified</span>
                                        <span class="font-semibold">${totalThreats}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span class="text-gray-700 print:text-sm">Successfully Mitigated</span>
                                        <span class="font-semibold text-green-600">${mitigatedCount}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span class="text-gray-700 print:text-sm">Remaining Vulnerabilities</span>
                                        <span class="font-semibold ${openThreats.length > 0 ? 'text-red-600' : 'text-green-600'}">${openThreats.length}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span class="text-gray-700 print:text-sm">High Risk Outstanding</span>
                                        <span class="font-semibold ${highRisks.length > 0 ? 'text-red-600' : 'text-green-600'}">${highRisks.length}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Security Recommendations -->
                            <div>
                                <h3 class="text-lg font-semibold mb-3 print:text-base">Security Recommendations</h3>
                                <ul class="space-y-2 text-sm text-gray-600 print:text-xs">
                                    <li class="flex items-start gap-2">
                                        <i class="fas fa-arrow-right text-blue-500 mt-1 flex-shrink-0 print:text-gray-600"></i>
                                        <span>Implement continuous security monitoring and automated threat detection</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <i class="fas fa-arrow-right text-blue-500 mt-1 flex-shrink-0 print:text-gray-600"></i>
                                        <span>Conduct regular penetration testing and security assessments</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <i class="fas fa-arrow-right text-blue-500 mt-1 flex-shrink-0 print:text-gray-600"></i>
                                        <span>Establish incident response plan for automotive security events</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <i class="fas fa-arrow-right text-blue-500 mt-1 flex-shrink-0 print:text-gray-600"></i>
                                        <span>Maintain compliance with evolving automotive security standards (ISO 21434, UN R155)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Compliance & Standards -->
                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 print:text-xl">Compliance & Standards</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                            <div>
                                <h3 class="text-lg font-semibold mb-3 print:text-base">Compliance Status</h3>
                                <div class="space-y-2">
                                    ${['ISO 21434 - Road Vehicles Cybersecurity', 'UN R155 - Cybersecurity Management', 'SAE J3061 - Cybersecurity Guidebook', 'NIST CSF - Cybersecurity Framework'].map(standard => `
                                        <div class="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span class="text-gray-700 print:text-sm">${standard}</span>
                                            <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium print:text-xs">
                                                Compliant
                                            </span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-3 print:text-base">Next Review Schedule</h3>
                                <div class="space-y-2 text-sm text-gray-600 print:text-xs">
                                    <div class="flex justify-between">
                                        <span>Next Assessment:</span>
                                        <span class="font-medium">${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Compliance Review:</span>
                                        <span class="font-medium">Quarterly</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Threat Model Update:</span>
                                        <span class="font-medium">After Major Changes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Report Footer -->
                <div class="bg-gray-100 border-t border-gray-200 p-6 print:bg-white print:border-t-2">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <div class="text-sm text-gray-600 print:text-xs">
                            <div>Generated by STRIDE Threat Modeler v2.0 | Automotive Security Framework</div>
                            <div>Confidential - For authorized personnel only</div>
                        </div>
                        <div class="flex gap-4 mt-4 md:mt-0 no-print">
                            <button onclick="window.print()" 
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors print:hidden">
                                <i class="fas fa-print mr-2"></i>Print Report
                            </button>
                            <button onclick="app.setPhase('mitigation')" 
                                    class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors print:hidden">
                                <i class="fas fa-edit mr-2"></i>Edit Mitigations
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Print-only elements -->
            <div class="hidden print:block print:mt-8 print:text-center">
                <div class="text-xs text-gray-500">
                    Report generated on ${reportDate} | STRIDE Threat Model Assessment | Page 1 of 1
                </div>
            </div>
        </div>
    `;
}
    
}

// Make app globally available
window.ThreatModelerApp = ThreatModelerApp;
