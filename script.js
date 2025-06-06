async function initServerData(serverIp, serverPort) {
  const serverIpElement = document.getElementById('server-ip');
  // Opcional: Mostrar la IP en la página si lo deseas
  // serverIpElement.innerHTML = serverIp;

  const serverStatusUrl = `https://mcapi.us/server/status?ip=${serverIp}&port=${serverPort}`;
  console.log(serverStatusUrl);

  try {
    const response = await fetch(serverStatusUrl);
    if (!response.ok) {
      throw new Error('No se pudo conectar con la API del servidor');
    }
    const data = await response.json();
    handleServerStatus(data);
  } catch (error) {
    const serverError = document.getElementById('rest');
    serverError.innerHTML = "Error de conexión o de API";
    console.error(error);
  }

  function handleServerStatus(data) {
    const serverMessage = document.getElementById('rest');
    if (data.status === 'error') {
      console.log(data.error);
      serverMessage.innerHTML = "El servidor está Offline";
      return;
    }

    // Validar favicon
    const logo = document.getElementById("favicon");
    if (data.favicon) {
      logo.src = data.favicon;
    } else {
      logo.src = ""; // O una imagen por defecto
    }

    // Validar datos antes de mostrar
    const jugadores = data.players && data.players.now !== undefined ? data.players.now : 'Desconocido';
    const motd = data.motd || 'Sin MOTD';

    serverMessage.innerHTML = `
      <b>IP del Servidor:</b> ${serverIp}<br>
      <b>Puerto:</b> ${serverPort}<br>
      <b>Jugadores Conectados:</b> ${jugadores}<br>
      <b>MOTD:</b> ${motd}
    `;
  }
}

// Puedes cambiar estos valores o pedirlos al usuario por un formulario
initServerData("play.krzz.eu.org", "25566");
