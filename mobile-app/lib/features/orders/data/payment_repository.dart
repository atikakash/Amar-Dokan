import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/api/dio_client.dart';
import 'package:ecommerce_mobile/features/orders/domain/payment.dart';

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  return PaymentRepository(ref.watch(dioProvider));
});

class PaymentRepository {
  PaymentRepository(this._dio);

  final Dio _dio;

  Future<Payment> initiate({
    required int orderId,
    required String gateway,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/payments/initiate',
        data: {
          'order_id': orderId,
          'gateway': gateway,
          'metadata': {'client': 'flutter-mobile'},
        },
      );

      return Payment.fromJson(response.data!['data'] as Map<String, dynamic>);
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
