# ResQMap - Emergency Response & Resource Navigation Platform

A comprehensive web application for emergency response coordination, accessible route navigation, local resource discovery, and disaster management. Built with Next.js 15, React 19, Leaflet maps, and Supabase.

## Features

### 1. **Emergency Services Map**
- Real-time mapping of hospitals, police stations, and fire departments
- Location-based emergency service discovery
- Distance calculation and nearest service finder
- Filter by service type
- Direct contact information

### 2. **Accessible Routes**
- Wheelchair-friendly route navigation
- Barrier detection and accessibility features
- Multi-accessibility type support (wheelchair, blind-friendly, low mobility)
- Community-contributed routes
- Difficulty level indicators

### 3. **Local Resources Discovery**
- Find nearby pharmacies, shelters, food banks, water distribution, medical clinics, supply stores, communication centers, and transportation services
- Real-time opening status
- User ratings and reviews
- Category filtering
- Distance-based sorting

### 4. **Disaster Dashboard**
- Real-time disaster event tracking
- Severity level indicators (low, medium, high)
- Affected area visualization with radius mapping
- Resource requirement tracking
- Active disaster statistics
- Community reporting system

### 5. **SOS Emergency Alert System**
- Send emergency location to designated contacts
- Multiple emergency type selection (medical, fire, accident, assault, other)
- Real-time location sharing with responders
- Emergency contact management
- Severity level indication
- Alert status tracking

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Maps**: Leaflet with OpenStreetMap
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL with PostGIS support)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Geolocation**: Browser Geolocation API

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account (free tier available)
- Vercel account (for deployment)

### Installation Steps

1. **Install Dependencies**
```bash
pnpm install
```

2. **Environment Variables**
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTGRES_URL=your_postgres_url
SUPABASE_JWT_SECRET=your_jwt_secret
```

3. **Database Setup**
- The application will auto-create tables on first setup
- Initialize sample data via: `POST /api/setup`

4. **Development Server**
```bash
pnpm dev
```
Visit http://localhost:3000

5. **Build for Production**
```bash
pnpm build
pnpm start
```

## Database Schema

### emergency_services
- id, name, service_type, address, phone, is_24_hours, latitude, longitude

### local_resources
- id, name, category, address, phone, description, is_open_now, rating, latitude, longitude

### accessibility_routes
- id, name, description, accessibility_features[], accessibility_type, difficulty_level, start/end coordinates

### disaster_events
- id, title, description, disaster_type, latitude, longitude, severity, affected_area_radius, status, resources_needed[]

### sos_alerts
- id, user_id, emergency_type, latitude, longitude, description, emergency_contacts[], severity, status

## API Endpoints

### Emergency Services
- `GET /api/emergency-services?lat=X&lng=Y&radius=5000&type=hospital`
- Get emergency services by location and type

### Local Resources
- `GET /api/resources?lat=X&lng=Y&radius=5000&category=Pharmacy`
- `POST /api/resources` - Add new resource

### Accessibility Routes
- `GET /api/accessibility-routes?type=Wheelchair`
- `POST /api/accessibility-routes` - Submit new route
- `PUT /api/accessibility-routes` - Update route

### Disasters
- `GET /api/disasters?lat=X&lng=Y&radius=25000&status=active`
- `POST /api/disasters` - Report disaster event
- `PUT /api/disasters` - Update disaster status

### SOS Alerts
- `GET /api/sos-alerts?status=active`
- `POST /api/sos-alerts` - Send SOS alert
- `PUT /api/sos-alerts` - Update SOS status

### Setup
- `GET /api/setup` - Check database status
- `POST /api/setup` - Initialize sample data

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

### Post-Deployment
1. Visit `/api/setup` to initialize sample data
2. Configure emergency services for your region
3. Customize resource categories

## Usage

### Finding Emergency Services
1. Click "Emergency Map" from homepage
2. Allow location access
3. View nearby hospitals, police, and fire stations
4. Click markers for details and contact info

### Reporting Accessible Routes
1. Navigate to "Accessible Routes"
2. Click "Report Route"
3. Provide route details and accessibility features
4. Submit for community review

### Discovering Local Resources
1. Go to "Resources" page
2. Select resource category
3. View nearby options with ratings and status
4. Filter by type as needed

### Emergency Response
1. Click "Send SOS Alert"
2. Enter emergency type and severity
3. Add emergency contacts
4. Share location with responders

### Tracking Disasters
1. View "Disaster Dashboard"
2. See real-time disaster zones
3. Check resource requirements
4. Report new incidents

## Security Features

- Row Level Security (RLS) for database access control
- Secure geolocation data handling
- Input validation and sanitization
- Safe emergency contact storage
- User privacy options (anonymous SOS alerts)

## Performance Optimizations

- Client-side Leaflet maps for smooth interaction
- Efficient distance calculations using Haversine formula
- Geospatial queries with PostGIS (when available)
- Real-time location updates
- Lazy-loaded map components

## Future Enhancements

- Real-time notifications via WebSockets
- Push notifications for SOS alerts
- Advanced route optimization with A* pathfinding
- AI-powered resource recommendations
- Multi-language support
- Offline map functionality
- Integration with emergency services APIs
- Mobile native apps (React Native)
- Community rating and review system
- Accessibility audit tracking

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Follow code style guidelines

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue on GitHub or contact support.

## Acknowledgments

- OpenStreetMap for map tiles
- Leaflet for mapping library
- Supabase for database infrastructure
- Next.js for application framework
- Vercel for hosting platform

---

**ResQMap** - Connecting people with resources, one emergency at a time.



