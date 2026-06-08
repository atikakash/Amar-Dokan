import 'package:ecommerce_mobile/features/catalog/domain/product.dart';

class CartItem {
  const CartItem({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.unitPrice,
    required this.lineTotal,
    this.product,
  });

  final int id;
  final int productId;
  final int quantity;
  final num unitPrice;
  final num lineTotal;
  final Product? product;

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'] as int,
      productId: json['product_id'] as int,
      quantity: json['quantity'] as int,
      unitPrice: num.parse(json['unit_price'].toString()),
      lineTotal: num.parse(json['line_total'].toString()),
      product: json['product'] == null
          ? null
          : Product.fromJson(json['product'] as Map<String, dynamic>),
    );
  }
}

class Cart {
  const Cart({
    required this.id,
    required this.status,
    required this.items,
    required this.subtotal,
  });

  final int id;
  final String status;
  final List<CartItem> items;
  final num subtotal;

  bool get isEmpty => items.isEmpty;

  factory Cart.fromJson(Map<String, dynamic> json) {
    final itemsJson = (json['items'] as List<dynamic>? ?? const []);

    return Cart(
      id: json['id'] as int,
      status: json['status'] as String,
      items: itemsJson
          .map((item) => CartItem.fromJson(item as Map<String, dynamic>))
          .toList(),
      subtotal: num.parse(json['subtotal'].toString()),
    );
  }
}
