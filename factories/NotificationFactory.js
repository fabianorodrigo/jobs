const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');

/**
 * Immutable instance with functions to send messages to Telegram, Email, etc
 *
 * @param {string} telegramToken Token to authentication in the Telegram API
 * @param {string} gmailUser Gmail User account that sends the notification email
 * @param {string} gmailPassword Gmail User password that sends the notification email
 * @returns {object} Immutable object with query functions
 */
module.exports = function NotificationFactory({ telegramToken, gmailUser, gmailPassword }) {
  const bot = new TelegramBot(telegramToken);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });

  /* bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message and Id: '.concat(msg.chat.id));
  }); */

  async function sendTelegramMessage({ destinatary, text }) {
    const result = await bot.sendMessage(destinatary, text);
    return result;
  }

  async function sendEmailMessage({ destinatary, subject, text }) {
    const mailOptions = {
      from: gmailUser,
      to: destinatary,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      }
      return info.response;
    });
  }

  return Object.freeze({
    sendTelegramMessage,
    sendEmailMessage,
  });
};
