# Loan Management System - Master Development Wireframe

This wireframe outlines the technical and functional architecture of the Loan Management System, incorporating the latest "Offer-Based" business logic and "Perfect White" UI aesthetic.

---

## 🏗️ 1. Architecture Overview (Two-Terminal Setup)

The platform is split into two distinct access points to ensure privacy and security as requested:
1.  **Admin/Lender Terminal**: Professional dashboard for the Owner and Staff.
2.  **Borrower/Agent Terminal**: User-facing portal for client signups and loan tracking.

---

## 👥 2. Roles, Access & Onboarding

| Role | Responsibility | Onboarding Method |
| :--- | :--- | :--- |
| **Admin (Lender)** | Final Decider / Capital Provider | Pre-configured in Database. |
| **Staff** | Verification / Payment Tracking | Manually added by Admin with login credentials. |
| **Borrower** | Interest Payer / Capital User | Self-Signup on website -> Admin Approval. |
| **External Agent** | Referrer / Partner | Self-Signup on website -> Admin Approval. |

---

## 📊 3. Detailed Sidebar Menus (Wireframe)

### 🟢 Admin (Lender) Dashboard
- **Analytics Overview**: Profit metrics, Active book value, Global late alerts.
- **Loan Pipeline**: Handle NEW incoming requests and **"Create Offer"** (Set Custom Interest, Late fee, Grace days).
- **Portfolio Management**: Real-time tracking of generated revenue and principal reduction per loan.
- **Financial Ledger**: History of all payments and pending dues.
- **Network Control**: Manage Staff access, Verify new Borrowers, and Assign/Manage Agent commissions.
- **Configuration**: System-wide settings for Twilio, TRX Wallet, and Interest Defaults.

### 🟡 Staff Panel
- **Operations Dashboard**: Today's collection and verification tasks.
- **Verification Center**: Validate Borrower documents (ID and Proof of Address).
- **Payment Settlement**: Manual entry of incoming payments from borrowers.

### 🔵 Borrower Dashboard
- **Loan Status**: Active loan terms + "Next Payment Date" primary display.
- **Apply Wizard**: Request funds (Amount, Duration, Description) -> Review Admin Offer.
- **Asset Vault**: Upload ID and Collateral images (Required to initiated loan).
- **Repayment Hub**: History of payments + Option to Pay Principal (reduces future interest).

### 🟣 Agent Portal
- **Partner Dashboard**: Real-time commission stats based on client repayments.
- **Referral Tool**: Unique link copy to bring new borrowers.
- **Client Registry**: List of referred borrowers and their current loan status.

---

## 🔄 4. The Loan Lifecycle (The "Simple" Path)

1.  **Application**: Borrower requests $100k for 12 months on the portal.
2.  **Offer Creation**: Admin receives a notification. Admin reviews the request and **custom-sets** the Interest (e.g. 7%), Initiation Fee (e.g. 3%), and Late Penalty.
3.  **Offer Review**: Borrower sees the offer: "You get $97k ($3k fee deducted)".
4.  **KYC Upload**: Borrower accepts the offer and must upload **ID and Address Proof**.
5.  **Initialization**: Admin releases funds. System records the "Initiated Date".
6.  **Repayment**: Borrower pays monthly.
    - **Late Fee Logic**: `(Unpaid Amount × Monthly Penalty %) / 30 × Days Late`.
    - **Early Principal Pay**: Borrower pays extra $5k principal $\rightarrow$ System recalculates next month's interest on the lower balance.
7.  **Commission**: Agent automatically earns their specific % share from the monthly interest paid.

---

## 🎨 5. UI/UX Design System
*   **Theme**: Pure Minimalist White (#FFFFFF background, #F8FAFC accents).
*   **Color Palette**: 
    - **Primary**: Deep Indigo (Professional)
    - **Urgent**: Rose Red (Overdue)
    - **Growth**: Emerald Green (Paid/Profit)
*   **Typography**: Clean High-Density Sans (Inter).
*   **Constraint**: No dummy data; dates must be accurate; no "K" currency (use generic pricing).
