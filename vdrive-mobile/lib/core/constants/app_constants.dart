import 'dart:io' show Platform;
import 'package:flutter/material.dart';

/// Application-wide constants
class AppConstants {
  AppConstants._();

  // API Configuration
  static const String _defaultApiBase = 'http://10.0.2.2:8080/api/v1';

  static String get apiBaseUrl {
    // For production, configure via environment variables
    // For development: Android emulator uses 10.0.2.2, iOS uses localhost
    if (Platform.isIOS) {
      return 'http://localhost:8080/api/v1';
    }
    return _defaultApiBase;
  }

  // App Info
  static const String appName = 'Vdrive';
  static const String appTagline = 'Smart EV Charging & Parking';
  static const String appVersion = '1.0.0';

  // API Endpoints
  static const String authLoginEndpoint = '/auth/login';
  static const String authActivateEndpoint = '/auth/activate';
  static const String usersEndpoint = '/users';
  static const String rolesEndpoint = '/roles';
  static const String tenantsEndpoint = '/tenants';
  static const String companiesEndpoint = '/companies';
  static const String locationsEndpoint = '/locations';
  static const String notificationsEndpoint = '/notifications/email';

  // Timeouts
  static const Duration apiTimeout = Duration(seconds: 30);
  static const Duration shortAnimationDuration = Duration(milliseconds: 300);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 500);
  static const Duration longAnimationDuration = Duration(milliseconds: 800);

  // Map Defaults (UAE Center)
  static const double mapCenterLatitude = 24.4539;
  static const double mapCenterLongitude = 54.3773;
  static const double mapDefaultZoom = 12.0;
  static const double mapChargerZoom = 15.0;

  // Storage Keys
  static const String tokenStorageKey = 'auth_token';
  static const String userStorageKey = 'user_data';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // Cache Duration
  static const Duration chargersListCacheDuration = Duration(minutes: 5);
  static const Duration userProfileCacheDuration = Duration(hours: 1);

  // UI Constants
  static const double appPaddingDefault = 16.0;
  static const double appPaddingSmall = 8.0;
  static const double appPaddingLarge = 24.0;
  static const double appPaddingExtraLarge = 32.0;

  static const double cardBorderRadius = 12.0;
  static const double buttonBorderRadius = 8.0;
  static const double inputBorderRadius = 10.0;

  // Colors
  static const Color primaryDark = Color(0xFF1F2937);
  static const Color accentAmber = Color(0xFFF59E0B);
  static const Color accentGreen = Color(0xFF10B981);
  static const Color surfaceDark = Color(0xFF111827);
  static const Color textWhite = Color(0xFFFFFFFF);
  static const Color textGray = Color(0xFF9CA3AF);
  static const Color textGrayDark = Color(0xFF6B7280);
  static const Color borderGray = Color(0xFF374151);
  static const Color errorRed = Color(0xFFEF4444);
  static const Color warningYellow = Color(0xFFF59E0B);
  static const Color successGreen = Color(0xFF10B981);

  // Charger Status Colors
  static const Color statusAvailableColor = Color(0xFF10B981); // Green
  static const Color statusInUseColor = Color(0xFF3B82F6); // Blue
  static const Color statusOfflineColor = Color(0xFF6B7280); // Gray
  static const Color statusMaintenanceColor = Color(0xFFF59E0B); // Amber

  // Status Indicators
  static const String statusPendingActivation = 'PENDING_ACTIVATION';
  static const String statusActive = 'ACTIVE';
  static const String statusDeactivated = 'DEACTIVATED';
  static const String statusSuspended = 'SUSPENDED';

  // Charger Status
  static const String chargerStatusAvailable = 'AVAILABLE';
  static const String chargerStatusInUse = 'IN_USE';
  static const String chargerStatusOffline = 'OFFLINE';
  static const String chargerStatusMaintenance = 'MAINTENANCE';

  // Charging Session Status
  static const String sessionStatusInProgress = 'IN_PROGRESS';
  static const String sessionStatusCompleted = 'COMPLETED';
  static const String sessionStatusFailed = 'FAILED';

  // Connector Types
  static const String connectorType2 = 'Type2';
  static const String connectorTypeCCS = 'CCS';
  static const String connectorTypeCHAdeMO = 'CHAdeMO';

  // Payment Methods
  static const String paymentCreditCard = 'CREDIT_CARD';
  static const String paymentWallet = 'WALLET';
  static const String paymentBank = 'BANK_TRANSFER';
}
