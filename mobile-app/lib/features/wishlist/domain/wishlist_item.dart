import 'package:ecommerce_mobile/features/catalog/domain/product.dart';

class WishlistItem {
  const WishlistItem({required this.id, required this.productId, this.product});

  final int id;
  final int productId;
  final Product? product;

  factory WishlistItem.fromJson(Map<String, dynamic> json) {
    return WishlistItem(
      id: json['id'] as int,
      productId: json['product_id'] as int,
      product: json['product'] == null
          ? null
          : Product.fromJson(json['product'] as Map<String, dynamic>),
    );
  }
}
