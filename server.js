const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("database.db");

db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT,
    concluida INTEGER DEFAULT 0
    )
    `);

    app.post("/tarefas", (req,res) => {

        const texto = req.body.texto;

        db.run(
            "INSERT INTO tarefas (texto) VALUES(?)",
            [texto],
            function(err) {

                if (err) {
                    res.status(500).send("Erro ao salvar");
                } else {
                    res.json({id: this.lastID, texto, concluida:0});
                }
            }
        );
    });

    app.get("/tarefas", (req, res) => {

        db.all("SELECT * FROM tarefas", [], (err, rows) => {

            if (err) {
                res.status(500).send(err)
            } else {
                res.json(rows);
            }
        });
    });

    app.put("/tarefas/:id", (req, res) => {

        const id = req.params.id;
        const concluida = req.body.concluida ? 1 : 0;

        console.log("BODY:", req.body);
        console.log("ID:", id);
        console.log("STATUS:", concluida);

        db.run(
            "UPDATE tarefas SET concluida = ? WHERE id = ?",
            [concluida,id],
            function(err) {
                if (err) {
                    console.error("ERRO SQL:", err);
                    res.status(500).send(err);
                } else {
                    res.send("Atualizado");
                }
            }
        );
    });

    app.delete("/tarefas/:id", (req, res) => {

        const id = req.params.id;

        db.run(
            "DELETE FROM tarefas WHERE id = ?",
            [id],
            function(err) {
                if (err){
                    res.status(500).send(err);
                } else {
                    res.send("Deletado");
                }
            }
        );
    });

    app.listen(3000, () => {
        console.log("Servidor rodando em http://localhost:3000");
    });