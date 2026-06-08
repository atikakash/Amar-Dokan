import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/api/dio_client.dart';
import 'package:ecommerce_mobile/features/wishlist/domain/wishlist_item.dart';

final wishlistRepositoryProvider = Provider<WishlistRepository>((ref) {
  return WishlistRepository(ref.watch(dioProvider));
});

class WishlistRepository {
  WishlistRepository(this._dio);

  final Dio _dio;

  Future<List<WishlistItem>> list() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/wishlist');
      final rows = response.data!['data'] as List<dynamic>;
      return rows
          .map((item) => WishlistItem.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> add(int productId) async {
    try {
      await _dio.post('/wishlist', data: {'product_id': productId});
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> remove(int productId) async {
    try {
      await _dio.delete('/wishlist/$productId');
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
