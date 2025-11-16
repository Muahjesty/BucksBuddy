# Campus Events API Documentation for AI Integration

## Overview
This API endpoint allows your external chatbot backend to fetch real-time campus event data to answer student questions about upcoming events.

## Endpoint

**GET** `/api/ai/campus-events`

**Base URL:** Your Replit app URL (e.g., `https://your-app.replit.dev`)

## Authentication

This endpoint requires authentication using a shared API key.

**Header:**
```
Authorization: Bearer YOUR_AI_API_KEY
```

Replace `YOUR_AI_API_KEY` with the same secret you added to both:
- This BucksBuddy app (as `AI_API_KEY` secret)
- Your external chatbot backend (as `AI_API_KEY` secret)

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 10 | Maximum number of events to return |
| `days_ahead` | integer | 30 | Only return events within this many days from now |

## Request Example

```bash
curl -X GET "https://your-app.replit.dev/api/ai/campus-events?limit=5&days_ahead=7" \
  -H "Authorization: Bearer YOUR_AI_API_KEY" \
  -H "Content-Type: application/json"
```

## Response Format

### Success (200 OK)

```json
{
  "events": [
    {
      "id": "uuid-here",
      "name": "Rutgers Tech Talk: AI in Education",
      "category": "Academic",
      "date": "2025-11-20T18:00:00.000Z",
      "location": "Bradley Hall Room 201",
      "description": "Join us for an exciting discussion about AI applications in modern education",
      "organizer": "Computer Science Department",
      "isFree": true
    },
    {
      "id": "uuid-here",
      "name": "Campus Job Fair",
      "category": "Career",
      "date": "2025-11-22T10:00:00.000Z",
      "location": "Campus Center Atrium",
      "description": "Meet with employers from top companies in the tri-state area",
      "organizer": "Career Services",
      "isFree": true
    }
  ],
  "count": 2,
  "query": {
    "limit": 5,
    "days_ahead": 7
  }
}
```

### Error Responses

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": "Missing or invalid authorization header"
}
```

**401 Unauthorized** - Wrong API key
```json
{
  "error": "Invalid API key"
}
```

**500 Internal Server Error** - Server configuration issue
```json
{
  "error": "Server configuration error"
}
```

## Event Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique event identifier |
| `name` | string | Event title |
| `category` | string | Event category (Academic, Social, Career, Sports, Cultural, etc.) |
| `date` | string (ISO 8601) | Event date and time |
| `location` | string | Event location/venue |
| `description` | string | Event details |
| `organizer` | string | Organization hosting the event |
| `isFree` | boolean | Whether the event is free to attend |

## Integration with Your Chatbot Backend

### Step 1: Store the API Key
In your external chatbot backend, add the same `AI_API_KEY` secret that you added to this app.

### Step 2: Fetch Events Before Responding
When a user asks about events, fetch the data from this endpoint:

```python
# Python example
import os
import requests

def get_campus_events(limit=10, days_ahead=30):
    api_key = os.environ.get("AI_API_KEY")
    base_url = "https://your-smart-campus-wallet-app.replit.dev"
    
    response = requests.get(
        f"{base_url}/api/ai/campus-events",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        params={
            "limit": limit,
            "days_ahead": days_ahead
        }
    )
    
    if response.status_code == 200:
        return response.json()["events"]
    else:
        print(f"Error fetching events: {response.json()}")
        return []
```

```javascript
// Node.js example
const axios = require('axios');

async function getCampusEvents(limit = 10, daysAhead = 30) {
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = "https://your-smart-campus-wallet-app.replit.dev";
    
    try {
        const response = await axios.get(`${baseUrl}/api/ai/campus-events`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            params: {
                limit: limit,
                days_ahead: daysAhead
            }
        });
        
        return response.data.events;
    } catch (error) {
        console.error("Error fetching events:", error.response?.data);
        return [];
    }
}
```

### Step 3: Include Event Data in OpenAI Context
When handling a chat message, fetch events and include them in your OpenAI prompt:

```python
# Python + OpenAI example
from openai import OpenAI

def handle_chat(user_message, financial_context):
    # Fetch campus events
    events = get_campus_events(limit=5, days_ahead=14)
    
    # Build context for OpenAI
    event_context = ""
    if events:
        event_context = "\\n\\nUpcoming Campus Events:\\n"
        for event in events:
            event_context += f"- {event['name']} on {event['date'][:10]} at {event['location']}"
            if event['isFree']:
                event_context += " (FREE)"
            event_context += f"\\n  {event['description']}\\n"
    
    system_prompt = f"""You are a friendly Campus Assistant for Rutgers University-Newark students.
    
Current student financial context:
- Meal Plan Balance: ${financial_context['meal_plan_balance']}
- Dining Dollars: ${financial_context['dining_dollars']}
- Campus Card Balance: ${financial_context['campus_card_balance']}
{event_context}

Help students with spending, budgeting, and campus life questions."""
    
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )
    
    return completion.choices[0].message.content
```

## Example Use Cases

### User asks: "What events are happening this weekend?"
Your backend:
1. Calls `/api/ai/campus-events?days_ahead=7&limit=10`
2. Receives list of upcoming events
3. Includes events in OpenAI context
4. OpenAI responds with relevant weekend events

### User asks: "Are there any free events I can attend?"
Your backend:
1. Fetches events from the endpoint
2. Filters for `isFree: true` events
3. Provides personalized recommendations

### User asks: "What tech events are coming up?"
Your backend:
1. Fetches events
2. OpenAI filters by category or keywords in description
3. Returns tech-related events

## Security Notes

- ✅ The `AI_API_KEY` must match in both apps
- ✅ Keep the API key secret - never expose it in client-side code
- ✅ Only your external backend should call this endpoint
- ✅ The endpoint does not require user authentication (uses service-to-service auth instead)

## Rate Limiting & Caching

Consider implementing caching in your chatbot backend:
- Cache event data for 5-10 minutes to reduce API calls
- Invalidate cache when users explicitly ask for "latest" events
- This improves response time and reduces load

## Testing

Test the endpoint using curl:

```bash
# Test with valid key
curl -X GET "https://your-app.replit.dev/api/ai/campus-events?limit=3&days_ahead=7" \
  -H "Authorization: Bearer YOUR_AI_API_KEY"

# Test without auth (should fail)
curl -X GET "https://your-app.replit.dev/api/ai/campus-events"

# Test with wrong key (should fail)
curl -X GET "https://your-app.replit.dev/api/ai/campus-events" \
  -H "Authorization: Bearer wrong-key"
```

## Support

If you encounter issues:
1. Verify `AI_API_KEY` is set in both apps
2. Check that the key matches exactly
3. Ensure your app URL is correct
4. Check the server logs for detailed error messages
