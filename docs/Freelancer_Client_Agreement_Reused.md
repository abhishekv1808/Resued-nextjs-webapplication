# FREELANCER–CLIENT AGREEMENT

**Reused.in — E-Commerce Web Application**

---

| **Field**            | **Details**                                                     |
| -------------------- | --------------------------------------------------------------- |
| **Date**             | February 16, 2026                                               |
| **Client Name**      | Waseem Pasha                                                    |
| **Brand Name**       | Reused.in                                                       |
| **Freelancer Name**  | [Your Full Name / Company Name]                                 |
| **Freelancer Email** | [Your Email Address]                                            |
| **Client Email**     | [Client Email Address]                                          |
| **Project Title**    | Reused.in — Full-Stack E-Commerce Platform for Used Electronics |

---

This Agreement ("Agreement") is entered into as of **February 16, 2026** ("Effective Date"), by and between:

**Client:** Waseem Pasha (hereinafter referred to as the "Client"), operating under the brand name **Reused.in**.

**Freelancer:** [Your Full Name / Company Name] (hereinafter referred to as the "Freelancer").

Both Parties agree to the terms and conditions set forth below.

---

## 1. Project Scope

### 1.1 Project Description

The Freelancer agrees to design and develop a **full-stack e-commerce web application** for the Client's brand **Reused.in** — a marketplace specializing in premium used and refurbished electronics including laptops, desktops, monitors, and computer accessories. The application is built using **Next.js 16 (App Router)**, **React 19**, **MongoDB (via Mongoose)**, and **Tailwind CSS 4**, and is deployed on **Render**.

---

### 1.2 Included Work

The Freelancer will provide the following services:

#### A. UI/UX Design & Frontend Development

| #   | Feature                   | Description                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Homepage**              | Hero carousel with promotional banners, sub-banners for desktops and monitors, "Why Choose Reused" section, brand logos, Used vs. Refurbished comparison slider, daily best sellers with countdown timer, brand-wise product rows (Apple, Dell, HP, Lenovo), desktops section, monitors section, accessories section, testimonials, exclusive stores, CTA banner, SEO content section, FAQ, and blog section. |
| 2   | **Product Listing Pages** | Category-based pages for Laptops, Desktops, Monitors, and Accessories with brand filtering, sorting, and pagination.                                                                                                                                                                                                                                                                                          |
| 3   | **Product Detail Page**   | Full product view with image gallery, specifications (processor, RAM, storage, display, OS, graphics, screen size, refresh rate, panel type, resolution, form factor), pricing with MRP/discount display, stock alerts, and add-to-cart/wishlist functionality.                                                                                                                                               |
| 4   | **Search Page**           | Full-text search across products by name, brand, description, and category.                                                                                                                                                                                                                                                                                                                                   |
| 5   | **Shopping Cart**         | Persistent cart with quantity management, price breakdown, and discount code application.                                                                                                                                                                                                                                                                                                                     |
| 6   | **Checkout Flow**         | Address input, order summary, discount code validation, and PhonePe payment gateway integration.                                                                                                                                                                                                                                                                                                              |
| 7   | **Payment Success Page**  | Order confirmation with payment verification and order details display.                                                                                                                                                                                                                                                                                                                                       |
| 8   | **Wishlist Page**         | Saved products list with add-to-cart and remove functionality.                                                                                                                                                                                                                                                                                                                                                |
| 9   | **Compare Page**          | Side-by-side product comparison feature.                                                                                                                                                                                                                                                                                                                                                                      |
| 10  | **User Authentication**   | Phone OTP-based login, Google OAuth login, and email-based signup/login.                                                                                                                                                                                                                                                                                                                                      |
| 11  | **User Profile**          | Profile management with name, phone, email, location, address editing, profile image upload, and order history.                                                                                                                                                                                                                                                                                               |
| 12  | **Blog Pages**            | Blog listing page and individual blog detail pages with rich content.                                                                                                                                                                                                                                                                                                                                         |
| 13  | **About Us Page**         | Company information and brand story page.                                                                                                                                                                                                                                                                                                                                                                     |
| 14  | **Contact Us Page**       | Contact form with enquiry submission.                                                                                                                                                                                                                                                                                                                                                                         |
| 15  | **Legal Pages**           | Privacy Policy, Terms of Service, and Return & Refund Policy pages.                                                                                                                                                                                                                                                                                                                                           |
| 16  | **Global Components**     | Responsive header with navigation and cart count, footer with links and newsletter, WhatsApp chat widget, notification banner, loading animations, celebration modal, toast notifications, and stock alert modal.                                                                                                                                                                                             |
| 17  | **Mobile Responsiveness** | Full responsive design optimized for mobile, tablet, and desktop viewports with app-like mobile experience.                                                                                                                                                                                                                                                                                                   |

#### B. Backend Development (API Routes)

| #   | Module                  | Description                                                                                                          |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | **Authentication APIs** | Phone OTP verification, Google OAuth callback, session management using iron-session, login/logout/signup endpoints. |
| 2   | **Product APIs**        | Product listing, filtering by category/brand, search, and individual product retrieval.                              |
| 3   | **Cart APIs**           | Add to cart, update quantity, remove from cart, and get cart contents.                                               |
| 4   | **Order APIs**          | Order creation, PhonePe payment integration, payment verification, order history retrieval.                          |
| 5   | **Stock Alert API**     | User subscription for back-in-stock notifications.                                                                   |
| 6   | **Newsletter API**      | Email subscription management.                                                                                       |
| 7   | **Health Check API**    | Server health monitoring endpoint.                                                                                   |

#### C. Admin Panel Development

| #   | Feature                      | Description                                                                                                                                                                   |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Admin Dashboard**          | Overview page with key metrics, analytics, and daily statistics.                                                                                                              |
| 2   | **Product Management**       | Add/edit/delete products across 4 categories (laptops, desktops, monitors, accessories) with dedicated forms per type, image upload via Cloudinary, and inventory management. |
| 3   | **Order Management**         | View all orders, update order status (Pending → Paid → Confirmed → Processing → Shipped → Delivered), add tracking IDs and courier details, status history timeline.          |
| 4   | **User Management**          | View all registered users, user details, and user analytics.                                                                                                                  |
| 5   | **User Tags**                | Tag-based user segmentation for targeted notifications.                                                                                                                       |
| 6   | **Discount Code Management** | Create/edit/delete discount codes with validation rules and usage limits.                                                                                                     |
| 7   | **Enquiry Management**       | View and manage customer enquiries from the Contact Us form.                                                                                                                  |
| 8   | **Push Notifications**       | Send web push notifications to subscribed users with custom banners using VAPID keys and web-push.                                                                            |
| 9   | **Admin Authentication**     | Secure JWT-based admin login with bcrypt password hashing.                                                                                                                    |

#### D. Database Design & Architecture

| #   | Data Model       | Key Fields                                                                                                                                         |
| --- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Product**      | Name, slug, price, MRP, discount, images, category, brand, rating, stock status, quantity, description, specifications.                            |
| 2   | **User**         | Name, phone, email, location, address, auth provider, profile image, wishlist, cart, tags, last login.                                             |
| 3   | **Order**        | User reference, products array, total amount, payment status, PhonePe transaction IDs, address, customer info, tracking, discount, status history. |
| 4   | **Admin**        | Username, hashed password.                                                                                                                         |
| 5   | **Blog**         | Title, content, date, metadata.                                                                                                                    |
| 6   | **DiscountCode** | Code, discount value, type, usage limits, validity dates.                                                                                          |
| 7   | **Enquiry**      | Customer details, message, status.                                                                                                                 |
| 8   | **Newsletter**   | Subscriber email.                                                                                                                                  |
| 9   | **DailyStats**   | Daily metrics for analytics.                                                                                                                       |
| 10  | **StockAlert**   | Product reference, user contact for back-in-stock alerts.                                                                                          |
| 11  | **Subscription** | Push notification subscription details.                                                                                                            |
| 12  | **RateLimit**    | Rate limiting records for API protection.                                                                                                          |

#### E. DevOps & Deployment

- Render deployment configuration (`render.yaml`)
- SEO optimization: Dynamic `robots.ts`, `sitemap.ts`, meta tags, structured headings
- Performance: MongoDB indexes, data projection, lazy loading
- Security: Rate limiting, sanitized error responses, session-based auth, JWT for admin

#### F. Integrations

- **PhonePe Payment Gateway** — Order payments and verification
- **Cloudinary** — Product image hosting and management
- **Google OAuth** — Social login
- **Web Push (VAPID)** — Browser push notifications
- **WhatsApp** — Customer support chat widget

---

### 1.3 Excluded Work

The following items are **NOT** included in this scope of work:

| #   | Excluded Item                                                                                       |
| --- | --------------------------------------------------------------------------------------------------- |
| 1   | Native mobile application development (iOS / Android)                                               |
| 2   | Content writing for blog posts, product descriptions, and marketing copy (unless agreed separately) |
| 3   | Logo design, brand identity design, or graphic design assets                                        |
| 4   | SMS gateway integration for OTP delivery (Client to provide third-party SMS service)                |
| 5   | Domain purchase, DNS configuration, and SSL certificate management                                  |
| 6   | Email marketing tools or CRM integration                                                            |
| 7   | Advanced analytics or reporting dashboards (e.g., Google Analytics, Mixpanel integration)           |
| 8   | Multi-language / localization support                                                               |
| 9   | Inventory sync with external ERP or warehouse systems                                               |
| 10  | Additional payment gateways beyond PhonePe (e.g., Razorpay, PayTM, Stripe)                          |
| 11  | Third-party logistics (3PL) API integration for automated shipping                                  |
| 12  | Any features, pages, or modules not explicitly listed in Section 1.2                                |

---

## 2. Deliverables and Timeline

The Freelancer agrees to complete the following deliverables on or before the agreed deadlines:

| #   | Deliverable                              | Description                                                                                                                                   | Due Date |
| --- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **Project Setup & Architecture**         | Next.js 16 project initialization, MongoDB setup, folder structure, environment configuration, deployment pipeline on Render                  | [Date]   |
| 2   | **Database Models & API Layer**          | All 12 Mongoose models, authentication APIs, product APIs, cart APIs, order APIs, and utility endpoints                                       | [Date]   |
| 3   | **UI Design System & Global Components** | Tailwind CSS theme, responsive header, footer, loader, toast, WhatsApp widget, notification banner                                            | [Date]   |
| 4   | **Homepage Development**                 | Full homepage with all 15+ sections including hero carousel, product rows, brand logos, testimonials, FAQ, CTA, SEO content, and blog section | [Date]   |
| 5   | **Product Pages**                        | Category listing pages, product detail page with specifications, image gallery, stock alerts                                                  | [Date]   |
| 6   | **User Features**                        | Authentication (phone, Google, email), user profile, wishlist, cart, compare, search                                                          | [Date]   |
| 7   | **Checkout & Payments**                  | Shopping cart, checkout flow, PhonePe payment integration, payment verification, order confirmation                                           | [Date]   |
| 8   | **Admin Panel**                          | Admin dashboard, product CRUD (4 category forms), order management, user management, discount codes, enquiries, push notifications, user tags | [Date]   |
| 9   | **Content & Legal Pages**                | Blog listing & detail, About Us, Contact Us, Privacy Policy, Terms of Service, Return & Refund Policy                                         | [Date]   |
| 10  | **Mobile Responsiveness**                | Full responsive optimization for mobile and tablet across all pages and admin panel                                                           | [Date]   |
| 11  | **SEO & Performance Optimization**       | Dynamic sitemap, robots.txt, meta tags, MongoDB indexes, image optimization, loading performance                                              | [Date]   |
| 12  | **Testing & Bug Fixes**                  | Cross-browser testing, mobile testing, payment flow testing, admin functionality testing, bug resolution                                      | [Date]   |
| 13  | **Final Deployment & Handover**          | Production deployment on Render, environment variable configuration, documentation, and project handover                                      | [Date]   |

> **Note:** All delivery dates assume timely feedback, content, assets, and approvals from the Client. Delays caused by the Client may result in adjusted timelines.

---

## 3. Payment Terms

The Client agrees to pay the Freelancer the following:

| **Item**              | **Details**                     |
| --------------------- | ------------------------------- |
| **Total Project Fee** | ₹[Amount]                       |
| **Currency**          | Indian Rupees (₹ / INR)         |
| **Payment Method**    | Bank Transfer / UPI / [Specify] |

### Payment Structure

| Milestone           | Percentage | Amount    | Due                              |
| ------------------- | ---------- | --------- | -------------------------------- |
| **Advance Payment** | 50%        | ₹[Amount] | Before any work begins           |
| **Final Payment**   | 50%        | ₹[Amount] | Upon final delivery and handover |

### Late Payment Policy

- If payments are delayed beyond **7 days** from the due date, a late fee of **2% per week** may apply until the payment is received in full.
- Work on the project may be paused until outstanding payments are settled.
- Final deliverables and source code will only be handed over upon receipt of full payment.

---

## 4. Revisions

- The Freelancer will provide up to **3 (three) rounds of revisions** on the deliverables listed in Section 2.
- A "revision" is defined as a set of changes to an already-delivered feature or page, communicated in writing by the Client within **5 business days** of delivery.
- Additional revisions beyond the included rounds may incur extra charges at a rate of **₹[Rate] per revision round** or as mutually agreed.
- Major scope changes (new features, pages, or modules not listed in Section 1.2) are not considered revisions and will require a separate scope addendum and additional fees.

---

## 5. Confidentiality

Both Parties agree to the following:

1. **Non-Disclosure:** All business information, project details, technical specifications, login credentials, API keys, customer data, and any other proprietary information shared during this engagement shall be treated as strictly confidential.

2. **Data Protection:** Neither Party will disclose personal or business data to any third party without prior written consent from the other Party.

3. **Security:** The Freelancer agrees to follow industry-standard security practices including:
   - Secure storage of environment variables and API keys (PhonePe credentials, MongoDB URI, Cloudinary keys, VAPID keys, JWT secrets)
   - Password hashing using bcrypt for admin authentication
   - Session-based authentication with iron-session
   - Sanitized API error responses to prevent data leakage

4. **Duration:** This confidentiality obligation shall remain in effect for a period of **2 (two) years** following the termination of this Agreement.

---

## 6. Intellectual Property Rights

### Upon Full Payment

Upon receipt of full and final payment, the Client shall own:

- All **final deliverable source code** of the Reused.in web application
- All **custom UI designs and components** created specifically for this project
- All **database schemas and configurations** designed for the project
- All **deployment configurations** (render.yaml, environment setup documentation)

### Freelancer Retains

The Freelancer retains the right to:

- Display samples, screenshots, and recordings of the work in their **professional portfolio**
- Use screenshots and project descriptions in **marketing materials, case studies, and social media**
- Reference the project in **future client proposals** without disclosing confidential business data

### Pre-existing Materials

The Freelancer retains full ownership of:

- Any **pre-existing code, libraries, frameworks, or tools** used in the project (e.g., open-source packages such as Next.js, React, Mongoose, Tailwind CSS, Framer Motion, Lucide React, etc.)
- Any **generic, reusable code patterns or utilities** not specific to the Client's business logic
- Pre-existing design templates, if any, that were adapted for this project

### Third-Party Licenses

The Client acknowledges that the project uses open-source software governed by their respective licenses (MIT, Apache 2.0, etc.), and ownership of these libraries remains with their original authors.

---

## 7. Termination of Contract

1. Either Party may terminate this Agreement with **15 (fifteen) days' written notice** via email.

2. **If the Client terminates early:**
   - The Client agrees to pay for all work completed up to the date of termination, calculated proportionally based on the deliverables completed as listed in Section 2.
   - Any advance payments already made are non-refundable for work already completed.

3. **If the Freelancer terminates early:**
   - The Freelancer will deliver all completed work and source code for which payment has been received.
   - The Freelancer will provide a reasonable transition period to hand over documentation and assist with knowledge transfer.

4. **Immediate Termination:**
   - Either Party may terminate immediately (without notice) if the other Party:
     - Commits a material breach of this Agreement
     - Fails to make a required payment within 30 days of the due date
     - Engages in fraudulent or illegal activity

---

## 8. Limitation of Liability

1. Under no circumstances will either Party be liable to the other for any **indirect, incidental, consequential, special, or exemplary damages** arising out of or in connection with this Agreement, including but not limited to:
   - Loss of profits, revenue, or business opportunities
   - Loss of data or data breaches caused by third-party services (PhonePe, Cloudinary, MongoDB Atlas, etc.)
   - Downtime of third-party hosting or payment services

2. The **total aggregate liability** of the Freelancer under this Agreement shall not exceed the **total project fee** paid by the Client.

3. The Freelancer is not liable for:
   - Security vulnerabilities in third-party packages, libraries, or frameworks
   - Changes in third-party API terms, pricing, or availability (PhonePe, Google OAuth, Cloudinary)
   - Server or hosting infrastructure failures on Render or MongoDB Atlas
   - Losses resulting from the Client's misuse, unauthorized modifications, or failure to maintain the application post-handover

---

## 9. Dispute Resolution & Jurisdiction

1. **Good Faith Negotiation:** In the event of any dispute arising out of this Agreement, both Parties agree to first attempt to resolve the matter through **good faith negotiation** within **30 days** of written notice of the dispute.

2. **Mediation:** If the dispute is not resolved through negotiation, the Parties agree to engage in **mediation** through a mutually agreed-upon mediator before pursuing any legal action.

3. **Arbitration:** If mediation fails, the dispute shall be referred to **binding arbitration** in accordance with the Arbitration and Conciliation Act, 1996 (India).

4. **Governing Law:** This Agreement shall be governed by and construed in accordance with the **laws of India**.

5. **Jurisdiction:** Any legal proceedings, if necessary, shall be filed exclusively in the courts of **Bengaluru, Karnataka, India**.

---

## 10. Post-Delivery Website Maintenance

### 10.1 Maintenance Period

Following the final delivery and handover of the project, the Freelancer agrees to provide website maintenance support for a period of **[Number] months** from the date of final delivery ("Maintenance Period").

### 10.2 What is Included in Maintenance

During the Maintenance Period, the Freelancer will be responsible for resolving the following types of issues **at no additional cost**:

| #   | Covered Item                    | Description                                                                                                                         |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Code Bug Fixes**              | Fixing bugs, errors, or defects in the application code (frontend and backend) that were part of the original delivered scope       |
| 2   | **Database Issues**             | Resolving MongoDB connection errors, query failures, data corruption, index issues, or schema-related problems                      |
| 3   | **Hosting & Deployment Errors** | Fixing deployment failures on Render, build errors, environment variable misconfigurations, and server crashes                      |
| 4   | **Website Errors**              | Resolving broken pages, 404 errors, 500 server errors, API route failures, and rendering issues                                     |
| 5   | **Authentication Issues**       | Fixing login/logout failures, session expiry issues, OTP verification errors, and Google OAuth callback problems                    |
| 6   | **Payment Gateway Errors**      | Resolving PhonePe payment processing failures, callback errors, or payment verification issues (excluding changes to PhonePe's API) |
| 7   | **Performance Issues**          | Addressing performance degradation, slow page loads, or memory leaks caused by the delivered code                                   |
| 8   | **Mobile Responsiveness Bugs**  | Fixing layout or display issues on specific devices or browsers that break the existing responsive design                           |
| 9   | **Admin Panel Errors**          | Resolving any bugs or errors in the admin dashboard functionality as originally delivered                                           |

### 10.3 What is NOT Included in Maintenance

The following items are **explicitly excluded** from the maintenance scope and will require a **separate agreement and additional fees**:

| #   | Excluded Item                    | Description                                                                                                                               |
| --- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **New Feature Development**      | Any new features, functionalities, or capabilities not part of the original scope defined in Section 1.2                                  |
| 2   | **New Page Creation**            | Creating new pages, routes, or sections that were not part of the original deliverables                                                   |
| 3   | **New Integrations**             | Adding new third-party service integrations (e.g., new payment gateways, shipping APIs, analytics tools, CRM systems, email services)     |
| 4   | **Major UI/UX Redesign**         | Significant design overhauls, theme changes, layout restructuring, or rebranding of the website                                           |
| 5   | **New Module Development**       | Building new admin modules, new API endpoints, or new database models not listed in the original scope                                    |
| 6   | **Content Updates**              | Adding, editing, or removing product listings, blog posts, banners, images, or marketing content (Client can do this via the Admin Panel) |
| 7   | **Technology Upgrades**          | Upgrading to newer versions of Next.js, React, or other core dependencies, or migrating to a different tech stack                         |
| 8   | **Third-Party Service Changes**  | Issues caused by changes in third-party APIs (PhonePe, Google, Cloudinary) that require code rewriting or migration                       |
| 9   | **Infrastructure Scaling**       | Server scaling, database optimization for significantly increased traffic, CDN setup, or load balancing configuration                     |
| 10  | **SEO Campaigns & Optimization** | Ongoing SEO work, keyword optimization, Google Search Console management, or analytics report generation                                  |
| 11  | **Security Audits**              | Comprehensive security audits, penetration testing, or compliance certifications (e.g., PCI DSS)                                          |

### 10.4 Maintenance Terms & Conditions

1. **Response Time:** The Freelancer will acknowledge reported issues within **24–48 hours** during business days (Monday to Saturday, 10:00 AM – 7:00 PM IST).

2. **Resolution Time:** Bug fixes and error resolutions will be completed within a **reasonable timeframe** depending on severity:
   - **Critical** (site down, payments broken): Within **24 hours**
   - **High** (major feature broken): Within **48–72 hours**
   - **Medium** (minor bugs, UI glitches): Within **5–7 business days**
   - **Low** (cosmetic issues): Within **10 business days**

3. **Issue Reporting:** All maintenance requests must be communicated in writing (email or agreed messaging platform) with a clear description of the issue, steps to reproduce, and screenshots where applicable.

4. **Access Requirement:** The Client must ensure the Freelancer has continued access to the hosting platform, database, and relevant services during the Maintenance Period.

5. **Limitation:** Maintenance does not cover issues arising from:
   - Unauthorized code modifications made by the Client or third parties
   - Changes to server/hosting environment not made by the Freelancer
   - Misuse of the Admin Panel resulting in data corruption
   - Force majeure events or third-party service outages

6. **Post-Maintenance Period:** After the Maintenance Period expires, any support, bug fixes, or maintenance will be provided on a **paid basis** at a mutually agreed hourly or per-task rate.

---

## Signatures

By signing below, both Parties acknowledge that they have read, understood, and agree to the terms and conditions of this Agreement.

&nbsp;

**Client**

| Field         | Details                  |
| ------------- | ------------------------ |
| **Name**      | Waseem Pasha             |
| **Brand**     | Reused.in                |
| **Signature** | **\*\***\_\_\_\_**\*\*** |
| **Date**      | **\*\***\_\_\_\_**\*\*** |

&nbsp;

**Freelancer**

| Field         | Details                       |
| ------------- | ----------------------------- |
| **Name**      | [Your Full Name]              |
| **Company**   | [Company Name, if applicable] |
| **Signature** | **\*\***\_\_\_\_**\*\***      |
| **Date**      | **\*\***\_\_\_\_**\*\***      |

---

_This document was generated on February 16, 2026. Both Parties should retain a signed copy for their records._
