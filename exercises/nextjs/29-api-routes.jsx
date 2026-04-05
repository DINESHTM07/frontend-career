// ============================================
// INTRO: Next.js API Routes — Backend Inside Your Frontend
// ============================================
// Next.js lets you write backend API endpoints inside your frontend project.
// No separate Express server needed. These run on Node.js on the server.
//
// WHY this matters:
//   - One repo for frontend + backend logic
//   - Secure: API keys stay server-side (never exposed to browser)
//   - Deploy together: Vercel, Railway, etc. handle both
//   - Serverless by default: each route = a serverless function
//
// App Router API routes live in: app/api/[route]/route.js
// Each file exports named functions: GET, POST, PUT, DELETE, PATCH
//
// PATTERN: Factory
// Each route handler is a "factory" — it takes a Request, processes it,
// and returns a Response. Same interface, different logic per method.
//
// REST conventions:
//   GET    /api/jokes         → list all jokes
//   POST   /api/jokes         → create a new joke
//   GET    /api/jokes/:id     → get one joke
//   PUT    /api/jokes/:id     → replace a joke
//   PATCH  /api/jokes/:id     → partially update a joke
//   DELETE /api/jokes/:id     → remove a joke
// ============================================

// ============================================
// PATTERN: Factory (API Endpoints)
// ============================================
// Each route handler follows the same factory pattern:
//   1. Parse the request (body, params, searchParams)
//   2. Validate inputs
//   3. Do the work (DB query, third-party API, computation)
//   4. Return a Response with appropriate status code
// ============================================

// ============================================
// ENDPOINT 1: GET /api/jokes — List all jokes
// app/api/jokes/route.js
// ============================================

// In-memory "database" for this exercise (replace with real DB in production)
const jokesDB = [
  { id: 1, setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!", category: "science", likes: 42 },
  { id: 2, setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field!", category: "puns", likes: 38 },
  { id: 3, setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up!", category: "food", likes: 29 },
  { id: 4, setup: "What do you call a fake noodle?", punchline: "An impasta!", category: "food", likes: 55 },
  { id: 5, setup: "Why did the math book look so sad?", punchline: "Because it had too many problems!", category: "school", likes: 33 },
];

let nextId = 6;

// GET /api/jokes
export async function GET_jokes(request) {
  // Parse URL search params for filtering
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sortBy = searchParams.get("sortBy") || "id"; // id | likes
  const order = searchParams.get("order") || "asc";  // asc | desc

  let jokes = [...jokesDB];

  // Filter by category if provided
  if (category) {
    jokes = jokes.filter((j) => j.category === category);
  }

  // Sort
  jokes.sort((a, b) => {
    const dir = order === "desc" ? -1 : 1;
    return (a[sortBy] - b[sortBy]) * dir;
  });

  return Response.json(
    {
      data: jokes,
      meta: {
        total: jokes.length,
        categories: [...new Set(jokesDB.map((j) => j.category))],
      },
    },
    { status: 200 }
  );
}

// Example requests:
//   GET /api/jokes                          → all jokes
//   GET /api/jokes?category=food           → only food jokes
//   GET /api/jokes?sortBy=likes&order=desc → sorted by most liked

// ============================================
// ENDPOINT 2: POST /api/feedback — Submit feedback
// app/api/feedback/route.js
// ============================================

const feedbackDB = [];

export async function POST_feedback(request) {
  let body;

  // Safely parse JSON body
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Validate required fields
  const { name, email, message, rating } = body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Valid email required";
  }

  if (!message || message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    errors.rating = "Rating must be between 1 and 5";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Validation failed", details: errors },
      { status: 422 } // Unprocessable Entity
    );
  }

  // Store feedback
  const newFeedback = {
    id: Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    message: message.trim(),
    rating: rating || null,
    createdAt: new Date().toISOString(),
  };

  feedbackDB.push(newFeedback);

  // In production: send email notification, save to DB, etc.
  console.log("[Feedback received]", newFeedback);

  return Response.json(
    { data: newFeedback, message: "Feedback submitted successfully" },
    { status: 201 } // Created
  );
}

// Example request:
//   POST /api/feedback
//   Body: { "name": "Alice", "email": "alice@example.com", "message": "Great site!", "rating": 5 }

// ============================================
// ENDPOINT 3: GET /api/weather?city=x — Weather proxy
// app/api/weather/route.js
// ============================================
// Why proxy through Next.js? To hide your API key from the browser.
// Browser → Next.js API route → OpenWeatherMap (key stays on server)

export async function GET_weather(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city || city.trim().length === 0) {
    return Response.json(
      { error: "city parameter is required. Example: /api/weather?city=London" },
      { status: 400 }
    );
  }

  // Simulate weather data (replace with real API call using API key from env)
  // In production: const apiKey = process.env.OPENWEATHER_API_KEY
  //                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
  const weatherData = simulateWeather(city.trim());

  if (!weatherData) {
    return Response.json(
      { error: `City "${city}" not found` },
      { status: 404 }
    );
  }

  // Cache weather for 10 minutes (ISR-style caching on API routes)
  return Response.json(
    { data: weatherData },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
      },
    }
  );
}

function simulateWeather(city) {
  const conditions = ["Sunny", "Cloudy", "Rainy", "Stormy", "Foggy", "Windy"];
  const seed = city.charCodeAt(0) % conditions.length;

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    temperature: Math.floor(15 + (city.charCodeAt(0) % 20)),
    feelsLike: Math.floor(12 + (city.charCodeAt(0) % 18)),
    condition: conditions[seed],
    humidity: 40 + (city.charCodeAt(1) % 50 || 20),
    windSpeed: 5 + (city.charCodeAt(0) % 30),
    icon: ["☀️", "☁️", "🌧️", "⛈️", "🌫️", "💨"][seed],
    timestamp: new Date().toISOString(),
  };
}

// Example requests:
//   GET /api/weather?city=London    → London weather
//   GET /api/weather?city=Tokyo     → Tokyo weather
//   GET /api/weather                → 400 error

// ============================================
// ENDPOINT 4: DELETE /api/jokes/:id — Delete a joke
// app/api/jokes/[id]/route.js
// ============================================

export async function DELETE_joke(request, { params }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return Response.json(
      { error: "Invalid joke ID" },
      { status: 400 }
    );
  }

  const index = jokesDB.findIndex((j) => j.id === id);

  if (index === -1) {
    return Response.json(
      { error: `Joke with id ${id} not found` },
      { status: 404 }
    );
  }

  const deleted = jokesDB.splice(index, 1)[0];

  return Response.json(
    { data: deleted, message: "Joke deleted successfully" },
    { status: 200 } // or 204 No Content if not returning body
  );
}

// Example requests:
//   DELETE /api/jokes/2   → deletes joke with id 2
//   DELETE /api/jokes/99  → 404 not found

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. Why use an API route to proxy weather data instead of calling the
//    weather API directly from the browser?
//    What would break if you called it from the browser?
//
// 2. What HTTP status codes did we use and why?
//    200, 201, 400, 404, 422 — what is each for?
//
// 3. In the POST handler, why do we validate inputs on the server
//    even if we also validate on the client side?
//
// 4. The weather endpoint uses Cache-Control headers. What does
//    s-maxage=600, stale-while-revalidate=60 mean?
// ============================================

// ============================================
// YOUR TURN: Add PUT (edit) + Pagination
// ============================================
//
// TASK 1 — PUT /api/jokes/:id (edit a joke)
// app/api/jokes/[id]/route.js — add PUT handler
//
// Requirements:
//   - Parse id from params, validate it's a number
//   - Parse body: { setup?, punchline?, category? } (all optional)
//   - Validate: at least one field must be provided
//   - Validate: if setup provided, must be 10+ chars; punchline 5+ chars
//   - Update only the provided fields (partial update)
//   - Return updated joke with 200
//   - Return 404 if id not found
//   - Return 400 if no fields provided
//
// export async function PUT(request, { params }) {
//   YOUR CODE HERE
// }
//
// Test with:
//   PUT /api/jokes/1
//   Body: { "punchline": "Because they make up EVERYTHING!" }

// TASK 2 — Pagination for GET /api/jokes
// Add pagination to the GET /api/jokes handler
//
// Requirements:
//   - Support ?page=1&limit=2 query params
//   - Default: page=1, limit=10
//   - Return data + pagination metadata:
//     { data: [...], meta: { page, limit, total, totalPages, hasNext, hasPrev } }
//   - Validate: page must be >= 1, limit between 1 and 50
//   - Return 400 for invalid pagination params
//
// Test with:
//   GET /api/jokes?page=1&limit=2   → first 2 jokes
//   GET /api/jokes?page=2&limit=2   → jokes 3-4
//   GET /api/jokes?page=99&limit=2  → empty data, valid response

export async function PUT_joke(request, { params }) {
  // YOUR CODE HERE
}

export function addPaginationToGetJokes(jokes, searchParams) {
  // YOUR CODE HERE
  // Parse page and limit from searchParams
  // Return { paginatedJokes, meta }
}

// BONUS TASK — POST /api/jokes/:id/like — Toggle like on a joke
// export async function POST_like(request, { params }) { ... }
// Increment joke.likes by 1 each time called
// Return: { liked: true, newCount: 43 }

// ============================================
// PATTERN LEARNED: Factory (API Endpoints)
// ============================================
// WHY "Factory":
//   Each route file is a factory that creates HTTP responses from requests.
//   Same input interface (Request) → same output interface (Response).
//   Different factories (GET, POST, PUT, DELETE) produce different results.
//
// BEST PRACTICES FOR API ROUTES:
//
//   1. Always validate inputs on the server — client validation is UX,
//      server validation is security. Users can bypass client checks.
//
//   2. Use correct HTTP status codes:
//      200 OK, 201 Created, 204 No Content (delete with no body)
//      400 Bad Request (missing/invalid input)
//      401 Unauthorized (not logged in)
//      403 Forbidden (logged in but not allowed)
//      404 Not Found
//      409 Conflict (duplicate email, etc.)
//      422 Unprocessable Entity (valid JSON but fails business rules)
//      500 Internal Server Error
//
//   3. Never expose internal errors to the client:
//      catch (err) { return Response.json({ error: 'Internal error' }, { status: 500 }) }
//
//   4. Keep API keys in environment variables:
//      process.env.MY_SECRET_KEY — server-only (no NEXT_PUBLIC_ prefix)
//      NEXT_PUBLIC_KEY — exposed to browser, never for secrets
//
//   5. Add rate limiting for public endpoints:
//      Use Upstash Redis + @upstash/ratelimit for edge-compatible rate limiting
//
// FILE STRUCTURE:
//   app/api/jokes/route.js          → GET (list), POST (create)
//   app/api/jokes/[id]/route.js     → GET (one), PUT, PATCH, DELETE
//   app/api/feedback/route.js       → POST only
//   app/api/weather/route.js        → GET only (proxy)
// ============================================
