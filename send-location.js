const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" });
  }

  const { latitude, longitude, maps, source } = req.body;

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Verifica se latitude e longitude foram recebidas corretamente
  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: "Latitude e Longitude são obrigatórias!" });
  }

  const message = `📍 Localização recebida\nFonte: ${source}\nMaps: ${maps}`;

  try {
    // Enviar a localização real para o Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`, {
      chat_id: TELEGRAM_CHAT_ID,
      latitude: latitude,
      longitude: longitude
    });

    // Enviar uma mensagem adicional com o link do Google Maps
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar para o Telegram:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Erro ao enviar para o Telegram." });
  }
};