/**
 * Consome API de cotações de moedas e envia email com valores
 */
const axios = require('axios');
const loaders = require('../../../loaders');

loaders.init();

const Notifier = require('../../../factories/NotificationFactory')({
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  gmailUser: process.env.GMAIL_USER,
  gmailPassword: process.env.GMAIL_PASSWORD,
});

(async () => {
  const response = await axios.get('https://economia.awesomeapi.com.br/json/all');
  const text = response.data;
  await Notifier.sendTelegramMessage({ destinatary: process.env.TELEGRAM_CHATID_NOTIFIED, text: formatMessage(text) });
  await Notifier.sendEmailMessage({ destinatary: process.env.EMAIL_NOTIFIED, subject: 'Cotações de Moedas', text: formatMessage(text) });
})();

function formatMessage(source) {
  let result = `USD: ${source.USD.codein}${source.USD.bid} (${source.USD.varBid})\n`;
  result += `EURO: ${source.EUR.codein}${source.EUR.bid} (${source.EUR.varBid})\n`;
  result += `PESO ARG: ${source.ARS.codein}${source.ARS.bid} (${source.ARS.varBid})\n`;
  result += `LIBRA: ${source.GBP.codein}${source.GBP.bid} (${source.GBP.varBid})\n\n`;
  result += `BTC: ${source.BTC.codein}${source.BTC.bid} (${source.BTC.varBid})\n`;
  result += `ETHER: ${source.ETH.codein}${source.ETH.bid} (${source.ETH.varBid})\n`;
  return result;
}
