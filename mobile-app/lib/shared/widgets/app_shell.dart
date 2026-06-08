import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AppShell extends StatelessWidget {
  const AppShell({required this.child, super.key});

  final Widget child;

  static const _tabs = [
    _TabItem('/', 'Home', Icons.home_outlined),
    _TabItem('/products', 'Shop', Icons.storefront_outlined),
    _TabItem('/cart', 'Cart', Icons.shopping_bag_outlined),
    _TabItem('/wishlist', 'Wishlist', Icons.favorite_border),
    _TabItem('/profile', 'Profile', Icons.person_outline),
  ];

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final index = _tabs.indexWhere((tab) {
      if (tab.path == '/') return location == '/';
      return location.startsWith(tab.path);
    });

    return Scaffold(
      extendBody: true,
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 220),
          child: child,
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index < 0 ? 0 : index,
        onDestinationSelected: (value) => context.go(_tabs[value].path),
        destinations: [
          for (final tab in _tabs)
            NavigationDestination(icon: Icon(tab.icon), label: tab.label),
        ],
      ),
    );
  }
}

class _TabItem {
  const _TabItem(this.path, this.label, this.icon);

  final String path;
  final String label;
  final IconData icon;
}
