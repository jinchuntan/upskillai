# upskill.ai.my

A mobile-friendly Malaysian studio shop for practical AI ebooks, digital wedding invitations and classes with Nigel Tan.

## Run locally

The ready-to-serve website lives in `dist/`. Run `python3 -m http.server 8000 --directory dist` from the repository root and visit `http://localhost:8000`. The site uses relative URLs and works under a subdirectory.

## Edit the shop

- Edit products, prices in MYR, class descriptions, or lesson samples in `src/catalog.mjs`.
- Edit layout and page templates in `src/build.mjs` and the styles, browser interactions, invitation and images in `dist/`.
- Run `npm run build` with Node.js 18 or later to regenerate the catalogue and product pages. The build has no package dependencies.
- The free five-page guide is included in `dist/downloads/everyday-ai.pdf`. To revise it, edit `src/make_guide.py` and run it with Python and ReportLab.
- The site serves its fonts locally. Their SIL Open Font Licenses are included in `dist/assets/`.

## Launch settings

The free ebook is downloadable. The Essentials and Premium products show provisional RM29 and RM39 prices. To start selling either product, finish the ebook, set up a merchant-hosted product that handles payment and delivers the file, then set the product's HTTPS `checkoutUrl`, update its preview wording, and rebuild. Keep paid files with the fulfilment provider; this repository is public.

Classes currently show outlines and warm-up exercises. When enrolment opens, update the label and dates in the catalogue, set the class’s HTTPS `bookingUrl`, and rebuild. The wedding card is an interactive demonstration with three styles, fictional events and a calendar download. Sample RSVPs stay in the open page. Saved shop items are stored in the visitor's browser.

Deploy the contents of `dist/` to a static host. To use the proposed `upskill.ai.my` domain, configure the domain in the chosen host and apply its DNS records with the domain owner.

## Seri Melur wedding e-card

Share `/jemputan/seri-melur/` for the standalone guest experience, or open **Wedding cards → Seri Melur** in the shop. The sample uses fictional families. Its RSVP previews a reply in the page and does not send guest data.

Edit the event and Malay invitation text in `src/invitations/seri-melur.mjs`. Run `npm run build` to regenerate the HTML and calendar together. The card's styles, interaction code and original illustration live in `dist/jemputan/seri-melur/`.
