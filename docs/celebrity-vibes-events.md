# Celebrity Vibes Events Feature

## Overview
The Celebrity Vibes Events feature allows administrators to create special occasion events (like Eid, Diwali, Oscars, etc.) where celebrities can showcase themed product collections on their profiles. This creates a curated shopping experience for special occasions and festivals.

## Architecture

### Database Schema

#### Table: `celebrity_vibes_events`
Stores information about special celebrity events.

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique event identifier
- `name` (TEXT NOT NULL) - Event name (e.g., "Eid Collection 2024")
- `description` (TEXT NOT NULL) - Detailed description of the event
- `event_type` (TEXT NOT NULL) - Category (e.g., "Religious", "Award Show", "Festival", "Holiday")
- `image_url` (TEXT NOT NULL) - Banner/cover image URL
- `start_date` (TEXT NOT NULL) - ISO date string when event starts
- `end_date` (TEXT NOT NULL) - ISO date string when event ends
- `is_active` (BOOLEAN DEFAULT true) - Whether event is currently active
- `is_featured` (BOOLEAN DEFAULT false) - Featured events display prominently
- `created_at` (TEXT DEFAULT 'now()') - Creation timestamp
- `updated_at` (TEXT DEFAULT 'now()') - Last update timestamp
- `metadata` (JSONB) - Additional data (color theme, tags, display order)

#### Table: `celebrity_event_products`
Junction table linking celebrity products to events.

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique link identifier
- `event_id` (INTEGER NOT NULL) - Reference to celebrity_vibes_events
- `celebrity_id` (INTEGER NOT NULL) - Reference to celebrities table
- `product_id` (INTEGER NOT NULL) - Reference to celebrity_products table
- `display_order` (INTEGER DEFAULT 0) - Order for displaying products
- `is_active` (BOOLEAN DEFAULT true) - Whether this product link is active
- `created_at` (TEXT DEFAULT 'now()') - Creation timestamp
- `notes` (TEXT) - Optional notes about product selection

### API Endpoints

#### Public Endpoints

**GET** `/api/celebrity-vibes-events`
- Get all celebrity vibes events
- Query params:
  - `active` (boolean) - Filter for active events only
  - `featured` (boolean) - Filter for featured events only
- Returns: Array of event objects

**GET** `/api/celebrity-vibes-events/:id`
- Get specific event by ID
- Returns: Event object

**GET** `/api/celebrity-vibes-events/:id/products`
- Get all products for a specific event
- Query params:
  - `celebrityId` (number) - Filter products by celebrity
- Returns: Array of event products with full product details

**GET** `/api/celebrities/:celebrityId/vibes-events`
- Get all events a celebrity has products in
- Returns: Array of events with product counts

#### Admin Endpoints (Authentication Required)

**POST** `/api/celebrity-vibes-events`
- Create new celebrity vibes event
- Requires: Admin role
- Body: Event data (name, description, eventType, imageUrl, dates, etc.)
- Returns: Created event object

**PUT** `/api/celebrity-vibes-events/:id`
- Update existing event
- Requires: Admin role
- Body: Partial event data
- Returns: Updated event object

**DELETE** `/api/celebrity-vibes-events/:id`
- Delete event and all associated product links
- Requires: Admin role
- Returns: Success message

#### Celebrity Endpoints (Authentication Required)

**POST** `/api/celebrity-vibes-events/:eventId/products`
- Add a celebrity's product to an event
- Requires: Authenticated user who owns the celebrity profile or admin
- Body: { celebrityId, productId, displayOrder, notes }
- Returns: Created event product link

**DELETE** `/api/celebrity-vibes-events/:eventId/products/:productLinkId`
- Remove a product from an event
- Requires: Authenticated user who owns the celebrity profile or admin
- Returns: Success message

### Backend Storage Methods

Located in `server/storage.ts`:

**Event Management:**
- `getCelebrityVibesEvents(filters?)` - Fetch all events with optional filters
- `getCelebrityVibesEventById(id)` - Get single event
- `createCelebrityVibesEvent(data)` - Create new event
- `updateCelebrityVibesEvent(id, data)` - Update event
- `deleteCelebrityVibesEvent(id)` - Delete event and associations

**Event Products Management:**
- `getCelebrityEventProducts(eventId, celebrityId?)` - Get products for event
- `getCelebrityEventProductById(id)` - Get single event product link
- `getCelebrityVibesEventsByCelebrity(celebrityId)` - Get celebrity's events
- `addProductToCelebrityEvent(data)` - Add product to event
- `removeProductFromCelebrityEvent(id)` - Remove product from event

### Frontend Components

#### Admin UI: `AdminCelebrityVibesEvents.tsx`
Full admin interface for managing celebrity vibes events.

**Features:**
- View all events in card layout
- Create new events with image upload
- Edit existing events
- Delete events with confirmation
- Toggle active/featured status
- Set event metadata (theme color, tags)
- Date range selection
- Responsive design with sidebar navigation

**Key Components Used:**
- Dialog for create/edit modals
- Card for event display
- Badge for status indicators
- Switch for toggles
- Date inputs for event scheduling
- Color picker for theme customization
- File upload with preview

### Migration

Migration file: `migrations/0005_add_celebrity_vibes_events.sql`

Includes:
- Table creation with constraints
- Indexes for performance optimization
- Proper data validation checks

## Usage Flow

### Admin Workflow
1. Admin logs into admin dashboard
2. Navigates to "Cele Vibes Events" section
3. Creates a new event with:
   - Event name and description
   - Event type (Festival, Award Show, etc.)
   - Banner image
   - Start and end dates
   - Theme color and tags
   - Active/Featured status
4. Event becomes available for celebrities

### Celebrity Workflow
1. Celebrity logs into their profile
2. Views active celebrity vibes events
3. Selects products from their profile to add to events
4. Products are showcased in the event's themed collection
5. Can add notes about why products fit the event

### Public User Experience
1. Users browse celebrity profiles
2. See special event sections with themed products
3. Event banners display with custom colors/themes
4. Filter products by events
5. Shop curated collections for special occasions

## Integration Points

### Routes Integration
Added to `client/src/App.tsx`:
```tsx
<Route path="/admin/celebrity-vibes-events" component={AdminCelebrityVibesEvents} />
```

### Schema Integration
Updated `shared/schema.ts` with:
- `celebrityVibesEvents` table definition
- `celebrityEventProducts` table definition
- Insert schemas with Zod validation
- TypeScript types for type safety

### API Integration
Updated `server/routes.ts` with new API endpoints and authentication middleware.

### Storage Integration
Updated `server/storage.ts` with database query methods.

## Security Considerations

- Admin-only access for event creation/modification
- Celebrity ownership validation for product additions
- Prevents duplicate product entries per event
- Cascading deletes for data consistency
- Activity logging for audit trail

## Future Enhancements

Potential improvements:
1. **Celebrity UI Component** - Interface for celebrities to manage their event products
2. **Public Event Display** - Dedicated event showcase pages
3. **Event Analytics** - Track engagement and product views per event
4. **Notifications** - Alert celebrities about new events
5. **Product Recommendations** - AI-suggested products for events
6. **Event Templates** - Recurring event patterns (Annual Eid, etc.)
7. **Social Sharing** - Share event collections on social media
8. **Limited Time Offers** - Time-bound discounts for event products

## Testing

To test this feature:

1. **Database Migration**
   ```bash
   # Run the migration
   npm run migrate
   ```

2. **Admin Access**
   - Login as admin user
   - Navigate to `/admin/celebrity-vibes-events`
   - Create a test event

3. **API Testing**
   ```bash
   # Get all events
   curl http://localhost:5000/api/celebrity-vibes-events
   
   # Get event by ID
   curl http://localhost:5000/api/celebrity-vibes-events/1
   ```

4. **Celebrity Integration**
   - Login as celebrity user
   - Add products to active events via API
   - View events on profile

## Files Modified/Created

### New Files:
- `client/src/pages/AdminCelebrityVibesEvents.tsx` - Admin UI
- `migrations/0005_add_celebrity_vibes_events.sql` - Database migration

### Modified Files:
- `shared/schema.ts` - Added tables and types
- `server/routes.ts` - Added API endpoints and imports
- `server/storage.ts` - Added storage methods
- `client/src/App.tsx` - Added route

## Dependencies

No new dependencies required. Uses existing:
- Drizzle ORM for database
- Zod for validation
- Wouter for routing
- shadcn/ui components
- Express for API

## Conclusion

The Celebrity Vibes Events feature provides a powerful way to create themed product collections tied to special occasions, enhancing user engagement and providing celebrities with new ways to showcase their products during relevant events.
