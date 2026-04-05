import type { Order } from '../types'

/*
  tableData.ts — 50 mock orders spread across 2024.
  Fully working — no implementation needed here.

  This data gives DataTable (Day 5) enough rows to demonstrate:
  - Pagination (10/page = 5 pages)
  - Sorting across all column types (string, number, date, union)
  - Date range filtering (rows across all 12 months)
  - All 4 status badge variants
*/

export const ordersData: Order[] = [
  { id: 'ORD-001', customer: 'Alice Johnson',    product: 'MacBook Pro 14"',           category: 'Electronics',   amount: 2499.00, status: 'completed',  date: '2024-01-05' },
  { id: 'ORD-002', customer: 'Bob Chen',          product: 'iPhone 15 Pro',             category: 'Electronics',   amount: 1199.00, status: 'completed',  date: '2024-01-08' },
  { id: 'ORD-003', customer: 'Carol Williams',    product: 'Sony WH-1000XM5',           category: 'Audio',         amount:  349.99, status: 'pending',    date: '2024-01-12' },
  { id: 'ORD-004', customer: 'David Park',        product: 'Nike Air Max 270',          category: 'Sports',        amount:  159.00, status: 'completed',  date: '2024-01-19' },
  { id: 'ORD-005', customer: 'Eva Martinez',      product: 'Instant Pot Duo 7-in-1',   category: 'Home & Garden', amount:   99.95, status: 'cancelled',  date: '2024-01-23' },
  { id: 'ORD-006', customer: 'Frank Lee',         product: 'Samsung 65" QLED TV',      category: 'Electronics',   amount: 1299.00, status: 'completed',  date: '2024-02-02' },
  { id: 'ORD-007', customer: 'Grace Kim',         product: "Levi's 501 Jeans",         category: 'Clothing',      amount:   69.99, status: 'refunded',   date: '2024-02-07' },
  { id: 'ORD-008', customer: 'Henry Brown',       product: 'Kindle Paperwhite',         category: 'Electronics',   amount:  139.99, status: 'completed',  date: '2024-02-14' },
  { id: 'ORD-009', customer: 'Isabella Clark',    product: 'Dyson V15 Detect',          category: 'Home & Garden', amount:  749.00, status: 'completed',  date: '2024-02-19' },
  { id: 'ORD-010', customer: 'James Wilson',      product: 'Whey Protein 5lb',          category: 'Sports',        amount:   59.99, status: 'pending',    date: '2024-02-25' },
  { id: 'ORD-011', customer: 'Karen Davis',       product: 'iPad Pro 12.9"',            category: 'Electronics',   amount: 1099.00, status: 'completed',  date: '2024-03-03' },
  { id: 'ORD-012', customer: 'Liam Thompson',     product: 'Patagonia Nano Puff Jacket',category: 'Clothing',      amount:  229.00, status: 'completed',  date: '2024-03-08' },
  { id: 'ORD-013', customer: 'Mia Rodriguez',     product: 'The Psychology of Money',   category: 'Books',         amount:   18.99, status: 'completed',  date: '2024-03-12' },
  { id: 'ORD-014', customer: 'Noah Garcia',       product: 'AirPods Pro 2nd Gen',       category: 'Electronics',   amount:  249.00, status: 'pending',    date: '2024-03-20' },
  { id: 'ORD-015', customer: 'Olivia Anderson',   product: 'Vitamix A3500 Blender',     category: 'Home & Garden', amount:  649.00, status: 'completed',  date: '2024-03-27' },
  { id: 'ORD-016', customer: 'Peter White',       product: 'Garmin Forerunner 265',     category: 'Sports',        amount:  449.99, status: 'refunded',   date: '2024-04-04' },
  { id: 'ORD-017', customer: 'Quinn Taylor',      product: 'Charlotte Tilbury Powder',  category: 'Beauty',        amount:   52.00, status: 'completed',  date: '2024-04-09' },
  { id: 'ORD-018', customer: 'Rachel Moore',      product: 'Dell UltraSharp 27"',       category: 'Electronics',   amount:  599.00, status: 'completed',  date: '2024-04-15' },
  { id: 'ORD-019', customer: 'Samuel Jackson',    product: 'North Face Thermoball Jacket', category: 'Clothing',   amount:  199.00, status: 'cancelled',  date: '2024-04-22' },
  { id: 'ORD-020', customer: 'Tara Lewis',        product: 'Atomic Habits (Hardcover)', category: 'Books',         amount:   24.99, status: 'completed',  date: '2024-04-28' },
  { id: 'ORD-021', customer: 'Uma Patel',         product: 'LG 27" 4K Monitor',         category: 'Electronics',   amount:  449.00, status: 'completed',  date: '2024-05-06' },
  { id: 'ORD-022', customer: 'Victor Nguyen',     product: 'On Cloudstratus Shoes',     category: 'Sports',        amount:  179.99, status: 'pending',    date: '2024-05-11' },
  { id: 'ORD-023', customer: 'Wendy Scott',       product: 'Olaplex No.3 Hair Perfector',category: 'Beauty',       amount:   30.00, status: 'completed',  date: '2024-05-17' },
  { id: 'ORD-024', customer: 'Xander Robinson',   product: 'Herman Miller Aeron Chair', category: 'Home & Garden', amount: 1499.00, status: 'completed',  date: '2024-05-24' },
  { id: 'ORD-025', customer: 'Yara Hassan',       product: 'Uniqlo Merino Wool Sweater',category: 'Clothing',      amount:   59.90, status: 'completed',  date: '2024-05-29' },
  { id: 'ORD-026', customer: 'Zoe Carter',        product: 'Sony PlayStation 5',        category: 'Electronics',   amount:  499.00, status: 'completed',  date: '2024-06-03' },
  { id: 'ORD-027', customer: 'Aaron Mitchell',    product: 'Nespresso Vertuo Next',     category: 'Home & Garden', amount:  179.00, status: 'refunded',   date: '2024-06-10' },
  { id: 'ORD-028', customer: 'Bella Turner',      product: 'Lululemon Align Leggings',  category: 'Clothing',      amount:  128.00, status: 'completed',  date: '2024-06-17' },
  { id: 'ORD-029', customer: 'Carlos Diaz',       product: 'Anker 737 Power Bank',      category: 'Electronics',   amount:  149.99, status: 'completed',  date: '2024-06-24' },
  { id: 'ORD-030', customer: 'Diana Foster',      product: 'Thinking Fast and Slow',    category: 'Books',         amount:   16.99, status: 'pending',    date: '2024-07-01' },
  { id: 'ORD-031', customer: 'Ethan Hughes',      product: 'Bose QuietComfort 45',      category: 'Electronics',   amount:  279.00, status: 'completed',  date: '2024-07-08' },
  { id: 'ORD-032', customer: 'Fiona Green',       product: 'Glossier Cloud Paint',      category: 'Beauty',        amount:   22.00, status: 'completed',  date: '2024-07-15' },
  { id: 'ORD-033', customer: 'George Hill',       product: 'Traeger Pro 575 Grill',     category: 'Home & Garden', amount:  799.00, status: 'cancelled',  date: '2024-07-22' },
  { id: 'ORD-034', customer: 'Hannah King',       product: 'Adidas Ultraboost 23',      category: 'Sports',        amount:  189.95, status: 'completed',  date: '2024-07-29' },
  { id: 'ORD-035', customer: 'Ian Campbell',      product: 'Apple Watch Ultra 2',       category: 'Electronics',   amount:  799.00, status: 'completed',  date: '2024-08-05' },
  { id: 'ORD-036', customer: 'Julia Ward',        product: 'Hydro Flask 32oz',          category: 'Sports',        amount:   44.95, status: 'completed',  date: '2024-08-12' },
  { id: 'ORD-037', customer: 'Kevin Cox',         product: 'KitchenAid Stand Mixer',    category: 'Home & Garden', amount:  449.95, status: 'completed',  date: '2024-08-19' },
  { id: 'ORD-038', customer: 'Laura Reed',        product: "Arc'teryx Beta LT Jacket",  category: 'Clothing',      amount:  599.00, status: 'refunded',   date: '2024-08-26' },
  { id: 'ORD-039', customer: 'Marcus Bell',       product: 'Segway Ninebot E2',         category: 'Sports',        amount:  499.00, status: 'pending',    date: '2024-09-02' },
  { id: 'ORD-040', customer: 'Natalie Hughes',    product: 'Tatcha The Dewy Skin Cream',category: 'Beauty',        amount:   68.00, status: 'completed',  date: '2024-09-09' },
  { id: 'ORD-041', customer: 'Oscar Fleming',     product: 'Bose SoundLink Max',        category: 'Electronics',   amount:  399.00, status: 'completed',  date: '2024-09-16' },
  { id: 'ORD-042', customer: 'Penelope Owens',    product: 'Zero to One (Thiel)',       category: 'Books',         amount:   19.99, status: 'completed',  date: '2024-09-23' },
  { id: 'ORD-043', customer: 'Quentin Banks',     product: 'Roomba i7+ Robot Vacuum',   category: 'Home & Garden', amount:  599.00, status: 'cancelled',  date: '2024-10-01' },
  { id: 'ORD-044', customer: 'Rebecca Stone',     product: 'Nike Dri-FIT ADV Short',   category: 'Sports',        amount:   65.00, status: 'completed',  date: '2024-10-08' },
  { id: 'ORD-045', customer: 'Sebastian Hunt',    product: 'Samsung Galaxy S24 Ultra',  category: 'Electronics',   amount: 1299.00, status: 'completed',  date: '2024-10-15' },
  { id: 'ORD-046', customer: 'Tiffany Wells',     product: 'NARS Soft Matte Foundation',category: 'Beauty',        amount:   49.00, status: 'pending',    date: '2024-10-22' },
  { id: 'ORD-047', customer: 'Ulrich Bauer',      product: 'Ergotron LX Desk Arm',     category: 'Home & Garden', amount:  219.99, status: 'completed',  date: '2024-11-04' },
  { id: 'ORD-048', customer: 'Vivian Fox',        product: "Levi's Sherpa Trucker Jacket", category: 'Clothing',   amount:  120.00, status: 'completed',  date: '2024-11-11' },
  { id: 'ORD-049', customer: 'Walter Singh',      product: 'Logitech MX Master 3S',    category: 'Electronics',   amount:   99.99, status: 'completed',  date: '2024-11-18' },
  { id: 'ORD-050', customer: 'Xena Murphy',       product: 'Theragun Prime',            category: 'Sports',        amount:  299.00, status: 'completed',  date: '2024-12-02' },
]
