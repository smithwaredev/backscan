const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" });
  }

  const { latitude, longitude, maps, source } = req.body;

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Verifica se latitude e longitude são válidas
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    console.error("Erro: Latitude ou Longitude inválida!", { latitude, longitude });
    return res.status(400).json({ success: false, message: "Latitude e Longitude válidas são obrigatórias!" });
  }

  // Conversão e arredondamento para maior precisão
  const formattedLatitude = parseFloat(latitude.toFixed(6));
  const formattedLongitude = parseFloat(longitude.toFixed(6));

  console.log("Valores enviados ao Telegram:");
  console.log("Latitude:", formattedLatitude);
  console.log("Longitude:", formattedLongitude);
  console.log("Enviando localização para o Telegram...");

  try {
    // Enviar a localização para o Telegram
    const locationResponse = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`, {
      chat_id: TELEGRAM_CHAT_ID,
      latitude: formattedLatitude,
      longitude: formattedLongitude
    });

    console.log("Resposta do Telegram (Localização):", locationResponse.data);

    // Criar a mensagem textual
    const message = `📍 Localização recebida\nFonte: ${source}\nMaps: ${maps}\nLatitude: ${formattedLatitude}\nLongitude: ${formattedLongitude}`;

    // Enviar uma mensagem adicional com o link do Google Maps
    const messageResponse = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    });

    console.log("Resposta do Telegram (Mensagem):", messageResponse.data);

    return res.status(200).json({ success: true, message: "Localização enviada com sucesso!" });

  } catch (error) {
    console.error("Erro ao enviar para o Telegram:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Erro ao enviar para o Telegram." });
  }
};