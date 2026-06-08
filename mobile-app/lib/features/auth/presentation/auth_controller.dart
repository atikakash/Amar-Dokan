import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/features/auth/data/auth_repository.dart';
import 'package:ecommerce_mobile/features/auth/domain/user.dart';

final authControllerProvider =
    StateNotifierProvider<AuthController, AsyncValue<User?>>((ref) {
      return AuthController(ref.watch(authRepositoryProvider))..restore();
    });

class AuthController extends StateNotifier<AsyncValue<User?>> {
  AuthController(this._repository) : super(const AsyncValue.loading());

  final AuthRepository _repository;

  Future<void> restore() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_repository.restoreUser);
  }

  Future<void> login({required String email, required String password}) async {
    state = const AsyncValue.loading();
    final result = await AsyncValue.guard(
      () => _repository.login(email: email, password: password),
    );
    state = result.whenData((session) => session.user);
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? phone,
  }) async {
    state = const AsyncValue.loading();
    final result = await AsyncValue.guard(
      () => _repository.register(
        name: name,
        email: email,
        phone: phone,
        password: password,
        passwordConfirmation: passwordConfirmation,
      ),
    );
    state = result.whenData((session) => session.user);
  }

  Future<void> refreshProfile() async {
    state = await AsyncValue.guard(_repository.profile);
  }

  Future<void> updateProfile(Map<String, dynamic> payload) async {
    final previous = state.valueOrNull;
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _repository.updateProfile(payload));
    if (state.hasError && previous != null) {
      state = AsyncValue.data(previous);
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    state = const AsyncValue.data(null);
  }
}
