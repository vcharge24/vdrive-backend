import 'package:flutter/foundation.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isAuthenticated = false;

  UserModel? get user => _user;
  bool get isAuthenticated => _isAuthenticated;

  void login(String email, String password) {
    // Mock login
    _user = UserModel(
      id: '1',
      firstName: 'Ahmed',
      lastName: 'Al Mansouri',
      email: email,
      phone: '+971 50 123 4567',
      avatarUrl: null,
      memberSince: DateTime(2024, 1, 15),
    );
    _isAuthenticated = true;
    notifyListeners();
  }

  void logout() {
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  void updateProfile(UserModel user) {
    _user = user;
    notifyListeners();
  }
}
