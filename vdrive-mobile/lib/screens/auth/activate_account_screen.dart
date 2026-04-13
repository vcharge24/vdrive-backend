import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/vdrive_button.dart';
import '../../widgets/vdrive_text_field.dart';

class ActivateAccountScreen extends StatefulWidget {
  final String? activationToken;
  final VoidCallback? onActivationSuccess;

  const ActivateAccountScreen({
    Key? key,
    this.activationToken,
    this.onActivationSuccess,
  }) : super(key: key);

  @override
  State<ActivateAccountScreen> createState() => _ActivateAccountScreenState();
}

class _ActivateAccountScreenState extends State<ActivateAccountScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  final _tokenController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  PasswordStrength _passwordStrength = PasswordStrength.weak;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    if (widget.activationToken != null) {
      _tokenController.text = widget.activationToken!;
    }
  }

  void _setupAnimations() {
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _tokenController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  PasswordStrength _evaluatePasswordStrength(String password) {
    if (password.isEmpty) return PasswordStrength.weak;

    int score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (RegExp(r'[A-Z]').hasMatch(password)) score++;
    if (RegExp(r'[0-9]').hasMatch(password)) score++;
    if (RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(password)) score++;

    if (score <= 1) return PasswordStrength.weak;
    if (score <= 3) return PasswordStrength.medium;
    return PasswordStrength.strong;
  }

  void _handleActivation(BuildContext context) async {
    if (_formKey.currentState?.validate() ?? false) {
      final authProvider = context.read<AuthProvider>();
      final success = await authProvider.activateAccount(
        _tokenController.text.trim(),
        _passwordController.text,
      );

      if (mounted) {
        if (success) {
          widget.onActivationSuccess?.call();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Account activated successfully!'),
              backgroundColor: Colors.green[600],
              duration: const Duration(seconds: 2),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(authProvider.error ?? 'Activation failed'),
              backgroundColor: Colors.red[600],
              duration: const Duration(seconds: 3),
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Activate Account',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),
                    // Heading
                    Text(
                      'Set Your Password',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Choose a strong password to secure your account',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.grey[500],
                          ),
                    ),
                    const SizedBox(height: 32),
                    // Activation Token Field
                    if (widget.activationToken == null)
                      Column(
                        children: [
                          VdriveTextField(
                            label: 'Activation Token',
                            hint: 'Paste your activation token',
                            controller: _tokenController,
                            prefixIcon: Icons.vpn_key,
                            validator: (value) {
                              if (value?.isEmpty ?? true) {
                                return 'Activation token is required';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 20),
                        ],
                      ),
                    // Password Field
                    VdriveTextField(
                      label: 'New Password',
                      hint: 'Enter a strong password',
                      controller: _passwordController,
                      obscureText: true,
                      prefixIcon: Icons.lock_outline,
                      onChanged: (value) {
                        setState(() {
                          _passwordStrength = _evaluatePasswordStrength(value);
                        });
                      },
                      validator: (value) {
                        if (value?.isEmpty ?? true) {
                          return 'Password is required';
                        }
                        if (value!.length < 8) {
                          return 'Password must be at least 8 characters';
                        }
                        if (!RegExp(r'[A-Z]').hasMatch(value)) {
                          return 'Must contain an uppercase letter';
                        }
                        if (!RegExp(r'[0-9]').hasMatch(value)) {
                          return 'Must contain a number';
                        }
                        if (!RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(value)) {
                          return 'Must contain a special character';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 12),
                    // Password Strength Indicator
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.grey[900],
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: _getStrengthColor(_passwordStrength),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Password Strength: ',
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Colors.grey[400],
                                    ),
                              ),
                              Text(
                                _passwordStrength.label,
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: _getStrengthColor(_passwordStrength),
                                      fontWeight: FontWeight.w600,
                                    ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: _passwordStrength.value,
                              minHeight: 6,
                              backgroundColor: Colors.grey[800],
                              valueColor: AlwaysStoppedAnimation(
                                _getStrengthColor(_passwordStrength),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Requirements: 8+ chars, uppercase, number, special char',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: Colors.grey[500],
                                  fontSize: 11,
                                ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Confirm Password Field
                    VdriveTextField(
                      label: 'Confirm Password',
                      hint: 'Re-enter your password',
                      controller: _confirmPasswordController,
                      obscureText: true,
                      prefixIcon: Icons.lock_outline,
                      validator: (value) {
                        if (value?.isEmpty ?? true) {
                          return 'Please confirm your password';
                        }
                        if (value != _passwordController.text) {
                          return 'Passwords do not match';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 32),
                    // Activate Button
                    Consumer<AuthProvider>(
                      builder: (context, authProvider, _) {
                        return VdriveButton(
                          label: 'Activate Account',
                          onPressed: () => _handleActivation(context),
                          isLoading: authProvider.isLoading,
                          fullWidth: true,
                        );
                      },
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Color _getStrengthColor(PasswordStrength strength) {
    switch (strength) {
      case PasswordStrength.weak:
        return Colors.red[400]!;
      case PasswordStrength.medium:
        return Colors.orange[400]!;
      case PasswordStrength.strong:
        return const Color(0xFF10B981);
    }
  }
}

enum PasswordStrength {
  weak(0.33, 'Weak'),
  medium(0.66, 'Medium'),
  strong(1.0, 'Strong');

  final double value;
  final String label;

  const PasswordStrength(this.value, this.label);
}
