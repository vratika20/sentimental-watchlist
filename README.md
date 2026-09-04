# Sentinel Watchlist Backend 🛡️📈

**Sentinel Watchlist** is an intelligent market monitoring backend built for a 72-hour hackathon. Unlike traditional apps that display static real-time prices, Sentinel remembers when a user last checked their watchlist. When they return, it analyzes historical market snapshots, calculates price % and volume % deltas, classifies movement severity (`NORMAL`, `MODERATE`, `SIGNIFICANT`), computes overall Watchlist Health and Volatility risk, and generates smart cross-sector recommendations.

It also features a **Time Machine API** that allows users to travel back in time and compare market states between any two historical timestamps.

---

## 🚀 Tech Stack
- **Language**: Java 17+
- **Framework**: Spring Boot 3.2.3
- **ORM / Persistence**: Spring Data JPA / Hibernate
- **Database**: PostgreSQL (with automatic fallback to embedded H2 in PostgreSQL mode)
- **Build Tool**: Apache Maven
- **Architecture**: 4-Tier Clean Architecture (`Controller` → `Service` → `Repository` → `Entity/DTO`)

---

## 🗄️ Database Tables & Schema

- **`users`**: User records tracking `id`, `name`, `email`, `last_active_timestamp`, `created_at`.
- **`watchlist_items`**: Mapping table connecting users to stock symbols (`user_id`, `symbol`, `added_at`).
- **`stock_snapshots`**: Time-series market snapshots (`symbol`, `company_name`, `sector`, `price`, `volume`, `timestamp`).

---

## ⚡ Core Features & Analytics Engine

1. **User Management**: Simple onboarding and tracking of user's `last_active_timestamp`.
2. **Watchlist Operations**: Dynamic creation, deletion, and retrieval of user watchlists.
3. **Snapshot Delta Engine**: Calculates price change % (`((P_to - P_from)/P_from) * 100`) and volume change % between two timestamps.
4. **Movement Severity Classifier**:
   - `NORMAL`: `|Price %| < 1.5%`
   - `MODERATE`: `1.5% <= |Price %| < 3.0%`
   - `SIGNIFICANT`: `|Price %| >= 3.0%`
5. **Tata Motors Demo Surge**: Seeded data demonstrates **10:00 AM → 2:00 PM: +3.5% Surge** (₹950.00 → ₹983.25, volume surge +137.5%).
6. **Volatility Classifier**: Computes standard deviation of returns across historical snapshots (`LOW`, `MEDIUM`, `HIGH`).
7. **Watchlist Health Evaluator**: Returns a health score (0-100) and status (`STABLE`, `MODERATE_ATTENTION`, `HIGH_ALERT`).
8. **Smart Recommendation Engine**: Recommends top non-watched stocks matching the user's active portfolio sectors.
9. **Time Machine API**: Allows comparing any two arbitrary historical timestamps.
10. **Data Freshness & Missing Data Handling**: Gracefully handles missing exact timestamps by matching nearest prior snapshots and providing data age tags (`REALTIME`, `RECENT`, `STALE`).

---

## 🛠️ How to Run

### Prerequisites
- JDK 17+ installed (`java -version`)
- Maven (included local binary `./apache-maven-3.9.6/bin/mvn`)

### 1. Build and Run Tests
```bash
./apache-maven-3.9.6/bin/mvn clean test
```

### 2. Start Application
```bash
./apache-maven-3.9.6/bin/mvn spring-boot:run
```
The application starts at `http://localhost:8080`.

H2 Console (if using in-memory mode): `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:sentineldb`
- Username: `sa`
- Password: *(blank)*

---

## 📡 REST API Documentation & Curl Examples

### 1. User Management

#### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Trader", "email": "alice@sentinel.com"}'
```

#### Get User
```bash
curl http://localhost:8080/api/users/1
```

---

### 2. Watchlist Management

#### View Watchlist
```bash
curl http://localhost:8080/api/users/1/watchlist
```

#### Add Stock to Watchlist
```bash
curl -X POST http://localhost:8080/api/users/1/watchlist \
  -H "Content-Type: application/json" \
  -d '{"symbol": "TATAMOTORS"}'
```

#### Remove Stock from Watchlist
```bash
curl -X DELETE http://localhost:8080/api/users/1/watchlist/TCS
```

---

### 3. Dashboard & Time Machine

#### "What Changed Since Last Check" Dashboard
Fetches user dashboard comparing market state at `last_active_timestamp` (10:00 AM in demo seed) with latest market state (2:00 PM in demo seed). Automatically updates `last_active_timestamp` after execution.

```bash
curl http://localhost:8080/api/users/1/dashboard
```

#### Time Machine API
Compare watchlist market state between any two historical timestamps (e.g. 10:00 AM and 2:00 PM on 2026-09-04).

```bash
curl "http://localhost:8080/api/users/1/dashboard/time-machine?from=2026-09-04T10:00:00%2B05:30&to=2026-09-04T14:00:00%2B05:30"
```

---

## 🧪 Demo Scenario Output Highlights

When querying `GET /api/users/1/dashboard`:
- **Tata Motors (`TATAMOTORS`)**: `+3.5% Surge` (950.00 → 983.25, volume +137.5%, `SIGNIFICANT`)
- **Infosys (`INFY`)**: `+1.8% Gain` (1600.00 → 1628.80, `MODERATE`)
- **TCS (`TCS`)**: `+0.4% Stable` (3850.00 → 3865.40, `NORMAL`)
- **HDFC Bank (`HDFCBANK`)**: `-1.2% Dip` (1450.00 → 1432.60, `NORMAL`)
- **Watchlist Health**: Score `65/100`, Status `MODERATE_ATTENTION`
- **Recommendations**: Recommends `M&M` (Mahindra & Mahindra, Auto sector candidate)
