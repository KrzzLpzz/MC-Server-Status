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

  // Función para convertir motd_json a HTML con formato y colores
  function motdJsonToHtml(motdJson) {
    if (!motdJson || !motdJson.extra) return '';
    // Mapear colores de Minecraft a CSS
    const colorMap = {
      black: '#000000',
      dark_blue: '#0000AA',
      dark_green: '#00AA00',
      dark_aqua: '#00AAAA',
      dark_red: '#AA0000',
      dark_purple: '#AA00AA',
      gold: '#FFAA00',
      gray: '#AAAAAA',
      dark_gray: '#555555',
      blue: '#5555FF',
      green: '#55FF55',
      aqua: '#55FFFF',
      red: '#FF5555',
      light_purple: '#FF55FF',
      yellow: '#FFFF55',
      white: '#FFFFFF',
      aqua: '#00FFFF'
    };

    function parsePart(part) {
      if (typeof part === 'string') {
        return part.replace(/\n/g, '<br>');
      }
      let style = '';
      if (part.color && colorMap[part.color]) style += `color:${colorMap[part.color]};`;
      if (part.bold) style += 'font-weight:bold;';
      if (part.italic) style += 'font-style:italic;';
      if (part.underlined) style += 'text-decoration:underline;';
      if (part.strikethrough) style += 'text-decoration:line-through;';
      if (part.obfuscated) style += 'filter: blur(2px);'; // Simulación de texto obfuscado

      let text = part.text ? part.text.replace(/\n/g, '<br>') : '';
      if (part.extra) {
        text += part.extra.map(parsePart).join('');
      }
      return `<span style="${style}">${text}</span>`;
    }

    return motdJson.extra.map(parsePart).join('');
  }

  function handleServerStatus(data) {
    const serverMessage = document.getElementById('rest');
    if (data.status === 'error' || data.online === false) {
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
    const maxJugadores = data.players && data.players.max !== undefined ? data.players.max : 'Desconocido';
    const version = data.server && data.server.name ? data.server.name : 'Desconocida';
    const ultimaActualizacion = data.last_updated ? new Date(data.last_updated * 1000).toLocaleString() : 'Desconocida';

    // MOTD formateado
    let motdHtml = '';
    if (data.motd_json && data.motd_json.extra) {
      motdHtml = motdJsonToHtml(data.motd_json);
    } else {
      motdHtml = data.motd || 'Sin MOTD';
    }

    serverMessage.innerHTML = `
      <b>IP del Servidor:</b> ${serverIp}<br>
      <b>Puerto:</b> ${serverPort}<br>
      <b>Jugadores Conectados:</b> ${jugadores} / ${maxJugadores}<br>
      <b>MOTD:</b> ${motdHtml}<br>
      <b>Última actualización:</b> ${ultimaActualizacion}
    `;
  }
}

// Puedes cambiar estos valores o pedirlos al usuario por un formulario
const SERVER_IP = "play.krzz.eu.org";
const SERVER_PORT = "25566";

// Refrescar cada 5 minutos (300000 ms)
function startAutoRefresh() {
  initServerData(SERVER_IP, SERVER_PORT);
  setInterval(() => {
    initServerData(SERVER_IP, SERVER_PORT);
  }, 300000); // 300000 ms = 5 minutos
}

startAutoRefresh();
