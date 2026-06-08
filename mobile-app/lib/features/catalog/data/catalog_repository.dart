import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/api/dio_client.dart';
import 'package:ecommerce_mobile/features/catalog/domain/category.dart';
import 'package:ecommerce_mobile/features/catalog/domain/product.dart';

final catalogRepositoryProvider = Provider<CatalogRepository>((ref) {
  return CatalogRepository(ref.watch(dioProvider));
});

class CatalogRepository {
  CatalogRepository(this._dio);

  final Dio _dio;

  Future<List<Category>> categories() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/categories',
        queryParameters: {'per_page': 100, 'is_active': true},
      );
      final rows = response.data!['data'] as List<dynamic>;
      return rows
          .map((item) => Category.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<List<Product>> products({
    String? search,
    int? categoryId,
    bool featured = false,
  }) async {
    try {
      final queryParameters = <String, dynamic>{
        'per_page': 50,
        'is_active': true,
        if (categoryId != null) 'category_id': categoryId,
        if (featured) 'is_featured': true,
      };
      if (search != null && search.isNotEmpty) {
        queryParameters['search'] = search;
      }

      final response = await _dio.get<Map<String, dynamic>>(
        '/products',
        queryParameters: queryParameters,
      );
      final rows = response.data!['data'] as List<dynamic>;
      return rows
          .map((item) => Product.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<Product> product(int id) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/products/$id');
      return Product.fromJson(response.data!['data'] as Map<String, dynamic>);
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
