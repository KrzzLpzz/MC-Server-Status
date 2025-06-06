function initServerData(serverIp, serverPort) {
  const serverIpElement = document.getElementById('server-ip');
  //serverIpElement.innerHTML = serverIp;

  console.log('https://mcapi.us/server/status?ip=' + serverIp + '&port=' + serverPort);
  fetch('https://mcapi.us/server/status?ip=' + serverIp + '&port=' + serverPort)
    .then(response => response.json())
    .then(data => handleServerStatus(data));

  function handleServerStatus(data) {
    if (data.status == 'error') {
      console.log(data.error);
      const serverError = document.getElementById('rest');
      serverError.innerHTML = "El servidor está Offline";
      return false;
    }

    const logo = document.getElementById("favicon");
    logo.src = data.favicon;

    const serverSuccess = document.getElementById('rest');
    serverSuccess.innerHTML = '<b>IP del Servidor: </b>' + serverIp + '<br>' + '<b>Puerto: </b>' + serverPort + '<br>' + '<b>Jugadores Conectados: </b>' + data.players.now + '<br>' + '<b>MOTD: </b>' + data.motd + '<br><br>Agrega el servidor a Bedrock:'
  }

}

initServerData("play.krzz.eu.org", "25566");
