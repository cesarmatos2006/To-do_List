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

    const divBotoes = document.createElement("div");

    divBotoes.appendChild(btnConcluir);
    divBotoes.appendChild(btnDelete);

    li.appendChild(span);
    li.appendChild(divBotoes);
    lista.appendChild(li);
}

function adicionar() {
    const input = document.getElementById("tarefaInput");

    console.log(input.value);

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