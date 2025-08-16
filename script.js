const form = document.getElementById('item-form');
const itemsList = document.getElementById('items-list');

// Load and display items
async function loadItems() {
  const res = await fetch('/items');
  const data = await res.json();

  itemsList.innerHTML = '';
  data.items.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} (Qty: ${item.quantity}) `;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = async () => {
      const newName = prompt('Update item name:', item.name);
      const newQty = prompt('Update quantity:', item.quantity);
      if (newName || newQty) {
        await fetch(`/items/${index}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: newName || item.name, 
            quantity: newQty ? parseInt(newQty) : item.quantity 
          })
        });
        loadItems();
      }
    };

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = async () => {
      await fetch(`/items/${index}`, { method: 'DELETE' });
      loadItems();
    };

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    itemsList.appendChild(li);
  });
}

// Submit new item
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const quantity = parseInt(document.getElementById('quantity').value) || 1;

  await fetch('/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity })
  });

  document.getElementById('name').value = '';
  document.getElementById('quantity').value = '';
  loadItems();
});

// Initial load
loadItems();
