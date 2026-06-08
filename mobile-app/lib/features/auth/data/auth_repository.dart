import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/api/dio_client.dart';
import 'package:ecommerce_mobile/core/api/token_storage.dart';
import 'package:ecommerce_mobile/features/auth/domain/auth_session.dart';
import 'package:ecommerce_mobile/features/auth/domain/user.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    ref.watch(dioProvider),
    ref.watch(tokenStorageProvider),
  );
});

class AuthRepository {
  AuthRepository(this._dio, this._storage);

  final Dio _dio;
  final TokenStorage _storage;

  Future<User?> restoreUser() async {
    final raw = await _storage.readUser();
    if (raw == null) return null;
    return User.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  Future<AuthSession> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      final session = AuthSession.fromJson(
        response.data!['data'] as Map<String, dynamic>,
      );
      await _storage.saveSession(
        token: session.token,
        userJson: session.user.encode(),
      );
      return session;
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<AuthSession> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? phone,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/register',
        data: {
          'name': name,
          'email': email,
          'phone': phone,
          'password': password,
          'password_confirmation': passwordConfirmation,
        },
      );
      final session = AuthSession.fromJson(
        response.data!['data'] as Map<String, dynamic>,
      );
      await _storage.saveSession(
        token: session.token,
        userJson: session.user.encode(),
      );
      return session;
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<User> profile() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/auth/profile');
      final user = User.fromJson(
        response.data!['data'] as Map<String, dynamic>,
      );
      await _storage.saveUser(user.encode());
      return user;
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<User> updateProfile(Map<String, dynamic> payload) async {
    try {
      final response = await _dio.put<Map<String, dynamic>>(
        '/auth/profile',
        data: payload,
      );
      final user = User.fromJson(
        response.data!['data'] as Map<String, dynamic>,
      );
      await _storage.saveUser(user.encode());
      return user;
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post('/auth/logout');
    } catch (_) {
      // Local logout must still succeed if the token is already invalid.
    } finally {
      await _storage.clear();
    }
  }
}
