import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:ecommerce_mobile/core/constants/app_constants.dart';
import 'package:ecommerce_mobile/core/routing/app_router.dart';
import 'package:ecommerce_mobile/core/theme/app_theme.dart';

void main() {
  runApp(const ProviderScope(child: EcommerceMobileApp()));
}

class EcommerceMobileApp extends ConsumerWidget {
  const EcommerceMobileApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: AppConstants.appName,
      theme: AppTheme.light(),
      darkTheme: AppTheme.light(),
      routerConfig: ref.watch(routerProvider),
      debugShowCheckedModeBanner: false,
    );
  }
}
