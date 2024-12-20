class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] === null || this[i] === undefined || this[i] === "") {
        return false;
      } else if (
        (this.mes === "2" && this.dia > 29) ||
        ((this.mes === "4" ||
          this.mes === "6" ||
          this.mes === "9" ||
          this.mes === "11") &&
          this.dia > 30) ||
        ((this.mes === "1" ||
          this.mes === "3" ||
          this.mes === "5" ||
          this.mes === "7" ||
          this.mes === "8" ||
          this.mes === "10" ||
          this.mes === "12") &&
          this.dia > 31) ||
        this.dia < 1
      ) {
        return "data";
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoID() {
    let proximoID = localStorage.getItem("id");
    return parseInt(proximoID) + 1;
  }

  gravar(d) {
    let id = this.getProximoID();

    localStorage.setItem(id, JSON.stringify(d));

    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    let despesas = [];
    let id = localStorage.getItem("id");
    for (let index = 1; index <= id; index++) {
      let despesa = JSON.parse(localStorage.getItem(index));
      if (despesa === null) {
        continue;
      }
      despesa.id = index;
      despesas.push(despesa);
    }
    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = [];
    despesasFiltradas = this.recuperarTodosRegistros();

    if (despesa.ano != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
    }

    if (despesa.mes != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
    }

    if (despesa.dia != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
    }

    if (despesa.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.tipo == despesa.tipo
      );
    }

    if (despesa.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }

    if (despesa.valor != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.valor == despesa.valor
      );
    }

    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new Bd();

function cadastrarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    Math.floor(dia.value),
    tipo.value,
    descricao.value,
    valor.value
  );

  if (despesa.validarDados() === true) {
    bd.gravar(despesa);
    document.getElementById("modalHeader").classList.remove("text-danger");
    document.getElementById("buttonModal").classList.remove("btn-danger");
    document.getElementById("modalHeader").classList.add("text-success");
    document.getElementById("buttonModal").classList.add("btn-success");
    document.getElementById("exampleModalLabel").textContent =
      "Registro inserido com sucesso";
    document.getElementById("modalBody").textContent =
      "Despesa cadastrada com sucesso!";
    document.getElementById("buttonModal").textContent = "Voltar";
    $("#modalRegistraDespesa").modal("show");

    ano.value = "";
    mes.value = "";
    dia.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";
  } else if (despesa.validarDados() === "data") {
    document.getElementById("modalHeader").classList.remove("text-success");
    document.getElementById("buttonModal").classList.remove("btn-success");
    document.getElementById("modalHeader").classList.add("text-danger");
    document.getElementById("buttonModal").classList.add("btn-danger");
    document.getElementById("exampleModalLabel").textContent =
      "Erro na gravação";
    document.getElementById("modalBody").textContent =
      "Verifique se a data informada é valida e tente novamente.";
    document.getElementById("buttonModal").textContent = "Voltar e Corrigir";
    $("#modalRegistraDespesa").modal("show");
  } else {
    document.getElementById("modalHeader").classList.remove("text-success");
    document.getElementById("buttonModal").classList.remove("btn-success");
    document.getElementById("modalHeader").classList.add("text-danger");
    document.getElementById("buttonModal").classList.add("btn-danger");
    document.getElementById("exampleModalLabel").textContent =
      "Erro na gravação";
    document.getElementById("modalBody").textContent =
      "Existem campos obrigatórios que não foram preenchidos.";
    document.getElementById("buttonModal").textContent = "Voltar e Corrigir";
    $("#modalRegistraDespesa").modal("show");
  }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros();
  }
  let listaDespesas = document.getElementById("lista_despesas");
  listaDespesas.innerHTML = "";

  despesas.forEach(function (d) {
    let linha = listaDespesas.insertRow();
    switch (d.tipo) {
      case "1":
        d.tipo = "Alimentação";
        break;
      case "2":
        d.tipo = "Educação";
        break;
      case "3":
        d.tipo = "Lazer";
        break;
      case "4":
        d.tipo = "Saúde";
        break;
      case "5":
        d.tipo = "Transporte";
        break;
    }
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = `R$${parseFloat(d.valor).toFixed(2)}`;

    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function () {
      document
        .getElementById("modalApagaDespesaModalHeader")
        .classList.remove("text-success");
      document
        .getElementById("modalApagaDespesaButtonModal")
        .classList.remove("btn-success");
      document
        .getElementById("modalApagaDespesaModalHeader")
        .classList.add("text-danger");
      document
        .getElementById("modalApagaDespesaButtonModal")
        .classList.add("btn-danger");
      document.getElementById(
        "modalApagaDespesaExampleModalLabel"
      ).textContent = "Excluir Item";
      document.getElementById("modalApagaDespesaModalBody").textContent =
        "Você tem certeza que deseja excluir este item?";
      document.getElementById("modalApagaDespesaButtonModal").textContent =
        "Excluir";
      $("#modalApagaDespesa").modal("show");
      document.getElementById("modalApagaDespesaButtonModal").onclick =
        function () {
          let id = btn.id.replace("id_despesa_", "");
          bd.remover(id);
          window.location.reload();
        };
    };
    linha.insertCell(4).append(btn);
  });
}

function pesquisarDespesas() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let despesas = bd.pesquisar(despesa);

  carregaListaDespesas(despesas, true);
}
