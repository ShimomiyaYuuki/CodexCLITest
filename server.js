const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const menu = [
  { id: 'coffee', name: 'ブレンドコーヒー', price: 300 },
  { id: 'latte', name: 'カフェラテ', price: 350 },
  { id: 'cappuccino', name: 'カプチーノ', price: 400 },
  { id: 'tea', name: '紅茶', price: 250 },
  { id: 'cake', name: 'チーズケーキ', price: 450 }
];

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.post('/order', (req, res) => {
  const order = { name: req.body.name || '匿名', items: [] };

  menu.forEach(item => {
    const qty = parseInt(req.body[item.id], 10) || 0;
    if (qty > 0) {
      order.items.push({ name: item.name, quantity: qty });
    }
  });

  fs.readFile('orders.json', 'utf8', (err, data) => {
    let orders = [];
    if (!err && data) {
      try { orders = JSON.parse(data); } catch (e) {}
    }
    orders.push(order);
    fs.writeFile('orders.json', JSON.stringify(orders, null, 2), err => {
      if (err) console.error(err);
    });
  });

  res.send('ご注文ありがとうございました。');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
