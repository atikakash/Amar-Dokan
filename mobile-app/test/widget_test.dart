import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ecommerce_mobile/features/catalog/presentation/catalog_providers.dart';
import 'package:ecommerce_mobile/main.dart';

void main() {
  testWidgets('mobile app renders', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          featuredProductsProvider.overrideWith((ref) async => []),
          categoriesProvider.overrideWith((ref) async => []),
        ],
        child: const EcommerceMobileApp(),
      ),
    );
    await tester.pump();

    expect(find.text('Premium shopping, right in your hand.'), findsWidgets);
  });
}
