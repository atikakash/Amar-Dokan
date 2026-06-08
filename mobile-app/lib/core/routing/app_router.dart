import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:ecommerce_mobile/features/auth/presentation/login_screen.dart';
import 'package:ecommerce_mobile/features/auth/presentation/register_screen.dart';
import 'package:ecommerce_mobile/features/cart/presentation/cart_screen.dart';
import 'package:ecommerce_mobile/features/catalog/presentation/categories_screen.dart';
import 'package:ecommerce_mobile/features/catalog/presentation/home_screen.dart';
import 'package:ecommerce_mobile/features/catalog/presentation/product_details_screen.dart';
import 'package:ecommerce_mobile/features/catalog/presentation/products_screen.dart';
import 'package:ecommerce_mobile/features/checkout/presentation/checkout_screen.dart';
import 'package:ecommerce_mobile/features/orders/presentation/orders_screen.dart';
import 'package:ecommerce_mobile/features/profile/presentation/profile_screen.dart';
import 'package:ecommerce_mobile/features/wishlist/presentation/wishlist_screen.dart';
import 'package:ecommerce_mobile/shared/widgets/app_shell.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
          GoRoute(
            path: '/products',
            builder: (context, state) => const ProductsScreen(),
          ),
          GoRoute(
            path: '/categories',
            builder: (context, state) => const CategoriesScreen(),
          ),
          GoRoute(
            path: '/cart',
            builder: (context, state) => const CartScreen(),
          ),
          GoRoute(
            path: '/checkout',
            builder: (context, state) => const CheckoutScreen(),
          ),
          GoRoute(
            path: '/orders',
            builder: (context, state) => const OrdersScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/wishlist',
            builder: (context, state) => const WishlistScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/products/:id',
        builder: (context, state) => ProductDetailsScreen(
          productId: int.parse(state.pathParameters['id']!),
        ),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
    ],
  );
});
