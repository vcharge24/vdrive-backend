import 'dart:convert';

class JwtDecoder {
  static Map<String, dynamic> decode(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) {
        throw Exception('Invalid token format');
      }

      final payload = parts[1];
      // Add padding if needed
      String normalizedPayload = payload;
      final remainder = payload.length % 4;
      if (remainder > 0) {
        normalizedPayload += '=' * (4 - remainder);
      }

      final decoded = utf8.decode(base64.decode(normalizedPayload));
      return jsonDecode(decoded) as Map<String, dynamic>;
    } catch (e) {
      throw Exception('Failed to decode JWT: $e');
    }
  }

  static bool isTokenExpired(String token) {
    try {
      final payload = decode(token);
      final exp = payload['exp'] as int?;
      if (exp == null) return false;

      final expirationTime = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
      return DateTime.now().isAfter(expirationTime);
    } catch (e) {
      return true;
    }
  }

  static String? getUserIdFromToken(String token) {
    try {
      final payload = decode(token);
      return payload['sub'] as String? ?? payload['userId'] as String?;
    } catch (e) {
      return null;
    }
  }

  static String? getEmailFromToken(String token) {
    try {
      final payload = decode(token);
      return payload['email'] as String?;
    } catch (e) {
      return null;
    }
  }

  static List<String> getRolesFromToken(String token) {
    try {
      final payload = decode(token);
      final roles = payload['roles'];
      if (roles is List) {
        return roles.map((r) => r.toString()).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
