# Vdrive Flutter Authentication Module - Complete Index

## Project Structure

```
lib/
├── core/
│   └── api/
│       └── api_client.dart                 # HTTP REST API client
├── models/
│   ├── user_model.dart                    # User data model
│   ├── charger_model.dart                 # Charger station model
│   └── session_model.dart                 # Charging session model
├── providers/
│   ├── auth_provider.dart                 # Authentication state management
│   ├── charger_provider.dart              # Charger data management
│   └── session_provider.dart              # Session history management
├── screens/
│   └── auth/
│       ├── login_screen.dart              # Login UI screen
│       └── activate_account_screen.dart   # Account activation screen
├── widgets/
│   ├── vdrive_text_field.dart             # Reusable text input widget
│   └── vdrive_button.dart                 # Reusable button widget
├── utils/
│   ├── jwt_decoder.dart                   # JWT token parsing utilities
│   └── mock_data.dart                     # Mock data for development
├── main_example.dart                      # Example main.dart setup
├── AUTHENTICATION_SETUP.md                # Detailed setup guide
└── VDRIVE_AUTH_MODULE_INDEX.md           # This file
```

## File Descriptions

### Core - API Layer

#### `lib/core/api/api_client.dart`
HTTP client for REST API communication with the Java Spring Boot backend.

**Features:**
- GET, POST, PUT, DELETE methods
- Automatic Authorization header injection
- Response status code handling
- JSON encoding/decoding
- Token management (setToken, clearToken)
- Custom ApiException for error handling

**Key Methods:**
- `get(endpoint)` - Make GET request
- `post(endpoint, body)` - Make POST request with JSON body
- `put(endpoint, body)` - Make PUT request
- `delete(endpoint)` - Make DELETE request
- `setToken(token)` - Store and use bearer token
- `clearToken()` - Clear stored token

**Usage:**
```dart
final client = ApiClient(baseUrl: 'https://api.vdrive.com');
final response = await client.get('/api/v1/chargers');
```

---

### Models

#### `lib/models/user_model.dart`
Represents an authenticated user with basic profile information.

**Properties:**
- `id` - Unique user identifier
- `email` - User email address
- `firstName` - First name (optional)
- `lastName` - Last name (optional)
- `phone` - Phone number (optional)
- `roles` - List of user roles (USER, ADMIN, etc.)
- `isActive` - Account activation status
- `createdAt` - Account creation date

**Methods:**
- `fullName` - Getter combining firstName and lastName

---

#### `lib/models/charger_model.dart`
Represents an EV charging station.

**Properties:**
- `id` - Charger identifier
- `name` - Station name
- `address` - Physical address
- `latitude`, `longitude` - GPS coordinates
- `totalSockets` - Total charging ports
- `availableSockets` - Currently available ports
- `connectorTypes` - Supported connectors (Type 2, CCS, CHAdeMO)
- `pricesPerKwh` - Pricing per connector type
- `rating` - User rating (0-5)
- `reviewCount` - Number of reviews
- `hasParking` - Parking availability
- `hasRestroom` - Restroom availability
- `operatingStatus` - Current status (active, inactive, etc.)

---

#### `lib/models/session_model.dart`
Represents a charging session and aggregated statistics.

**ChargingSession Properties:**
- `id` - Session identifier
- `chargerId` - Associated charger
- `chargerName` - Charger name
- `userId` - User who charged
- `startTime` - Session start timestamp
- `endTime` - Session end timestamp (optional)
- `energyDelivered` - Energy delivered in kWh
- `costAed` - Cost in AED
- `status` - active, completed, failed
- `socketNumber` - Which socket was used

**SessionStats Properties:**
- `totalSessions` - Total sessions count
- `totalEnergyKwh` - Total energy delivered
- `totalSpentAed` - Total amount spent
- `co2SavedKg` - Estimated CO2 saved

---

### Providers (State Management)

#### `lib/providers/auth_provider.dart`
Manages authentication state and user session.

**State:**
- `currentUser` - Currently authenticated user
- `token` - Bearer token for API requests
- `isLoading` - Loading state flag
- `error` - Error message if any
- `isAuthenticated` - Boolean authentication status

**Methods:**
- `login(email, password)` - Authenticate user
- `activateAccount(token, password)` - Activate new account
- `logout()` - Clear session and log out
- `checkAuth()` - Validate existing token on app startup

**Features:**
- Automatic JWT token validation and expiry checking
- Secure token storage using FlutterSecureStorage
- Auto-decode JWT to extract user info
- User-friendly error messages
- Automatic token injection in API requests

**Events:**
- Calls `notifyListeners()` after state changes
- Integrates with Provider for reactive UI updates

**Usage:**
```dart
final authProvider = context.read<AuthProvider>();
final success = await authProvider.login('user@example.com', 'password');

if (success) {
  print('User logged in: ${authProvider.currentUser?.email}');
}
```

---

#### `lib/providers/charger_provider.dart`
Manages charger data and location-based filtering.

**State:**
- `chargers` - All available chargers
- `nearbyChargers` - Filtered chargers by proximity
- `selectedCharger` - Currently selected charger
- `isLoading` - Loading state flag

**Methods:**
- `fetchChargers()` - Load all chargers
- `fetchNearbyChargers(lat, lng, radiusKm)` - Get chargers within radius
- `searchChargers(query)` - Search by name/address
- `getChargerById(id)` - Get specific charger
- `selectCharger(charger)` - Set selected charger
- `clearSelection()` - Clear selection

**Features:**
- Haversine formula for accurate distance calculation
- Auto-sorting by distance
- Search filter by name and address
- Mock data includes 12 UAE locations

**Current Status:**
- Uses mock data for development
- Ready for API integration when `/api/v1/chargers` endpoint available

**Usage:**
```dart
final chargerProvider = context.read<ChargerProvider>();
await chargerProvider.fetchChargers();
await chargerProvider.fetchNearbyChargers(25.2048, 55.2708, 5.0); // 5km radius
```

---

#### `lib/providers/session_provider.dart`
Manages charging session history and statistics.

**State:**
- `sessions` - List of all charging sessions
- `activeSession` - Current in-progress session
- `isLoading` - Loading state flag
- `stats` - SessionStats object with aggregated data

**Methods:**
- `fetchSessions()` - Load all sessions
- `getActiveSession()` - Get current charging session
- `fetchStats()` - Load statistics
- `getSessionById(id)` - Get specific session
- `getCompletedSessions()` - Filter completed sessions
- `getSessionsForCharger(id)` - Get sessions for specific charger
- `calculateStats()` - Compute statistics from sessions
- `updateStats()` - Update statistics and notify listeners

**Features:**
- Auto-detects active sessions
- Calculates CO2 savings (0.5 kg per kWh)
- Aggregates cost and energy data
- Mock data includes 10 recent sessions

**Usage:**
```dart
final sessionProvider = context.read<SessionProvider>();
await sessionProvider.fetchSessions();
await sessionProvider.fetchStats();

print('Total energy: ${sessionProvider.stats.totalEnergyKwh} kWh');
print('Total cost: ${sessionProvider.stats.totalSpentAed} AED');
```

---

### Screens

#### `lib/screens/auth/login_screen.dart`
Beautiful dark-themed login interface.

**Features:**
- Vdrive logo and branding
- Email and password input fields
- Form validation
- Loading state with spinner
- Error display via SnackBar
- Smooth fade-in animations
- "Forgot password?" link (placeholder)
- "Sign up" link
- SafeArea and responsive layout

**Theme:**
- Dark background (#111827)
- Amber accent buttons (#F59E0B)
- Custom styled text fields
- Material 3 design

**Validation:**
- Email format validation
- Password minimum 6 characters
- Both fields required

**Usage:**
```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) => LoginScreen(
      onLoginSuccess: () {
        // Handle successful login
      },
    ),
  ),
);
```

---

#### `lib/screens/auth/activate_account_screen.dart`
Account activation flow with password setup.

**Features:**
- Activation token input (manual or deep link)
- New password field with strength indicator
- Confirm password field
- Password strength validation
- Real-time strength feedback (weak/medium/strong)
- Password requirements display:
  - Minimum 8 characters
  - Uppercase letter required
  - Number required
  - Special character required
- AppBar with back navigation
- Animations and dark theme

**Password Strength Indicator:**
- Visual progress bar color-coded
- Weak (red), Medium (orange), Strong (green)
- Requirements checklist below

**Usage:**
```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) => ActivateAccountScreen(
      activationToken: 'token_from_deeplink',
      onActivationSuccess: () {
        // Navigate to login
      },
    ),
  ),
);
```

---

### Widgets

#### `lib/widgets/vdrive_text_field.dart`
Reusable styled text input component.

**Features:**
- Dark surface background with amber focus border
- Optional label and hint text
- Prefix and suffix icons
- Show/hide toggle for passwords
- Error state styling with error text
- Form validation support
- Focus state animations
- Rounded corners (12px)
- Disabled state support

**Customization:**
```dart
VdriveTextField(
  label: 'Email',
  hint: 'user@example.com',
  prefixIcon: Icons.email,
  obscureText: false,
  validator: (value) => value?.isEmpty ? 'Required' : null,
)
```

---

#### `lib/widgets/vdrive_button.dart`
Reusable button component with multiple variants.

**Types:**
- `VdriveButtonType.primary` - Amber gradient button for main actions
- `VdriveButtonType.secondary` - Outlined amber button
- `VdriveButtonType.danger` - Red gradient for destructive actions

**Features:**
- Loading state with spinner
- Disabled state styling
- Full-width option
- Icon support
- Rounded corners
- Smooth elevation and shadows
- Custom height (default 56px)

**Usage:**
```dart
VdriveButton(
  label: 'Sign In',
  onPressed: () => handleLogin(),
  type: VdriveButtonType.primary,
  isLoading: isLoading,
  fullWidth: true,
)
```

---

### Utilities

#### `lib/utils/jwt_decoder.dart`
JWT token parsing and validation utilities.

**Methods:**
- `decode(token)` - Parse JWT and extract payload claims
- `isTokenExpired(token)` - Check if token has expired
- `getUserIdFromToken(token)` - Extract user ID claim
- `getEmailFromToken(token)` - Extract email claim
- `getRolesFromToken(token)` - Extract roles array

**Expected JWT Claims:**
- `sub` or `userId` - User identifier
- `email` - User email address
- `roles` - Array of role strings
- `exp` - Expiration timestamp (seconds)

**Usage:**
```dart
final isExpired = JwtDecoder.isTokenExpired(token);
final userId = JwtDecoder.getUserIdFromToken(token);
final roles = JwtDecoder.getRolesFromToken(token);
```

---

#### `lib/utils/mock_data.dart`
Mock data for development and testing.

**Mock Chargers (12 locations):**
- Abu Dhabi Mall
- The Galleria Al Maryah Island
- Yas Mall
- Downtown Abu Dhabi
- Dubai Mall
- Mall of the Emirates
- Ibn Battuta Mall
- Dubai Marina
- Jumeirah Beach Residence
- Emirates Mall
- Al Wahda Mall
- Al Reef Mall

**Mock Sessions (10 sessions):**
- Realistic timestamps (past dates)
- Various charger locations
- Energy 19-40 kWh per session
- Cost 24-58 AED per session
- 100% completed status

**Mock Statistics:**
- 47 total sessions
- 1,284.5 kWh total energy
- 1,685.40 AED total spent
- 641.2 kg CO2 saved

**Usage:**
```dart
final chargers = MockData.getMockChargers();
final sessions = MockData.getMockSessions();
final stats = MockData.getMockSessionStats();
```

---

### Documentation

#### `AUTHENTICATION_SETUP.md`
Complete setup and integration guide covering:
- Architecture overview
- Feature descriptions
- Installation steps
- API endpoint requirements
- JWT token format
- Usage examples
- Theme customization
- Mock data details
- Error handling
- Next steps for production

#### `main_example.dart`
Reference implementation showing:
- Provider initialization
- Theme configuration
- AuthWrapper widget
- Automatic auth checking
- Navigation logic
- Dashboard example
- Statistics display

---

## API Requirements

### Authentication Endpoints

#### POST /api/v1/auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["USER"]
  }
}
```

#### POST /api/v1/auth/activate
```json
Request:
{
  "token": "activation_token_abc...",
  "password": "newPassword123"
}

Response (200):
{
  "message": "Account activated successfully"
}
```

#### POST /api/v1/auth/logout
```json
Request: {}
Response (200): {}
```

### Data Endpoints (Not yet implemented)

- GET `/api/v1/chargers` - All charging stations
- GET `/api/v1/sessions` - User's session history
- GET `/api/v1/sessions/active` - Current active session
- GET `/api/v1/sessions/stats` - User statistics

---

## Theme Colors

```dart
// Dark backgrounds
const Color darkBg = Color(0xFF111827);        // #111827
const Color darkSurface = Color(0xFF1F2937);  // #1F2937

// Accents
const Color amberAccent = Color(0xFFF59E0B);  // #F59E0B
const Color successGreen = Color(0xFF10B981); // #10B981

// Text
Color white = Colors.white;
Color grey400 = Colors.grey[400];
Color grey600 = Colors.grey[600];
```

---

## Dependencies

```yaml
dependencies:
  provider: ^6.1.2           # State management
  http: ^1.2.1              # HTTP requests
  flutter_secure_storage: ^9.2.2  # Secure token storage
  geolocator: ^12.0.0        # Location services
  intl: ^0.19.0              # Date formatting
  go_router: ^14.2.0         # Navigation
```

---

## Integration Checklist

- [x] Create authentication provider with login/logout
- [x] Implement JWT token parsing and validation
- [x] Setup secure token storage
- [x] Create login screen UI
- [x] Create account activation screen
- [x] Implement charger data provider
- [x] Implement session history provider
- [x] Create reusable UI widgets
- [x] Setup example main.dart
- [x] Create comprehensive documentation

## Next Steps

1. Update `main.dart` with your backend URL
2. Implement `/api/v1/chargers` endpoint
3. Implement `/api/v1/sessions` endpoints
4. Add navigation with go_router
5. Implement payment integration
6. Add push notifications
7. Setup analytics
8. Add offline caching

---

## Support & References

- Flutter Provider documentation: https://pub.dev/packages/provider
- JWT specification: https://tools.ietf.org/html/rfc7519
- Material Design 3: https://m3.material.io/

---

**Module Version:** 1.0.0
**Last Updated:** 2026-04-13
**Flutter SDK:** >= 3.0.0
