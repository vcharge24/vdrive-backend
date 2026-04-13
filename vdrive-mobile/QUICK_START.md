# Vdrive Flutter Auth Module - Quick Start

## 5-Minute Setup

### 1. Update Backend URL
Edit `lib/main_example.dart` line 13:
```dart
baseUrl: 'http://your-api-server.com', // Change this
```

### 2. Copy to main.dart
Copy the provider setup from `main_example.dart` to your `lib/main.dart`.

### 3. Update Your App Home
Replace your home widget with:
```dart
home: const AuthWrapper(),
```

### 4. Done!
Run `flutter pub get` and `flutter run`. You'll see:
- Login screen if not authenticated
- Home screen if authenticated

## Common Tasks

### Login User
```dart
final authProvider = context.read<AuthProvider>();
final success = await authProvider.login('user@example.com', 'password');
```

### Check Token Valid
```dart
final isValid = !JwtDecoder.isTokenExpired(token);
```

### Get Current User
```dart
Consumer<AuthProvider>(
  builder: (context, authProvider, _) {
    return Text(authProvider.currentUser?.email ?? 'Not logged in');
  },
)
```

### Logout
```dart
await context.read<AuthProvider>().logout();
```

### Get Chargers
```dart
final chargers = context.read<ChargerProvider>();
await chargers.fetchChargers();
```

### Get Sessions
```dart
final sessions = context.read<SessionProvider>();
await sessions.fetchSessions();
```

## File Locations

| What | Where |
|------|-------|
| Login Screen | `lib/screens/auth/login_screen.dart` |
| Auth Provider | `lib/providers/auth_provider.dart` |
| Text Field | `lib/widgets/vdrive_text_field.dart` |
| Button | `lib/widgets/vdrive_button.dart` |
| API Client | `lib/core/api/api_client.dart` |
| Mock Data | `lib/utils/mock_data.dart` |
| JWT Helper | `lib/utils/jwt_decoder.dart` |
| Setup Guide | `AUTHENTICATION_SETUP.md` |
| Full Docs | `VDRIVE_AUTH_MODULE_INDEX.md` |
| Example App | `lib/main_example.dart` |

## API Endpoints Needed

```
POST /api/v1/auth/login
  - Request: {email, password}
  - Response: {token, user}

POST /api/v1/auth/activate
  - Request: {token, password}
  - Response: {message}

POST /api/v1/auth/logout
  - Request: {}
  - Response: {}
```

## Color Scheme

- **Background:** #111827 (dark gray)
- **Surface:** #1F2937 (lighter gray)
- **Accent:** #F59E0B (amber)
- **Success:** #10B981 (green)
- **Error:** FF5252 (red)

## Mock Data Available

- 12 chargers in Abu Dhabi/Dubai
- 10 charging sessions
- Complete user statistics

Replace with API calls when backend ready.

## Troubleshooting

**Problem:** Login screen doesn't appear
- Solution: Check AuthWrapper is home widget
- Check AuthProvider is initialized

**Problem:** Token not saving
- Solution: Check FlutterSecureStorage setup
- Check platform-specific configuration

**Problem:** API errors
- Solution: Check baseUrl is correct
- Check backend is running
- Review error message from authProvider.error

## Next Steps

1. Implement `/api/v1/auth/login` endpoint
2. Implement `/api/v1/auth/activate` endpoint
3. Setup JWT token generation on backend
4. Test with real credentials
5. Implement charger endpoints
6. Add navigation flow

## Example Backend Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["USER"]
  }
}
```

## More Help

- Read `AUTHENTICATION_SETUP.md` for complete guide
- Check `VDRIVE_AUTH_MODULE_INDEX.md` for full API
- Review `main_example.dart` for reference implementation
- Check inline code documentation

---

**Ready to code? Start with `AUTHENTICATION_SETUP.md` for details.**
