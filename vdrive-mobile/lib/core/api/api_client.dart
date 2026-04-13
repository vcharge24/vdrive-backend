import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../constants/app_constants.dart';

/// HTTP Client for API communication
class ApiClient {
  static final ApiClient _instance = ApiClient._internal();

  late final http.Client _httpClient;
  late final FlutterSecureStorage _secureStorage;
  String? _token;

  // Callback for handling unauthorized errors
  Function? onUnauthorized;

  ApiClient._internal() {
    _httpClient = http.Client();
    _secureStorage = const FlutterSecureStorage();
    _loadToken();
  }

  factory ApiClient() {
    return _instance;
  }

  /// Load token from secure storage
  Future<void> _loadToken() async {
    try {
      _token = await _secureStorage.read(
        key: AppConstants.tokenStorageKey,
      );
    } catch (e) {
      if (kDebugMode) {
        print('Error loading token: $e');
      }
    }
  }

  /// Set the authentication token
  Future<void> setToken(String token) async {
    _token = token;
    try {
      await _secureStorage.write(
        key: AppConstants.tokenStorageKey,
        value: token,
      );
    } catch (e) {
      if (kDebugMode) {
        print('Error saving token: $e');
      }
    }
  }

  /// Clear the authentication token
  Future<void> clearToken() async {
    _token = null;
    try {
      await _secureStorage.delete(key: AppConstants.tokenStorageKey);
    } catch (e) {
      if (kDebugMode) {
        print('Error clearing token: $e');
      }
    }
  }

  /// Get current token
  String? getToken() {
    return _token;
  }

  /// Build headers with authorization
  Map<String, String> _buildHeaders({
    Map<String, String>? additionalHeaders,
  }) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (_token != null && _token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_token';
    }

    headers.addAll(additionalHeaders ?? {});
    return headers;
  }

  /// Handle response and potential unauthorized errors
  Future<T> _handleResponse<T>(
    http.Response response,
    T Function(dynamic) parser,
  ) async {
    if (response.statusCode == 401) {
      await clearToken();
      onUnauthorized?.call();
      throw UnauthorizedException('Unauthorized - Token expired');
    }

    if (response.statusCode >= 400) {
      throw ApiException(
        statusCode: response.statusCode,
        message: response.body,
      );
    }

    try {
      final decoded = jsonDecode(response.body);
      return parser(decoded);
    } catch (e) {
      throw ApiException(
        statusCode: response.statusCode,
        message: 'Failed to parse response: $e',
      );
    }
  }

  /// GET request
  Future<T> get<T>(
    String endpoint, {
    required T Function(dynamic) parser,
    Map<String, String>? headers,
    Map<String, String>? queryParams,
  }) async {
    try {
      final uri = Uri.parse(
        '${AppConstants.apiBaseUrl}$endpoint',
      ).replace(queryParameters: queryParams);

      final response = await _httpClient
          .get(
            uri,
            headers: _buildHeaders(additionalHeaders: headers),
          )
          .timeout(AppConstants.apiTimeout);

      return await _handleResponse(response, parser);
    } catch (e) {
      if (e is ApiException || e is UnauthorizedException) {
        rethrow;
      }
      throw ApiException(
        statusCode: 0,
        message: 'GET request failed: $e',
      );
    }
  }

  /// POST request
  Future<T> post<T>(
    String endpoint, {
    required dynamic body,
    required T Function(dynamic) parser,
    Map<String, String>? headers,
  }) async {
    try {
      final response = await _httpClient
          .post(
            Uri.parse('${AppConstants.apiBaseUrl}$endpoint'),
            headers: _buildHeaders(additionalHeaders: headers),
            body: jsonEncode(body),
          )
          .timeout(AppConstants.apiTimeout);

      return await _handleResponse(response, parser);
    } catch (e) {
      if (e is ApiException || e is UnauthorizedException) {
        rethrow;
      }
      throw ApiException(
        statusCode: 0,
        message: 'POST request failed: $e',
      );
    }
  }

  /// PUT request
  Future<T> put<T>(
    String endpoint, {
    required dynamic body,
    required T Function(dynamic) parser,
    Map<String, String>? headers,
  }) async {
    try {
      final response = await _httpClient
          .put(
            Uri.parse('${AppConstants.apiBaseUrl}$endpoint'),
            headers: _buildHeaders(additionalHeaders: headers),
            body: jsonEncode(body),
          )
          .timeout(AppConstants.apiTimeout);

      return await _handleResponse(response, parser);
    } catch (e) {
      if (e is ApiException || e is UnauthorizedException) {
        rethrow;
      }
      throw ApiException(
        statusCode: 0,
        message: 'PUT request failed: $e',
      );
    }
  }

  /// PATCH request
  Future<T> patch<T>(
    String endpoint, {
    required dynamic body,
    required T Function(dynamic) parser,
    Map<String, String>? headers,
  }) async {
    try {
      final response = await _httpClient
          .patch(
            Uri.parse('${AppConstants.apiBaseUrl}$endpoint'),
            headers: _buildHeaders(additionalHeaders: headers),
            body: jsonEncode(body),
          )
          .timeout(AppConstants.apiTimeout);

      return await _handleResponse(response, parser);
    } catch (e) {
      if (e is ApiException || e is UnauthorizedException) {
        rethrow;
      }
      throw ApiException(
        statusCode: 0,
        message: 'PATCH request failed: $e',
      );
    }
  }

  /// DELETE request
  Future<T> delete<T>(
    String endpoint, {
    required T Function(dynamic) parser,
    Map<String, String>? headers,
  }) async {
    try {
      final response = await _httpClient
          .delete(
            Uri.parse('${AppConstants.apiBaseUrl}$endpoint'),
            headers: _buildHeaders(additionalHeaders: headers),
          )
          .timeout(AppConstants.apiTimeout);

      return await _handleResponse(response, parser);
    } catch (e) {
      if (e is ApiException || e is UnauthorizedException) {
        rethrow;
      }
      throw ApiException(
        statusCode: 0,
        message: 'DELETE request failed: $e',
      );
    }
  }
}

/// Custom exception for API errors
class ApiException implements Exception {
  final int statusCode;
  final String message;

  ApiException({
    required this.statusCode,
    required this.message,
  });

  @override
  String toString() => 'ApiException: $statusCode - $message';
}

/// Exception for unauthorized access
class UnauthorizedException implements Exception {
  final String message;

  UnauthorizedException(this.message);

  @override
  String toString() => 'UnauthorizedException: $message';
}
