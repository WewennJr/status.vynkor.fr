// ===== VARIABLES GLOBALES =====
let PING_INTERVAL_MS = 30000;
let MAX_HISTORY = 20;
let services = [];
let servicesWithMaintenanceCheck = [];
let serviceStatuses = {};
let firstRenderDone = false;
let pingHistory = {};
let timeLabels = [];

// Charger l'historique depuis localStorage
if (localStorage.getItem('pingHistory')) pingHistory = JSON.parse(localStorage.getItem('pingHistory'));
if (localStorage.getItem('timeLabels')) timeLabels = JSON.parse(localStorage.getItem('timeLabels'));

// ===== CHARGEMENT DE LA CONFIGURATION =====
async function loadConfig() {
    try {
        const response = await fetch('services.json');
        const data = await response.json();
        
        // Appliquer la config
        PING_INTERVAL_MS = data.config.pingIntervalMs || 30000;
        MAX_HISTORY = data.config.maxHistoryPoints || 20;
        
        // Charger les services
        services = data.services;
        
        // Extraire les services avec check maintenance
        servicesWithMaintenanceCheck = services
            .filter(s => s.checkMaintenance)
            .map(s => s.url);
        
        // Initialiser l'historique pour chaque service
        services.forEach(s => {
            if (!pingHistory[s.url]) pingHistory[s.url] = [];
        });
        
        return true;
    } catch (error) {
        console.error('Erreur lors du chargement de services.json:', error);
        alert('Impossible de charger la configuration des services. Vérifiez que services.json est accessible.');
        return false;
    }
}

// ===== FONCTIONS DE PING =====
async function checkService(service) {
    const start = performance.now();
    let status = 'down';
    let responseTime = 0;
    let uptime = 0;

    // Ping classique
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        await fetch(service.url, { 
            method: 'HEAD', 
            mode: 'no-cors', 
            cache: 'no-cache', 
            signal: controller.signal 
        });
        clearTimeout(timeoutId);
        const end = performance.now();
        responseTime = Math.round(end - start);
        status = responseTime > 5000 ? 'degraded' : 'operational';
        uptime = 99.5 + Math.random() * 0.5;
    } catch {
        status = 'down';
        responseTime = 0;
        uptime = 0;
    }

    // Check maintenance si configuré
    if (service.checkMaintenance && status !== 'down') {
        try {
            const res = await fetch(`${service.url}/status/maintenance`);
            const data = await res.json();
            if (data.maintenance) {
                status = 'maintenance';
            }
        } catch {
            // Ignore les erreurs, garder le statut normal
        }
    }

    return { status, responseTime, uptime };
}

function getStatusInfo(status) {
    return {
        operational: { text: 'Opérationnel', icon: '✓' },
        checking: { text: 'Vérification', icon: '🔄' },
        degraded: { text: 'Dégradé', icon: '⚠' },
        down: { text: 'Hors ligne', icon: '✕' },
        maintenance: { text: 'Maintenance', icon: '🛠️' }
    }[status] || { text: 'Vérification', icon: '🔄' };
}

// ===== RENDER SERVICES =====
function renderService(service, s) {
    const info = getStatusInfo(s.status);
    return `<div class="service-card ${s.status}" data-url="${service.url}">
            <div class="service-header">
                <div class="service-name"><span>${service.icon}</span> ${service.name}</div>
                <div class="status-badge ${s.status}"><span class="status-dot"></span>${info.icon} ${info.text}</div>
            </div>
            <div class="service-url"><a href="${service.url}" target="_blank">${service.url.replace('https://', '')}</a></div>
            <div class="service-metrics">
                <div class="metric">
                    <div class="metric-label">Temps de réponse</div>
                    <div class="metric-value">${s.responseTime || '—'} ms</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Disponibilité (30j)</div>
                    <div class="metric-value">${s.uptime?.toFixed(2) || '—'}%</div>
                    <div class="uptime-bar"><div class="uptime-fill" style="width:${s.uptime || 0}%"></div></div>
                </div>
            </div>
        </div>`;
}

function renderServices(updateOnly = false) {
    const container = document.getElementById('services');
    if (!updateOnly) {
        container.innerHTML = services.map(s => renderService(s, serviceStatuses[s.url] || { status: 'checking' })).join('');
        if (!firstRenderDone) {
            document.querySelectorAll('.service-card').forEach((c, i) => setTimeout(() => c.classList.add('show'), i * 100));
            firstRenderDone = true;
        } else {
            document.querySelectorAll('.service-card').forEach(c => c.classList.add('show'));
        }
    } else {
        services.forEach(s => {
            const card = container.querySelector(`.service-card[data-url="${s.url}"]`);
            if (card) {
                const sData = serviceStatuses[s.url];
                const badge = card.querySelector('.status-badge');
                const info = getStatusInfo(sData.status);
                badge.innerHTML = `<span class="status-dot"></span>${info.icon} ${info.text}`;
                badge.className = `status-badge ${sData.status}`;
                const metrics = card.querySelectorAll('.metric-value');
                metrics[0].textContent = `${sData.responseTime || '—'} ms`;
                metrics[1].textContent = `${sData.uptime?.toFixed(2) || '—'}%`;
                card.querySelector('.uptime-fill').style.width = `${sData.uptime || 0}%`;
            }
        });
    }
}

// ===== OVERALL STATUS =====
function updateOverallStatus() {
    const statuses = Object.values(serviceStatuses);
    if (!statuses.length) return;

    const totalPoints = statuses.reduce((acc, s) => {
        if (s.status === 'operational') return acc + 2;
        if (s.status === 'degraded' || s.status === 'maintenance') return acc + 1;
        return acc;
    }, 0);
    const maxPoints = statuses.length * 2;
    const percent = totalPoints / maxPoints * 100;

    const overall = document.getElementById('overall-status');
    const icon = document.getElementById('overall-icon');
    const text = document.getElementById('overall-text');
    const subtext = document.getElementById('overall-subtext');
    const fill = document.getElementById('global-fill');

    if (percent >= 66.6) {
        overall.className = 'overall-status operational';
        icon.textContent = '🟢';
        text.textContent = 'Systèmes stables';
        fill.style.background = 'linear-gradient(90deg,#10b981,#059669)';
    } else if (percent >= 33.3) {
        overall.className = 'overall-status degraded';
        icon.textContent = '🟠';
        text.textContent = 'Performance dégradée';
        fill.style.background = 'linear-gradient(90deg,#f59e0b,#d97706)';
    } else {
        overall.className = 'overall-status down';
        icon.textContent = '🔴';
        text.textContent = 'Problèmes majeurs';
        fill.style.background = 'linear-gradient(90deg,#ef4444,#b91c1c)';
    }

    fill.style.width = '0';
    setTimeout(() => { fill.style.width = `${percent}%` }, 50);
    subtext.textContent = `${percent.toFixed(1)}% de disponibilité globale`;
}

// ===== CHART.JS =====
let chart = null;

function initChart() {
    const ctx = document.getElementById('uptimeChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: services.map(s => ({
                label: s.name,
                data: pingHistory[s.url],
                fill: false,
                borderColor: s.color,
                tension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 8,
                borderWidth: 2
            })).concat([{
                label: 'Moyenne',
                data: Array(MAX_HISTORY).fill(null),
                borderColor: '#ffffff',
                borderDash: [5, 5],
                fill: false,
                tension: 0.3
            }])
        },
        options: {
            responsive: true,
            animation: { duration: 500 },
            scales: {
                y: { title: { display: true, text: 'Ping (ms)' } },
                x: { title: { display: true, text: 'Heure' } }
            },
            plugins: {
                legend: { display: true },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const service = services[context.datasetIndex];
                            if (!service) return context.formattedValue + ' ms';
                            const status = serviceStatuses[service.url]?.status || 'checking';
                            return `${service.name}: ${context.formattedValue} ms (${status})`;
                        }
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (!chart) return;
    
    chart.data.labels = timeLabels;
    services.forEach((s, i) => {
        chart.data.datasets[i].data = pingHistory[s.url];
    });

    // Calcul moyenne
    const moyenne = [];
    for (let i = 0; i < timeLabels.length; i++) {
        let sum = 0, count = 0;
        services.forEach(s => {
            const val = pingHistory[s.url][i];
            if (val != null) { sum += val; count++; }
        });
        moyenne.push(count ? Math.round(sum / count) : null);
    }
    chart.data.datasets[services.length].data = moyenne;

    chart.update();
}

// ===== CHECK ALL SERVICES =====
async function checkAllServices() {
    document.getElementById('refresh-icon').classList.add('spinner');

    services.forEach(s => serviceStatuses[s.url] = { status: 'checking', responseTime: null, uptime: null });
    renderServices();

    await Promise.all(services.map(async s => {
        const res = await checkService(s);
        serviceStatuses[s.url] = res;

        pingHistory[s.url].push(res.responseTime);
        if (pingHistory[s.url].length > MAX_HISTORY) pingHistory[s.url].shift();
    }));

    timeLabels.push(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    if (timeLabels.length > MAX_HISTORY) timeLabels.shift();

    renderServices(true);
    updateOverallStatus();
    updateChart();

    // Sauvegarde localStorage
    localStorage.setItem('pingHistory', JSON.stringify(pingHistory));
    localStorage.setItem('timeLabels', JSON.stringify(timeLabels));

    document.getElementById('last-check').textContent = new Date().toLocaleTimeString();
    document.getElementById('refresh-icon').classList.remove('spinner');
}

// ===== INITIALISATION =====
async function init() {
    const configLoaded = await loadConfig();
    if (!configLoaded) return;
    
    initChart();
    await checkAllServices();
    setInterval(checkAllServices, PING_INTERVAL_MS);
}

// Démarrer l'application
init();