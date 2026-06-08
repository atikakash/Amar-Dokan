import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/features/cart/data/cart_repository.dart';
import 'package:ecommerce_mobile/features/cart/domain/cart.dart';

final cartControllerProvider =
    StateNotifierProvider<CartController, AsyncValue<Cart?>>((ref) {
      return CartController(ref.watch(cartRepositoryProvider));
    });

class CartController extends StateNotifier<AsyncValue<Cart?>> {
  CartController(this._repository) : super(const AsyncValue.data(null));

  final CartRepository _repository;

  Future<void> load() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_repository.getCart);
  }

  Future<void> addItem(int productId, {int quantity = 1}) async {
    state = await AsyncValue.guard(
      () => _repository.addItem(productId: productId, quantity: quantity),
    );
  }

  Future<void> updateItem(int itemId, int quantity) async {
    state = await AsyncValue.guard(
      () => _repository.updateItem(itemId: itemId, quantity: quantity),
    );
  }

  Future<void> removeItem(int itemId) async {
    state = await AsyncValue.guard(() => _repository.removeItem(itemId));
  }
}
