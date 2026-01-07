# Phase 1 Implementation Plan: The Business Layers

**Goal**: Implement the critical "Wallet" (Finance) and "Voice" (Communication) of the Madrasti2 system. These are prerequisites for the final Performance Reports.

---

## Part A: The Finance Module (`backend/finance`)
**Objective**: Manage school fees, invoicing, and payment tracking.

### 1. Database Schema (Models)
We need a flexible system that handles different fee types (Tuition, Transport, Registration) and varying costs per grade.

*   **`FeeCategory`**
    *   `name`: e.g., "Monthly Tuition", "Registration Fee", "Transport Zone A".
    *   `type`: `RECURRING` (Monthly) or `ONE_TIME` (Yearly).
*   **`FeeStructure`**
    *   `academic_year`: Link to current year.
    *   `grade`: Link to Grade (e.g., Grade 1).
    *   `category`: Link to FeeCategory.
    *   `amount`: Decimal (e.g., 1500.00).
    *   *Logic*: "Grade 1 Tuition is 1500 DH".
*   **`Invoice`**
    *   `student`: Link to Student.
    *   `month`: Date (e.g., Nov 2025).
    *   `total_amount`: Sum of items.
    *   `status`: `DRAFT`, `ISSUED`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`.
    *   `due_date`: Date.
*   **`InvoiceItem`**
    *   `invoice`: Link to Invoice.
    *   `description`: "November Tuition".
    *   `amount`: 1500.00.
*   **`Payment`**
    *   `invoice`: Link to Invoice.
    *   `amount`: Amount paid.
    *   `date`: Payment date.
    *   `method`: `CASH`, `CHECK`, `TRANSFER`.
    *   `transaction_id`: Optional reference.
    *   `recorded_by`: Admin user who took the money.

### 2. API Endpoints
*   `GET /api/finance/config/`: Manage fee structures.
*   `POST /api/finance/invoices/generate/`: Bulk generate invoices for a specific month/grade.
*   `GET /api/finance/students/{id}/invoices/`: Parent/Admin view of student history.
*   `POST /api/finance/payments/`: Record a payment (Admin only).

### 3. Frontend Views
*   **Admin**:
    *   **Fee Setup**: Table to set prices per grade.
    *   **Invoicing Dashboard**: "Generate November Invoices" button. List of unpaid invoices.
    *   **Cashier View**: Quick lookup student -> Accept Payment -> Print Receipt.
*   **Parent**:
    *   **Financial Status**: View list of invoices (Paid/Unpaid).
    *   **History**: Download PDF receipts.

---

## Part B: The Communication Module (`backend/communication`)
**Objective**: Enable direct, tracked communication between school stakeholders.

### 1. Database Schema (Models)
*   **`Conversation`**
    *   `participants`: M2M to User.
    *   `type`: `DIRECT` (1-on-1) or `GROUP` (Class discussion).
    *   `related_student`: Optional link (e.g., "Discussing Student Alice").
    *   `updated_at`: Timestamp for sorting.
*   **`Message`**
    *   `conversation`: Link to Conversation.
    *   `sender`: Link to User.
    *   `content`: Text.
    *   `attachment`: File (optional).
    *   `is_read`: Boolean.
*   **`Announcement`**
    *   `title`: Text.
    *   `content`: Rich Text.
    *   `target_role`: `ALL`, `PARENTS`, `TEACHERS`.
    *   `target_grade`: Optional filter (e.g., "Only Grade 5 Parents").
    *   `is_published`: Boolean.

### 2. API Endpoints
*   `GET /api/communication/inbox/`: List user's conversations.
*   `POST /api/communication/messages/`: Send a message.
*   `GET /api/communication/announcements/`: Public feed based on user role.

### 3. Frontend Views
*   **Global**:
    *   **Notification Bell**: Shows unread count.
*   **Teacher/Parent**:
    *   **Chat Interface**: WhatsApp-style view. Select Parent/Teacher -> Chat.
*   **Admin**:
    *   **Announcement Board**: Create/Edit news blasts.

---

## Execution Steps

1.  **Setup**: Create Django apps `finance` and `communication`.
2.  **Backend - Finance**: Implement Models -> Serializers -> Views -> URLs.
3.  **Frontend - Finance**: Build Admin Fee Setup -> Invoice Generation -> Payment Recording.
4.  **Backend - Communication**: Implement Models -> Serializers -> Views.
5.  **Frontend - Communication**: Build Chat UI -> Announcement Board.
6.  **Integration**: Link Finance status to Parent Dashboard. Link Chat to Teacher Dashboard.

**Estimated Timeline**:
*   Finance Module: 1.5 Weeks
*   Communication Module: 1 Week
