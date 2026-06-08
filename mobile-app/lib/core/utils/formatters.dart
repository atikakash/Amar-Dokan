import 'package:intl/intl.dart';

final _currency = NumberFormat.currency(symbol: r'$');
final _date = DateFormat.yMMMd();

String money(Object? value) {
  final amount = num.tryParse(value?.toString() ?? '0') ?? 0;
  return _currency.format(amount);
}

String shortDate(String? value) {
  if (value == null || value.isEmpty) return '-';
  return _date.format(DateTime.parse(value).toLocal());
}

String productImage(String? value) {
  return value == null || value.isEmpty
      ? 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
      : value;
}
