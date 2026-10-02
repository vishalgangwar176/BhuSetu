BhuSetu
AI-Powered Geospatial Integration Platform for Urban Land Records
BhuSetu automatically integrates, harmonizes, validates and synchronizes multi-source land datasets with AI-generated feature extraction outputs. It replaces slow, error-prone manual GIS workflows with an intelligent, role-based platform aligned with the NAKSHA Programme of the Department of Land Resources.

Table of Contents
Overview
Key Features
Supported Data Sources
User Roles
Integration Pipeline
Tech Stack
Project Structure
Getting Started
Environment Variables
Firebase Setup
Expected Impact
Roadmap
Author
License
Overview
Urban land administration depends on many spatial and non-spatial datasets produced by different departments and survey methods: drone surveys, orthorectified imagery, DSM/DTM, GNSS surveys, municipal records, utility databases and revenue land records. Today, combining them relies largely on manual GIS work.

BhuSetu provides a single platform that:

Ingests all of these datasets in one place
Aligns them with a geo-referencing and coordinate transformation engine
Matches, corrects and reconciles them using AI/ML
Scores every output with a transparent confidence value
Exposes the final harmonized data to departments through standard exports and APIs
Key Features
Multi-source data ingestion with metadata, CRS detection and quality scoring
AI/ML spatial matching of parcels, building footprints and imagery features
Automated topology correction for gaps, overlaps, slivers and self-intersections
Intelligent attribute mapping between revenue records and spatial parcels
Geo-referencing and coordinate transformation engine using GNSS/CORS control points
Change detection between existing cadastral maps and new imagery-derived layers
Spatial conflict resolution framework with explainable AI suggestions
Confidence scoring with a per-parcel breakdown and configurable thresholds
Interactive Web-GIS workspace with layer controls, before/after comparison and parcel details
Role-based dashboards for four types of users
Gemini-powered Help Assistant that is aware of the user's role and current page
Search-grounded statutory updates with cited sources
Maps-grounded location context for parcels and field visits
Light and dark themes with a government-portal style interface and accessibility controls
Audit logs for every important action
Export and interoperability via GeoJSON, Shapefile, CSV and REST API endpoints
Supported Data Sources
Category	Dataset
Imagery	Drone imagery, Orthorectified Imagery (ORI)
Elevation	DSM / DTM datasets
Cadastral	Existing cadastral maps
Records	Revenue land records
Urban	Municipal GIS layers, Utility network data
Survey	Ground Truthing (GT) datasets, GNSS / CORS survey data
Features	Building footprint datasets
User Roles
Role	Purpose	Main Capabilities
Revenue Officer	Record accuracy and approvals	Approval queue, dispute arbitration, mutation tracking, area mismatch review, reports
Field Surveyor	Ground verification	Assigned tasks, field map, GNSS and ground-truth entry, sync status, navigation to site
System Admin	Platform operations	Pipeline monitor, data source health, user and role management, audit logs, integrations
Public Viewer	Transparent read-only access	Parcel search, read-only map, FAQs, issue reporting (no personal data shown)
Integration Pipeline
Ingest and validate the uploaded datasets
Geo-reference and transform coordinates (RMSE before and after)
AI/ML spatial matching of parcels, footprints and imagery features
Automated topology correction
Intelligent attribute mapping of revenue records onto parcels
Change detection against existing cadastral maps
Spatial conflict resolution
Confidence scoring and final output
Tech Stack
Layer	Technology
Frontend	React, Vite, Tailwind CSS, React Router
Maps	Leaflet (react-leaflet), OpenStreetMap and CartoDB basemaps
Charts and icons	Recharts, Lucide
Authentication and database	Firebase Authentication, Cloud Firestore
AI	Google Gemini API with Google Search grounding and Google Maps grounding
Target architecture	AI/ML, GeoAI, GIS and Web-GIS, spatial databases (PostGIS), ETL automation, computer vision, cloud computing, spatial analytics, API integration frameworks
Project Structure
bhusetu/
├── public/
├── src/
│   ├── components/        # Shared UI components (header, sidebar, tables, map, chat)
│   ├── pages/
│   │   ├── revenue/       # Revenue Officer workspace
│   │   ├── surveyor/      # Field Surveyor workspace
│   │   ├── admin/         # System Admin workspace
│   │   └── public/        # Public Viewer portal
│   ├── services/          # Firebase, Gemini and data services
│   ├── context/           # Auth, theme and role context
│   ├── data/              # Sample GeoJSON and seed data
│   ├── styles/            # Design tokens (light and dark themes)
│   └── App.jsx
├── firestore.rules
├── .env.example
├── package.json
└── README.md
Getting Started
Prerequisites
Node.js 18 or later
npm or yarn
A Firebase project
A Gemini API key
Installation
bash
# Clone the repository
git clone https://github.com/vishalgangwar176/bhusetu.git
cd bhusetu

# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Start the development server
npm run dev
The app runs at http://localhost:5173.

Production Build
bash
npm run build
npm run preview
Environment Variables
Create a .env file in the project root:

env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
Note: Never commit your .env file. For production, call Gemini from a secure backend or Cloud Function instead of the browser.

Firebase Setup
Create a project in the Firebase Console.
Enable Authentication with the Email/Password and Google providers.
Create a Cloud Firestore database.
Deploy the security rules from firestore.rules.
Sign in as the first user, then use the Admin Seed sample data option to load demo records.
Use the Admin Users and Roles page to assign roles. New sign-ups default to Public Viewer.
Expected Impact
Reduces manual GIS integration effort
Improves accuracy and consistency of urban land records
Enables seamless inter-departmental spatial data exchange
Accelerates cadastral finalization
Improves interoperability of urban land information systems
Supports standardized digital land governance
Roadmap
 Connect a PostGIS spatial database backend
 Train and deploy computer vision models for building and boundary extraction
 Real integration with NAKSHA, municipal GIS and revenue database APIs
 Offline-first mobile app for field surveyors
 Multi-language interface (Hindi and regional languages)
 Automated test suite and CI/CD pipeline
Author
Vishal GitHub: @vishalgangwar176

License
This project is licensed under the MIT License. See the LICENSE file for details.


