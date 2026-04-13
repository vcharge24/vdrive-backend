import 'package:flutter/material.dart';

enum VdriveButtonType { primary, secondary, danger }

class VdriveButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final VdriveButtonType type;
  final bool isLoading;
  final bool isDisabled;
  final bool fullWidth;
  final double? width;
  final double height;
  final IconData? icon;
  final MainAxisAlignment mainAxisAlignment;

  const VdriveButton({
    Key? key,
    required this.label,
    this.onPressed,
    this.type = VdriveButtonType.primary,
    this.isLoading = false,
    this.isDisabled = false,
    this.fullWidth = false,
    this.width,
    this.height = 56,
    this.icon,
    this.mainAxisAlignment = MainAxisAlignment.center,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isActive = !isDisabled && !isLoading;

    Widget child = Row(
      mainAxisAlignment: mainAxisAlignment,
      mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
      children: [
        if (icon != null && !isLoading) ...[
          Icon(icon, color: _getTextColor()),
          const SizedBox(width: 8),
        ],
        if (isLoading)
          SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation(_getTextColor()),
            ),
          )
        else
          Flexible(
            child: Text(
              label,
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: _getTextColor(),
                    fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );

    if (fullWidth || width != null) {
      child = SizedBox(
        width: fullWidth ? double.infinity : width,
        height: height,
        child: child,
      );
    }

    Widget button;

    switch (type) {
      case VdriveButtonType.primary:
        button = Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isActive ? onPressed : null,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              height: height,
              decoration: BoxDecoration(
                gradient: isActive
                    ? const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFFD97706),
                          Color(0xFFF59E0B),
                        ],
                      )
                    : LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Colors.grey[700]!,
                          Colors.grey[800]!,
                        ],
                      ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: isActive
                    ? [
                        BoxShadow(
                          color: const Color(0xFFF59E0B).withOpacity(0.4),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ]
                    : [],
              ),
              child: child,
            ),
          ),
        );
        break;

      case VdriveButtonType.secondary:
        button = Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isActive ? onPressed : null,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              height: height,
              decoration: BoxDecoration(
                border: Border.all(
                  color: isActive
                      ? const Color(0xFFF59E0B)
                      : Colors.grey[700]!,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: child,
            ),
          ),
        );
        break;

      case VdriveButtonType.danger:
        button = Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isActive ? onPressed : null,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              height: height,
              decoration: BoxDecoration(
                gradient: isActive
                    ? const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFFDC2626),
                          Color(0xFFEF4444),
                        ],
                      )
                    : LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Colors.grey[700]!,
                          Colors.grey[800]!,
                        ],
                      ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: child,
            ),
          ),
        );
        break;
    }

    if (!fullWidth && width == null) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: button,
      );
    }

    return button;
  }

  Color _getTextColor() {
    if (isDisabled || isLoading) return Colors.grey[600]!;

    switch (type) {
      case VdriveButtonType.primary:
        return Colors.black;
      case VdriveButtonType.secondary:
        return const Color(0xFFF59E0B);
      case VdriveButtonType.danger:
        return Colors.white;
    }
  }
}
