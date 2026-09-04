const express = require('express');
const path = require('path');
const { TOKENS, TENANTS, seed, REASON_CODES } = require('./data');

const app = express();
app.use(express.json());

let db = seed();

// ---------------------------------------------------------------------------
// Auth: a token maps to exactly one tenant. Sent as the x-tenant-token header.
// ---------------------------------------------------------------------------
function auth(req, res, next) {
  const token = req.header('x-tenant-token');
  const tenantId = TOKENS[token];
  if (!tenantId) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  req.tenantId = tenantId;
  next();
}

// Simulated network / query latency.
const jitter = (min, max) => (req, res, next) =>
  setTimeout(next, Math.floor(Math.random() * (max - min)) + min);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/api/me', auth, (req, res) => {
  res.json(TENANTS[req.tenantId]);
});

app.get('/api/stock-items', auth, jitter(80, 430), (req, res) => {
  res.json(db.stockItems);
});

app.get('/api/batches', auth, jitter(40, 160), (req, res) => {
  let rows = db.batches.filter((b) => b.tenantId === req.tenantId);
  if (req.query.stockItemId) {
    rows = rows.filter((b) => b.stockItemId === req.query.stockItemId);
  }
  res.json(rows);
});

app.get('/api/movements', auth, (req, res) => {
  res.json(db.movements.filter((m) => m.tenantId === req.tenantId));
});

// Goods receipt.
app.post('/api/batches', auth, (req, res) => {
  const { stockItemId, lotCode, quantity, expiresAt } = req.body || {};

  const item = db.stockItems.find(
    (s) => s.id === stockItemId && s.tenantId === req.tenantId
  );
  if (!item) return res.status(404).json({ error: 'stock item not found' });

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: 'quantity must be a positive number' });
  }

  if (item.dateMarkingType !== 'none' && !expiresAt) {
    return res.status(400).json({ error: 'expiresAt is required for this item' });
  }

  const batch = {
    id: 'b-' + Math.random().toString(36).slice(2, 8),
    tenantId: req.tenantId,
    stockItemId,
    lotCode: lotCode || null,
    quantity,
    expiresAt: expiresAt || null,
    receivedAt: new Date().toISOString().slice(0, 10),
  };
  db.batches.push(batch);

  db.movements.push({
    id: 'm-' + Math.random().toString(36).slice(2, 8),
    tenantId: req.tenantId,
    batchId: batch.id,
    type: 'RECEIPT',
    quantity,
    reasonCode: 'RECEIPT_PURCHASE',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(batch);
});

// Stock movement: consumption, write-off, expedition.
app.post('/api/movements', auth, (req, res) => {
  const { batchId, type, quantity, reasonCode } = req.body || {};

  const batch = db.batches.find(
    (b) => b.id === batchId && b.tenantId === req.tenantId
  );
  if (!batch) return res.status(404).json({ error: 'batch not found' });

  const item = db.stockItems.find((s) => s.id === batch.stockItemId);

  if (!['CONSUMPTION', 'WRITE_OFF', 'EXPEDITION'].includes(type)) {
    return res.status(400).json({ error: 'unknown movement type' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: 'quantity must be a positive number' });
  }

  if (type === 'EXPEDITION' && !item.isExpeditionAllowed) {
    return res.status(422).json({ error: 'item may not be expedited' });
  }

  batch.quantity = batch.quantity - quantity;

  const movement = {
    id: 'm-' + Math.random().toString(36).slice(2, 8),
    tenantId: req.tenantId,
    batchId,
    type,
    quantity,
    reasonCode: reasonCode || REASON_CODES[1],
    createdAt: new Date().toISOString(),
  };
  db.movements.push(movement);

  res.status(201).json({ movement, batch });
});

// Test helper: restore the seed data.
app.post('/api/_reset', (req, res) => {
  db = seed();
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, '..', 'public')));

const port = process.env.PORT || 3100;
app.listen(port, () => {
  console.log(`ARTOSoft QA sandbox listening on http://localhost:${port}`);
});
