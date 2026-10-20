# Prompt: write the sPark Privacy Policy and Terms of Use

Paste everything below the line into a capable LLM (ideally one with access to this
repository). It is self-contained. The result replaces the interim content in
`src/legal.mjs`. This file lives in `reference/`, so it is never published.

---

## ROLE

You are a senior technology-and-privacy lawyer and a plain-language writer. You draft
Privacy Policies and Terms of Use for consumer mobile apps and B2B web dashboards operating
in Greece and the EU. Your drafts are precise, readable by non-lawyers, and never claim
more than the product actually does.

## TASK

Write the full text of **four documents** for the **sPark** platform:

1. Privacy Policy — Greek (`el`)
2. Privacy Policy — English (`en`)
3. Terms of Use — Greek (`el`)
4. Terms of Use — English (`en`)

They are published on the public brand site (`https://sparkparking.gr`) at `/privacy/`,
`/terms/`, `/en/privacy/` and `/en/terms/`. They must also satisfy the **Google OAuth
consent-screen verification** (and the Apple and Meta/Facebook sign-in app reviews), which
require a public privacy policy and terms of service on the app's verified domain.

Greek is the primary language. Write the Greek natively, not as a translation of the
English; both must say the same thing. Use the informal second person (εσύ) for drivers,
matching the brand voice, and a neutral professional tone for operators.

## HARD RULES

1. **Never invent facts about the product.** Use only the facts in "PLATFORM FACTS" below,
   or facts you verify in the repository. If a fact is needed but unknown, do not guess:
   write the sentence in a way that stays true either way, and list the gap under
   "OPEN QUESTIONS" in your reply.
2. **Never promise what the product does not do.** No claims of "bank-grade", "military",
   "100% secure", "we never share data" unless literally true. Describe measures
   factually (e.g. passwords are hashed with scrypt; reset tokens are stored only as a
   hash; session tokens are kept in the OS secure store on mobile).
3. **Not legal advice boilerplate.** Do not paste generic template clauses that do not
   apply (no cookies section describing cookies the site does not set; no children's
   marketing; no sale of data). Every clause must map to a real feature or a real legal
   obligation.
4. Plain text only. No HTML, no Markdown inside strings.
5. Do not touch anything except `src/legal.mjs`. Do not change the schema.

## OUTPUT FORMAT (exact)

Replace the `LEGAL` export in `src/legal.mjs`. Keep `LEGAL_KINDS`, `COMPANY` (in `content.mjs`), `legalPath`
and `TOKENS` as they are. Shape:

```js
export const LEGAL = {
  el: { privacy: DOC, terms: DOC },
  en: { privacy: DOC, terms: DOC },
}

// DOC
{
  title: 'Privacy Policy',
  description: 'One sentence, 70-160 characters, used as meta description.',
  updated: 'YYYY-MM-DD',          // today's date
  intro: ['paragraph', ...],      // 1-3 short paragraphs, before the contents list
  sections: [
    { id: 'kebab-case-id', h: 'Heading', body: [BLOCK, ...] },
  ],
}

// BLOCK is one of
'A plain paragraph.'
{ ul: ['item', ...] }
{ ol: ['item', ...] }
{ table: { head: ['Col', ...], rows: [['cell', ...], ...] } }
```

Constraints enforced by the test suite (`pnpm run test`):

- For each kind (`privacy`, `terms`) the **section `id`s must be identical and in the same
  order in `el` and `en`**. Headings and text differ; ids do not.
- Ids are unique, lowercase kebab-case, starting with a letter.
- No `<` followed by a letter anywhere in the text (no HTML).
- No unresolved `{{...}}` tokens. Available tokens, substituted at build time:
  `{{CONTACT_EMAIL}}` (turned into a mailto link), `{{SITE}}`, `{{COMPANY_NAME}}`,
  `{{COMPANY_ADDRESS}}`. Use `{{CONTACT_EMAIL}}` for every contact point; there is one
  address. Do not hard-code an email address.
- Tables are for data inventories and processor lists only (keep cells short).

After writing, run in `apps/spark-parking-brand`: `pnpm run build && pnpm run test`. The
only tests allowed to fail are three that were already failing before this task
(`translations are complete…`, `body content is in the HTML…`,
`long price amounts are scaled down…`). Everything about legal pages must pass.

## PLATFORM FACTS

sPark ("Make Parking Smart") is a Greek parking marketplace. Drivers find, compare and book
parking on a live map; parking operators manage their facilities on a web dashboard. It
launches in Greece (Athens first). Interface languages: Greek and English.

### Three surfaces

| Surface | What it is | Users |
| --- | --- | --- |
| Mobile app (iOS and Android; Expo/React Native; bundle id `gr.parking.spark`) | Map, search, price comparison for an exact stay, booking, payment, rotating QR code for entry, saved facilities, trips, reviews, wallet credits, driver subscription plans, push notifications | **Drivers** ("mobile users") |
| Web portal / dashboard (Next.js) | Operator dashboard: facilities, zones, opening hours, capacity and live occupancy, tariffs, bookings, staff members, analytics, billing/subscription, audit log. Platform admin area for sPark staff | **Operators** (roles `OPERATOR_ADMIN`, `OPERATOR_STAFF`), **platform staff** (`PLATFORM_ADMIN`, `SUPER_ADMIN`) |
| Public brand site (`sparkparking.gr`, static) | Marketing page and these legal documents. Collects **no** personal data: no forms, no cookies, no analytics, no third-party requests, self-hosted fonts. Only browser storage is `localStorage['spark-theme']` (light/dark), a functional preference | Anyone |

Driver accounts and staff/operator accounts are **separate account systems** by design: a
mobile session can never act as a staff user and vice versa.

### Personal data actually held (from the database schema)

Drivers (`MobileUser` and related):

- Email (lowercased), display name, avatar URL, email-verified flag, account status
  (active / deactivated / suspended / deleted), timestamps.
- Password hash (scrypt, per-hash random salt) when a password identity exists. Never the
  password itself.
- Sign-in identities: one row per method (password, Google, Facebook, Apple) holding the
  provider's stable subject id, the email the provider asserted, verified flag, last-used
  time. **No provider access or refresh tokens are stored.**
- Vehicles: licence plate, vehicle type (car, motorbike, van, truck), optional label,
  default flag.
- Bookings: facility, vehicle plate, start/end, price, status and status history, source
  channel, a per-booking secret used to compute rotating entry QR codes, applied
  driver-subscription discount.
- Payments and refunds: provider reference ids and statuses. **Card numbers are handled by
  Stripe and never stored by sPark.**
- Wallet: balance in EUR cents and a ledger of credit transactions.
- Driver subscriptions and a billing-customer reference at the payment provider.
- Saved (favourite) facilities; reviews (rating, optional text, linked to booking).
- Mobile profile: push notification token, locale, app version, last-active time (written
  on launch/token refresh).
- Password-reset tokens: stored only as a SHA-256 hash, single use, short-lived.
- Session revocation watermark (timestamp).
- **Device location**: the app asks for foreground location only
  (`ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`; iOS "when in use") to show nearby
  parking and distance. Verify in `apps/spark-parking-api` and
  `apps/spark-parking-mobile` whether coordinates are ever sent to or stored by the
  server; state exactly what you find.

Operators and staff (`User` and related):

- Email, display name, avatar URL, role, email-verified flag, password hash or an external
  identity-provider uid (Firebase), lifecycle status.
- Operator organisation data: business name, memberships and roles, invitations (token
  stored only as a hash), facilities, tariffs, rules, images, managers.
- Operator subscription and billing-customer reference.
- **Audit log**: actor id and role, action, entity, payload, **IP address**, timestamp.

Platform-wide:

- Server logs and rate-limiting data (verify what is logged; the project rule is that raw
  tokens, passwords and PII are never logged).
- Facility data ingested from OpenStreetMap (Overpass) and Google Places is business
  location data, not personal data.

### Account lifecycle and retention (verify in code before writing numbers)

- Self-service **account deletion** exists (`apps/spark-parking-api/src/auth/
  account-deletion.service.ts`). A deleted user row is **anonymised in place**, not
  removed, because bookings are financial records: identifying fields are stripped, the
  email is rewritten so the address can register again, the identity-provider credential
  is destroyed, and the row can never authenticate again.
- Admin lifecycle (deactivate / suspend / delete / purge) with a restorable window before
  permanent purge: `LIFECYCLE_PURGE_RETENTION_DAYS`, default **30** days.
- Read `account-deletion.service.ts`, `lifecycle-purge.service.ts` and the Prisma schema
  to state precisely what is erased, what is anonymised, and what is kept (bookings,
  payments, invoices, audit log) and for how long. Greek tax and accounting law requires
  retention of accounting records; cite it as the reason without inventing a period you
  cannot verify (list it under OPEN QUESTIONS if the code does not define one).

### Third parties / processors (verify each against the code and `.env.example`)

Providers are chosen by environment variable; describe each as "where enabled", and in the
OPEN QUESTIONS list say which ones production actually uses.

| Purpose | Provider(s) in code |
| --- | --- |
| Sign-in | Google Sign-In (mobile, OAuth), Sign in with Apple, Facebook Login, email + password; staff web sign-in via Auth.js or Firebase Authentication (Clerk and Supabase adapters also exist) |
| Maps and places | Google Maps (mobile and web), Mapbox (alternative), OpenStreetMap Overpass and Google Places for facility ingestion |
| Payments | Stripe (cards, driver and operator subscriptions, webhooks). A mock provider exists for development only |
| Email | Resend or SendGrid (transactional: password reset, invites, booking notices) |
| Push | Expo Push Service (token stored in the mobile profile) |
| Hosting / data store | PostgreSQL, Redis. Hosting vendor and region are **not** in the repo: OPEN QUESTION |

There is **no** analytics SDK, no advertising SDK and no crash-reporting SDK in any of the
three apps. Say so only if you re-verify it with a search for analytics/crash packages in
all three `package.json` files.

### Security measures that may be described (all real, verify before citing)

scrypt password hashing; hashed single-use reset and invite tokens; session revocation
watermark; tokens in `expo-secure-store` (never AsyncStorage) on mobile; Zod input
validation; authorization checks in controller and service; rate limiting on login, OTP,
search and booking; idempotency keys on payments and booking confirmation; cryptographic
verification of payment webhooks; row-level locking to prevent overbooking; admin
endpoints not exposed in client bundles; audit logging of administrative actions; a
separated super-administrator tier for any action on user accounts.

### Commercial facts for the Terms

- Drivers: free to browse (no sign-up needed to view the map and prices). An account is
  needed to book, pay, save, review and hold a wallet. Bookings are for a vehicle at a
  facility for a time window; the price is computed from the operator's tariff; booking
  statuses and a cancellation/refund flow exist (check `BookingStatus`, `RefundStatus`,
  facility rules and the booking service for the real cancellation and no-show behaviour;
  the brand copy says "free cancellation" for some bookings: state the rule exactly as
  the code implements it, not as marketing).
- **sPark is a marketplace/intermediary.** The parking service is provided by the
  independent operator that runs the facility; sPark does not own or run the car parks,
  does not guarantee a physical space, and is not liable for vehicle damage or theft on
  the premises (draft this carefully and in line with Greek consumer law: no clause may
  waive mandatory consumer rights).
- Wallet credits, promotions and driver subscription plans exist; read the schema and the
  `subscriptions` and `payments` modules for real terms (billing interval, trial,
  renewal, cancellation, whether credits are refundable or expire).
- Operators: B2B. Invited by email or by self-registration where
  `OPERATOR_SELF_SIGNUP_ENABLED`; subscription plans with billing through Stripe; they are
  responsible for the accuracy of their prices, hours, capacity and rules, for their own
  tax invoicing, and for lawful processing of any data they receive about drivers. In
  that relationship sPark is **processor** for operator-held booking data it processes on
  the operator's behalf and **controller** for its own account, security and billing data;
  say so, and add a short processor-terms section or clause.
- Acceptable use, account termination/suspension (the product has suspend, deactivate and
  delete states), intellectual property (sPark name, mark and software; operator content
  licence), availability and changes, limitation of liability within what Greek and EU
  law allows, governing law (Greece), jurisdiction (courts of Athens, subject to
  mandatory consumer forum rules), changes to terms and notice.
- Greek and EU consumer requirements to cover for drivers: right of withdrawal for
  distance contracts and the **exception for services performed at a specific date or
  period** (parking bookings usually fall under it: state the correct position), clear
  total price including taxes, complaints channel, EU Online Dispute Resolution /
  alternative dispute resolution information, Hellenic Consumers' Ombudsman.

### Legal frame to apply (confirm current article numbers; do not cite from memory if unsure)

- GDPR (EU 2016/679), Greek Law 4624/2019, ePrivacy Law 3471/2006 (Greece), Hellenic Data
  Protection Authority (www.dpa.gr) as supervisory authority.
- Greek consumer protection law 2251/1994 and the EU Consumer Rights Directive as
  transposed; EU Digital Services Act and Platform-to-Business rules where they apply to
  a marketplace.
- Lawful bases to map explicitly per purpose: contract (accounts, bookings, payments),
  legal obligation (accounting, tax), legitimate interests (security, fraud prevention,
  audit logs), consent (push notifications, precise location permission).
- Data-subject rights: access, rectification, erasure, restriction, portability,
  objection, withdrawal of consent, complaint to the DPA. Describe how to exercise them
  (email {{CONTACT_EMAIL}}; in-app account deletion) and the one-month response time.
- International transfers (Stripe, Google, Expo, email vendors are US-based or have US
  affiliates): mention safeguards generically (adequacy decision / standard contractual
  clauses) without naming a mechanism you cannot verify.
- Children: the service is not directed at under-18s (driving/booking age); no
  knowingly collected data from minors.

### Google / Apple / Meta review requirements for the Privacy Policy

The policy must, in the Greek and the English version:

- Name the app and the operator of the service; say it is hosted on `{{SITE}}`.
- State which Google user data sPark accesses through Google Sign-In: **only** the basic
  profile data (name, email address, profile picture) and the account's stable id; no
  Gmail, Drive, Calendar or other Google data; no restricted or sensitive scopes.
- State how it is used (create/sign in to the account, link the account to the same
  verified email, show name and avatar), that no Google access/refresh token is stored,
  that it is not sold, not used for advertising, not shared with third parties except the
  processors listed, and not used to train generalised AI models.
- Include a sentence that sPark's use of information received from Google APIs complies
  with the Google API Services User Data Policy, including the Limited Use requirements.
- Say the same, adapted, for Sign in with Apple (name and email, possibly private relay
  address) and Facebook Login (name, email, profile picture).
- Explain how a user revokes access (Google Account permissions page, in-app deletion)
  and how to request deletion.

## STRUCTURE TO FOLLOW

Privacy Policy sections (use these ids, in this order; add more only if the platform
facts require it, in both languages):

`who-we-are`, `scope`, `data-we-collect`, `how-we-use-data`, `legal-bases`,
`social-sign-in`, `location`, `payments`, `sharing-and-processors`,
`international-transfers`, `retention`, `your-rights`, `security`, `children`,
`brand-site`, `changes`, `contact`.

- `data-we-collect` is a **table**: category, examples, source, purpose. Separate the
  driver app and the operator dashboard.
- `sharing-and-processors` is a **table**: recipient, purpose, data involved.
- `brand-site` states that `sparkparking.gr` sets no cookies, runs no analytics and loads
  nothing from third parties, and stores only the theme preference locally.
- `contact` uses `{{CONTACT_EMAIL}}` and `{{COMPANY_NAME}}` / `{{COMPANY_ADDRESS}}`, and
  names the Hellenic DPA as the authority to complain to.

Terms of Use sections (ids, in this order):

`acceptance`, `the-service`, `accounts`, `driver-bookings`, `prices-and-payments`,
`cancellations-and-refunds`, `wallet-and-subscriptions`, `operator-terms`,
`acceptable-use`, `content-and-reviews`, `intellectual-property`,
`availability-and-changes`, `suspension-and-termination`, `liability`,
`consumer-rights`, `data-protection`, `governing-law`, `changes-to-terms`, `contact`.

- `operator-terms` and the processor clause apply to the web dashboard; keep driver-facing
  and operator-facing obligations clearly separated.
- Each document opens with `intro` that says, in two or three sentences, who the document
  covers (drivers using the app, operators using the dashboard) and that using the service
  means accepting it.

## STYLE

- Short sentences. Defined terms used consistently: "sPark", "you", "driver", "operator",
  "facility", "booking".
- Headings are questions or plain labels, never legalese Latin.
- Greek: use proper monotonic Greek, consistent terminology (e.g. "δεδομένα προσωπικού
  χαρακτήρα", "υπεύθυνος επεξεργασίας", "εκτελών την επεξεργασία"), no machine-translated
  stiffness. A native speaker/lawyer should still review it; do not mention that in the
  document itself.
- Target length: Privacy 2,000–3,000 words per language; Terms 2,000–3,000 words per
  language. Completeness over brevity, but no filler.

## FINAL REPLY (after the file is written)

Give me, in this order:

1. **OPEN QUESTIONS** — every fact you could not verify and had to word around (legal
   entity name, registration/GEMI and VAT numbers, registered address, whether a DPO is
   required, hosting provider and region, which providers production uses, exact retention
   periods, cancellation/refund rules, wallet credit expiry, subscription terms). For each:
   what is needed, and where in the document it matters.
2. **DISCREPANCIES** — places where the brand-site marketing copy or the code contradicts
   what the documents must say (e.g. "free cancellation" claims, "no sign-up to browse").
3. **WHAT I VERIFIED** — a short list of files you read to ground the documents.
4. Confirmation that `pnpm run build` succeeded and which tests passed.

Do not summarise the documents; they are in the file.
