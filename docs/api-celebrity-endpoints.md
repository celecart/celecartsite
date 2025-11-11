# Celebrity Endpoints

This app exposes both a page route and an API route for accessing a celebrity by ID. Use the API for programmatic access; the page route renders the SPA, but can return JSON when requested.

## Routes

- `GET /api/celebrities/:id`
  - Returns a celebrity JSON object.
  - Errors:
    - `400 { "message": "Invalid celebrity ID" }`
    - `404 { "message": "Celebrity not found" }`
    - `500 { "message": "Failed to fetch celebrity" }`
  - Behavior: Optional activity logging when the requester is authenticated.

- `GET /celebrity/:id`
  - Default: Renders the SPA profile page.
  - JSON: Returns the same JSON as the API when either:
    - `Accept: application/json`, or
    - `?format=json` is present
  - Errors (in JSON mode): same as the API route.

## Parameter Handling

- `:id` must be numeric. Leading/trailing whitespace is trimmed.
- Non-numeric IDs return `400`.

## Examples

```http
GET /api/celebrities/4
GET /celebrity/4?format=json
GET /celebrity/999999?format=json      // 404
GET /celebrity/abc?format=json         // 400
```

## Notes

- Prefer `GET /api/celebrities/:id` for backend services or scripts.
- The alias route helps clients accidentally hitting the page route while expecting JSON.