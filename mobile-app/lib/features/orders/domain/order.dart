class OrderItem {
  const OrderItem({
    required this.id,
    required this.productName,
    required this.productSku,
    required this.quantity,
    required this.unitPrice,
    required this.total,
  });

  final int id;
  final String productName;
  final String productSku;
  final int quantity;
  final num unitPrice;
  final num total;

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] as int,
      productName: json['product_name'] as String,
      productSku: json['product_sku'] as String,
      quantity: json['quantity'] as int,
      unitPrice: num.parse(json['unit_price'].toString()),
      total: num.parse(json['total'].toString()),
    );
  }
}

class Order {
  const Order({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.paymentStatus,
    required this.total,
    required this.createdAt,
    this.items = const [],
  });

  final int id;
  final String orderNumber;
  final String status;
  final String paymentStatus;
  final num total;
  final String createdAt;
  final List<OrderItem> items;

  factory Order.fromJson(Map<String, dynamic> json) {
    final itemsJson = (json['items'] as List<dynamic>? ?? const []);

    return Order(
      id: json['id'] as int,
      orderNumber: json['order_number'] as String,
      status: json['status'] as String,
      paymentStatus: json['payment_status'] as String,
      total: num.parse(json['total'].toString()),
      createdAt: json['created_at'] as String,
      items: itemsJson
          .map((item) => OrderItem.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}
