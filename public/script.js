const lista = document.getElementById("lista");

function carregar() {
    fetch("/tarefas")
    .then(res => res.json())
    .then(dados => {

        lista.innerHTML = "";

        dados.forEach(tarefa => {

            criarElemento(tarefa);

        });
    });
}

carregar();

function criarElemento(tarefa) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.innerText = tarefa.texto;

    if(tarefa.concluida){
        span.style.textDecoration="line-through";
    }

    const btnConcluir = document.createElement("button");
    btnConcluir.innerText="✔";

    btnConcluir.onclick = () => concluir(tarefa.id, !tarefa.concluida);

    const btnDelete = document.createElement("button");
    btnDelete.innerText="🗑";

    btnDelete.onclick = () => deletar(tarefa.id);

    const btnEditar = document.createElement("button");
    btnEditar.innerText="✏";

    btnEditar.onclick = () => {
        const novoTexto = prompt("Editar tarefa:", tarefa.texto);

        if(novoTexto) {
            btnEditar(tarefa.id, novoTexto);
        }
    };

    const divBotoes = document.createElement("div");

    divBotoes.appendChild(btnConcluir);
    divBotoes.appendChild(btnDelete);
    divBotoes.appendChild(btnEditar);

    li.appendChild(span);
    li.appendChild(divBotoes);
    lista.appendChild(li);
}

function adicionar() {
    const input = document.getElementById("tarefaInput");

    if(input.value.trim() === ""){
        alert("Digite uma tarefa!");
        return;
    }

    fetch("/tarefas", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            texto:input.value
        })
    })
    .then(() => {
        input.value="";
        carregar();
    });
}

function concluir(id, status) {
    fetch("/tarefas/" + id, {
        method: "PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            concluida:status
        })
    })

    .then(() => carregar());
}

function deletar(id) {
    fetch("/tarefas/" + id, {
        method: "DELETE"
    })
    .then(() => carregar());
}

function editar(id, texto) {
    fetch("/tarefas/" + id, {
        method: "PUT",
        headers: {
            "Content-Type":"aplicattion/json"
        },
        body: JSON.stringify({
            texto: texto
        })
    })
    .then(() => carregar());
}