import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/utils/formatters.dart';
import 'package:ecommerce_mobile/features/auth/presentation/auth_controller.dart';
import 'package:ecommerce_mobile/features/orders/presentation/order_providers.dart';
import 'package:ecommerce_mobile/shared/widgets/app_error.dart';
import 'package:ecommerce_mobile/shared/widgets/sign_in_required.dart';

class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authControllerProvider).valueOrNull;
    final orders = ref.watch(ordersProvider);

    if (user == null) return const SignInRequired();

    return Scaffold(
      appBar: AppBar(title: const Text('Orders')),
      body: orders.when(
        data: (rows) {
          if (rows.isEmpty) return const Center(child: Text('No orders yet.'));

          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(ordersProvider),
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: rows.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final order = rows[index];
                return Card(
                  child: ExpansionTile(
                    title: Text(order.orderNumber),
                    subtitle: Text(
                      '${shortDate(order.createdAt)} • ${order.status} • ${order.paymentStatus}',
                    ),
                    trailing: Text(money(order.total)),
                    children: [
                      for (final item in order.items)
                        ListTile(
                          title: Text(item.productName),
                          subtitle: Text(
                            '${item.productSku} x ${item.quantity}',
                          ),
                          trailing: Text(money(item.total)),
                        ),
                    ],
                  ),
                );
              },
            ),
          );
        },
        error: (error, _) => AppError(
          message: error.toString(),
          onRetry: () => ref.invalidate(ordersProvider),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}
