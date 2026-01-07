# Adding Finance & Communication to Sidebar

## Quick Manual Instructions

Since the sidebar configuration file is large and complex, here's exactly what to add:

### 1. Add Icons (Line ~38-41)

In the imports at the top, add these icons to the list from `lucide-react`:
```javascript
  DollarSign,
  CreditCard,
  Megaphone
```

### 2. For ADMIN Role (After Reports & Analytics section, around line 197)

Add this new Finance section:
```javascript
// 💰 Finance Management
{
  key: 'finance',
  icon: DollarSign,
  label: 'Finance',
  tooltip: 'Manage fees, invoices, and payments',
  items: [
    { key: 'fee-setup', label: 'Fee Setup', path: '/admin/finance/setup' },
    { key: 'invoices', label: 'Invoices', path: '/admin/finance/invoices' },
    { key: 'payments', label: 'Payments', path: '/admin/finance/payments' },
  ]
},
```

Update the Communications section items to include:
```javascript
items: [
  { key: 'messages', label: 'Messages', path: '/messages' },
  { key: 'announcements', label: 'Announcements', path: '/announcements' },
  // ... keep other existing items
]
```

### 3. For PARENT Role (around line 416-449)

Add these two sections:
```javascript
{
  key: 'finance',
  icon: DollarSign,
  label: 'Financial Status',
  tooltip: 'View invoices and payments',
  path: '/parent/finance',
},
{
  key: 'communication',
  icon: MessageSquare,
  label: 'Communication',
  tooltip: 'Messages and announcements',
  items: [
    { key: 'messages', label: 'Messages', path: '/messages' },
    { key: 'announcements', label: 'Announcements', path: '/announcements' },
  ]
},
```

### 4. For TEACHER, STUDENT Roles  

Add a Communication section similarly:
```javascript
{
  key: 'communication',
  icon: MessageSquare,
  label: 'Communication',
  tooltip: 'Messages and announcements',
  items: [
    { key: 'messages', label: 'Messages', path: '/messages' },
    { key: 'announcements', label: 'Announcements', path: '/announcements' },
  ]
},
```

---

## OR: Automatic Script

If you prefer, I can create a Python script that automatically adds these items to the sidebar file safely.

Would you like me to:
A) Create an automated script to patch the sidebar?
B) Leave it for you to add manually using the guide above?

The pages are all ready and working at these URLs:
- `/admin/finance/setup`
- `/admin/finance/invoices`
- `/admin/finance/payments`
- `/parent/finance` 
- `/messages` (all roles)
- `/announcements` (all roles)

You can navigate there directly even without sidebar links! 🚀
