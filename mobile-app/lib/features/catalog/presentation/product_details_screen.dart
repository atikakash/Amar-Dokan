import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/utils/formatters.dart';
import 'package:ecommerce_mobile/features/auth/presentation/auth_controller.dart';
import 'package:ecommerce_mobile/features/cart/presentation/cart_controller.dart';
import 'package:ecommerce_mobile/features/catalog/presentation/catalog_providers.dart';
import 'package:ecommerce_mobile/features/wishlist/presentation/wishlist_controller.dart';
import 'package:ecommerce_mobile/shared/widgets/app_error.dart';

class ProductDetailsScreen extends ConsumerStatefulWidget {
  const ProductDetailsScreen({required this.productId, super.key});

  final int productId;

  @override
  ConsumerState<ProductDetailsScreen> createState() =>
      _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends ConsumerState<ProductDetailsScreen> {
  int quantity = 1;

  @override
  Widget build(BuildContext context) {
    final productState = ref.watch(productDetailsProvider(widget.productId));
    final user = ref.watch(authControllerProvider).valueOrNull;
    final wishlist = ref.watch(wishlistControllerProvider).valueOrNull ?? [];

    return Scaffold(
      appBar: AppBar(title: const Text('Product details')),
      body: productState.when(
        data: (product) {
          final isWished = wishlist.any((item) => item.productId == product.id);

          return Stack(
            children: [
              ListView(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 116),
                children: [
                  Hero(
                    tag: 'product-${product.id}',
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(28),
                      child: AspectRatio(
                        aspectRatio: 1,
                        child: Image.network(
                          productImage(product.primaryImage),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    product.name,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    money(product.price),
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Chip(label: Text('${product.stockQuantity} in stock')),
                  const SizedBox(height: 16),
                  Text(
                    product.description ?? 'No description available.',
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(height: 1.55),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Reviews',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  if (product.reviews.isEmpty)
                    const Text('No reviews yet.')
                  else
                    for (final review in product.reviews)
                      Card(
                        child: ListTile(
                          title: Text(review.title ?? 'Customer review'),
                          subtitle: Text(review.comment ?? ''),
                          trailing: Text('${review.rating}/5'),
                        ),
                      ),
                ],
              ),
              Positioned(
                left: 16,
                right: 16,
                bottom: 16,
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: quantity > 1
                              ? () => setState(() => quantity--)
                              : null,
                          icon: const Icon(Icons.remove_circle_outline),
                        ),
                        Text(
                          '$quantity',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        IconButton(
                          onPressed: quantity < product.stockQuantity
                              ? () => setState(() => quantity++)
                              : null,
                          icon: const Icon(Icons.add_circle_outline),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: FilledButton.icon(
                            onPressed:
                                user == null || product.stockQuantity == 0
                                ? null
                                : () => ref
                                      .read(cartControllerProvider.notifier)
                                      .addItem(product.id, quantity: quantity),
                            icon: const Icon(Icons.shopping_bag_outlined),
                            label: const Text('Add'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filledTonal(
                          onPressed: user == null
                              ? null
                              : () => ref
                                    .read(wishlistControllerProvider.notifier)
                                    .toggle(product.id),
                          icon: Icon(
                            isWished ? Icons.favorite : Icons.favorite_border,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
        error: (error, _) => AppError(message: error.toString()),
        loading: () => const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}
