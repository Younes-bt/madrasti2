# Madrasti 2.0: Visual Project Structure

This document provides a visual representation of the ideal sitemap for each role, designed to match the strategic workflows.

---

## 🛡️ Admin Portal Sitemap
```mermaid
graph TD
    Admin[Admin Command Center] --> Dashboard[Dashboard: The Pulse]
    
    Admin --> People[People & Roles]
    People --> Staff[Staff & Contracts]
    People --> Teachers[Teachers & Performance]
    People --> Students[Student Files]
    People --> Parents[Families]

    Admin --> Academics[Academic Backbone]
    Academics --> Structure[Years / Tracks / Grades]
    Academics --> Subjects[Subjects & Curriculum]
    Academics --> Timetable[Master Schedule Builder]

    Admin --> Finance[Finance & Ops]
    Finance --> Overview[Cash Flow / Budgets]
    Finance --> Fees[Fee Setup]
    Finance --> Invoices[Billing & Payroll]
    Finance --> Logistics[Inventory & Transport]

    Admin --> Quality[Quality & Reports]
    Quality --> Review[Content Review]
    Quality --> Reports[Academic & Attendance Stats]
```

---

## 👩‍🏫 Teacher Portal Sitemap
```mermaid
graph TD
    Teacher[Teacher Workspace] --> Home[Home: Morning Coffee]
    
    Teacher --> Classes[Classroom Deck]
    Classes --> ClassHub[Class Dashboard]
    ClassHub --> Attendance[Daily Register]
    ClassHub --> Students[Engagement Pulse]
    ClassHub --> Gradebook[Grades & Feedback]

    Teacher --> Studio[Content Studio]
    Studio --> Library[Resource Library]
    Studio --> Builder[Lesson/Slide Builder]
    Studio --> Assignments[Homework/Exam Creator]

    Teacher --> Interaction[Personal Workspace]
    Interaction --> Inbox[Direct Parent Line]
    Interaction --> Planner[To-Do & Projects]
```

---

## 🎒 Student Portal Sitemap
```mermaid
graph TD
    Student[Student Journey] --> Home[Home: Pack Your Bag]
    
    Student --> Journey[The Explorer Map]
    Journey --> Subjects[Subjects]
    Subjects --> Chapters[Chapters]
    Chapters --> Lesson[Immersive Lesson Player]
    Chapters --> Lab[Virtual Three.js Labs]

    Student --> Gym[The Practice Gym]
    Gym --> Homework[Homework Tasks]
    Gym --> Quiz[Self-Assessment & Exams]

    Student --> Records[My Profile]
    Records --> Grades[Growth Charts]
    Records --> Rewards[XP / Badges / Store]
```

---

## 👨‍👩‍👧‍👦 Parent Portal Sitemap
```mermaid
graph TD
    Parent[Parent Partnership] --> Home[Home: Safety Feed]
    
    Parent --> Kids[Profile Switcher]
    Kids --> Academics[Smart AI Summaries]
    Kids --> Attendance[History & Excuses]
    Kids --> Behavior[Teacher Notes]

    Parent --> Office[The Admin Office]
    Office --> Finance[Payments & Invoices]
    Office --> Requests[Meetings & Doc Requests]
    Office --> Transport[Live Bus Tracking]

    Parent --> Community[School Life]
    Community --> News[Circulars & Events]
    Community --> Messages[Staff/Teacher Chat]
```
