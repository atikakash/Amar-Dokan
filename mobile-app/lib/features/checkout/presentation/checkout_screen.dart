import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:ecommerce_mobile/core/utils/formatters.dart';
import 'package:ecommerce_mobile/features/auth/presentation/auth_controller.dart';
import 'package:ecommerce_mobile/features/cart/presentation/cart_controller.dart';
import 'package:ecommerce_mobile/features/orders/presentation/order_providers.dart';
import 'package:ecommerce_mobile/shared/widgets/sign_in_required.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _address = TextEditingController();
  final _city = TextEditingController();
  final _country = TextEditingController(text: 'United States');
  final _note = TextEditingController();
  String _gateway = 'stripe';

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(cartControllerProvider.notifier).load());
  }

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _address.dispose();
    _city.dispose();
    _country.dispose();
    _note.dispose();
    super.dispose();
  }

  Future<void> _placeOrder() async {
    if (!_formKey.currentState!.validate()) return;
    final checkout = await ref
        .read(checkoutControllerProvider.notifier)
        .placeOrder({
          'customer_note': _note.text.trim(),
          'shipping_total': 0,
          'tax_total': 0,
          'shipping_address': {
            'name': _name.text.trim(),
            'phone': _phone.text.trim(),
            'address_line_1': _address.text.trim(),
            'city': _city.text.trim(),
            'country': _country.text.trim(),
          },
        }, gateway: _gateway);
    await ref.read(cartControllerProvider.notifier).load();
    if (!mounted || checkout == null) return;
    final checkoutUrl = checkout.payment.checkoutUrl;
    if (checkoutUrl != null && checkoutUrl.isNotEmpty) {
      final launched = await launchUrl(
        Uri.parse(checkoutUrl),
        mode: LaunchMode.externalApplication,
      );
      if (!mounted) return;
      if (launched) {
        return;
      }
    }
    final messenger = ScaffoldMessenger.of(context);
    context.go('/orders');
    messenger.showSnackBar(
      SnackBar(content: Text('Order ${checkout.order.orderNumber} placed')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authControllerProvider).valueOrNull;
    final cart = ref.watch(cartControllerProvider).valueOrNull;
    final checkout = ref.watch(checkoutControllerProvider);

    if (user == null) return const SignInRequired();

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Order total'),
                  Text(
                    money(cart?.subtotal ?? 0),
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  controller: _name,
                  decoration: const InputDecoration(labelText: 'Full name'),
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _phone,
                  decoration: const InputDecoration(labelText: 'Phone'),
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _address,
                  decoration: const InputDecoration(labelText: 'Address'),
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _city,
                  decoration: const InputDecoration(labelText: 'City'),
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _country,
                  decoration: const InputDecoration(labelText: 'Country'),
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _note,
                  decoration: const InputDecoration(labelText: 'Order note'),
                  minLines: 2,
                  maxLines: 3,
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _gateway,
                  decoration: const InputDecoration(
                    labelText: 'Payment method',
                  ),
                  items: const [
                    DropdownMenuItem(value: 'stripe', child: Text('Stripe')),
                    DropdownMenuItem(
                      value: 'sslcommerz',
                      child: Text('SSLCommerz'),
                    ),
                    DropdownMenuItem(value: 'bkash', child: Text('bKash')),
                  ],
                  onChanged: (value) =>
                      setState(() => _gateway = value ?? 'stripe'),
                ),
                if (checkout.hasError) ...[
                  const SizedBox(height: 12),
                  Text(
                    checkout.error.toString(),
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.error,
                    ),
                  ),
                ],
                const SizedBox(height: 20),
                FilledButton(
                  onPressed: checkout.isLoading || (cart?.isEmpty ?? true)
                      ? null
                      : _placeOrder,
                  child: checkout.isLoading
                      ? const SizedBox.square(
                          dimension: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Place order & pay'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
