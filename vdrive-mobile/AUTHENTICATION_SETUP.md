# Vdrive Flutter Authentication Module - Setup Guide

## Overview

This authentication module provides a complete authentication system for the Vdrive Flutter customer mobile app, connecting to a Java Spring Boot backend via REST API.

## Architecture

### Files Created

#### Providers
- **`lib/providers/auth_provider.dart`** - Main authentication provider handling login, logout, token management
- **`lib/providers/charger_provider.dart`** - Charger data management with mock data
- **`lib/providers/session_provider.dart`** - Charging session history and statistics

#### Models
- **`lib/models/user_model.dart`** - User data structure
- **`lib/models/charger_model.dart`** - Charger station data structure
- **`lib/models/session_model.dart`** - Charging session and statistics data

#### Core
- **`lib/core/api/api_client.dart`** - HTTP client for REST API communication
- **`lib/utils/jwt_decoder.dart`** - JWT token parsing and validation
- **`lib/utils/mock_data.dart`** - Mock data for chargers and sessions

#### UI Components
- **`lib/widgets/vdrive_text_field.dart`** - Reusable styled text input
- **`lib/widgets/vdrive_button.dart`** - Reusable styled button component

#### Screens
- **`lib/screens/auth/login_screen.dart`** - Beautiful login screen with animations
- **`lib/screens/auth/activate_account_screen.dart`** - Account activation flow

## Features

### AuthProvider
- Login with email/password
- Automatic JWT token validation (checks expiry)
- Secure token storage using FlutterSecureStorage
- Auto-decode JWT to extract user info (userId, email, roles)
- Account activation flow
- Logout with token cleanup
- Auth check on app startup
- User-friendly error messages

### ChargerProvider
- Fetch all chargers (mock data for now)
- Filter nearby chargers by distance
- Search chargers by name/address
- Distance calculation using Haversine formula
- 12 mock chargers with realistic UAE locations

### SessionProvider
- Fetch charging session history
- Get active charging session
- Calculate session statistics
- Mock data with 10 recent sessions
- Statistics: total sessions, energy (kWh), cost (AED), CO2 saved (kg)

### UI Components
- Dark theme with Vdrive branding (#111827, #1F2937)
- Amber accent color (#F59E0B)
- Green for success (#10B981)
- Animated transitions and focus states
- Full-width responsive layouts

## Setup Instructions

### 1. Dependencies

Ensure `pubspec.yaml` has these packages:

```yaml
dependencies:
  provider: ^6.1.2
  http: ^1.2.1
  flutter_secure_storage: ^9.2.2
  geolocator: ^12.0.0
```

Run: `flutter pub get`

### 2. Initialize Providers in main.dart

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'lib/core/api/api_client.dart';
import 'lib/providers/auth_provider.dart';
import 'lib/providers/charger_provider.dart';
import 'lib/providers/session_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize API Client
  final apiClient = ApiClient(
    baseUrl: 'http://your-backend-url.com', // Update with your backend URL
  );
  
  runApp(MyApp(apiClient: apiClient));
}

class MyApp extends StatelessWidget {
  final ApiClient apiClient;

  const MyApp({required this.apiClient});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(
            apiClient: apiClient,
            secureStorage: const FlutterSecureStorage(),
          ),
        ),
        ChangeNotifierProvider(
          create: (_) => ChargerProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider(
          create: (_) => SessionProvider(apiClient: apiClient),
        ),
      ],
      child: MaterialApp(
        title: 'Vdrive',
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          scaffoldBackgroundColor: const Color(0xFF111827),
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF111827),
            elevation: 0,
          ),
          textTheme: const TextTheme(
            bodyLarge: TextStyle(color: Colors.white),
            bodyMedium: TextStyle(color: Colors.white),
            bodySmall: TextStyle(color: Colors.white70),
          ),
          colorScheme: ColorScheme.dark(
            primary: const Color(0xFFF59E0B),
            secondary: const Color(0xFF1F2937),
            surface: const Color(0xFF111827),
            error: Colors.red[600],
          ),
        ),
        home: const AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();
    // Check auth on app startup
    context.read<AuthProvider>().checkAuth();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        if (authProvider.isAuthenticated) {
          // Navigate to home screen
          return HomeScreen();
        } else {
          return LoginScreen(
            onLoginSuccess: () {
              // Handle successful login
            },
          );
        }
      },
    );
  }
}
```

### 3. API Endpoints Required

The backend should implement these REST endpoints:

#### Authentication
```
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
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

```
POST /api/v1/auth/activate
{
  "token": "activation_token",
  "password": "newpassword123"
}
```

```
POST /api/v1/auth/logout
{}
```

#### Future Endpoints (Not yet implemented)
```
GET /api/v1/chargers
GET /api/v1/sessions
GET /api/v1/sessions/active
GET /api/v1/sessions/stats
```

### 4. Security Setup

#### FlutterSecureStorage Configuration

**iOS** - Already configured in Info.plist
**Android** - Add to android/app/build.gradle:

```gradle
android {
    compileSdkVersion 33
    ...
}
```

### 5. JWT Token Format

The backend should return JWT tokens with these claims:

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "roles": ["USER", "ADMIN"],
  "exp": 1704067200
}
```

The `JwtDecoder` utility automatically extracts:
- `sub` or `userId` for user ID
- `email` for email
- `roles` for user roles

### 6. Usage Examples

#### Login
```dart
final authProvider = context.read<AuthProvider>();
final success = await authProvider.login('user@example.com', 'password');

if (success) {
  // Navigate to home
  Navigator.pushReplacementNamed(context, '/home');
}
```

#### Check Authentication
```dart
@override
void initState() {
  super.initState();
  context.read<AuthProvider>().checkAuth();
}
```

#### Access User Info
```dart
Consumer<AuthProvider>(
  builder: (context, authProvider, _) {
    return Text('Welcome, ${authProvider.currentUser?.email}');
  },
)
```

#### Get Chargers
```dart
final chargerProvider = context.read<ChargerProvider>();
await chargerProvider.fetchChargers();
```

#### Search Chargers
```dart
await chargerProvider.searchChargers('Dubai Mall');
```

#### Get Session History
```dart
final sessionProvider = context.read<SessionProvider>();
await sessionProvider.fetchSessions();
await sessionProvider.fetchStats();
```

## Theme Customization

The app uses Vdrive brand colors defined as constants:

- **Dark Background**: `#111827` (used in ScaffoldBackgroundColor)
- **Secondary Dark**: `#1F2937` (used for surfaces)
- **Amber Accent**: `#F59E0B` (primary action color)
- **Success Green**: `#10B981` (for positive states)

To customize, update the `MaterialApp` theme in main.dart.

## Mock Data

Mock data is provided for development/testing:

### Chargers (12 UAE locations)
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

### Sessions (10 recent charging sessions)
- 47 total sessions
- 1,284.5 kWh total energy
- 1,685.40 AED total spent
- 641.2 kg CO2 saved

Replace mock data calls with API calls when backend endpoints are ready.

## Error Handling

The `AuthProvider` provides user-friendly error messages:

```dart
if (authProvider.error != null) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(authProvider.error!)),
  );
}
```

Common errors:
- "Invalid email or password" (401)
- "User not found" (404)
- "Bad request" (400)
- "An error occurred. Please try again later." (generic)

## Next Steps

1. **Implement Backend Endpoints** - Create `/api/v1/chargers`, `/api/v1/sessions` endpoints
2. **Setup Payment Integration** - Add payment provider (Apple Pay, Google Pay)
3. **Add Navigation** - Implement go_router for deep linking and navigation
4. **Real Location Services** - Replace mock chargers with location-based search
5. **Offline Support** - Add local caching and offline capabilities
6. **Analytics** - Integrate analytics tracking
7. **Push Notifications** - Add FCM for charging status updates

## Support

For issues or questions, refer to the inline documentation in each file.
