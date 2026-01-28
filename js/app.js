// js/app.js

let tarefas = [];

// Carregar tarefas do localStorage
function carregarTarefas() {
    const salvas = localStorage.getItem('tarefas');
    if (salvas) {
        tarefas = JSON.parse(salvas);
        atualizarLista();
    }
}

// Salvar tarefas
function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    atualizarContador();
}

// Adicionar nova tarefa
function adicionarTarefa() {
    const input = document.getElementById('novaTarefa');
    const texto = input.value.trim();
    
    if (!texto) {
        alert('Por favor, digite uma tarefa!');
        input.focus();
        return;
    }
    
    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        completa: false,
        data: new Date().toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    tarefas.push(novaTarefa);
    salvarTarefas();
    atualizarLista();
    
    input.value = '';
    input.focus();
}

// Criar elemento HTML
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.className = `tarefa ${tarefa.completa ? 'completa' : ''}`;
    li.id = `tarefa-${tarefa.id}`;
    
    li.innerHTML = `
        <span>${tarefa.completa ? '✅ ' : ''}${tarefa.texto}</span>
        <small>${tarefa.data}</small>
        <div>
            <button onclick="editarTarefa(${tarefa.id})">✏️ Editar</button>
            <button onclick="removerTarefa(${tarefa.id})">❌ Remover</button>
            <button onclick="toggleCompleta(${tarefa.id})">
                ${tarefa.completa ? '↩️ Desfazer' : '✓ Concluir'}
            </button>
        </div>
    `;
    
    return li;
}

// Atualizar lista
function atualizarLista() {
    const lista = document.getElementById('listaTarefas');
    lista.innerHTML = '';
    
    tarefas.forEach(tarefa => {
        lista.appendChild(criarElementoTarefa(tarefa));
    });
}

// Editar tarefa
function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;
    
    const novoTexto = prompt('Editar tarefa:', tarefa.texto);
    if (novoTexto && novoTexto.trim()) {
        tarefa.texto = novoTexto.trim();
        salvarTarefas();
        atualizarLista();
    }
}

// Remover tarefa
function removerTarefa(id) {
    if (!confirm('Tem certeza que deseja remover esta tarefa?')) return;
    
    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas();
    atualizarLista();
}

// Marcar/desmarcar como concluída
function toggleCompleta(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.completa = !tarefa.completa;
        salvarTarefas();
        atualizarLista();
    }
}

// Atualizar contador
function atualizarContador() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.completa).length;
    const pendentes = total - concluidas;
    
    document.getElementById('total').textContent = total;
    document.getElementById('concluidas').textContent = concluidas;
    document.getElementById('pendentes').textContent = pendentes;
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    carregarTarefas();
    atualizarContador();
    
    // Evento do botão
    document.getElementById('btnAdicionar').addEventListener('click', adicionarTarefa);
    
    // Evento da tecla Enter
    document.getElementById('novaTarefa').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') adicionarTarefa();
    });
    
    // Focar no input ao carregar
    document.getElementById('novaTarefa').focus();
});