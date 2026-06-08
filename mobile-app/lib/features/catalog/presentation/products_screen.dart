import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/features/catalog/presentation/catalog_providers.dart';
import 'package:ecommerce_mobile/shared/widgets/app_error.dart';
import 'package:ecommerce_mobile/shared/widgets/product_card.dart';

class ProductsScreen extends ConsumerWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final products = ref.watch(productsProvider);
    final categories = ref.watch(categoriesProvider);
    final selectedCategory = ref.watch(selectedCategoryProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Products')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              decoration: const InputDecoration(
                hintText: 'Search products',
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (value) =>
                  ref.read(productSearchProvider.notifier).state = value,
            ),
          ),
          categories.maybeWhen(
            data: (rows) => SizedBox(
              height: 44,
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                children: [
                  ChoiceChip(
                    label: const Text('All'),
                    selected: selectedCategory == null,
                    onSelected: (_) =>
                        ref.read(selectedCategoryProvider.notifier).state =
                            null,
                  ),
                  const SizedBox(width: 8),
                  for (final category in rows) ...[
                    ChoiceChip(
                      label: Text(category.name),
                      selected: selectedCategory == category.id,
                      onSelected: (_) =>
                          ref.read(selectedCategoryProvider.notifier).state =
                              category.id,
                    ),
                    const SizedBox(width: 8),
                  ],
                ],
              ),
            ),
            orElse: () => const SizedBox.shrink(),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: products.when(
              data: (rows) => GridView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: rows.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.58,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemBuilder: (context, index) =>
                    ProductCard(product: rows[index]),
              ),
              error: (error, _) => AppError(
                message: error.toString(),
                onRetry: () => ref.invalidate(productsProvider),
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
            ),
          ),
        ],
      ),
    );
  }
}
