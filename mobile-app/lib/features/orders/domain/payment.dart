class Payment {
  const Payment({
    required this.id,
    required this.orderId,
    required this.gateway,
    required this.status,
    required this.transactionId,
    required this.amount,
    required this.currency,
    this.checkoutUrl,
  });

  final int id;
  final int orderId;
  final String gateway;
  final String status;
  final String transactionId;
  final num amount;
  final String currency;
  final String? checkoutUrl;

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] as int,
      orderId: json['order_id'] as int,
      gateway: json['gateway'] as String,
      status: json['status'] as String,
      transactionId: json['transaction_id'] as String,
      amount: num.parse(json['amount'].toString()),
      currency: json['currency'] as String,
      checkoutUrl: json['checkout_url'] as String?,
    );
  }
}
