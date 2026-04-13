/// Authentication response model matching backend
class AuthResponse {
  final String accessToken;
  final String? refreshToken;
  final String userId;
  final String email;
  final List<String> roles;

  AuthResponse({
    required this.accessToken,
    this.refreshToken,
    required this.userId,
    required this.email,
    required this.roles,
  });

  /// Factory constructor from JSON
  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String?,
      userId: json['userId'] as String,
      email: json['email'] as String,
      roles: List<String>.from(json['roles'] as List? ?? []),
    );
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'userId': userId,
      'email': email,
      'roles': roles,
    };
  }

  /// Copy with method for immutability
  AuthResponse copyWith({
    String? accessToken,
    String? refreshToken,
    String? userId,
    String? email,
    List<String>? roles,
  }) {
    return AuthResponse(
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
      userId: userId ?? this.userId,
      email: email ?? this.email,
      roles: roles ?? this.roles,
    );
  }

  @override
  String toString() {
    return 'AuthResponse(userId: $userId, email: $email, roles: $roles)';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthResponse &&
          runtimeType == other.runtimeType &&
          userId == other.userId &&
          email == other.email;

  @override
  int get hashCode => userId.hashCode ^ email.hashCode;
}
