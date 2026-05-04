-- ============================================================
-- VAPE DROP — Seed Data
-- Run in Supabase SQL Editor (Settings > SQL Editor)
-- Safe to re-run: uses ON CONFLICT DO NOTHING / TRUNCATE
-- ============================================================

-- ── SCHEMA (create tables if missing) ──────────────────────

CREATE TABLE IF NOT EXISTS products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  brand      TEXT,
  flavor     TEXT,
  puffs      INT DEFAULT 0,
  price      NUMERIC(10,2) NOT NULL,
  stock      INT DEFAULT 0,
  image_url  TEXT,
  category   TEXT,
  active     BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ DEFAULT now(),
  status           TEXT DEFAULT 'nuevo',
  total            NUMERIC(10,2),
  shipping_cost    NUMERIC(10,2) DEFAULT 0,
  customer_name    TEXT,
  customer_email   TEXT,
  customer_phone   TEXT,
  customer_address TEXT,
  delivery_type    TEXT DEFAULT 'delivery',
  payment_method   TEXT DEFAULT 'tarjeta',
  drop_point_id    UUID
);

CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  quantity    INT NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS bundles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2),
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id  UUID REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity   INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS drop_points (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name    TEXT NOT NULL,
  address TEXT,
  active  BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS settings (
  id             INT PRIMARY KEY DEFAULT 1,
  shipping_price NUMERIC(10,2) DEFAULT 50
);

-- ── CLEAR EXISTING DATA ─────────────────────────────────────

TRUNCATE bundle_items CASCADE;
TRUNCATE order_items CASCADE;
TRUNCATE orders CASCADE;
TRUNCATE bundles CASCADE;
TRUNCATE products CASCADE;
TRUNCATE drop_points CASCADE;

-- ── PRODUCTS (12 items) ─────────────────────────────────────

INSERT INTO products (name, brand, flavor, puffs, price, stock, category, active) VALUES
  ('GHOST 5000',   'Phantom',    'Blueberry Ice',   5000,  185, 12, 'Desechables', true),
  ('AERO X PRO',   'AeroVape',   'Mango Lychee',    7000,  220,  8, 'Desechables', true),
  ('SHADOW 8K',    'ShadowCo',   'Cool Mint',       8000,  275,  5, 'Desechables', true),
  ('CIPHER DROP',  'Phantom',    'Watermelon',      3500,  155, 20, 'Desechables', true),
  ('VORTEX 6K',    'VortexVap',  'Grape Ice',       6000,  240, 14, 'Desechables', true),
  ('PULSE ULTRA',  'PulseCore',  'Peach Frost',     5500,  195,  9, 'Desechables', true),
  ('NEON X4',      'NeonLabs',   'Strawberry Kiwi', 4000,  165, 18, 'Desechables', true),
  ('ZERO MAX',     'ZeroTech',   'Lychee Blast',    7500,  260,  6, 'Desechables', true),
  ('DRIFT 3K',     'DriftCo',    'Tropical Mix',    3000,  145, 25, 'Desechables', true),
  ('TITAN 10K',    'TitanVap',   'Double Apple',   10000,  320,  4, 'Desechables', true),
  ('FLASH PRO',    'FlashVap',   'Mint Candy',      4500,  175, 16, 'Desechables', true),
  ('ECLIPSE 8K',   'EclipseVap', 'Blue Razz',       8000,  285,  7, 'Desechables', true);

-- ── DROP POINTS ─────────────────────────────────────────────

INSERT INTO drop_points (name, address, active) VALUES
  ('Unidad Deportiva Hugo Sánchez',                   'Área de estacionamiento, poste norte',           true),
  ('Biblioteca Pública Benemérito de Las Américas',   'Banca exterior frente a la entrada',             true),
  ('Unidad Deportiva Municipal',                      'Junto a las canchas de futbol, banca 3',         true);

-- ── SETTINGS ────────────────────────────────────────────────

INSERT INTO settings (id, shipping_price)
VALUES (1, 50)
ON CONFLICT (id) DO UPDATE SET shipping_price = EXCLUDED.shipping_price;

-- ── BUNDLES ─────────────────────────────────────────────────

WITH
  b1 AS (INSERT INTO bundles (name, description, price, active) VALUES ('Pack 3 Amigos', '3 vapes para compartir', 480, true) RETURNING id),
  b2 AS (INSERT INTO bundles (name, description, price, active) VALUES ('Combo Fin de Semana', '2 vapes + 1 extra de regalo', 560, true) RETURNING id),
  b3 AS (INSERT INTO bundles (name, description, price, active) VALUES ('Pack Ahorro x5', '5 desechables al mejor precio', 750, true) RETURNING id),
  p1  AS (SELECT id FROM products WHERE name='GHOST 5000'   LIMIT 1),
  p2  AS (SELECT id FROM products WHERE name='AERO X PRO'   LIMIT 1),
  p4  AS (SELECT id FROM products WHERE name='CIPHER DROP'  LIMIT 1),
  p3  AS (SELECT id FROM products WHERE name='SHADOW 8K'    LIMIT 1),
  p5  AS (SELECT id FROM products WHERE name='VORTEX 6K'    LIMIT 1),
  p7  AS (SELECT id FROM products WHERE name='NEON X4'      LIMIT 1),
  p9  AS (SELECT id FROM products WHERE name='DRIFT 3K'     LIMIT 1)
INSERT INTO bundle_items (bundle_id, product_id, quantity)
SELECT b1.id, p1.id, 1 FROM b1, p1 UNION ALL
SELECT b1.id, p2.id, 1 FROM b1, p2 UNION ALL
SELECT b1.id, p4.id, 1 FROM b1, p4 UNION ALL
SELECT b2.id, p3.id, 1 FROM b2, p3 UNION ALL
SELECT b2.id, p5.id, 1 FROM b2, p5 UNION ALL
SELECT b2.id, p7.id, 1 FROM b2, p7 UNION ALL
SELECT b3.id, p1.id, 2 FROM b3, p1 UNION ALL
SELECT b3.id, p4.id, 2 FROM b3, p4 UNION ALL
SELECT b3.id, p9.id, 1 FROM b3, p9;

-- ── SAMPLE ORDERS (5 for admin testing) ─────────────────────

WITH
  dp1 AS (SELECT id FROM drop_points WHERE name LIKE '%Hugo%' LIMIT 1),
  dp2 AS (SELECT id FROM drop_points WHERE name LIKE '%Municipal%' LIMIT 1),
  p1  AS (SELECT id, price FROM products WHERE name='GHOST 5000' LIMIT 1),
  p2  AS (SELECT id, price FROM products WHERE name='AERO X PRO' LIMIT 1),
  p3  AS (SELECT id, price FROM products WHERE name='SHADOW 8K'  LIMIT 1),

  o1 AS (
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total, status, delivery_type, payment_method, shipping_cost)
    VALUES ('Ana García', 'ana@test.com', '5512340001', 'Col. Roma Norte 123', 405, 'nuevo', 'delivery', 'tarjeta', 50)
    RETURNING id
  ),
  o2 AS (
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total, status, delivery_type, payment_method, shipping_cost, drop_point_id)
    SELECT 'Carlos López', 'carlos@test.com', '5598760002', 'Dep. Hugo Sánchez', 185, 'en_proceso', 'drop', 'tarjeta', 0, dp1.id FROM dp1
    RETURNING id
  ),
  o3 AS (
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total, status, delivery_type, payment_method, shipping_cost)
    VALUES ('María Torres', 'maria@test.com', '5512340003', 'Polanco', 660, 'en_proceso', 'delivery', 'transferencia', 0)
    RETURNING id
  ),
  o4 AS (
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total, status, delivery_type, payment_method, shipping_cost, drop_point_id)
    SELECT 'Juan Pérez', 'juan@test.com', '5598760004', 'Unid. Dep. Municipal', 220, 'drop_realizado', 'drop', 'transferencia', 0, dp2.id FROM dp2
    RETURNING id
  ),
  o5 AS (
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total, status, delivery_type, payment_method, shipping_cost)
    VALUES ('Laura Ruiz', 'laura@test.com', '5512340005', 'Del Valle', 340, 'entregado', 'delivery', 'efectivo', 50)
    RETURNING id
  )

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT o1.id, p1.id, 1, p1.price FROM o1, p1 UNION ALL
SELECT o1.id, p2.id, 1, p2.price FROM o1, p2 UNION ALL
SELECT o2.id, p1.id, 1, p1.price FROM o2, p1 UNION ALL
SELECT o3.id, p3.id, 2, p3.price FROM o3, p3 UNION ALL
SELECT o3.id, p1.id, 1, p1.price FROM o3, p1 UNION ALL
SELECT o4.id, p2.id, 1, p2.price FROM o4, p2 UNION ALL
SELECT o5.id, p1.id, 1, p1.price FROM o5, p1 UNION ALL
SELECT o5.id, p3.id, 1, p3.price FROM o5, p3;

-- ── DONE ────────────────────────────────────────────────────
-- Expected results:
--   products: 12 rows
--   drop_points: 3 rows
--   settings: 1 row (shipping_price=50)
--   bundles: 3 rows
--   bundle_items: 9 rows
--   orders: 5 rows
--   order_items: 8 rows

SELECT 'products' AS table_name, COUNT(*) FROM products
UNION ALL SELECT 'drop_points', COUNT(*) FROM drop_points
UNION ALL SELECT 'bundles', COUNT(*) FROM bundles
UNION ALL SELECT 'bundle_items', COUNT(*) FROM bundle_items
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'settings', COUNT(*) FROM settings;
