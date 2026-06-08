import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/features/catalog/data/catalog_repository.dart';
import 'package:ecommerce_mobile/features/catalog/domain/category.dart';
import 'package:ecommerce_mobile/features/catalog/domain/product.dart';

final productSearchProvider = StateProvider<String>((ref) => '');
final selectedCategoryProvider = StateProvider<int?>((ref) => null);

final categoriesProvider = FutureProvider<List<Category>>((ref) {
  return ref.watch(catalogRepositoryProvider).categories();
});

final productsProvider = FutureProvider<List<Product>>((ref) {
  final search = ref.watch(productSearchProvider);
  final categoryId = ref.watch(selectedCategoryProvider);
  return ref
      .watch(catalogRepositoryProvider)
      .products(search: search, categoryId: categoryId);
});

final featuredProductsProvider = FutureProvider<List<Product>>((ref) {
  return ref.watch(catalogRepositoryProvider).products(featured: true);
});

final productDetailsProvider = FutureProvider.family<Product, int>((ref, id) {
  return ref.watch(catalogRepositoryProvider).product(id);
});
