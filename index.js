/* Mapeamento de Campos e Elementos */
const fields = {
    S: document.getElementById('swot-s'),
    W: document.getElementById('swot-w'),
    O: document.getElementById('swot-o'),
    T: document.getElementById('swot-t')
};

const elements = {
    statTotal: document.getElementById('stat-total'),
    statS: document.getElementById('stat-s'),
    statW: document.getElementById('stat-w'),
    statO: document.getElementById('stat-o'),
    statT: document.getElementById('stat-t'),
    itemCounter: document.getElementById('item-counter'),
    historicoList: document.getElementById('historico-list'),
    btnSalvar: document.getElementById('btn-salvar'),
    btnLimpar: document.getElementById('btn-limpar'),
    btnExportPdf: document.getElementById('btn-export-pdf'),
    btnTema: document.getElementById('btn-tema'), // Adicionado para o Modo Claro/Escuro
    presetLoader: document.getElementById('preset-loader')
};

/* Presets Estratégicos Robustos */
const PRESETS = {
    startup: {
        S: "• Equipe de engenharia sênior\n• Tecnologia de IA proprietária\n• Baixo custo operacional inicial",
        W: "• Dependência de investidores anjo\n• Marca desconhecida no mercado B2B\n• Ciclo de vendas muito longo",
        O: "• Crescimento do setor de automação\n• Possível parceria com a Microsoft\n• Expansão para o mercado latino",
        T: "• Gigantes tech lançando recursos similares\n• Mudanças na LGPD\n• Instabilidade na taxa de juros"
    },
    cafe: {
        S: "• Grãos premiados de origem única\n• Localização com alto fluxo de pedestres\n• Ambiente propício para coworking",
        W: "• Espaço físico limitado (poucas mesas)\n• Alta rotatividade de funcionários\n• Preço final acima da média local",
        O: "• Lançamento de programa de assinatura\n• Expansão para delivery de brunch\n• Venda de grãos moídos para casa",
        T: "• Aumento do custo do leite e café\n• Nova franquia Starbucks a 100m\n• Queda no poder de compra da vizinhança"
    },
    freelancer: {
        S: "• Portfólio com grandes marcas internacionais\n• Domínio de stack moderna (Next.js/TS)\n• Entrega rápida e comunicação fluida",
        W: "• Falta de rotina de prospecção ativa\n• Nenhuma rede de backup para emergências\n• Mix de finanças pessoais e PJ",
        O: "• Escassez de especialistas em IA generativa\n• Criação de infoproduto (curso de dev)\n• Migração para contratos fixos (retainer)",
        T: "• IA automatizando tarefas de frontend\n• Saturação de devs juniores (guerra de preços)\n• Instabilidade econômica global"
    }
};

/* Funções de Interface */
function updateUI() {
    const data = {};
    for (const key in fields) {
        data[key] = fields[key].value.split('\n').filter(line => line.trim() !== '').length;
    }

    const total = data.S + data.W + data.O + data.T;
    
    elements.statS.textContent = data.S;
    elements.statW.textContent = data.W;
    elements.statO.textContent = data.O;
    elements.statT.textContent = data.T;
    elements.statTotal.textContent = total;
    elements.itemCounter.textContent = `${total} Itens Totais`;
}

/* Gestão de Tema (Modo Claro/Escuro) */
function toggleTema() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('swot_theme', isLight ? 'light' : 'dark');
}

function carregarTemaSalvo() {
    const temaSalvo = localStorage.getItem('swot_theme');
    if (temaSalvo === 'light') {
        document.body.classList.add('light-mode');
    }
}

/* Gestão de Histórico */
function salvar() {
    const total = elements.statTotal.textContent;
    if (total === "0" || total === "0 Itens Totais") {
        return alert("A matriz está vazia! Adicione alguns pontos antes de salvar.");
    }
    
    const version = {
        time: new Date().toLocaleTimeString('pt-BR'),
        date: new Date().toLocaleDateString('pt-BR'),
        total: total
    };

    let history = JSON.parse(localStorage.getItem('swot_history')) || [];
    history.unshift(version);
    localStorage.setItem('swot_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('swot_history')) || [];
    elements.historicoList.innerHTML = history.map(h => 
        `<li><strong>[${h.date} - ${h.time}]</strong><br>Salvo com ${h.total}</li>`
    ).join('') || "<li>Nenhuma versão salva localmente.</li>";
}

/* Event Listeners */

// Atualização em tempo real
Object.values(fields).forEach(f => f.addEventListener('input', updateUI));

// Botão Salvar
elements.btnSalvar.addEventListener('click', salvar);

// Botão Tema
elements.btnTema.addEventListener('click', toggleTema);

// Botão Limpar
elements.btnLimpar.addEventListener('click', () => {
    if(confirm("Deseja apagar permanentemente todos os campos desta matriz?")) {
        Object.values(fields).forEach(f => f.value = '');
        updateUI();
    }
});

// Exportar PDF
elements.btnExportPdf.addEventListener('click', () => {
    window.print();
});

// Carregar Exemplos
elements.presetLoader.addEventListener('change', (e) => {
    const p = PRESETS[e.target.value];
    if(p) {
        fields.S.value = p.S;
        fields.W.value = p.W;
        fields.O.value = p.O;
        fields.T.value = p.T;
        updateUI();
    }
    e.target.value = ''; 
});

/* Inicialização */
document.addEventListener('DOMContentLoaded', () => {
    carregarTemaSalvo();
    renderHistory();
    updateUI();
});