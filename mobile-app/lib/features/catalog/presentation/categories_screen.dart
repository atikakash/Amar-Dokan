import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ecommerce_mobile/core/utils/formatters.dart';
import 'package:ecommerce_mobile/features/catalog/presentation/catalog_providers.dart';
import 'package:ecommerce_mobile/shared/widgets/app_error.dart';

class CategoriesScreen extends ConsumerWidget {
  const CategoriesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categories = ref.watch(categoriesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Categories')),
      body: categories.when(
        data: (rows) => ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: rows.length,
          separatorBuilder: (context, index) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final category = rows[index];
            return Card(
              clipBehavior: Clip.antiAlias,
              child: ListTile(
                leading: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    productImage(category.image),
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                  ),
                ),
                title: Text(category.name),
                subtitle: Text(category.description ?? 'Browse this category'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  ref.read(selectedCategoryProvider.notifier).state =
                      category.id;
                  context.go('/products');
                },
              ),
            );
          },
        ),
        error: (error, _) => AppError(
          message: error.toString(),
          onRetry: () => ref.invalidate(categoriesProvider),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}
