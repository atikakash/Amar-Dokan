import 'package:ecommerce_mobile/features/catalog/domain/category.dart';

class ProductImage {
  const ProductImage({
    required this.id,
    required this.url,
    this.altText,
    this.isPrimary = false,
  });

  final int id;
  final String url;
  final String? altText;
  final bool isPrimary;

  factory ProductImage.fromJson(Map<String, dynamic> json) {
    return ProductImage(
      id: json['id'] as int,
      url: json['url'] as String,
      altText: json['alt_text'] as String?,
      isPrimary: json['is_primary'] as bool? ?? false,
    );
  }
}

class Review {
  const Review({
    required this.id,
    required this.rating,
    this.title,
    this.comment,
    this.createdAt,
  });

  final int id;
  final int rating;
  final String? title;
  final String? comment;
  final String? createdAt;

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] as int,
      rating: json['rating'] as int,
      title: json['title'] as String?,
      comment: json['comment'] as String?,
      createdAt: json['created_at'] as String?,
    );
  }
}

class Product {
  const Product({
    required this.id,
    required this.categoryId,
    required this.name,
    required this.slug,
    required this.sku,
    required this.price,
    required this.stockQuantity,
    required this.lowStockThreshold,
    required this.isActive,
    required this.isFeatured,
    this.description,
    this.comparePrice,
    this.category,
    this.images = const [],
    this.reviews = const [],
  });

  final int id;
  final int categoryId;
  final String name;
  final String slug;
  final String sku;
  final String? description;
  final num price;
  final num? comparePrice;
  final int stockQuantity;
  final int lowStockThreshold;
  final bool isActive;
  final bool isFeatured;
  final Category? category;
  final List<ProductImage> images;
  final List<Review> reviews;

  String? get primaryImage => images.isEmpty ? null : images.first.url;

  factory Product.fromJson(Map<String, dynamic> json) {
    final imagesJson = (json['images'] as List<dynamic>? ?? const []);
    final reviewsJson = (json['reviews'] as List<dynamic>? ?? const []);

    return Product(
      id: json['id'] as int,
      categoryId: json['category_id'] as int,
      name: json['name'] as String,
      slug: json['slug'] as String,
      sku: json['sku'] as String,
      description: json['description'] as String?,
      price: num.parse(json['price'].toString()),
      comparePrice: json['compare_price'] == null
          ? null
          : num.parse(json['compare_price'].toString()),
      stockQuantity: json['stock_quantity'] as int? ?? 0,
      lowStockThreshold: json['low_stock_threshold'] as int? ?? 0,
      isActive: json['is_active'] as bool? ?? true,
      isFeatured: json['is_featured'] as bool? ?? false,
      category: json['category'] == null
          ? null
          : Category.fromJson(json['category'] as Map<String, dynamic>),
      images: imagesJson
          .map((item) => ProductImage.fromJson(item as Map<String, dynamic>))
          .toList(),
      reviews: reviewsJson
          .map((item) => Review.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}
