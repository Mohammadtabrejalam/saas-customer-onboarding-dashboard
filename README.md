
# SaaS Customer Onboarding Dashboard

A React and Firebase application for managing SaaS customer onboarding, tracking milestones, scheduling follow-ups, and monitoring customer activation.

## Live Demo

https://tourmaline-caramel-983ba4.netlify.app

## Features

- Customer onboarding management
- Customer registration and status tracking
- Onboarding milestone checklist
- Automatic progress calculation
- Real-time Firebase Firestore updates
- Customer search and status filtering
- Follow-up scheduling and overdue alerts
- Follow-up completion tracking
- Customer activity history
- Analytics and reporting dashboard
- Responsive user interface

## Tech Stack

- Frontend: React.js, JavaScript, CSS
- Build Tool: Vite
- Database: Firebase Firestore
- Authentication: Firebase Anonymous Authentication
- Deployment: Netlify
- Version Control: Git and GitHub

## Project Architecture

React Components
    |
    v
Firebase Authentication
    |
    v
Cloud Firestore
    |
    v
Real-time Customer Data

## Run Locally

1. Clone the repository.
2. Install dependencies:

   npm install

3. Configure Firebase in src/firebase.js.
4. Enable Firebase Authentication and Firestore.
5. Start the application:

   npm run dev

## Future Improvements

- Email/password authentication
- Role-based access control
- Team collaboration
- Customer notifications
- CSV and PDF reports
- Automated follow-up reminders

## Project Status

Portfolio prototype built with fictional customer data.
Production use requires stronger authentication,
authorization, and security testing.
