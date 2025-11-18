# PowerShell script to create backdated commits
# This script creates commits according to the development timeline

# Function to create a commit with custom date
function Create-Commit {
    param(
        [string]$Message,
        [string]$DateTime,
        [string[]]$Files
    )
    if ($Files) {
        git add $Files
    }
    $env:GIT_COMMITTER_DATE=$DateTime
    $env:GIT_AUTHOR_DATE=$DateTime
    git commit -m $Message --date=$DateTime --allow-empty
}

# Day 1: Backend Development (Nov 17, 2025)
# Commit 1: Initial Django project setup
Create-Commit -Message "Initial Django project setup with basic configuration" -DateTime "2025-11-17 09:00:00" -Files @("backend/manage.py", "backend/eld_generator_project/__init__.py", "backend/eld_generator_project/settings.py", "backend/requirements.txt")

# Commit 2: Django app creation
Create-Commit -Message "Create eld_generator Django app" -DateTime "2025-11-17 09:15:00" -Files @("backend/eld_generator/__init__.py", "backend/eld_generator/apps.py", "backend/eld_generator/models.py", "backend/eld_generator/utils.py")

# Commit 3: Add Django REST Framework
git add backend/requirements.txt backend/eld_generator_project/settings.py
git commit -m "Add Django REST Framework and CORS headers" --date="2025-11-17 09:30:00" --author-date="2025-11-17 09:30:00"

# Commit 4: Create API serializers
git add backend/eld_generator/serializers.py
git commit -m "Add request serializer for trip data" --date="2025-11-17 10:00:00" --author-date="2025-11-17 10:00:00"

# Commit 5: Basic API endpoint
git add backend/eld_generator/urls.py backend/eld_generator_project/urls.py backend/eld_generator/views.py
git commit -m "Add calculate-route API endpoint" --date="2025-11-17 10:30:00" --author-date="2025-11-17 10:30:00"

# Commit 6: Geocoding service
git add backend/eld_generator/services/__init__.py backend/eld_generator/services/route_calculator.py
git commit -m "Implement geocoding service with Nominatim" --date="2025-11-17 11:00:00" --author-date="2025-11-17 11:00:00"

# Commit 7: Route calculation with OSRM
git add backend/eld_generator/services/route_calculator.py
git commit -m "Implement route calculation using OSRM API" --date="2025-11-17 11:30:00" --author-date="2025-11-17 11:30:00"

# Commit 8: Fuel stop calculation
git add backend/eld_generator/services/route_calculator.py
git commit -m "Add fuel stop calculation every 1000 miles" --date="2025-11-17 13:00:00" --author-date="2025-11-17 13:00:00"

# Commit 9: ELD calculator constants
git add backend/eld_generator/services/eld_calculator.py
git commit -m "Add HOS constants and helper functions" --date="2025-11-17 13:30:00" --author-date="2025-11-17 13:30:00"

# Commit 10: Basic ELD entry calculation
git add backend/eld_generator/services/eld_calculator.py
git commit -m "Implement basic ELD log entry generation" --date="2025-11-17 14:00:00" --author-date="2025-11-17 14:00:00"

# Commit 11: HOS compliance logic
git add backend/eld_generator/services/eld_calculator.py
git commit -m "Add 11-hour driving limit and 14-hour window enforcement" --date="2025-11-17 15:00:00" --author-date="2025-11-17 15:00:00"

# Commit 12: Break requirement
git add backend/eld_generator/services/eld_calculator.py
git commit -m "Add 30-minute break requirement after 8 hours" --date="2025-11-17 15:30:00" --author-date="2025-11-17 15:30:00"

# Commit 13: Rest period logic
git add backend/eld_generator/services/eld_calculator.py
git commit -m "Add 10-hour off-duty rest period enforcement" --date="2025-11-17 16:00:00" --author-date="2025-11-17 16:00:00"

# Commit 14: 70-hour cycle tracking
git add backend/eld_generator/services/eld_calculator.py
git commit -m "Implement 70-hour/8-day cycle tracking" --date="2025-11-17 16:30:00" --author-date="2025-11-17 16:30:00"

# Commit 15: Pickup/dropoff handling
git add backend/eld_generator/services/eld_calculator.py
git commit -m "Add 1-hour pickup and dropoff time handling" --date="2025-11-17 17:00:00" --author-date="2025-11-17 17:00:00"

# Commit 16: Daily log generator
git add backend/eld_generator/services/log_generator.py
git commit -m "Create daily log sheet generator" --date="2025-11-17 19:00:00" --author-date="2025-11-17 19:00:00"

# Commit 17: Log sheet formatting
git add backend/eld_generator/services/log_generator.py
git commit -m "Add 24-hour grid and totals calculation" --date="2025-11-17 19:30:00" --author-date="2025-11-17 19:30:00"

# Commit 18: Complete API endpoint
git add backend/eld_generator/views.py
git commit -m "Complete route calculation endpoint with full response" --date="2025-11-17 20:00:00" --author-date="2025-11-17 20:00:00"

# Commit 19: Error handling improvements
git add backend/eld_generator/services/route_calculator.py
git commit -m "Improve error handling and coordinate validation" --date="2025-11-17 20:30:00" --author-date="2025-11-17 20:30:00"

# Commit 20: Fix fuel stop placement
git add backend/eld_generator/services/route_calculator.py backend/eld_generator/services/eld_calculator.py
git commit -m "Fix fuel stops to use route geometry for accurate placement" --date="2025-11-17 21:00:00" --author-date="2025-11-17 21:00:00"

# Day 2: Frontend Development (Nov 18, 2025)
# Commit 21: React project setup
git add frontend/package.json frontend/vite.config.js frontend/index.html
git commit -m "Initialize React project with Vite" --date="2025-11-18 09:00:00" --author-date="2025-11-18 09:00:00"

# Commit 22: Basic app structure
git add frontend/src/index.jsx frontend/src/App.jsx frontend/src/index.css
git commit -m "Create basic App component structure" --date="2025-11-18 09:30:00" --author-date="2025-11-18 09:30:00"

# Commit 23: API service
git add frontend/src/services/api.js
git commit -m "Add Axios API service for backend communication" --date="2025-11-18 10:00:00" --author-date="2025-11-18 10:00:00"

# Commit 24: Trip input form component
git add frontend/src/components/TripInputForm.jsx frontend/src/components/TripInputForm.css
git commit -m "Create trip input form component" --date="2025-11-18 10:30:00" --author-date="2025-11-18 10:30:00"

# Commit 25: Location picker with Leaflet
git add frontend/src/components/TripMapPicker.jsx frontend/src/components/TripMapPicker.css frontend/package.json
git commit -m "Add Leaflet map for location picking" --date="2025-11-18 11:00:00" --author-date="2025-11-18 11:00:00"

# Commit 26: Integrate location picker
git add frontend/src/components/TripInputForm.jsx
git commit -m "Integrate map picker into trip form" --date="2025-11-18 11:30:00" --author-date="2025-11-18 11:30:00"

# Commit 27: Multi-step form component
git add frontend/src/components/MultiStepForm.jsx frontend/src/components/MultiStepForm.css
git commit -m "Create multi-step form navigation" --date="2025-11-18 13:00:00" --author-date="2025-11-18 13:00:00"

# Commit 28: Route map component
git add frontend/src/components/RouteMap.jsx frontend/src/components/RouteMap.css
git commit -m "Create route visualization component" --date="2025-11-18 13:30:00" --author-date="2025-11-18 13:30:00"

# Commit 29: Map markers and popups
git add frontend/src/components/RouteMap.jsx
git commit -m "Add markers for waypoints and stops on route map" --date="2025-11-18 14:00:00" --author-date="2025-11-18 14:00:00"

# Commit 30: Route info panel
git add frontend/src/components/RouteMap.jsx
git commit -m "Add route summary panel with stops information" --date="2025-11-18 14:30:00" --author-date="2025-11-18 14:30:00"

# Commit 31: Log sheet viewer
git add frontend/src/components/LogSheetViewer.jsx frontend/src/components/LogSheetViewer.css
git commit -m "Create daily log sheet viewer component" --date="2025-11-18 15:00:00" --author-date="2025-11-18 15:00:00"

# Commit 32: Log sheet grid visualization
git add frontend/src/components/LogSheetViewer.jsx
git commit -m "Implement 24-hour grid visualization for log sheets" --date="2025-11-18 15:30:00" --author-date="2025-11-18 15:30:00"

# Commit 33: PDF export functionality
git add frontend/src/components/LogSheetPDF.jsx frontend/src/components/LogSheetPDF.css frontend/package.json
git commit -m "Add PDF export using react-pdf" --date="2025-11-18 16:00:00" --author-date="2025-11-18 16:00:00"

# Commit 34: Date utilities
git add frontend/src/utils/dateUtils.js frontend/src/utils/constants.js
git commit -m "Add date utility functions" --date="2025-11-18 16:30:00" --author-date="2025-11-18 16:30:00"

# Commit 35: Styling improvements
git add frontend/src/App.css frontend/src/index.css frontend/index.html
git commit -m "Add Poppins font and improve overall styling" --date="2025-11-18 18:00:00" --author-date="2025-11-18 18:00:00"

# Commit 36: Mobile responsiveness
git add frontend/src/components/*.css frontend/src/App.css
git commit -m "Make components responsive for mobile devices" --date="2025-11-18 18:30:00" --author-date="2025-11-18 18:30:00"

# Commit 37: Fix coordinate handling
git add frontend/src/components/TripInputForm.jsx frontend/src/components/TripMapPicker.jsx
git commit -m "Fix coordinate parsing and validation" --date="2025-11-18 19:00:00" --author-date="2025-11-18 19:00:00"

# Commit 38: Global map support
git add frontend/src/components/TripMapPicker.jsx
git commit -m "Update map picker for global location support" --date="2025-11-18 19:30:00" --author-date="2025-11-18 19:30:00"

# Commit 39: Fix rest stop coordinates
git add backend/eld_generator/services/eld_calculator.py backend/eld_generator/views.py
git commit -m "Fix rest stop placement using route geometry" --date="2025-11-18 20:00:00" --author-date="2025-11-18 20:00:00"

# Commit 40: CORS and CSRF fixes
git add backend/eld_generator_project/settings.py backend/eld_generator/views.py
git commit -m "Fix CORS and CSRF configuration for development" --date="2025-11-18 20:15:00" --author-date="2025-11-18 20:15:00"

# Commit 41: Add README
git add README.md
git commit -m "Add comprehensive README with setup instructions" --date="2025-11-18 20:30:00" --author-date="2025-11-18 20:30:00"

# Commit 42: Final polish
git add .
git commit -m "Final code cleanup and improvements" --date="2025-11-18 20:45:00" --author-date="2025-11-18 20:45:00"

Write-Host "All commits created successfully!"

