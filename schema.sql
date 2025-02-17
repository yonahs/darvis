
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE segment_refresh_frequency AS ENUM ('never', 'daily', 'weekly', 'monthly');
CREATE TYPE user_role AS ENUM ('admin', 'customer_support', 'logistics', 'pharmacy');
CREATE TYPE risk_factor_type AS ENUM (
  'payment',
  'prescription',
  'shipping',
  'compliance',
  'medical',
  'other'
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metadata JSONB DEFAULT '{}'::jsonb,
  action_type TEXT NOT NULL,
  details JSONB,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Segments
CREATE TABLE ai_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  next_refresh_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  natural_language_query TEXT NOT NULL,
  description TEXT,
  structured_query JSONB NOT NULL,
  parent_segment_id UUID,
  name TEXT NOT NULL,
  refresh_frequency segment_refresh_frequency DEFAULT 'never'
);

-- BSD Packages
CREATE TABLE bsd_packages (
  autoid INTEGER PRIMARY KEY,
  weight DOUBLE PRECISION,
  totalsalevalue DOUBLE PRECISION,
  shipdate TIMESTAMP WITHOUT TIME ZONE,
  bsd_refnumber VARCHAR,
  courier_id INTEGER,
  packages INTEGER,
  last_modified TIMESTAMP WITH TIME ZONE,
  masterboxes INTEGER
);

-- Client Changelog
CREATE TABLE client_changelog (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT,
  comment TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Client Risk Assessments
CREATE TABLE client_risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id INTEGER NOT NULL,
  risk_level INTEGER NOT NULL DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  notes TEXT,
  assessed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_assessed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Client Risk Factors
CREATE TABLE client_risk_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID,
  factor_type risk_factor_type NOT NULL,
  impact_score INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Client RX
CREATE TABLE clientrx (
  id INTEGER PRIMARY KEY,
  clientid INTEGER,
  americandr INTEGER,
  info VARCHAR,
  directory VARCHAR,
  dateuploaded DATE,
  last_modified TIMESTAMP WITH TIME ZONE,
  image VARCHAR
);

-- Client RX Details
CREATE TABLE clientrxdetails (
  id INTEGER PRIMARY KEY,
  rxid INTEGER,
  drugid INTEGER,
  drugdetailid INTEGER,
  rxdate DATE,
  refills INTEGER,
  filled INTEGER,
  strength VARCHAR,
  duration VARCHAR,
  qtypercycle INTEGER,
  totalboxesallowed INTEGER,
  yarpadate DATE,
  last_modified TIMESTAMP WITH TIME ZONE
);

-- Clients (Main client table)
CREATE TABLE clients (
  clientid INTEGER PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR,
  address VARCHAR,
  address2 VARCHAR,
  city VARCHAR,
  state VARCHAR,
  zip VARCHAR,
  country VARCHAR,
  dayphone VARCHAR,
  mobile VARCHAR,
  createddate TIMESTAMP WITHOUT TIME ZONE,
  last_modified TIMESTAMP WITHOUT TIME ZONE,
  active BOOLEAN,
  blacklist BOOLEAN,
  blacklistreason TEXT,
  -- ... keep existing code (all the condition_ columns)
  websiteid INTEGER
);

-- Couriers
CREATE TABLE couriers (
  courierid INTEGER PRIMARY KEY,
  name VARCHAR,
  displayname VARCHAR,
  trackinglink VARCHAR
);

-- Customer Call Logs
CREATE TABLE customer_call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id INTEGER,
  called_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  called_by UUID,
  duration_seconds INTEGER,
  outcome TEXT NOT NULL,
  notes TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  segment_id UUID,
  zendesk_ticket_id TEXT
);

-- Dashboard Changelog
CREATE TABLE dashboard_changelog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  previous_state JSONB,
  new_state JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Dashboard Preferences
CREATE TABLE dashboard_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Extra Tracking Numbers
CREATE TABLE extratrackingnumbers (
  autoid INTEGER PRIMARY KEY,
  orderid INTEGER,
  ups VARCHAR,
  shipstatus INTEGER,
  courierid INTEGER,
  sentdate DATE,
  contents TEXT,
  last_modified TIMESTAMP WITH TIME ZONE
);

-- New Drug Details
CREATE TABLE newdrugdetails (
  id INTEGER PRIMARY KEY,
  drugid INTEGER,
  strength VARCHAR,
  packsize INTEGER,
  form INTEGER,
  manufacturer INTEGER,
  supplier INTEGER,
  costnis DOUBLE PRECISION,
  saledollar DOUBLE PRECISION,
  salenis DOUBLE PRECISION,
  available BOOLEAN,
  otc BOOLEAN,
  barcode DOUBLE PRECISION,
  defaultshipper INTEGER,
  weight DOUBLE PRECISION,
  brand BOOLEAN,
  -- ... keep existing code (remaining columns)
  turkey_cost_usd DOUBLE PRECISION
);

-- New Drugs
CREATE TABLE newdrugs (
  drugid INTEGER PRIMARY KEY,
  nameus VARCHAR,
  chemical VARCHAR,
  prescription BOOLEAN,
  visible BOOLEAN,
  refrigerate BOOLEAN,
  refrigeratedays INTEGER,
  availability INTEGER,
  onbothsites BOOLEAN,
  ivf BOOLEAN,
  woopostid BIGINT
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL,
  category TEXT NOT NULL,
  order_id INTEGER,
  alert_source TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Order Delays
CREATE TABLE order_delays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id INTEGER NOT NULL,
  delay_reason TEXT NOT NULL,
  reported_by TEXT,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  estimated_resolution_date TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  priority TEXT,
  impact_assessment TEXT,
  resolution_notes TEXT,
  notification_sent BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Order Status Changes
CREATE TABLE order_status_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id INTEGER NOT NULL,
  old_status INTEGER,
  new_status INTEGER NOT NULL,
  changed_by TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- Orders
CREATE TABLE orders (
  orderid INTEGER PRIMARY KEY,
  clientid INTEGER,
  drugid INTEGER,
  drugdetailid INTEGER,
  amount INTEGER,
  orderdate TIMESTAMP WITHOUT TIME ZONE,
  totalsale DOUBLE PRECISION,
  totalcost DOUBLE PRECISION,
  status INTEGER,
  shipstatus INTEGER,
  cancelled BOOLEAN,
  -- ... keep existing code (remaining columns)
  express_shipping3 BOOLEAN
);

-- Payment Methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id INTEGER NOT NULL,
  payment_type TEXT NOT NULL,
  processor_id INTEGER,
  is_default BOOLEAN DEFAULT false,
  masked_number TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment Tracking
CREATE TABLE payment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id INTEGER NOT NULL,
  payment_method_id UUID,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0,
  last_attempt TIMESTAMP WITH TIME ZONE,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  notes TEXT,
  notify_after_days INTEGER DEFAULT 7,
  notify_after_attempts INTEGER DEFAULT 3,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Processor
CREATE TABLE processor (
  autoid INTEGER PRIMARY KEY,
  name VARCHAR,
  displayname VARCHAR,
  abbrev VARCHAR,
  marker VARCHAR,
  location VARCHAR,
  active BOOLEAN,
  isacc BOOLEAN,
  hasapi BOOLEAN,
  showonivf BOOLEAN,
  sp_mid VARCHAR,
  sp_apilogin VARCHAR,
  sp_apipublickey VARCHAR,
  sp_developerid VARCHAR
);

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer_support',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Stock Count Settings
CREATE TABLE stock_count_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_recipients TEXT[] NOT NULL DEFAULT '{}',
  email_frequency TEXT NOT NULL DEFAULT 'daily',
  last_email_sent TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Stock Counts
CREATE TABLE stock_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id INTEGER,
  drug_detail_id INTEGER,
  count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Suppliers
CREATE TABLE suppliers (
  id INTEGER PRIMARY KEY,
  name VARCHAR,
  yarpacode VARCHAR
);

-- Tracking Status
CREATE TABLE trackingstatus (
  id INTEGER PRIMARY KEY,
  shipstatus VARCHAR
);

-- Trustpilot Reviews
CREATE TABLE trustpilot_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,
  customer_name TEXT,
  status TEXT DEFAULT 'new',
  requires_attention BOOLEAN DEFAULT false,
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Warehouses
CREATE TABLE warehouses (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Websites
CREATE TABLE websites (
  websiteid INTEGER PRIMARY KEY,
  name VARCHAR,
  abbrev VARCHAR,
  phone VARCHAR,
  fax VARCHAR,
  address VARCHAR,
  emailfrom VARCHAR,
  paths VARCHAR,
  loginlink VARCHAR,
  displayorder INTEGER,
  invoicelogo VARCHAR,
  invoiceimgfax VARCHAR,
  invoiceimgtel VARCHAR,
  invoiceimgemail VARCHAR
);

-- Views
CREATE OR REPLACE VIEW vw_client_overview AS
SELECT
  c.*,
  ra.risk_level,
  ra.is_flagged,
  ra.last_assessed_at,
  o.total_orders,
  o.last_order_date,
  o.lifetime_value,
  ARRAY_AGG(DISTINCT 
    CASE 
      WHEN c.condition_anxiety THEN 'anxiety'
      WHEN c.condition_arthritis THEN 'arthritis'
      -- ... keep existing code (other conditions)
    END
  ) FILTER (WHERE 
    c.condition_anxiety OR 
    c.condition_arthritis OR 
    -- ... keep existing code (other conditions)
    c.condition_weight_loss
  ) as conditions
FROM clients c
LEFT JOIN client_risk_assessments ra ON c.clientid = ra.client_id
LEFT JOIN (
  SELECT 
    clientid,
    COUNT(*) as total_orders,
    MAX(orderdate) as last_order_date,
    SUM(totalsale) as lifetime_value
  FROM orders
  WHERE NOT cancelled
  GROUP BY clientid
) o ON c.clientid = o.clientid;

-- Add other views as needed
-- ... keep existing code (remaining views)

