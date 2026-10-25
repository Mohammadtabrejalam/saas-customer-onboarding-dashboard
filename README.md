# SaaS Customer Onboarding Dashboard

A web-based customer onboarding management application built with **React.js and Firebase** to streamline customer onboarding, track milestones, manage follow-ups, and monitor activation progress.

## Live Demo

**Website:** https://dashboardset.netlify.app

## Features

- **Customer Management:** Add and manage customer records.
- **Onboarding Tracking:** Track account setup, configuration, training, and activation.
- **Progress Monitoring:** Automatically calculate onboarding completion percentages.
- **Real-Time Updates:** Synchronize customer records using Firebase Firestore.
- **Search and Filtering:** Find customers by name and onboarding status.
- **Follow-up Management:** Schedule follow-ups and identify overdue customers.
- **Activity History:** Record customer interactions, notes, and outcomes.
- **Analytics Dashboard:** Monitor onboarding completion rates and customer progress.
- **Responsive Design:** Support desktop and mobile layouts.

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Build Tool | Vite |
| Database | Firebase Firestore |
| Authentication | Firebase Anonymous Authentication |
| Deployment | Netlify |
| Version Control | Git, GitHub |

## Project Architecture

```text
React.js Frontend
       |
       v
Firebase Authentication
       |
       v
Cloud Firestore
       |
       v
Real-Time Customer Updates
       |
       v
Dashboard & Analytics
```

## Installation and Setup

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Navigate to the project**

```bash
cd saas-customer-onboarding-dashboard
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure Firebase**

Create a Firebase project, register a web app, and configure `src/firebase.js` using your Firebase web configuration.

Enable Anonymous Authentication, create a Firestore database, and configure appropriate Firestore Security Rules.

**5. Start the development server**

```bash
npm run dev
```

## Future Improvements

- Email/password authentication
- Role-based access control
- Multi-user team collaboration
- Automated follow-up notifications
- CSV and PDF report exports
- Customer adoption analytics
- Automated testing

## Project Status

**Deployed portfolio prototype**

This project demonstrates customer onboarding workflows, React state management, Firebase integration, and real-time data handling.

The application is intended for demonstration with fictional customer data. Production use requires additional authentication, authorization, and security testing.
