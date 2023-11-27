import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/saved', async (req, res) => {
  const data = await fs.readFileSync('./saved.json');
  res.json(JSON.parse(data));
});

const delay = async (d) =>
  new Promise((res) =>
    setTimeout(() => {
      res();
    }, d)
  );

app.get('/update', async (req, res) => {
  try {
    const data = fs.readFileSync('./tickers.json');

    const jsonData = JSON.parse(data);

    const saved = [];

    const all = [];

    console.log('Start parsing...');

    for (let i = 0; i < jsonData.length; i++) {
      const { symbol, name } = jsonData[i];

      const ticket = axios
        .get(
          ` https://symbol-search.tradingview.com/symbol_search/v3/?text=${symbol}&hl=1&domain=production&sort_by_country=US`
        )
        .then((res) => {
          saved.push({
            target: { symbol, name },
            data: res.data,
          });
          console.log(`Getted ${symbol} ${i}`);
        })
        .catch((e) => {
          console.log(`Error: ${symbol} ${i}`);
        });

      all.push(ticket);

      await delay(10);

      // if (i > 1000) break;
    }

    await Promise.all(all);

    fs.writeFileSync('./saved.json', JSON.stringify(saved));

    console.log('SAVED ALL ==========================');

    res.json({ wow: jsonData.length });
  } catch (e) {
    console.log(e);
    res.status({ error: e.message });
  }
});

app.get('/logos', async (req, res) => {
  const logos_ = fs.readFileSync('./logos.json');
  const logos = JSON.parse(logos_);
  res.json(logos);
});

app.get('/logos/:num', async (req, res) => {
  const { num } = req.params;

  const getRandomElements = (array) => {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, num);
  }

  const logos_ = fs.readFileSync('./logos.json');
  const logos = JSON.parse(logos_);

  const tickers_ = fs.readFileSync('./tickers.json');
  const tickers = JSON.parse(tickers_);

  const random = getRandomElements(tickers);

  for (let i = 0; i < random.length; i++) {
    const ticker = random[i];
    const url = `https://s3-symbol-logo.tradingview.com/${logos[ticker.symbol]}.svg`;

    const res = await fetch(url);
    const svg = await res.text();

    random[i].logo = svg;
  }
  
  res.json(random);
});

app.get('/fill-empty', async (req, res) => {
  try {
    const logos_ = fs.readFileSync('./logos.json');
    const logos = JSON.parse(logos_);

    const tickers_ = fs.readFileSync('./saved.json');
    const tickers = JSON.parse(tickers_);
    let n = 0;

    tickers.forEach(({ target, data }) => {
      let isCustom = true;

      for (let i = 0; i < data.symbols.length; i++) {
        const { logoid } = data.symbols[i];

        if (logoid) isCustom = false;
      }

      if (isCustom) {
        logos[target.symbol] = 'custom'
        n++;
      }
    });

    fs.writeFileSync('./logos.json', JSON.stringify(logos));

    res.json({ success: true, filled: n });
  } catch (e) {
    console.log(e);
    res.json({ success: false, error: e.message });
  }
});

app.post('/save', async (req, res) => {
  try {
    const { symbol, logo } = req.body;

    const logos_ = fs.readFileSync('./logos.json');
    const logos = JSON.parse(logos_);

    logos[symbol] = logo;

    fs.writeFileSync('./logos.json', JSON.stringify(logos));

    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.json({ success: false, error: e.message });
  }
});


app.use('/', express.static(path.join(__dirname, './client/dist')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/dist', 'index.html'));
});

app.listen(8888, () => {
  console.log('Server has started on 8888');
});
