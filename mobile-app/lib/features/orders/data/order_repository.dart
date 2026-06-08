import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/api/dio_client.dart';
import 'package:ecommerce_mobile/features/orders/domain/order.dart';

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  return OrderRepository(ref.watch(dioProvider));
});

class OrderRepository {
  OrderRepository(this._dio);

  final Dio _dio;

  Future<List<Order>> list() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/orders',
        queryParameters: {'per_page': 30},
      );
      final rows = response.data!['data'] as List<dynamic>;
      return rows
          .map((item) => Order.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<Order> checkout(Map<String, dynamic> payload) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/orders',
        data: payload,
      );
      return Order.fromJson(response.data!['data'] as Map<String, dynamic>);
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
