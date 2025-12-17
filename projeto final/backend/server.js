const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // seu usuário
    password: '1234', // sua senha
    database: 'escola'
});

db.connect(err => {
    if(err) {
        console.error('Erro ao conectar ao MySQL:', err);
    } else {
        console.log('Conectado ao MySQL!');
    }
});

// ROTAS

// Listar todos os alunos
app.get('/alunos', (req, res) => {
    db.query('SELECT * FROM alunos', (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results);
    });
});

// Buscar aluno por id
app.get('/alunos/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM alunos WHERE id = ?', [id], (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results[0]);
    });
});

// Cadastrar aluno
app.post('/alunos', (req, res) => {
    const { nome, email, curso, rm, dataNascimento } = req.body;
    db.query(
        'INSERT INTO alunos (nome, email, curso, rm, data_nascimento) VALUES (?, ?, ?, ?, ?)',
        [nome, email, curso, rm, dataNascimento],
        (err, results) => {
            if(err) return res.status(500).send(err);
            res.json({ id: results.insertId, nome, email, curso, rm, dataNascimento });
        }
    );
});

// Atualizar aluno
app.put('/alunos/:id', (req, res) => {
    const id = req.params.id;
    const { nome, email, curso, rm, dataNascimento } = req.body;
    db.query(
        'UPDATE alunos SET nome=?, email=?, curso=?, rm=?, data_nascimento=? WHERE id=?',
        [nome, email, curso, rm, dataNascimento, id],
        (err) => {
            if(err) return res.status(500).send(err);
            res.json({ id, nome, email, curso, rm, dataNascimento });
        }
    );
});

// Deletar aluno
app.delete('/alunos/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM alunos WHERE id=?', [id], (err) => {
        if(err) return res.status(500).send(err);
        res.json({ message: 'Aluno deletado!' });
    });
});

// Rodar servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
