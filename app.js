// BiomeTools - Educational Application for Biomedicine Students
class BiomeTools {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'dashboard';
        this.currentTool = 'genetic';
        this.currentCalc = 'dilution';
        
        // Data from the application data JSON
        this.geneticCode = {
            "UUU": "Phe", "UUC": "Phe", "UUA": "Leu", "UUG": "Leu",
            "UCU": "Ser", "UCC": "Ser", "UCA": "Ser", "UCG": "Ser",
            "UAU": "Tyr", "UAC": "Tyr", "UAA": "Stop", "UAG": "Stop",
            "UGU": "Cys", "UGC": "Cys", "UGA": "Stop", "UGG": "Trp",
            "CUU": "Leu", "CUC": "Leu", "CUA": "Leu", "CUG": "Leu",
            "CCU": "Pro", "CCC": "Pro", "CCA": "Pro", "CCG": "Pro",
            "CAU": "His", "CAC": "His", "CAA": "Gln", "CAG": "Gln",
            "CGU": "Arg", "CGC": "Arg", "CGA": "Arg", "CGG": "Arg",
            "AUU": "Ile", "AUC": "Ile", "AUA": "Ile", "AUG": "Met",
            "ACU": "Thr", "ACC": "Thr", "ACA": "Thr", "ACG": "Thr",
            "AAU": "Asn", "AAC": "Asn", "AAA": "Lys", "AAG": "Lys",
            "AGU": "Ser", "AGC": "Ser", "AGA": "Arg", "AGG": "Arg",
            "GUU": "Val", "GUC": "Val", "GUA": "Val", "GUG": "Val",
            "GCU": "Ala", "GCC": "Ala", "GCA": "Ala", "GCG": "Ala",
            "GAU": "Asp", "GAC": "Asp", "GAA": "Glu", "GAG": "Glu",
            "GGU": "Gly", "GGC": "Gly", "GGA": "Gly", "GGG": "Gly"
        };

        this.aminoAcids = {
            "Ala": "Alanina", "Arg": "Arginina", "Asn": "Asparagina", "Asp": "Ácido Aspártico",
            "Cys": "Cisteína", "Gln": "Glutamina", "Glu": "Ácido Glutâmico", "Gly": "Glicina",
            "His": "Histidina", "Ile": "Isoleucina", "Leu": "Leucina", "Lys": "Lisina",
            "Met": "Metionina", "Phe": "Fenilalanina", "Pro": "Prolina", "Ser": "Serina",
            "Thr": "Treonina", "Trp": "Triptofano", "Tyr": "Tirosina", "Val": "Valina"
        };

        this.biomedicineSubjects = [
            "Anatomia Humana", "Fisiologia", "Bioquímica", "Biologia Celular",
            "Microbiologia", "Imunologia", "Farmacologia", "Patologia",
            "Hematologia", "Parasitologia", "Análises Clínicas", "Biologia Molecular",
            "Genética", "Histologia", "Embriologia", "Bioética",
            "Bioestatística", "Toxicologia", "Epidemiologia", "Citologia"
        ];

        this.commonBuffers = [
            {"name": "PBS (pH 7.4)", "composition": "NaCl 137mM, KCl 2.7mM, Na2HPO4 10mM, KH2PO4 1.8mM"},
            {"name": "Tris-HCl (pH 8.0)", "composition": "Tris base 50mM, HCl para ajuste de pH"},
            {"name": "HEPES (pH 7.4)", "composition": "HEPES 25mM, NaCl 150mM"},
            {"name": "Acetato (pH 5.0)", "composition": "Acetato de sódio 50mM, ácido acético"}
        ];

        this.consensusSequences = {
            "TATA_box": "TATAAA",
            "Kozak": "GCCRCCATGG",
            "Shine_Dalgarno": "AGGAGG",
            "Pribnow": "TATAAT"
        };

        this.exampleSequences = {
            "dna_examples": [
                "ATGGCATGCAAATTCGATGGCCTAA",
                "TATAAAAGGCATGAAATTTGACTAG",
                "GCGATCGATGCCAATTAAGGCTAA"
            ]
        };

        // Initialize immediately
        this.init();
    }

    init() {
        console.log('BiomeTools initializing...');
        
        // Load user data first
        this.loadUserData();
        
        // Setup UI components
        this.populateSelects();
        this.renderCodonTable();
        this.renderBufferList();
        
        // Setup all event listeners
        this.setupEventListeners();
        
        // Show appropriate screen
        if (this.currentUser) {
            console.log('User found, showing main app');
            this.showMainApp();
        } else {
            console.log('No user found, showing login screen');
            this.showLoginScreen();
        }
    }

    // Login and Authentication
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Login form - more robust setup
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('Login form found, adding event listener');
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin();
                return false;
            };
        } else {
            console.error('Login form not found!');
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                this.handleLogout();
            };
        }

        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.onclick = (e) => {
                const tabName = e.target.getAttribute('data-tab');
                if (tabName) {
                    this.switchTab(tabName);
                }
            };
        });

        // Tools navigation
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.onclick = (e) => {
                const toolName = e.target.getAttribute('data-tool');
                if (toolName) {
                    this.switchTool(toolName);
                }
            };
        });

        // Calculator navigation
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.onclick = (e) => {
                const calcName = e.target.getAttribute('data-calc');
                if (calcName) {
                    this.switchCalc(calcName);
                }
            };
        });

        // Setup tool-specific listeners
        this.setupGeneticTool();
        this.setupCalculators();
        this.setupQualityControl();
        this.setupLibrary();
        this.setupStudies();
        this.setupSettings();
    }

    handleLogin() {
        console.log('Handling login...');
        
        const nameInput = document.getElementById('studentName');
        const emailInput = document.getElementById('studentEmail');
        
        if (!nameInput || !emailInput) {
            console.error('Login form inputs not found');
            this.showToast('Erro: Campos do formulário não encontrados', 'error');
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        console.log('Login attempt:', { name, email });
        
        if (!name || !email) {
            this.showToast('Por favor, preencha todos os campos', 'warning');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showToast('Por favor, insira um email válido', 'warning');
            return;
        }

        // Set user data
        this.currentUser = { 
            name: name, 
            email: email, 
            semester: 1,
            loginDate: new Date().toISOString()
        };
        
        console.log('User created:', this.currentUser);
        
        // Save to localStorage
        this.saveUserData();
        
        // Show main app
        this.showMainApp();
        this.showToast('Login realizado com sucesso!', 'success');
        
        console.log('Login completed successfully');
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('biometools_user');
        this.showLoginScreen();
        this.showToast('Logout realizado com sucesso!', 'info');
    }

    showLoginScreen() {
        console.log('Showing login screen');
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            loginScreen.style.display = 'flex';
        }
        
        if (mainApp) {
            mainApp.classList.add('hidden');
            mainApp.style.display = 'none';
        }
    }

    showMainApp() {
        console.log('Showing main app');
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        const userWelcome = document.getElementById('userWelcome');
        
        if (loginScreen) {
            loginScreen.classList.add('hidden');
            loginScreen.style.display = 'none';
        }
        
        if (mainApp) {
            mainApp.classList.remove('hidden');
            mainApp.style.display = 'flex';
        }
        
        if (userWelcome && this.currentUser) {
            userWelcome.textContent = `Olá, ${this.currentUser.name}!`;
        }
        
        // Initialize dashboard and settings
        this.updateDashboard();
        this.loadSettings();
        
        console.log('Main app displayed successfully');
    }

    // Navigation
    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        this.currentTab = tabName;

        // Update dashboard when switching to it
        if (tabName === 'dashboard') {
            this.updateDashboard();
        }
    }

    switchTool(toolName) {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-tool="${toolName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        document.querySelectorAll('.tool-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${toolName}-tool`);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        this.currentTool = toolName;
    }

    switchCalc(calcName) {
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-calc="${calcName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        document.querySelectorAll('.calc-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${calcName}-calc`);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        this.currentCalc = calcName;
    }

    // Genetic Tool
    setupGeneticTool() {
        const validateBtn = document.getElementById('validateDna');
        const translateRnaBtn = document.getElementById('translateToRna');
        const translateProteinBtn = document.getElementById('translateToProtein');
        const analyzeFramesBtn = document.getElementById('analyzeFrames');
        const dnaInput = document.getElementById('dnaInput');

        if (validateBtn) {
            validateBtn.onclick = () => this.validateDNA();
        }

        if (translateRnaBtn) {
            translateRnaBtn.onclick = () => this.translateToRNA();
        }

        if (translateProteinBtn) {
            translateProteinBtn.onclick = () => this.translateToProtein();
        }

        if (analyzeFramesBtn) {
            analyzeFramesBtn.onclick = () => this.analyzeReadingFrames();
        }

        if (dnaInput) {
            dnaInput.oninput = () => this.resetTranslationButtons();
        }
    }

    validateDNA() {
        const dnaInput = document.getElementById('dnaInput');
        if (!dnaInput) return false;

        const input = dnaInput.value.trim().toUpperCase();
        const validBases = /^[ATGC]+$/;
        
        if (!input) {
            this.showToast('Por favor, insira uma sequência de DNA', 'warning');
            return false;
        }
        
        if (!validBases.test(input)) {
            this.showToast('Sequência inválida. Use apenas as bases A, T, G, C', 'error');
            return false;
        }
        
        this.showToast('Sequência de DNA válida!', 'success');
        const translateBtn = document.getElementById('translateToRna');
        if (translateBtn) {
            translateBtn.disabled = false;
        }
        this.logActivity('Validação de sequência de DNA');
        return true;
    }

    translateToRNA() {
        if (!this.validateDNA()) return;
        
        const dnaInput = document.getElementById('dnaInput');
        if (!dnaInput) return;

        const dna = dnaInput.value.trim().toUpperCase();
        const rna = dna.replace(/T/g, 'U');
        
        this.displaySequenceResult('RNA', rna, 'RNA (5\' → 3\')');
        const translateProteinBtn = document.getElementById('translateToProtein');
        const analyzeFramesBtn = document.getElementById('analyzeFrames');
        
        if (translateProteinBtn) translateProteinBtn.disabled = false;
        if (analyzeFramesBtn) analyzeFramesBtn.disabled = false;
        
        this.logActivity('Tradução DNA → RNA');
    }

    translateToProtein() {
        if (!this.validateDNA()) return;
        
        const dnaInput = document.getElementById('dnaInput');
        if (!dnaInput) return;

        const dna = dnaInput.value.trim().toUpperCase();
        const rna = dna.replace(/T/g, 'U');
        
        // Find reading frames
        const proteins = [];
        for (let frame = 0; frame < 3; frame++) {
            const protein = this.translateRNAToProtein(rna, frame);
            if (protein.length > 0) {
                proteins.push({
                    frame: frame + 1,
                    sequence: protein,
                    start: frame
                });
            }
        }
        
        this.displayProteinResults(proteins);
        this.logActivity('Tradução RNA → Proteína');
    }

    translateRNAToProtein(rna, frame = 0) {
        let protein = '';
        const startIndex = rna.indexOf('AUG', frame);
        
        if (startIndex === -1) return '';
        
        for (let i = startIndex; i < rna.length - 2; i += 3) {
            const codon = rna.substr(i, 3);
            if (codon.length === 3) {
                const amino = this.geneticCode[codon];
                if (amino === 'Stop') break;
                protein += amino;
            }
        }
        
        return protein;
    }

    analyzeReadingFrames() {
        const dnaInput = document.getElementById('dnaInput');
        if (!dnaInput) return;

        const dna = dnaInput.value.trim().toUpperCase();
        const rna = dna.replace(/T/g, 'U');
        
        let results = '<div class="sequence-result"><h4>Análise de Frames de Leitura</h4>';
        
        for (let frame = 0; frame < 3; frame++) {
            results += `<div style="margin: 16px 0;"><strong>Frame ${frame + 1}:</strong><br>`;
            results += '<div class="sequence-display">';
            
            for (let i = frame; i < rna.length - 2; i += 3) {
                const codon = rna.substr(i, 3);
                if (codon.length === 3) {
                    const amino = this.geneticCode[codon];
                    let codonClass = '';
                    
                    if (codon === 'AUG') codonClass = 'start-codon';
                    else if (amino === 'Stop') codonClass = 'stop-codon';
                    
                    results += `<span class="${codonClass}">${codon}</span> `;
                }
            }
            results += '</div></div>';
        }
        
        results += '</div>';
        
        // Check for consensus sequences
        results += this.findConsensusSequences(dna);
        
        const resultsContainer = document.getElementById('translationResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = results;
        }
        this.logActivity('Análise de frames de leitura');
    }

    findConsensusSequences(dna) {
        let results = '<div class="sequence-result"><h4>Sequências Consenso Encontradas</h4>';
        let found = false;
        
        // TATA box
        const tataIndex = dna.indexOf('TATAAA');
        if (tataIndex !== -1) {
            results += `<p>🎯 <strong>TATA box</strong> encontrada na posição ${tataIndex + 1}</p>`;
            found = true;
        }
        
        // Start codon
        const startIndex = dna.indexOf('ATG');
        if (startIndex !== -1) {
            results += `<p>🚀 <strong>Códon de início (ATG)</strong> encontrado na posição ${startIndex + 1}</p>`;
            found = true;
        }
        
        if (!found) {
            results += '<p>Nenhuma sequência consenso conhecida encontrada.</p>';
        }
        
        results += '</div>';
        return results;
    }

    displaySequenceResult(type, sequence, title) {
        const result = `
            <div class="sequence-result">
                <h4>${title}</h4>
                <div class="sequence-display">${this.formatSequence(sequence)}</div>
                <p><strong>Comprimento:</strong> ${sequence.length} nucleotídeos</p>
            </div>
        `;
        
        const resultsContainer = document.getElementById('translationResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = result;
        }
    }

    displayProteinResults(proteins) {
        let results = '<div class="sequence-result"><h4>Proteínas Traduzidas</h4>';
        
        if (proteins.length === 0) {
            results += '<p>Nenhuma proteína encontrada. Verifique se há códons de início (ATG) na sequência.</p>';
        } else {
            proteins.forEach(protein => {
                results += `
                    <div style="margin: 16px 0; padding: 12px; background: var(--color-surface); border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
                        <strong>Frame ${protein.frame}:</strong><br>
                        <div class="sequence-display">${this.formatProteinSequence(protein.sequence)}</div>
                        <p><strong>Comprimento:</strong> ${protein.sequence.length} aminoácidos</p>
                    </div>
                `;
            });
        }
        
        results += '</div>';
        const resultsContainer = document.getElementById('translationResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = results;
        }
    }

    formatSequence(sequence) {
        return sequence.match(/.{1,3}/g)?.join(' ') || sequence;
    }

    formatProteinSequence(sequence) {
        return sequence.match(/.{1,10}/g)?.join(' ') || sequence;
    }

    resetTranslationButtons() {
        const translateRnaBtn = document.getElementById('translateToRna');
        const translateProteinBtn = document.getElementById('translateToProtein');
        const analyzeFramesBtn = document.getElementById('analyzeFrames');
        const resultsContainer = document.getElementById('translationResults');

        if (translateRnaBtn) translateRnaBtn.disabled = true;
        if (translateProteinBtn) translateProteinBtn.disabled = true;
        if (analyzeFramesBtn) analyzeFramesBtn.disabled = true;
        if (resultsContainer) resultsContainer.innerHTML = '';
    }

    renderCodonTable() {
        const grid = document.getElementById('codonGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        Object.entries(this.geneticCode).forEach(([codon, amino]) => {
            const item = document.createElement('div');
            item.className = 'codon-item';
            
            const fullName = this.aminoAcids[amino] || amino;
            
            item.innerHTML = `
                <div class="codon">${codon}</div>
                <div class="amino">${amino}</div>
                <div class="amino" style="font-size: 10px;">${fullName}</div>
            `;
            
            grid.appendChild(item);
        });
    }

    // Laboratory Calculators
    setupCalculators() {
        const calculateDilutionBtn = document.getElementById('calculateDilution');
        if (calculateDilutionBtn) {
            calculateDilutionBtn.onclick = () => this.calculateDilution();
        }

        const calculateMolarityBtn = document.getElementById('calculateMolarity');
        if (calculateMolarityBtn) {
            calculateMolarityBtn.onclick = () => this.calculateMolarity();
        }

        const convertUnitsBtn = document.getElementById('convertUnits');
        if (convertUnitsBtn) {
            convertUnitsBtn.onclick = () => this.convertUnits();
        }

        // Auto-calculate on input change
        ['c1', 'v1', 'c2'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.oninput = () => this.autoCalculateDilution();
            }
        });

        ['mass', 'molarMass', 'volume'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.oninput = () => this.autoCalculateMolarity();
            }
        });
    }

    calculateDilution() {
        const c1Element = document.getElementById('c1');
        const v1Element = document.getElementById('v1');
        const c2Element = document.getElementById('c2');
        const v2Element = document.getElementById('v2');

        if (!c1Element || !v1Element || !c2Element || !v2Element) return;

        const c1 = parseFloat(c1Element.value);
        const v1 = parseFloat(v1Element.value);
        const c2 = parseFloat(c2Element.value);
        
        if (isNaN(c1) || isNaN(v1) || isNaN(c2) || c2 === 0) {
            this.showToast('Por favor, preencha todos os campos com valores válidos', 'warning');
            return;
        }
        
        const v2 = (c1 * v1) / c2;
        v2Element.value = v2.toFixed(2);
        
        const result = `
            <h4>Resultado da Diluição</h4>
            <p><strong>Fórmula:</strong> C₁ × V₁ = C₂ × V₂</p>
            <p><strong>Cálculo:</strong> ${c1} × ${v1} = ${c2} × ${v2.toFixed(2)}</p>
            <p><strong>Volume final necessário:</strong> ${v2.toFixed(2)} mL</p>
            <p><strong>Volume de diluente a adicionar:</strong> ${(v2 - v1).toFixed(2)} mL</p>
        `;
        
        const resultContainer = document.getElementById('dilutionResult');
        if (resultContainer) {
            resultContainer.innerHTML = result;
        }
        this.logActivity('Cálculo de diluição');
    }

    autoCalculateDilution() {
        const c1Element = document.getElementById('c1');
        const v1Element = document.getElementById('v1');
        const c2Element = document.getElementById('c2');
        const v2Element = document.getElementById('v2');

        if (!c1Element || !v1Element || !c2Element || !v2Element) return;

        const c1 = parseFloat(c1Element.value);
        const v1 = parseFloat(v1Element.value);
        const c2 = parseFloat(c2Element.value);
        
        if (!isNaN(c1) && !isNaN(v1) && !isNaN(c2) && c2 !== 0) {
            const v2 = (c1 * v1) / c2;
            v2Element.value = v2.toFixed(2);
        }
    }

    calculateMolarity() {
        const massElement = document.getElementById('mass');
        const molarMassElement = document.getElementById('molarMass');
        const volumeElement = document.getElementById('volume');
        const molarityElement = document.getElementById('molarity');

        if (!massElement || !molarMassElement || !volumeElement || !molarityElement) return;

        const mass = parseFloat(massElement.value);
        const molarMass = parseFloat(molarMassElement.value);
        const volume = parseFloat(volumeElement.value);
        
        if (isNaN(mass) || isNaN(molarMass) || isNaN(volume) || molarMass === 0 || volume === 0) {
            this.showToast('Por favor, preencha todos os campos com valores válidos', 'warning');
            return;
        }
        
        const moles = mass / molarMass;
        const molarity = moles / volume;
        
        molarityElement.value = molarity.toFixed(4);
        
        const result = `
            <h4>Resultado da Molaridade</h4>
            <p><strong>Fórmula:</strong> M = n / V</p>
            <p><strong>Número de mols:</strong> ${moles.toFixed(4)} mol</p>
            <p><strong>Molaridade:</strong> ${molarity.toFixed(4)} mol/L</p>
            <p><strong>Concentração:</strong> ${(molarity * 1000).toFixed(2)} mmol/L</p>
        `;
        
        const resultContainer = document.getElementById('molarityResult');
        if (resultContainer) {
            resultContainer.innerHTML = result;
        }
        this.logActivity('Cálculo de molaridade');
    }

    autoCalculateMolarity() {
        const massElement = document.getElementById('mass');
        const molarMassElement = document.getElementById('molarMass');
        const volumeElement = document.getElementById('volume');
        const molarityElement = document.getElementById('molarity');

        if (!massElement || !molarMassElement || !volumeElement || !molarityElement) return;

        const mass = parseFloat(massElement.value);
        const molarMass = parseFloat(molarMassElement.value);
        const volume = parseFloat(volumeElement.value);
        
        if (!isNaN(mass) && !isNaN(molarMass) && !isNaN(volume) && volume !== 0 && molarMass !== 0) {
            const molarity = (mass / molarMass) / volume;
            molarityElement.value = molarity.toFixed(4);
        }
    }

    convertUnits() {
        const valueElement = document.getElementById('unitValue');
        const fromUnitElement = document.getElementById('fromUnit');
        const toUnitElement = document.getElementById('toUnit');
        const resultElement = document.getElementById('unitResult');

        if (!valueElement || !fromUnitElement || !toUnitElement || !resultElement) return;

        const value = parseFloat(valueElement.value);
        const fromUnit = fromUnitElement.value;
        const toUnit = toUnitElement.value;
        
        if (isNaN(value)) {
            this.showToast('Por favor, insira um valor válido', 'warning');
            return;
        }
        
        const conversions = {
            'mg/mL': 1,
            'μg/mL': 0.001,
            'ng/mL': 0.000001,
            'g/L': 1
        };
        
        const baseValue = value * conversions[fromUnit];
        const result = baseValue / conversions[toUnit];
        
        resultElement.value = result.toFixed(6);
        this.logActivity('Conversão de unidades');
    }

    renderBufferList() {
        const container = document.getElementById('bufferList');
        if (!container) return;

        container.innerHTML = '';
        
        this.commonBuffers.forEach(buffer => {
            const item = document.createElement('div');
            item.className = 'buffer-item';
            item.innerHTML = `
                <h5>${buffer.name}</h5>
                <p>${buffer.composition}</p>
            `;
            container.appendChild(item);
        });
    }

    // Quality Control
    setupQualityControl() {
        const analyzeBtn = document.getElementById('analyzeQC');
        if (analyzeBtn) {
            analyzeBtn.onclick = () => this.analyzeQualityControl();
        }
    }

    analyzeQualityControl() {
        const dataInput = document.getElementById('qcData');
        if (!dataInput) return;

        const input = dataInput.value.trim();
        
        if (!input) {
            this.showToast('Por favor, insira dados de controle', 'warning');
            return;
        }
        
        const data = input.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
        
        if (data.length === 0) {
            this.showToast('Nenhum dado válido encontrado', 'error');
            return;
        }
        
        const stats = this.calculateStatistics(data);
        this.displayQCResults(stats, data);
        this.plotLeveyJennings(data, stats);
        this.logActivity('Análise de controle de qualidade');
    }

    calculateStatistics(data) {
        const n = data.length;
        const mean = data.reduce((a, b) => a + b, 0) / n;
        const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / mean) * 100;
        
        return {
            n,
            mean: mean.toFixed(2),
            stdDev: stdDev.toFixed(2),
            cv: cv.toFixed(2),
            min: Math.min(...data).toFixed(2),
            max: Math.max(...data).toFixed(2)
        };
    }

    displayQCResults(stats, data) {
        const results = `
            <div class="qc-stats">
                <div class="qc-stat">
                    <span class="value">${stats.n}</span>
                    <span class="label">Amostras</span>
                </div>
                <div class="qc-stat">
                    <span class="value">${stats.mean}</span>
                    <span class="label">Média</span>
                </div>
                <div class="qc-stat">
                    <span class="value">${stats.stdDev}</span>
                    <span class="label">Desvio Padrão</span>
                </div>
                <div class="qc-stat">
                    <span class="value">${stats.cv}%</span>
                    <span class="label">CV%</span>
                </div>
                <div class="qc-stat">
                    <span class="value">${stats.min}</span>
                    <span class="label">Mínimo</span>
                </div>
                <div class="qc-stat">
                    <span class="value">${stats.max}</span>
                    <span class="label">Máximo</span>
                </div>
            </div>
            
            <div class="sequence-result">
                <h4>Interpretação</h4>
                <p><strong>Precisão:</strong> ${stats.cv < 5 ? 'Excelente' : stats.cv < 10 ? 'Boa' : 'Revisar metodologia'} (CV = ${stats.cv}%)</p>
                <p><strong>Controle:</strong> Verificar se os valores estão dentro de ±2SD da média (${(stats.mean - 2*stats.stdDev).toFixed(2)} - ${(parseFloat(stats.mean) + 2*parseFloat(stats.stdDev)).toFixed(2)})</p>
            </div>
        `;
        
        const resultsContainer = document.getElementById('qcResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = results;
        }
    }

    plotLeveyJennings(data, stats) {
        const chart = document.getElementById('qcChart');
        if (!chart) return;

        const mean = parseFloat(stats.mean);
        const sd = parseFloat(stats.stdDev);
        
        chart.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4>Gráfico de Levey-Jennings (Simulado)</h4>
                <p>Média: ${mean} (linha central)</p>
                <p>+2SD: ${(mean + 2*sd).toFixed(2)} | -2SD: ${(mean - 2*sd).toFixed(2)}</p>
                <p>+3SD: ${(mean + 3*sd).toFixed(2)} | -3SD: ${(mean - 3*sd).toFixed(2)}</p>
                <div style="margin-top: 20px; padding: 20px; background: var(--color-secondary); border-radius: var(--radius-base);">
                    <p><strong>Pontos plotados:</strong> ${data.length}</p>
                    <p><strong>Fora de controle (>2SD):</strong> ${data.filter(x => Math.abs(x - mean) > 2*sd).length}</p>
                </div>
            </div>
        `;
    }

    // Library Management
    setupLibrary() {
        const addBtn = document.getElementById('addArticleBtn');
        if (addBtn) {
            addBtn.onclick = () => this.toggleArticleForm();
        }

        const cancelBtn = document.getElementById('cancelArticle');
        if (cancelBtn) {
            cancelBtn.onclick = () => this.hideArticleForm();
        }

        const form = document.getElementById('articleForm');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.saveArticle();
            };
        }

        const searchInput = document.getElementById('searchArticles');
        if (searchInput) {
            searchInput.oninput = () => this.filterArticles();
        }

        const filterSelect = document.getElementById('filterSubject');
        if (filterSelect) {
            filterSelect.onchange = () => this.filterArticles();
        }

        const exportBtn = document.getElementById('exportBibBtn');
        if (exportBtn) {
            exportBtn.onclick = () => this.exportBibliography();
        }

        this.renderArticles();
    }

    toggleArticleForm() {
        const form = document.getElementById('addArticleForm');
        if (form) {
            form.classList.toggle('hidden');
            if (!form.classList.contains('hidden')) {
                const titleInput = document.getElementById('articleTitle');
                if (titleInput) titleInput.focus();
            }
        }
    }

    hideArticleForm() {
        const form = document.getElementById('addArticleForm');
        const articleForm = document.getElementById('articleForm');
        
        if (form) form.classList.add('hidden');
        if (articleForm) articleForm.reset();
    }

    saveArticle() {
        const titleElement = document.getElementById('articleTitle');
        const authorsElement = document.getElementById('articleAuthors');
        const journalElement = document.getElementById('articleJournal');
        const yearElement = document.getElementById('articleYear');
        const doiElement = document.getElementById('articleDoi');
        const subjectElement = document.getElementById('articleSubject');
        const tagsElement = document.getElementById('articleTags');
        const notesElement = document.getElementById('articleNotes');

        if (!titleElement || !authorsElement || !journalElement || !yearElement || !subjectElement) {
            this.showToast('Erro: Campos do formulário não encontrados', 'error');
            return;
        }

        const article = {
            id: Date.now(),
            title: titleElement.value.trim(),
            authors: authorsElement.value.trim(),
            journal: journalElement.value.trim(),
            year: parseInt(yearElement.value),
            doi: doiElement ? doiElement.value.trim() : '',
            subject: subjectElement.value,
            tags: tagsElement ? tagsElement.value.split(',').map(t => t.trim()).filter(t => t) : [],
            notes: notesElement ? notesElement.value.trim() : '',
            dateAdded: new Date().toISOString()
        };

        if (!article.title || !article.authors || !article.journal || !article.year || !article.subject) {
            this.showToast('Por favor, preencha todos os campos obrigatórios', 'warning');
            return;
        }

        const articles = this.getArticles();
        articles.push(article);
        localStorage.setItem('biometools_articles', JSON.stringify(articles));

        this.hideArticleForm();
        this.renderArticles();
        this.showToast('Artigo adicionado com sucesso!', 'success');
        this.logActivity('Artigo adicionado à biblioteca');
    }

    getArticles() {
        return JSON.parse(localStorage.getItem('biometools_articles') || '[]');
    }

    deleteArticle(id) {
        if (confirm('Tem certeza que deseja excluir este artigo?')) {
            const articles = this.getArticles().filter(a => a.id !== id);
            localStorage.setItem('biometools_articles', JSON.stringify(articles));
            this.renderArticles();
            this.showToast('Artigo excluído com sucesso!', 'info');
        }
    }

    renderArticles() {
        const container = document.getElementById('articlesList');
        if (!container) return;

        const articles = this.getArticles();

        if (articles.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Nenhum artigo adicionado ainda. Comece adicionando seu primeiro artigo científico!</p></div>';
            return;
        }

        container.innerHTML = articles.map(article => `
            <div class="article-item" data-subject="${article.subject}" data-search="${article.title.toLowerCase()} ${article.authors.toLowerCase()} ${article.tags.join(' ').toLowerCase()}">
                <div class="article-header">
                    <div>
                        <h3 class="article-title">${article.title}</h3>
                        <div class="article-meta">
                            <strong>${article.authors}</strong> • ${article.journal} • ${article.year}
                            ${article.doi ? ` • DOI: ${article.doi}` : ''}
                        </div>
                        <div class="article-tags">
                            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        ${article.notes ? `<p style="margin-top: 8px; font-size: 14px; color: var(--color-text-secondary);">${article.notes}</p>` : ''}
                    </div>
                </div>
                <div class="article-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.generateCitation(${article.id}, 'ABNT')">ABNT</button>
                    <button class="btn btn--sm btn--outline" onclick="app.generateCitation(${article.id}, 'APA')">APA</button>
                    <button class="btn btn--sm btn--outline" onclick="app.deleteArticle(${article.id})">Excluir</button>
                </div>
            </div>
        `).join('');
    }

    generateCitation(id, format) {
        const article = this.getArticles().find(a => a.id === id);
        if (!article) return;

        let citation = '';
        
        if (format === 'ABNT') {
            citation = `${article.authors.toUpperCase()}. ${article.title}. <strong>${article.journal}</strong>, v. X, n. X, p. XX-XX, ${article.year}.`;
        } else if (format === 'APA') {
            citation = `${article.authors} (${article.year}). ${article.title}. <em>${article.journal}</em>, X(X), XX-XX.`;
        }

        // Show citation in a modal-like display
        const existingCitation = document.querySelector('.citation-display');
        if (existingCitation) existingCitation.remove();

        const citationDiv = document.createElement('div');
        citationDiv.className = 'citation-format citation-display';
        citationDiv.innerHTML = `
            <strong>Citação ${format}:</strong><br>
            ${citation}
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; cursor: pointer;">×</button>
        `;

        const articleElement = document.querySelector(`[data-search*="${article.title.toLowerCase()}"]`);
        if (articleElement) {
            articleElement.appendChild(citationDiv);
        }
    }

    filterArticles() {
        const searchInput = document.getElementById('searchArticles');
        const subjectFilter = document.getElementById('filterSubject');
        
        if (!searchInput || !subjectFilter) return;

        const searchTerm = searchInput.value.toLowerCase();
        const subjectFilterValue = subjectFilter.value;
        
        const articles = document.querySelectorAll('.article-item');
        
        articles.forEach(article => {
            const searchText = article.getAttribute('data-search') || '';
            const articleSubject = article.getAttribute('data-subject') || '';
            
            const matchesSearch = !searchTerm || searchText.includes(searchTerm);
            const matchesSubject = !subjectFilterValue || articleSubject === subjectFilterValue;
            
            article.style.display = matchesSearch && matchesSubject ? 'block' : 'none';
        });
    }

    exportBibliography() {
        const articles = this.getArticles();
        if (articles.length === 0) {
            this.showToast('Nenhum artigo para exportar', 'warning');
            return;
        }

        let bibliography = 'BIBLIOGRAFIA - BiomeTools\n\n';
        bibliography += 'FORMATO ABNT:\n\n';
        
        articles.forEach((article, index) => {
            bibliography += `${index + 1}. ${article.authors.toUpperCase()}. ${article.title}. ${article.journal}, v. X, n. X, p. XX-XX, ${article.year}.\n\n`;
        });

        bibliography += '\nFORMATO APA:\n\n';
        
        articles.forEach((article, index) => {
            bibliography += `${index + 1}. ${article.authors} (${article.year}). ${article.title}. ${article.journal}, X(X), XX-XX.\n\n`;
        });

        this.downloadTextFile('bibliografia_biometools.txt', bibliography);
        this.logActivity('Export de bibliografia');
    }

    // Studies Organizer
    setupStudies() {
        const addBtn = document.getElementById('addStudyPlan');
        if (addBtn) {
            addBtn.onclick = () => this.addStudyPlan();
        }

        // Set default date to today
        const dateInput = document.getElementById('studyDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }

        this.renderCurrentSchedule();
        this.updateStudyProgress();
    }

    addStudyPlan() {
        const subjectElement = document.getElementById('studySubject');
        const dateElement = document.getElementById('studyDate');
        const topicsElement = document.getElementById('studyTopics');
        const hoursElement = document.getElementById('studyHours');

        if (!subjectElement || !dateElement || !topicsElement || !hoursElement) return;

        const subject = subjectElement.value;
        const date = dateElement.value;
        const topics = topicsElement.value.trim();
        const hours = parseFloat(hoursElement.value);

        if (!subject || !date || !topics || !hours) {
            this.showToast('Por favor, preencha todos os campos', 'warning');
            return;
        }

        const study = {
            id: Date.now(),
            subject,
            date,
            topics,
            hours,
            completed: false,
            dateAdded: new Date().toISOString()
        };

        const studies = this.getStudies();
        studies.push(study);
        localStorage.setItem('biometools_studies', JSON.stringify(studies));

        // Clear form
        subjectElement.value = '';
        topicsElement.value = '';
        hoursElement.value = '';

        this.renderCurrentSchedule();
        this.updateStudyProgress();
        this.showToast('Estudo adicionado ao cronograma!', 'success');
        this.logActivity('Estudo agendado');
    }

    getStudies() {
        return JSON.parse(localStorage.getItem('biometools_studies') || '[]');
    }

    renderCurrentSchedule() {
        const container = document.getElementById('currentSchedule');
        if (!container) return;

        const studies = this.getStudies().sort((a, b) => new Date(a.date) - new Date(b.date));

        if (studies.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Nenhum estudo agendado. Adicione atividades ao seu cronograma!</p></div>';
            return;
        }

        container.innerHTML = studies.map(study => `
            <div class="schedule-item">
                <div class="schedule-date">${new Date(study.date).toLocaleDateString('pt-BR')}</div>
                <div class="schedule-subject">${study.subject}</div>
                <div class="schedule-topics">${study.topics}</div>
                <div class="schedule-hours">${study.hours}h planejadas</div>
                <button class="btn btn--sm btn--outline" onclick="app.deleteStudy(${study.id})">Remover</button>
            </div>
        `).join('');
    }

    deleteStudy(id) {
        if (confirm('Tem certeza que deseja remover este estudo?')) {
            const studies = this.getStudies().filter(s => s.id !== id);
            localStorage.setItem('biometools_studies', JSON.stringify(studies));
            this.renderCurrentSchedule();
            this.updateStudyProgress();
            this.showToast('Estudo removido do cronograma!', 'info');
        }
    }

    updateStudyProgress() {
        const totalHoursElement = document.getElementById('totalHours');
        const weekHoursElement = document.getElementById('weekHours');

        if (!totalHoursElement || !weekHoursElement) return;

        const studies = this.getStudies();
        const totalHours = studies.reduce((sum, study) => sum + study.hours, 0);
        
        // Calculate this week's hours
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weekHours = studies
            .filter(study => new Date(study.date) >= oneWeekAgo)
            .reduce((sum, study) => sum + study.hours, 0);

        totalHoursElement.textContent = `${totalHours}h`;
        weekHoursElement.textContent = `${weekHours}h`;
    }

    // Settings
    setupSettings() {
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.onclick = () => this.saveSettings();
        }

        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.onclick = () => this.exportAllData();
        }

        const clearBtn = document.getElementById('clearData');
        if (clearBtn) {
            clearBtn.onclick = () => this.clearAllData();
        }
    }

    loadSettings() {
        if (!this.currentUser) return;

        const nameInput = document.getElementById('settingsName');
        const emailInput = document.getElementById('settingsEmail');
        const semesterSelect = document.getElementById('currentSemester');

        if (nameInput) nameInput.value = this.currentUser.name || '';
        if (emailInput) emailInput.value = this.currentUser.email || '';
        if (semesterSelect) semesterSelect.value = this.currentUser.semester || '1';
    }

    saveSettings() {
        if (!this.currentUser) return;

        const nameInput = document.getElementById('settingsName');
        const emailInput = document.getElementById('settingsEmail');
        const semesterSelect = document.getElementById('currentSemester');

        if (nameInput) this.currentUser.name = nameInput.value.trim();
        if (emailInput) this.currentUser.email = emailInput.value.trim();
        if (semesterSelect) this.currentUser.semester = semesterSelect.value;

        this.saveUserData();
        
        const userWelcome = document.getElementById('userWelcome');
        if (userWelcome) {
            userWelcome.textContent = `Olá, ${this.currentUser.name}!`;
        }
        
        this.showToast('Configurações salvas com sucesso!', 'success');
    }

    exportAllData() {
        const data = {
            user: this.currentUser,
            articles: this.getArticles(),
            studies: this.getStudies(),
            activities: JSON.parse(localStorage.getItem('biometools_activities') || '[]'),
            exportDate: new Date().toISOString()
        };

        this.downloadTextFile('biometools_backup.json', JSON.stringify(data, null, 2));
        this.showToast('Dados exportados com sucesso!', 'success');
    }

    clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('biometools_articles');
            localStorage.removeItem('biometools_studies');
            localStorage.removeItem('biometools_activities');
            
            this.renderArticles();
            this.renderCurrentSchedule();
            this.updateStudyProgress();
            this.updateDashboard();
            
            this.showToast('Todos os dados foram limpos!', 'info');
        }
    }

    // Utility Functions
    populateSelects() {
        const selects = ['articleSubject', 'filterSubject', 'studySubject'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            // Clear existing options (except first one for filters)
            if (selectId.includes('filter')) {
                // Keep the "all" option
            } else {
                select.innerHTML = '<option value="">Selecione...</option>';
            }
            
            this.biomedicineSubjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                select.appendChild(option);
            });
        });
    }

    // Data Management
    loadUserData() {
        const userData = localStorage.getItem('biometools_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('User data loaded:', this.currentUser);
            } catch (e) {
                console.error('Error loading user data:', e);
                this.currentUser = null;
            }
        }
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('biometools_user', JSON.stringify(this.currentUser));
            console.log('User data saved:', this.currentUser);
        }
    }

    logActivity(activity) {
        const activities = JSON.parse(localStorage.getItem('biometools_activities') || '[]');
        activities.unshift({
            activity,
            timestamp: new Date().toISOString(),
            user: this.currentUser?.name || 'Unknown'
        });
        
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.splice(50);
        }
        
        localStorage.setItem('biometools_activities', JSON.stringify(activities));
    }

    updateDashboard() {
        const activities = JSON.parse(localStorage.getItem('biometools_activities') || '[]');
        const articles = this.getArticles();
        
        // Update stats
        const toolsUsedElement = document.getElementById('toolsUsed');
        const articlesAddedElement = document.getElementById('articlesAdded');
        
        if (toolsUsedElement) {
            toolsUsedElement.textContent = activities.filter(a => 
                a.activity.includes('Tradução') || 
                a.activity.includes('Cálculo') || 
                a.activity.includes('Análise')
            ).length;
        }
        
        if (articlesAddedElement) {
            articlesAddedElement.textContent = articles.length;
        }
        
        // Update recent activity
        const recentContainer = document.getElementById('recentActivity');
        if (recentContainer) {
            if (activities.length === 0) {
                recentContainer.innerHTML = '<p>Bem-vindo ao BiomeTools! Comece explorando as ferramentas.</p>';
            } else {
                recentContainer.innerHTML = activities.slice(0, 5).map(activity => 
                    `<p style="margin-bottom: 8px; font-size: 14px;">
                        <strong>${activity.activity}</strong><br>
                        <small style="color: var(--color-text-secondary);">${new Date(activity.timestamp).toLocaleString('pt-BR')}</small>
                    </p>`
                ).join('');
            }
        }
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    downloadTextFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

// Global functions for HTML onclick handlers
window.switchTab = function(tabName) {
    if (window.app) {
        window.app.switchTab(tabName);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing BiomeTools...');
    window.app = new BiomeTools();
});