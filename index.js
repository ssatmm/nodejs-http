'use strict';
const http = require('node:http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    console.info(`Requested by ${req.socket.remoteAdd }`);
  res.writeHead(200,{
    'Content-Type': 'text/html; charset=utf-8'
  });
  
  switch (req.method){
    case 'GET':
      if (req.url === '/') {
        res.write('<!DOCTYPE html><html lang="ja"><body>' +
          '<h1>アンケートフォーム</h1>' +
          '<a href="/enquetes">アンケート一覧</a>' +
          '</body></html>');
      } else if (req.url === '/enquetes') {
        res.write('<!DOCTYPE html><html lang="ja"><body>' +
          '<h1>アンケート一覧</h1><ul>' +
          '<li><a href="/enquetes/yaki-tofu">焼き肉・湯豆腐</a></li>' +
          '<li><a href="/enquetes/rice-bread">ごはん・パン</a></li>' +
          '<li><a href="/enquetes/sushi-pizza">寿司・ピザ</a></li>' +
          '</ul></body></html>');
      } else if (req.url === '/enquetes/yaki-tofu') {
      res.write(pug.renderFile('./form.pug',{
          path: req.url,
          firstItem: '肉',
          secondItem: '豆'
        }));
      }else if(req.url === '/enquetes/rice-bread'){
        res.write(pug.renderFile('./form.pug',{
          path: req.url,
          firstItem: '米',
          secondItem:'ぱん'
        }));
      }else if(req.url === '/enquetes/sushi-pizza'){
        res.write(pug.renderFile('./form.pug',{
          path: req.url,
          firstItem: 'すし',
          secondItem: 'ぴざ'
        }))
      }
      res.end();
      break;
    case 'POST':
      let rawData = '';
      req
        .on('data', chunk => {
          rawData += chunk;
        })
        .on('end', () => {
          const answer = new URLSearchParams(rawData);
          const body = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
          console.info(body);
          res.write(`<h1>${body}</h1>`);
          res.end();
        });
      break;
    case 'DELETE':
      res.write(`DELETE ${req.url}\n`);
      res.end();
      break;
    default:
      break;
  }
  })
  .on('error', e => {
    console.error('Server Error', e);
  })
  .on('clienError', e =>{
    console.error('Client Error', e);
});
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});