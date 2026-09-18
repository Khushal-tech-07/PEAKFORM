# PeakForm Security Specification & Invariants

## 1. Data Invariants
1. **Public Reading**: Categories and Products are public catalog assets accessible for reading by all users (guests and authenticated).
2. **Catalog Mutation Lockdown**: Only authenticated administrators can create, update, or delete Categories and Products.
3. **Admin Identity**: Admin operations require authentication with verified email (`alphartist222@gmail.com`).
4. **Contact Submissions**: Anyone can submit a contact inquiry, but submissions must have strict type checks, max lengths, and cannot be updated or listed/scraped by unauthorized guests.
5. **Path Variable Hardening**: Document IDs in all collections must not exceed 128 characters and must match `^[a-zA-Z0-9_-]+$`.
6. **Immutable Fields**: `id`, `slug`, and `createdAt` cannot be tampered with once created.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Unauthenticated Product Creation**: Guest attempts to `setDoc` on `/products/malicious-item`. Expect `PERMISSION_DENIED`.
2. **Product Price Inversion / Non-Numeric**: Admin attempts to set `price: "free"` as a string. Expect `PERMISSION_DENIED`.
3. **Oversized String Payload**: Attempt to write 2MB string into `shortDescription`. Expect `PERMISSION_DENIED`.
4. **Ghost Field Injection**: Adding `{ backdoor: true }` to category document. Expect `PERMISSION_DENIED`.
5. **ID Poisoning Attack**: Writing to path `/products/../../root` or junk ID exceeding 128 characters. Expect `PERMISSION_DENIED`.
6. **Unverified Admin Email Spoof**: Auth token claims admin email but `email_verified` is false. Expect `PERMISSION_DENIED`.
7. **Contact Submission Scrape**: Guest trying to list all customer messages from `/contact_submissions`. Expect `PERMISSION_DENIED`.
8. **Contact Submission Tamper**: Attacker trying to update existing contact message. Expect `PERMISSION_DENIED`.
9. **Category Deletion by Guest**: Guest deletes `/categories/cardio-machines`. Expect `PERMISSION_DENIED`.
10. **Negative Price Attack**: Product creation with `price: -499`. Expect `PERMISSION_DENIED`.
11. **Rating Overflow**: Writing `rating: 9999` to product. Expect `PERMISSION_DENIED`.
12. **Malformed Slug Injection**: Slug containing XSS script tags `<script>`. Expect `PERMISSION_DENIED`.
