import 'package:flutter/foundation.dart';
import '../models/session_model.dart';

class SessionProvider extends ChangeNotifier {
  List<SessionModel> _allSessions = [];
  SessionModel? _activeSession;

  List<SessionModel> get allSessions => _allSessions;
  List<SessionModel> get inProgressSessions =>
      _allSessions.where((s) => s.status == 'in_progress').toList();
  List<SessionModel> get completedSessions =>
      _allSessions.where((s) => s.status == 'completed').toList();
  List<SessionModel> get recentSessions =>
      _allSessions.where((s) => s.status == 'completed').take(3).toList();
  SessionModel? get activeSession => _activeSession;

  int get totalSessions => _allSessions.length;
  double get totalEnergyUsed =>
      _allSessions.fold(0.0, (sum, s) => sum + s.energyDelivered);
  double get totalSpent => _allSessions.fold(0.0, (sum, s) => sum + s.cost);
  double get co2Saved =>
      totalEnergyUsed * 0.45; // Approximate CO2 savings per kWh in UAE

  int get monthlySessionCount => _allSessions
      .where((s) => DateTime.parse(s.startTime).month == DateTime.now().month)
      .length;
  double get monthlyEnergyUsed => _allSessions
      .where((s) => DateTime.parse(s.startTime).month == DateTime.now().month)
      .fold(0.0, (sum, s) => sum + s.energyDelivered);
  double get monthlySpent => _allSessions
      .where((s) => DateTime.parse(s.startTime).month == DateTime.now().month)
      .fold(0.0, (sum, s) => sum + s.cost);

  SessionProvider() {
    _initializeMockData();
  }

  void _initializeMockData() {
    _allSessions = [
      SessionModel(
        id: '1',
        chargerId: '1',
        chargerName: 'Al Safa Park Station',
        startTime: 'Apr 10, 2026 - 09:30 AM',
        endTime: 'Apr 10, 2026 - 11:45 AM',
        duration: '2h 15m',
        energyDelivered: 45.5,
        cost: 56.88,
        status: 'completed',
        connectorType: 'CCS',
        progress: 1.0,
      ),
      SessionModel(
        id: '2',
        chargerId: '2',
        chargerName: 'Emirates Mall Chargers',
        startTime: 'Apr 08, 2026 - 02:00 PM',
        endTime: 'Apr 08, 2026 - 04:30 PM',
        duration: '2h 30m',
        energyDelivered: 38.2,
        cost: 53.48,
        status: 'completed',
        connectorType: 'Type 2',
        progress: 1.0,
      ),
      SessionModel(
        id: '3',
        chargerId: '3',
        chargerName: 'Downtown Charging Hub',
        startTime: 'Apr 06, 2026 - 06:15 PM',
        endTime: 'Apr 06, 2026 - 08:45 PM',
        duration: '2h 30m',
        energyDelivered: 52.0,
        cost: 80.60,
        status: 'completed',
        connectorType: 'CCS',
        progress: 1.0,
      ),
      SessionModel(
        id: '4',
        chargerId: '5',
        chargerName: 'Business Bay Fast Chargers',
        startTime: 'Apr 12, 2026 - 10:00 AM',
        endTime: null,
        duration: '1h 15m',
        energyDelivered: 28.5,
        cost: 47.03,
        status: 'in_progress',
        connectorType: 'CCS',
        progress: 0.65,
      ),
    ];

    // Set active session
    final inProgress = _allSessions.where((s) => s.status == 'in_progress');
    if (inProgress.isNotEmpty) {
      _activeSession = inProgress.first;
    }
  }

  void startSession(String chargerId, String chargerName) {
    final newSession = SessionModel(
      id: 'session_${DateTime.now().millisecondsSinceEpoch}',
      chargerId: chargerId,
      chargerName: chargerName,
      startTime: DateTime.now().toString(),
      duration: '0m',
      energyDelivered: 0.0,
      cost: 0.0,
      status: 'in_progress',
      connectorType: 'CCS',
      progress: 0.0,
    );
    _allSessions.insert(0, newSession);
    _activeSession = newSession;
    notifyListeners();
  }

  void endSession(String sessionId) {
    final sessionIndex =
        _allSessions.indexWhere((s) => s.id == sessionId);
    if (sessionIndex != -1) {
      // Mock completion
      notifyListeners();
    }
  }
}
