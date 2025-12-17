const nome = document.getElementById('nome');
const email = document.getElementById('email');
const curso = document.getElementById('curso');
const rm = document.getElementById('rm');
const dataNascimento = document.getElementById('dataNascimento');
const lista = document.getElementById('lista');
const btnCadastrar = document.getElementById('btnCadastrar');
const btnAtualizar = document.getElementById('btnAtualizar');

let idAtual = null;

// Função para formatar data ISO para YYYY-MM-DD (exibição)
function formatarData(dataISO) {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// CADASTRAR
function cadastrar() {
    fetch('http://localhost:3000/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: nome.value,
            email: email.value,
            curso: curso.value,
            rm: rm.value,
            data_nascimento: dataNascimento.value
        })
    }).then(() => {
        limparCampos();
        listar();
    });
}

// LISTAR
function listar() {
    fetch('http://localhost:3000/alunos')
        .then(res => res.json())
        .then(dados => {
            lista.innerHTML = '';
            dados.forEach(a => {
                lista.innerHTML += `
<li>
    <div class="info">
        <p><strong>Nome:</strong> ${a.nome}</p>
        <p><strong>Email:</strong> ${a.email}</p>
        <p><strong>Curso:</strong> ${a.curso}</p>
        <p><strong>RM:</strong> ${a.rm}</p>
        <p><strong>Data de Nascimento:</strong> ${formatarData(a.data_nascimento)}</p>
    </div>
    <div class="acoes">
        <button class="atualizar" onclick="prepararAtualizar(${a.id})">Atualizar</button>
        <button class="deletar" onclick="deletar(${a.id})">Deletar</button>
    </div>
</li>
                `;
            });
        });
}

// PREPARAR ATUALIZAR (preenche o formulário para editar)
function prepararAtualizar(id) {
    fetch(`http://localhost:3000/alunos/${id}`)
        .then(res => res.json())
        .then(a => {
            nome.value = a.nome;
            email.value = a.email;
            curso.value = a.curso;
            rm.value = a.rm;
            // Formata para YYYY-MM-DD para o input type="date"
            dataNascimento.value = formatarData(a.data_nascimento);

            idAtual = id;
            btnCadastrar.style.display = 'none';
            btnAtualizar.style.display = 'block';
        });
}

// ATUALIZAR
function atualizar() {
    fetch(`http://localhost:3000/alunos/${idAtual}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: nome.value,
            email: email.value,
            curso: curso.value,
            rm: rm.value,
            data_nascimento: dataNascimento.value
        })
    }).then(() => {
        limparCampos();
        idAtual = null;
        btnCadastrar.style.display = 'block';
        btnAtualizar.style.display = 'none';
        listar();
    });
}

// DELETAR
function deletar(id) {
    if(confirm('Deseja realmente excluir este aluno?')) {
        fetch(`http://localhost:3000/alunos/${id}`, { method: 'DELETE' })
            .then(() => listar());
    }
}

// LIMPAR CAMPOS
function limparCampos() {
    nome.value = '';
    email.value = '';
    curso.value = '';
    rm.value = '';
    dataNascimento.value = '';
}

// EVENTOS
btnCadastrar.addEventListener('click', cadastrar);
btnAtualizar.addEventListener('click', atualizar);

// INICIALIZA LISTA
listar();
