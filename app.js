const express = require('express');       
const fs = require('fs').promises;       
const app = express();                     
const PORT = 3000;                         

app.use(express.json());                   
app.use(express.static(__dirname));       

// Load items from JSON
async function loadItems() {
  try {
    const data = await fs.readFile('items.json', 'utf-8');
    return JSON.parse(data);
  } catch {
    return { items: [] };
  }
}

// Save items to JSON
async function saveItems(items) {
  await fs.writeFile('items.json', JSON.stringify({ items }, null, 2));
}


// Test route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// GET all items
app.get('/items', async (req, res) => {
  const data = await loadItems();
  res.json(data);
});

// POST a new item
app.post('/items', async (req, res) => {
  let { name, quantity } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid item name' });
  }

  if (!quantity || typeof quantity !== 'number') {
    quantity = 1;
  }

  const data = await loadItems();
  const items = data.items;

  items.push({ name, quantity });
  await saveItems(items);

  res.json({ items });
});

// PUT: Update an item by index
app.put('/items/:index', async (req, res) => {
  const index = parseInt(req.params.index);
  const { name, quantity } = req.body;

  const data = await loadItems();
  const items = data.items;

  if (!items[index]) return res.status(404).json({ error: 'Item not found' });

  items[index] = {
    name: name || items[index].name,
    quantity: quantity || items[index].quantity
  };

  await saveItems(items);
  res.json({ items });
});

// DELETE: Remove an item by index
app.delete('/items/:index', async (req, res) => {
  const index = parseInt(req.params.index);

  const data = await loadItems();
  const items = data.items;

  if (!items[index]) return res.status(404).json({ error: 'Item not found' });

  items.splice(index, 1);
  await saveItems(items);
  res.json({ items });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
