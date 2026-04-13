/// API endpoint constants matching the backend
class ApiEndpoints {
  ApiEndpoints._();

  // Authentication
  static const String login = '/auth/login';
  static const String activate = '/auth/activate';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';

  // Users
  static const String users = '/users';
  static String userById(String userId) => '/users/$userId';
  static const String userProfile = '/users/profile';

  // Roles
  static const String roles = '/roles';
  static String roleById(String roleId) => '/roles/$roleId';

  // Tenants
  static const String tenants = '/tenants';
  static String tenantById(String tenantId) => '/tenants/$tenantId';

  // Companies
  static const String companies = '/companies';
  static String companyById(String companyId) => '/companies/$companyId';

  // Locations
  static const String locations = '/locations';
  static String locationById(String locationId) => '/locations/$locationId';

  // Notifications
  static const String notifications = '/notifications/email';
  static String notificationById(String notificationId) =>
      '/notifications/$notificationId';

  // Chargers (for EV charging)
  static const String chargers = '/chargers';
  static String chargerById(String chargerId) => '/chargers/$chargerId';
  static const String chargersNearby = '/chargers/nearby';

  // Charging Sessions
  static const String chargingSessions = '/charging-sessions';
  static String chargingSessionById(String sessionId) =>
      '/charging-sessions/$sessionId';
  static const String myChargingSessions = '/charging-sessions/my-sessions';

  // Payments
  static const String payments = '/payments';
  static String paymentById(String paymentId) => '/payments/$paymentId';

  // Parking
  static const String parking = '/parking';
  static String parkingById(String parkingId) => '/parking/$parkingId';
  static const String parkingNearby = '/parking/nearby';

  // History
  static const String history = '/history';
  static const String chargingHistory = '/history/charging';
  static const String parkingHistory = '/history/parking';
}
