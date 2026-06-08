import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/features/wishlist/data/wishlist_repository.dart';
import 'package:ecommerce_mobile/features/wishlist/domain/wishlist_item.dart';

final wishlistControllerProvider =
    StateNotifierProvider<WishlistController, AsyncValue<List<WishlistItem>>>((
      ref,
    ) {
      return WishlistController(ref.watch(wishlistRepositoryProvider));
    });

class WishlistController extends StateNotifier<AsyncValue<List<WishlistItem>>> {
  WishlistController(this._repository) : super(const AsyncValue.data([]));

  final WishlistRepository _repository;

  Future<void> load() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_repository.list);
  }

  Future<void> toggle(int productId) async {
    final current = state.valueOrNull ?? [];
    final exists = current.any((item) => item.productId == productId);
    if (exists) {
      await _repository.remove(productId);
    } else {
      await _repository.add(productId);
    }
    await load();
  }
}
