/*
# Create enquiries table

1. New Tables
- `enquiries`: stores website enquiry form submissions.
  - `id` (uuid, primary key)
  - `full_name` (text, required)
  - `company_name` (text, optional)
  - `phone` (text, required)
  - `email` (text, required)
  - `category` (text, required) - one of the enquiry categories offered on the contact form
  - `product_interest` (text, optional)
  - `quantity` (text, optional)
  - `message` (text, required)
  - `created_at` (timestamptz, defaults to now)

2. Security
- Row level security enabled on `enquiries`.
- Website visitors (anon role) may only INSERT. They cannot read, update or delete submissions.
- Length limits are enforced in the database as a safety net against oversized submissions.

3. Notes
- The website has no sign-in, so submissions are made with the public anon key.
- Staff read submissions from the Supabase dashboard.
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  company_name text CHECK (company_name IS NULL OR char_length(company_name) <= 160),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  category text NOT NULL CHECK (char_length(category) <= 80),
  product_interest text CHECK (product_interest IS NULL OR char_length(product_interest) <= 160),
  quantity text CHECK (quantity IS NULL OR char_length(quantity) <= 120),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON enquiries TO anon;

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries" ON enquiries FOR INSERT
  TO anon WITH CHECK (true);
