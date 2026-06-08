import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/api/dio_client.dart';
import 'package:ecommerce_mobile/features/cart/domain/cart.dart';

final cartRepositoryProvider = Provider<CartRepository>((ref) {
  return CartRepository(ref.watch(dioProvider));
});

class CartRepository {
  CartRepository(this._dio);

  final Dio _dio;

  Future<Cart> getCart() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/cart');
      return Cart.fromJson(response.data!['data'] as Map<String, dynamic>);
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<Cart> addItem({required int productId, required int quantity}) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/cart/items',
        data: {'product_id': productId, 'quantity': quantity},
      );
      return Cart.fromJson(response.data!['data'] as Map<String, dynamic>);
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<Cart> updateItem({required int itemId, required int quantity}) async {
    try {
      final response = await _dio.put<Map<String, dynamic>>(
        '/cart/items/$itemId',
        data: {'quantity': quantity},
      );
      return Cart.fromJson(response.data!['data'] as Map<String, dynamic>);
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<Cart> removeItem(int itemId) async {
    try {
      final response = await _dio.delete<Map<String, dynamic>>(
        '/cart/items/$itemId',
      );
      return Cart.fromJson(response.data!['data'] as Map<String, dynamic>);
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
