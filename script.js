
let usuarioActual = null;
let balance = 10000;
let operaciones = [];
let historial = [];

// Simulación de precios en tiempo real con Binance API
async function obtenerPrecios() {
  const response = await fetch("https://api.binance.com/api/v3/ticker/price");
  const data = await response.json();
  const top = data.slice(0, 10); // 10 primeras criptos
  const preciosHTML = top.map(d => \`<p><strong>\${d.symbol}:</strong> \$\${parseFloat(d.price).toFixed(2)}</p>\`).join("");
  document.getElementById("precios").innerHTML = "<h3>Precios en tiempo real</h3>" + preciosHTML;
}

function login() {
  const nombre = document.getElementById("usuario").value.trim();
  if (!nombre) return alert("Ingresa un usuario");
  usuarioActual = nombre;
  document.getElementById("login").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("nombreUsuario").textContent = usuarioActual;
  actualizarBalance();
}

function actualizarBalance() {
  document.getElementById("balance").textContent = balance.toFixed(2);
}

function abrirOperacion() {
  const simbolo = prompt("¿Qué cripto deseas comprar? (Ej: BTCUSDT)");
  const monto = parseFloat(prompt("¿Cuánto deseas invertir?"));
  if (!simbolo || isNaN(monto) || monto > balance) return alert("Datos inválidos o saldo insuficiente");
  balance -= monto;
  operaciones.push({ simbolo, monto });
  actualizarBalance();
  renderizarOperaciones();
}

function cerrarOperacion(i) {
  const op = operaciones[i];
  const ganancia = op.monto * (Math.random() * 0.2 - 0.1); // +/- 10%
  balance += op.monto + ganancia;
  historial.push({ ...op, ganancia });
  operaciones.splice(i, 1);
  actualizarBalance();
  renderizarOperaciones();
}

function retirarFondos() {
  const cantidad = parseFloat(prompt("¿Cuánto deseas retirar?"));
  if (isNaN(cantidad) || cantidad > balance) return alert("Cantidad inválida");
  balance -= cantidad;
  alert(\`Retiro de \$\${cantidad} exitoso a billetera Binance.\`);
  actualizarBalance();
}

function renderizarOperaciones() {
  const contenedor = document.getElementById("operacionesAbiertas");
  contenedor.innerHTML = "<h3>Operaciones Abiertas</h3>";
  operaciones.forEach((op, i) => {
    const div = document.createElement("div");
    div.innerHTML = \`\${op.simbolo} - \$\${op.monto.toFixed(2)} <button onclick="cerrarOperacion(\${i})">Cerrar</button>\`;
    contenedor.appendChild(div);
  });
}

function mostrarHistorial() {
  const cont = document.getElementById("historial");
  cont.classList.toggle("hidden");
  if (!cont.classList.contains("hidden")) {
    cont.innerHTML = "<h3>Historial</h3>" + historial.map(op => \`\${op.simbolo}: \$\${op.monto.toFixed(2)} → Ganancia: \$\${op.ganancia.toFixed(2)}\`).join("<br>");
  }
}

function goHome() {
  location.href = "/";
}

obtenerPrecios();
setInterval(obtenerPrecios, 15000); // cada 15 segundos
