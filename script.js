document.addEventListener("DOMContentLoaded", () => {
  const calendario = document.getElementById("calendario-mensal");
  const listaHorarios = document.getElementById("horarios-disponiveis");
  const tituloDia = document.getElementById("dia-selecionado");

  const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const horariosNormais = ["09:00", "09:30", "10:00", "10:30", "11:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
  const horariosExtendidos = [...horariosNormais, "18:00", "18:30", "19:00", "19:30", "20:00"];

  let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

  function gerarCalendario() {
    calendario.innerHTML = "";
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes, dia);
      const diaSemana = data.getDay();
      const diaTexto = diasSemana[diaSemana];
      if (["terca", "quarta", "quinta", "sexta", "sabado"].includes(diaTexto)) {
        const btn = document.createElement("button");
        const dataStr = data.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' });
        btn.textContent = `${diaTexto}\n${dataStr}`;
        btn.onclick = () => mostrarHorarios(diaTexto, dataStr);
        calendario.appendChild(btn);
      }
    }
  }

  function mostrarHorarios(dia, data) {
    tituloDia.textContent = `⏰Horários disponíveis para ${data}`;
    listaHorarios.innerHTML = "";

    const horarios = (dia === "sexta" || dia === "sabado") ? horariosExtendidos : horariosNormais;

    horarios.forEach(h => {
      const agendamento = agendamentos.find(a => a.data === data && a.horario === h);
      const li = document.createElement("li");

      if (agendamento) {
        if (agendamento.nome !== "Bloqueado") {
          li.innerHTML = `<strong>${h}</strong> - 📌Reservado `;
        } else {
          li.textContent = `${h} -  ❌Indisponível`;
        }
      } else {
        li.innerHTML = `<strong>${h}</strong> - ✅Disponível 
          <button onclick="agendar('${data}', '${h}')" class="agendar">Agendar</button>`;
      }

      listaHorarios.appendChild(li);
    });
  }

  window.agendar = (data, horario) => {
    // Sempre solicitar nome e telefone
    const nome = prompt("Digite seu nome completo:");
    const tel = prompt("Digite seu telefone:");

    if (!nome || !tel) {
      alert("⚠️ Nome e telefone são obrigatórios para agendar.");
      return;
    }

    // Verificar se o horário já está reservado
    const existe = agendamentos.find(a => a.data === data && a.horario === horario);
    if (existe) {
      alert(`Este horário já está reservado para:\nNome: ${existe.nome}\nTelefone: ${existe.telefone}`);
      return;
    }

    // Salvar dados no localStorage para reutilizar depois
    localStorage.setItem("cliente_nome", nome);
    localStorage.setItem("cliente_telefone", tel);

    // Criar agendamento
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
    gerarCalendario();
  };

  function saudacao() {
    const saudacaoEl = document.getElementById("saudacao");
    const agora = new Date();
    const hora = agora.getHours();
    let msg = "Olá";
    if (hora < 12) msg = "Bom dia";
    else if (hora < 18) msg = "Boa tarde";
    else msg = "Boa noite";

    const dias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    const diaSemana = dias[agora.getDay()];
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();

    saudacaoEl.textContent = `${msg} ! `;
  }

  saudacao();
  gerarCalendario();
});
