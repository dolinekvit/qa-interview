// In-memory seed data. Reset on every server restart.
// Two tenants share this store, exactly like a real multi-tenant database would.

const TOKENS = {
  'tok-consi': 'consi',
  'tok-novak': 'pekarna-novak',
};

const TENANTS = {
  consi: { id: 'consi', name: 'Consi s.r.o.' },
  'pekarna-novak': { id: 'pekarna-novak', name: 'Pekárna Novák' },
};

function seed() {
  const stockItems = [
    {
      id: 'si-001',
      tenantId: 'consi',
      sku: 'MOU-T530',
      name: 'Mouka pšeničná hladká T530',
      kind: 'ingredient',
      unit: 'kg',
      trackingMode: 'BATCH',
      dateMarkingType: 'best_before',
      isExpeditionAllowed: false,
      reorderThreshold: 200,
    },
    {
      id: 'si-002',
      tenantId: 'consi',
      sku: 'DRO-CER',
      name: 'Droždí čerstvé',
      kind: 'ingredient',
      unit: 'kg',
      trackingMode: 'BATCH',
      dateMarkingType: 'use_by',
      isExpeditionAllowed: false,
      reorderThreshold: 10,
    },
    {
      id: 'si-003',
      tenantId: 'consi',
      sku: 'CHL-KMI-1200',
      name: 'Chléb konzumní kmínový 1200g',
      kind: 'product',
      unit: 'ks',
      trackingMode: 'BATCH',
      dateMarkingType: 'best_before',
      isExpeditionAllowed: true,
      reorderThreshold: 0,
    },
    {
      id: 'si-004',
      tenantId: 'consi',
      sku: 'SAC-PAP-500',
      name: 'Sáček papírový 500g',
      kind: 'packaging',
      unit: 'ks',
      trackingMode: 'QUANTITY',
      dateMarkingType: 'none',
      isExpeditionAllowed: false,
      reorderThreshold: 5000,
    },
    {
      id: 'si-101',
      tenantId: 'pekarna-novak',
      sku: 'MAS-82',
      name: 'Máslo 82% tuku',
      kind: 'ingredient',
      unit: 'kg',
      trackingMode: 'BATCH',
      dateMarkingType: 'use_by',
      isExpeditionAllowed: false,
      reorderThreshold: 40,
    },
    {
      id: 'si-102',
      tenantId: 'pekarna-novak',
      sku: 'ROH-TUK',
      name: 'Rohlík tukový 43g',
      kind: 'product',
      unit: 'ks',
      trackingMode: 'BATCH',
      dateMarkingType: 'best_before',
      isExpeditionAllowed: true,
      reorderThreshold: 0,
    },
  ];

  const today = new Date();
  const day = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const batches = [
    {
      id: 'b-001',
      tenantId: 'consi',
      stockItemId: 'si-001',
      lotCode: 'L2026-0812-A',
      quantity: 320,
      expiresAt: day(120),
      receivedAt: day(-14),
    },
    {
      id: 'b-002',
      tenantId: 'consi',
      stockItemId: 'si-002',
      lotCode: 'L2026-0901-D',
      quantity: 12,
      expiresAt: day(-2), // already past its use-by date
      receivedAt: day(-9),
    },
    {
      id: 'b-003',
      tenantId: 'consi',
      stockItemId: 'si-003',
      lotCode: 'L2026-0901-CH',
      quantity: 480,
      expiresAt: day(3),
      receivedAt: day(0),
    },
    {
      id: 'b-004',
      tenantId: 'consi',
      stockItemId: 'si-003',
      lotCode: 'L2026-0829-CH',
      quantity: 60,
      expiresAt: day(-1), // yesterday
      receivedAt: day(-4),
    },
    {
      id: 'b-101',
      tenantId: 'pekarna-novak',
      stockItemId: 'si-101',
      lotCode: 'N-2026-0044',
      quantity: 55,
      expiresAt: day(21),
      receivedAt: day(-3),
    },
  ];

  const movements = [];

  return { stockItems, batches, movements };
}

const REASON_CODES = [
  'RECEIPT_PURCHASE',
  'CONSUMPTION_PRODUCTION',
  'WRITE_OFF_DAMAGE',
  'WRITE_OFF_EXPIRY',
  'EXPEDITION_SALE',
];

module.exports = { TOKENS, TENANTS, seed, REASON_CODES };
