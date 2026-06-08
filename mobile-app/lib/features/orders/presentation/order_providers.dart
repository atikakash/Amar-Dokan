import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/features/orders/data/order_repository.dart';
import 'package:ecommerce_mobile/features/orders/data/payment_repository.dart';
import 'package:ecommerce_mobile/features/orders/domain/order.dart';
import 'package:ecommerce_mobile/features/orders/domain/payment.dart';

final ordersProvider = FutureProvider<List<Order>>((ref) {
  return ref.watch(orderRepositoryProvider).list();
});

final checkoutControllerProvider =
    StateNotifierProvider<CheckoutController, AsyncValue<CheckoutResult?>>((
      ref,
    ) {
      return CheckoutController(
        ref.watch(orderRepositoryProvider),
        ref.watch(paymentRepositoryProvider),
        ref,
      );
    });

class CheckoutResult {
  const CheckoutResult({required this.order, required this.payment});

  final Order order;
  final Payment payment;
}

class CheckoutController extends StateNotifier<AsyncValue<CheckoutResult?>> {
  CheckoutController(this._orders, this._payments, this._ref)
    : super(const AsyncValue.data(null));

  final OrderRepository _orders;
  final PaymentRepository _payments;
  final Ref _ref;

  Future<CheckoutResult?> placeOrder(
    Map<String, dynamic> payload, {
    required String gateway,
  }) async {
    state = const AsyncValue.loading();
    final result = await AsyncValue.guard(() async {
      final order = await _orders.checkout(payload);
      final payment = await _payments.initiate(
        orderId: order.id,
        gateway: gateway,
      );

      return CheckoutResult(order: order, payment: payment);
    });
    state = result;
    final checkout = result.valueOrNull;
    if (checkout != null) {
      _ref.invalidate(ordersProvider);
    }
    return checkout;
  }
}
