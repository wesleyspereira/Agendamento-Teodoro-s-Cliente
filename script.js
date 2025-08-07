document.addEventListener("DOMContentLoaded", () => {
  const calendario = document.getElementById("calendario-mensal");
  const listaHorarios = document.getElementById("horarios-disponiveis");
  const tituloDia = document.getElementById("dia-selecionado");
  const mesAtualTexto = document.getElementById("mes-atual");

  const btnAnterior = document.getElementById("anterior");
  const btnProximo = document.getElementById("proximo");

  const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const horariosNormais = ["09:00", "09:30", "10:00", "10:30", "11:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
  const horariosExtendidos = [...horariosNormais, "18:00", "18:30", "19:00", "19:30", "20:00"];

  let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  let dataAtual = new Date();

  function gerarCalendario(ano, mes) {
    calendario.innerHTML = "";
    const hoje = new Date();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    const nomeMes = dataAtual.toLocaleString("pt-BR", { month: 'long' });
    mesAtualTexto.textContent = `${nomeMes.toUpperCase()} ${ano}`;

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes, dia);
      const diaSemana = data.getDay();
      const diaTexto = diasSemana[diaSemana];
      const dataStr = data.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' });

      if (["terca", "quarta", "quinta", "sexta", "sabado"].includes(diaTexto)) {
        const btn = document.createElement("button");
        btn.textContent = `${diaTexto}\n${dataStr}`;

        // Verifica se a data é no passado
        const isPassado = data.setHours(0,0,0,0) < hoje.setHours(0,0,0,0);
        if (isPassado) {
          btn.classList.add("dia-passado");
          btn.disabled = true;
        } else {
          btn.onclick = () => mostrarHorarios(diaTexto, dataStr);
        }

        calendario.appendChild(btn);
      }
    }
  }

  function mostrarHorarios(dia, data) {
    tituloDia.textContent = `⏰ Horários disponíveis para ${data}`;
    listaHorarios.innerHTML = "";

    document.querySelectorAll("#calendario-mensal button").forEach(btn => {
      btn.classList.remove("selecionado");
      if (btn.textContent.includes(data)) {
        btn.classList.add("selecionado");
      }
    });

    setTimeout(() => {
      listaHorarios.scrollIntoView({ behavior: "smooth" });
    }, 100);

    const horarios = (dia === "sexta" || dia === "sabado") ? horariosExtendidos : horariosNormais;

    horarios.forEach(h => {
      const agendamento = agendamentos.find(a => a.data === data && a.horario === h);
      const li = document.createElement("li");

      if (agendamento) {
        if (agendamento.nome !== "Bloqueado") {
          li.innerHTML = `<strong>${h}</strong> - 📌 Reservado`;
        } else {
          li.innerHTML = `${h} - ❌ Indisponível`;
        }
      } else {
        li.innerHTML = `<strong>${h}</strong> - ✅ Disponível 
          <button onclick="agendar('${data}', '${h}')" class="agendar">Agendar</button>`;
      }

      listaHorarios.appendChild(li);
    });
  }

  window.agendar = (data, horario) => {
    const nome = prompt("Digite seu nome completo:");
    const tel = prompt("Digite seu telefone:");

    if (!nome || !tel) {
      alert("⚠️ Nome e telefone são obrigatórios para agendar.");
      return;
    }

    const existe = agendamentos.find(a => a.data === data && a.horario === horario);
    if (existe) {
      alert(`Este horário já está reservado para:\nNome: ${existe.nome}\nTelefone: ${existe.telefone}`);
      return;
    }

    localStorage.setItem("cliente_nome", nome);
    localStorage.setItem("cliente_telefone", tel);

    agendamentos.push({
      id: Date.now(),
      nome,
      telefone: tel,
      data,
      horario,
      status: "pendente"
    });

    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    alert("✅ Agendamento realizado com sucesso!");
    gerarCalendario(dataAtual.getFullYear(), dataAtual.getMonth());
  };

  function saudacao() {
    const saudacaoEl = document.getElementById("saudacao");
    const agora = new Date();
    const hora = agora.getHours();
    let msg = "Olá";
    if (hora < 12) msg = "Bom dia";
    else if (hora < 18) msg = "Boa tarde";
    else msg = "Boa noite";

    saudacaoEl.textContent = `${msg} !`;
  }

  btnAnterior.onclick = () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    gerarCalendario(dataAtual.getFullYear(), dataAtual.getMonth());
  };

  btnProximo.onclick = () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    gerarCalendario(dataAtual.getFullYear(), dataAtual.getMonth());
  };

  saudacao();
  gerarCalendario(dataAtual.getFullYear(), dataAtual.getMonth());
});
