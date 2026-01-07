# Phase 1 Testing Guide
**Quick Start Testing for Finance & Communication Modules**

---

## 🚀 Prerequisites

1. **Start the Backend**:
```bash
cd backend
python manage.py runserver
```

2. **Start the Frontend**:
```bash
cd frontend
npm run dev
```

3. **Have Users Ready**: You'll need at least one user of each role:
   - Admin
   - Teacher
   - Student
   - Parent

---

## 📋 Test Scenario 1: Finance Module (15 minutes)

### Part A: Setup Fees (Admin Only)

**Steps**:
1. Login as **Admin**
2. Navigate to: `http://localhost:5173/admin/finance/setup`
3. Click **"Fee Categories"** tab
4. Click **"Add Category"**
   - Name: "Monthly Tuition"
   - Type: "Recurring (Monthly)"
   - Description: "Regular monthly fees"
   - Click **Save**

5. Repeat to create:
   - "Registration Fee" (One Time)
   - "Books & Materials" (One Time)

**Expected Result**: ✅ You should see 3 fee categories listed

---

### Part B: Define Fee Structures

**Steps**:
1. Click **"Fee Structures"** tab
2. Click **"Add Fee"**
   - Academic Year: Select current year
   - Grade: Select "Grade 1" (or any grade)
   - Fee Category: "Monthly Tuition"
   - Amount: `500` DH
   - Click **Save**

3. Add more fee structures:
   - Grade 1 → Registration Fee → 2000 DH
   - Grade 1 → Books & Materials → 1500 DH

**Expected Result**: ✅ You should see at least 3 fee structures for Grade 1

**What This Does**: Sets the pricing for Grade 1 students

---

### Part C: Generate Invoices

**Steps**:
1. Navigate to: `http://localhost:5173/admin/finance/invoices`
2. Click **"Bulk Generate"**
3. Fill the form:
   - Academic Year: Current year
   - Grade: Select "Grade 1"
   - For Month: Select current month (e.g., `2025-11-01`)
   - Due Date: Pick a date 10 days from now
   - Click **Generate**

**Expected Result**: 
- ✅ Success message: "Generated X invoices"
- ✅ Table shows new invoices with "Issued" status
- ✅ Each invoice has the monthly tuition amount (500 DH)

**What This Does**: Creates monthly invoices for all Grade 1 students

---

### Part D: Record a Payment

**Steps**:
1. Navigate to: `http://localhost:5173/admin/finance/payments`
2. Click **"Record Payment"**
3. Fill the form:
   - Invoice: Select any invoice from the dropdown
   - Amount: Enter `500` (or full amount)
   - Payment Method: "Cash"
   - Click **Record Payment**

**Expected Result**: 
- ✅ Success message
- ✅ Payment appears in the transactions table
- ✅ Go back to Invoices page → Invoice status should now be "Paid"

---

### Part E: Parent View (Test Parent Access)

**Steps**:
1. Logout from Admin
2. Login as **Parent**
3. Navigate to: `http://localhost:5173/parent/finance`

**Expected Result**: 
- ✅ See summary cards:
  - Outstanding Balance (if any unpaid invoices)
  - Total Paid
  - Pending Invoices count
- ✅ See tabs: Pending, Paid, All
- ✅ Click "Pending" → See unpaid invoices for your children
- ✅ Click "Paid" → See paid invoices

**What This Tests**: Parent can view their financial status

---

## 💬 Test Scenario 2: Communication Module (10 minutes)

### Part A: Create an Announcement (Admin)

**Steps**:
1. Login as **Admin**
2. Navigate to: `http://localhost:5173/announcements`
3. Click **"New Announcement"**
4. Fill the form:
   - Title: "School Holiday Announcement"
   - Content: "School will be closed on December 25th for the holidays."
   - Target Audience: "All Users"
   - Specific Grade: Leave as "All Grades"
   - Click **Publish**

**Expected Result**: 
- ✅ Success message
- ✅ Announcement appears in the feed
- ✅ Shows "ALL" badge

---

### Part B: Create Targeted Announcement

**Steps**:
1. Click **"New Announcement"** again
2. Fill the form:
   - Title: "Parent-Teacher Meeting"
   - Content: "Grade 1 parents are invited to a meeting on Dec 15th."
   - Target Audience: "Parents Only"
   - Specific Grade: Select "Grade 1"
   - Click **Publish**

**Expected Result**: 
- ✅ Announcement shows "PARENTS" badge
- ✅ Also shows "Grade 1" badge

---

### Part C: View as Different Roles

**Steps**:
1. Logout
2. Login as **Teacher** (not Admin)
3. Navigate to: `http://localhost:5173/announcements`

**Expected Result**: 
- ✅ See "School Holiday Announcement" (because it's for ALL)
- ✅ Do NOT see "Parent-Teacher Meeting" (because it's for PARENTS only)

4. Logout and login as **Parent** (with Grade 1 child)
5. Navigate to: `http://localhost:5173/announcements`

**Expected Result**: 
- ✅ See both announcements

**What This Tests**: Role-based announcement filtering

---

### Part D: Messages (Teacher ↔ Parent)

**Steps**:
1. Login as **Teacher**
2. Navigate to: `http://localhost:5173/messages`

**Current State**: Since we haven't implemented "Start Conversation" from scratch, you'll need to:

**Option 1 - Use Admin to Create Conversation**:
```python
# In Django shell or admin panel, create a conversation manually
from communication.models import Conversation
from users.models import User

teacher = User.objects.get(email='teacher@example.com')
parent = User.objects.get(email='parent@example.com')

conv = Conversation.objects.create(conversation_type='DIRECT')
conv.participants.add(teacher, parent)
```

**Option 2 - Test with API**:
```bash
# Use Postman or curl to test
POST http://localhost:8000/api/communication/conversations/start_direct/
Headers: Authorization: Bearer <jwt_token>
Body: { "user_id": <parent_user_id> }
```

Once you have a conversation:

**Steps**:
3. You should see the conversation in the left panel
4. Click on it → See message thread
5. Type a message: "Hello, this is about your child's progress"
6. Click Send

**Expected Result**: 
- ✅ Message appears in the thread
- ✅ Shows your name and timestamp

7. Logout and login as **Parent**
8. Navigate to: `http://localhost:5173/messages`

**Expected Result**: 
- ✅ See conversation with Teacher
- ✅ Unread badge showing "1"
- ✅ Click conversation → See teacher's message
- ✅ Badge disappears (marked as read)
- ✅ Reply to the message

**What This Tests**: Two-way messaging between roles

---

## 🔍 What to Look For (Quality Checks)

### Visual/UI Checks:
- ✅ All pages load without errors
- ✅ Tables display data correctly
- ✅ Status badges have correct colors
- ✅ Forms validate input (try submitting empty forms)
- ✅ Buttons are clickable and responsive
- ✅ Loading spinners appear during API calls
- ✅ Success/error toasts appear

### Data Integrity Checks:
- ✅ Invoice totals calculate correctly
- ✅ Payment updates invoice status
- ✅ Parents only see their children's invoices
- ✅ Announcements filter by role
- ✅ Messages are attributed to correct sender
- ✅ Timestamps are accurate

### Error Handling:
- ✅ Try creating a fee structure with empty amount → Should show error
- ✅ Try generating invoices for a grade with no students → Should handle gracefully
- ✅ Try sending empty message → Should be disabled/show error

---

## 🐛 Common Issues & Solutions

### Issue: "No invoices generated"
**Cause**: No students enrolled in the selected grade  
**Solution**: 
1. Go to `/admin/school-management/students`
2. Add a student to Grade 1
3. Try bulk invoice generation again

### Issue: "Parent sees no invoices"
**Cause**: Parent account not linked to student  
**Solution**: 
1. Edit student profile
2. Set the parent relationship
3. Refresh parent finance page

### Issue: "Can't create announcement"
**Cause**: Not logged in as Admin  
**Solution**: Only Admin users can create announcements

### Issue: "No conversations showing"
**Cause**: No conversations created yet  
**Solution**: Use API or Django admin to create initial conversation (feature to start new conversation from UI not yet implemented)

---

## ✅ Quick Verification Checklist

After testing, confirm:

**Finance Module**:
- [ ] Fee categories created
- [ ] Fee structures defined per grade
- [ ] Invoices generated successfully
- [ ] Payment recorded and invoice status updated
- [ ] Parent can view their financial status
- [ ] Correct totals and balances calculated

**Communication Module**:
- [ ] Admin can create announcements
- [ ] Announcements show correct target badges
- [ ] Role-based announcement filtering works
- [ ] Messages can be sent and received
- [ ] Unread count updates correctly
- [ ] Mark-as-read functionality works

---

## 🎯 Priority Testing Order

If you're short on time, test in this order:

1. **Finance Setup** (5 min): Create fees + Generate one invoice
2. **Record Payment** (2 min): Test the full invoice → payment flow
3. **Parent View** (2 min): Verify parent can see invoices
4. **Announcements** (3 min): Create one and verify it shows up
5. **Messages** (Optional): If you have time to set up conversations

---

## 📝 Report Issues

If you find bugs, note:
1. What page you were on
2. What you tried to do
3. What happened vs. what you expected
4. Any error messages (check browser console: F12)

---

## 🚀 Next Steps After Testing

Once you've verified these work:
1. ✅ Mark Phase 1 as tested and validated
2. 🎯 Decide: Deploy Phase 1 or Continue to Phase 2?
3. 📊 Phase 2 will add analytics (student performance metrics)

---

**Happy Testing!** 🧪
