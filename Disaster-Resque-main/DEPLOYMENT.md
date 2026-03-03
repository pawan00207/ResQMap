# ResQMap - Complete Deployment Guide

## Quick Start Summary

You now have a fully-featured ResQMap application with 5 core modules ready for deployment. Follow this guide to get your site live on Vercel.

## Pre-Deployment Checklist

- [x] All 5 features implemented (Emergency Map, Accessibility, Resources, Disasters, SOS)
- [x] Leaflet maps integrated with OpenStreetMap
- [x] Supabase database configured
- [x] API routes created for all features
- [x] Responsive UI with Tailwind CSS
- [x] Geolocation services integrated
- [x] Navigation and routing complete

## Step 1: Prepare for Vercel Deployment

### Local Verification
```bash
# Install dependencies
pnpm install

# Build locally to catch any errors
pnpm build

# Test the build
pnpm start
```

### Verify Supabase Connection
1. Check your `.env.local` has all required variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - POSTGRES_URL

## Step 2: Deploy to Vercel

### Option A: Via GitHub (Recommended)
```bash
# Push to GitHub
git add .
git commit -m "Initial ResQMap deployment"
git push

# Then in Vercel:
# 1. Go to vercel.com and sign in
# 2. Click "New Project"
# 3. Import from GitHub
# 4. Select your repository
# 5. Add environment variables
# 6. Deploy
```

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Add Environment Variables in Vercel
In your Vercel project settings, add:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- POSTGRES_URL
- SUPABASE_JWT_SECRET

## Step 3: Initialize Database

After deployment:

1. Visit `https://your-domain.vercel.app/api/setup` (GET request)
   - Check if database is initialized

2. Visit `https://your-domain.vercel.app/api/setup` (POST request)
   - Initialize sample data

Or use curl:
```bash
curl -X POST https://your-domain.vercel.app/api/setup
```

## Step 4: Verify All Features Work

### Test Each Module:
1. **Home Page**: `https://your-domain.vercel.app/`
   - Verify layout and navigation

2. **Emergency Services Map**: `https://your-domain.vercel.app/map`
   - Allow location access
   - Verify markers appear
   - Test filtering by service type

3. **Accessible Routes**: `https://your-domain.vercel.app/accessibility`
   - See sample routes
   - Test report form

4. **Local Resources**: `https://your-domain.vercel.app/resources`
   - Test category filters
   - Verify resource listings

5. **Disaster Dashboard**: `https://your-domain.vercel.app/disasters`
   - Check statistics
   - Test disaster reporting

6. **SOS Alert**: `https://your-domain.vercel.app/sos`
   - Test SOS form
   - Verify location sharing UI

## Step 5: Customize for Your Region

### Update Sample Data
Edit `/app/api/setup/route.ts` and update coordinates and locations for your region:
```typescript
const SAMPLE_DATA = {
  emergency_services: [
    {
      name: 'Your Hospital Name',
      latitude: YOUR_LAT,
      longitude: YOUR_LNG,
      // ...
    },
    // Add your local services
  ],
  // ...
}
```

### Add Real Emergency Services
You can manually add services via Supabase:
1. Go to supabase.com → Your Project
2. Go to the SQL Editor
3. Run:
```sql
INSERT INTO emergency_services (name, service_type, address, phone, is_24_hours, latitude, longitude)
VALUES 
  ('Hospital Name', 'hospital', 'Address', '911', true, 40.7128, -74.0060),
  ('Police Station', 'police', 'Address', '911', true, 40.7282, -74.0076),
  ('Fire Station', 'fire', 'Address', '911', true, 40.7505, -73.9972);
```

## Step 6: Setup Monitoring & Analytics

### Enable Vercel Analytics
```bash
# Analytics is included via @vercel/analytics
# Just run your app and data will be collected
```

### Configure Error Tracking
Consider adding Sentry or similar:
```bash
pnpm add @sentry/nextjs
```

## Step 7: Performance Optimization

### Current Optimizations Included:
- Dynamic map loading (client-side only)
- Efficient distance calculations
- Lazy-loaded components
- Optimized images with Next.js Image component

### Additional Optimization:
- Enable Vercel's Edge Cache: 25 seconds
- Implement ISR (Incremental Static Regeneration) for data

## Step 8: Security Configuration

### Supabase RLS (Row Level Security)
Enable RLS policies in Supabase:
```sql
-- Example: Users can only see their own SOS alerts
CREATE POLICY "Users can view own alerts" ON sos_alerts
  FOR SELECT USING (user_id = auth.uid());
```

### Environment Variables
- Never commit `.env.local`
- Use Vercel's built-in secrets management
- Rotate SUPABASE_SERVICE_ROLE_KEY periodically

## Step 9: Ongoing Maintenance

### Regular Tasks:
- Monitor error rates in Vercel Analytics
- Update emergency service data regularly
- Review and moderate community-contributed content
- Monitor database usage in Supabase

### Backup Your Data:
```bash
# Supabase automatically backs up daily
# Manual export in Supabase dashboard:
# 1. Go to Supabase project
# 2. Settings → Backup
# 3. Download snapshot
```

## Troubleshooting

### Maps Not Loading
- Check: Browser geolocation permissions
- Verify: OpenStreetMap is accessible
- Check: No CORS issues in browser console

### Database Not Initializing
- Run: `/api/setup` with POST method
- Check: Supabase credentials in .env
- Verify: Service role key has table creation permissions

### SOS Alerts Not Sending
- Check: User location is enabled
- Verify: Supabase tables exist
- Check: API error in browser console

### Location Services Not Working
- Ensure: Site uses HTTPS (required for Geolocation API)
- Check: Browser location permissions
- Test: In private/incognito window

## Performance Benchmarks

Expected performance metrics:
- Home Page: <1s
- Map Pages: <2s (first load with maps)
- API Responses: <200ms
- Database Queries: <100ms

## Scaling Considerations

For production with high traffic:
1. Enable Supabase connection pooling
2. Add Redis caching for static data
3. Implement CDN for map tiles
4. Consider Vercel Pro for higher limits
5. Add rate limiting to API routes

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Leaflet Docs**: https://leafletjs.com/

## Next Steps After Launch

1. **User Feedback**: Collect feedback on UX
2. **Analytics**: Monitor usage patterns
3. **Expansion**: Add more regions/cities
4. **Features**: Consider mobile app
5. **Integrations**: Connect with real emergency services APIs
6. **Community**: Enable user contributions and moderation

---

## Deployment Success Checklist

- [ ] Repository pushed to GitHub
- [ ] Project imported in Vercel
- [ ] Environment variables added
- [ ] Deployment successful (Build passes)
- [ ] Site loads at your-domain.vercel.app
- [ ] Location services working
- [ ] Database initialized with sample data
- [ ] All 5 features accessible and functional
- [ ] Maps rendering correctly
- [ ] API routes responding properly
- [ ] No console errors

**Congratulations! Your ResQMap application is now live!**

For questions or issues, refer to the main README.md or contact support.
