# Company Website: Animal Feed and Veterinary Products

A multi-page corporate website for an animal feed manufacturer that also supplies veterinary drugs and animal healthcare products. Built with plain HTML5, CSS3 and vanilla JavaScript. No build step and no frameworks.

## Project structure

```
index.html            Home page
about.html            About Us
products.html         Product catalogue with category filters and search
manufacturing.html    Feed manufacturing process and facility
veterinary.html       Veterinary products and use notice
contact.html          Contact details, enquiry form, map
privacy.html          Privacy Policy (draft template)
terms.html            Terms and Conditions (draft template)
css/style.css         All styling and design tokens
js/config.js          Company details and Supabase connection settings
js/script.js          Navigation, filters, search, reveal effects and enquiry form
images/logo.svg       Logo
supabase/migrations/  Database migration for the enquiries table
```

## Editing company details

Open `js/config.js` and replace the values:

- `companyName`: legal or trading name shown across the site
- `phoneDisplay`: phone number as shown to visitors, e.g. `+234 801 234 5678`
- `phoneNumber`: digits only with country code, used in the phone link, e.g. `2348012345678`
- `email`: public enquiry email
- `whatsappNumber`: digits only with country code, used for every WhatsApp link, e.g. `2348012345678`
- `supabaseUrl` and `supabaseAnonKey`: see below

Company name, phone, email and WhatsApp are filled in automatically across all pages from this file. Each page's text is also present in the HTML as a fallback.

## Connecting Supabase (enquiries)

Enquiries are saved to a Supabase table called `enquiries`.

1. In the Supabase dashboard, open **Project Settings > API**.
2. Copy the **Project URL** into `supabaseUrl` and the **anon public** key into `supabaseAnonKey` in `js/config.js`.
3. The table is defined in `supabase/migrations/20261031010011_create_enquiries_table.sql`. It has row level security enabled and a single policy that lets the public anon key **insert** enquiries only. Nobody using the public key can read them.
4. Read enquiries in the Supabase Table Editor, which uses your dashboard login rather than the public key.

If the URL or key is empty, the form shows an error message and does not pretend to send. Until the values are added, enquiries will not be saved.

Note that the anon key is public by design and ships to the browser. Protection comes from the row level security policy, so keep that policy in place.

## Placeholders to replace

Items shown in gold-tinted text (class `editable`) or in square brackets must be replaced before launch:

- Company name, phone numbers, email and WhatsApp number (`js/config.js` and the topbar, footer and contact details)
- Social profile links: the Facebook, Instagram, X and TikTok links currently point to the platform homepages
- Address, business hours and Google Maps location (currently centred on Lagos, Nigeria)
- Founding year, history timeline and company background on `about.html`
- Manufacturing facility specifications on `manufacturing.html` (marked [To be confirmed])
- Registrations, certifications and regulatory notices on `about.html` and `veterinary.html`
- Privacy Policy and Terms: company address, retention period, payment and delivery terms, returns procedure, liability wording and governing law. Have a qualified adviser review both pages before publishing.
- Copyright year is hard-coded as 2026 in the footers

Do not publish product claims, dosages, registration numbers or certifications that have not been confirmed.

## Images

Photos are loaded directly from Pexels (images.pexels.com). Only the logo is stored locally. To self-host photos, download them into `images/`, update the `src` attributes, and confirm the licence allows it.

## Deployment

The site is static. Upload all files (keeping folder structure) to any static host such as Netlify, Vercel, Cloudflare Pages or cPanel. No build command is needed. Point your domain at the host and make sure `index.html` is the root page.

## Testing checklist

- Open every page on desktop (1440px), tablet (768px) and mobile (375px and 360px). Confirm there is no horizontal scrolling.
- Open and close the mobile menu. Confirm the page does not scroll behind it.
- On products, test each category filter, search, combined filter and search, and the empty-results message.
- Open `products.html?filter=poultry` and confirm the filter is pre-selected.
- On contact, submit the form empty, with invalid values, and with valid values. Check the error messages and the success or fallback message.
- Confirm the "Enquire about this product" links pre-fill the product and category on the form.
- Test every WhatsApp, phone, email and social link.
- Check the Privacy Policy and Terms links in the footer on every page.
- Test with keyboard only: tab order, focus outlines and the menu toggle.
- Run the site through Google Lighthouse (performance, accessibility, SEO) before launch.
