import 'dart:convert';

class User {
  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phone,
    this.emailVerifiedAt,
    this.createdAt,
  });

  final int id;
  final String name;
  final String email;
  final String role;
  final String? phone;
  final String? emailVerifiedAt;
  final String? createdAt;

  bool get isVerified => emailVerifiedAt != null;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      phone: json['phone'] as String?,
      emailVerifiedAt: json['email_verified_at'] as String?,
      createdAt: json['created_at'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'role': role,
    'phone': phone,
    'email_verified_at': emailVerifiedAt,
    'created_at': createdAt,
  };

  String encode() => jsonEncode(toJson());
}
