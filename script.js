
let usuario = null;
let balance = 10000;
let operaciones = [];
let historial = [];

async function obtenerPrecios() {
  const r = await fetch("https://api.binance.com/api/v3/ticker/price");
  const d = await r.json();
  const top = d.slice(0, 10);
  const contenedor = document.getElementById("crypto-prices");
  contenedor.innerHTML = "<h3>Precios Cripto</h3>";
  top.forEach(c => {
    const p = parseFloat(c.price).toFixed(2);
    contenedor.innerHTML += `<div><strong>${c.symbol}</strong>: $${p}</div>`;
  });
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (!user || !pass) return alert("Completa ambos campos");
  usuario = user;
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("user-info").innerText = `Bienvenido, ${usuario}`;
  actualizarBalance();
  obtenerPrecios();
}

function actualizarBalance() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function abrirOperacion() {
  const simbolo = prompt("Cripto (ej. BTCUSDT):");
  const monto = parseFloat(prompt("Monto a invertir:"));
  if (!simbolo || isNaN(monto) || monto > balance) return alert("Datos inválidos");
  balance -= monto;
  operaciones.push({ simbolo, monto });
  actualizarBalance();
  mostrarOperaciones();
}

function mostrarOperaciones() {
  const div = document.getElementById("operaciones-abiertas");
  div.innerHTML = "<h4>Operaciones Abiertas</h4>";
  operaciones.forEach((op, i) => {
    const el = document.createElement("div");
    el.innerHTML = `${op.simbolo} - $${op.monto.toFixed(2)} <button onclick="cerrarOperacion(${i})">Cerrar</button>`;
    div.appendChild(el);
  });
}

function cerrarOperacion(i) {
  const op = operaciones[i];
  const resultado = op.monto * (Math.random() * 0.2 - 0.1);
  balance += op.monto + resultado;
  historial.push({ ...op, ganancia: resultado });
  operaciones.splice(i, 1);
  actualizarBalance();
  mostrarOperaciones();
}

function retirarFondos() {
  const cant = parseFloat(prompt("Cantidad a retirar:"));
  if (isNaN(cant) || cant > balance) return alert("Fondos insuficientes");
  balance -= cant;
  alert(`Retirado $${cant} a Binance.`);
  actualizarBalance();
}

function toggleHistorial() {
  const div = document.getElementById("historial");
  div.classList.toggle("hidden");
  if (!div.classList.contains("hidden")) {
    div.innerHTML = "<h4>Historial</h4>";
    historial.forEach(h => {
      div.innerHTML += `<div>${h.symbol} - $${h.monto.toFixed(2)} → Ganancia: $${h.ganancia.toFixed(2)}</div>`;
    });
  }
}

document.getElementById("logo").onclick = () => location.href = "/";
