import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/charger_provider.dart';
import 'providers/session_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/activate_account_screen.dart';
import 'screens/dashboard/navigation_shell.dart';
import 'screens/chargers/charger_detail_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF111827),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const VdriveApp());
}

class VdriveApp extends StatelessWidget {
  const VdriveApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuth()),
        ChangeNotifierProvider(create: (_) => ChargerProvider()..fetchChargers()),
        ChangeNotifierProvider(create: (_) => SessionProvider()..fetchSessions()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          return MaterialApp.router(
            title: 'Vdrive',
            theme: AppTheme.darkTheme,
            routerConfig: _buildRouter(auth),
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }

  GoRouter _buildRouter(AuthProvider auth) {
    return GoRouter(
      initialLocation: '/',
      refreshListenable: auth,
      redirect: (context, state) {
        final isAuthenticated = auth.isAuthenticated;
        final isAuthScreen =
            state.uri.path == '/login' || state.uri.path == '/activate';

        if (!isAuthenticated && !isAuthScreen) {
          return '/login';
        }
        if (isAuthenticated && isAuthScreen) {
          return '/';
        }
        return null;
      },
      routes: [
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/activate',
          builder: (context, state) => const ActivateAccountScreen(),
        ),
        GoRoute(
          path: '/',
          builder: (context, state) => const NavigationShell(),
        ),
        GoRoute(
          path: '/charger/:id',
          builder: (context, state) {
            final chargerId = state.pathParameters['id']!;
            return ChargerDetailScreen(chargerId: chargerId);
          },
        ),
      ],
    );
  }
}
