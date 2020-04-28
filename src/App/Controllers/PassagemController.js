const { discord, date } = require('../../../src/server');
const puppeteer = require('puppeteer');
const dir = require('path');
const request = require('request');

module.exports = async (msg) => {
  if (msg.channel.id !== '702914393251250177')
    return msg.reply('canal especifico: <#702914393251250177>');

  msg.reply('aguarde enquanto estou gerando a passagem de turno...');

  const options = {
    method: 'GET',
    url: process.env.TURNO_API,
  };

  request(options, async (error, response, body) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
      ],
    });

    const page = await browser.newPage();
    const path = dir.resolve('public', 'images', 'turno.png');

    await page.goto(process.env.PRINT_URL);
    await page.screenshot({ path });
    await browser.close();

    const { total, chamados } = JSON.parse(body);

    const allchamados = `CHAMADOS TOTAL: **${total}**`;
    const ativacao = `${chamados[0].fila}: **${chamados[0].value}**`;
    const bloqueio = `${chamados[1].fila}: **${chamados[1].value}**`;
    const cancelamento = `${chamados[2].fila}: **${chamados[2].value}**`;
    const circuito = `${chamados[3].fila}: **${chamados[3].value}**`;
    const corporativo = `${chamados[4].fila}: **${chamados[4].value}**`;
    const nivel1 = `${chamados[5].fila}: **${chamados[5].value}**`;
    const proativo = `${chamados[6].fila}: **${chamados[6].value}**`;
    const residencial = `${chamados[7].fila}: **${chamados[7].value}**`;

    const avatar = new discord.MessageEmbed()
      .setColor('#1a65aa')
      .setDescription(
        `${allchamados} \n\n ${ativacao} \n ${bloqueio} \n ${cancelamento} \n ${circuito} \n ${corporativo} \n ${nivel1} \n ${proativo} \n ${residencial}`
      )
      .setTimestamp(date)
      .attachFiles([path])
      .setThumbnail('attachment://discordjs.png')
      .setFooter(msg.author.username);

    msg.channel.send(avatar);
  });
};
