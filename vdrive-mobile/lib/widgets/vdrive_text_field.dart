import 'package:flutter/material.dart';

class VdriveTextField extends StatefulWidget {
  final String? label;
  final String? hint;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onEditingComplete;
  final TextInputType keyboardType;
  final bool obscureText;
  final int maxLines;
  final int minLines;
  final IconData? prefixIcon;
  final IconData? suffixIcon;
  final VoidCallback? onSuffixIconPressed;
  final String? Function(String?)? validator;
  final String? errorText;
  final bool enabled;

  const VdriveTextField({
    Key? key,
    this.label,
    this.hint,
    this.controller,
    this.onChanged,
    this.onEditingComplete,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
    this.maxLines = 1,
    this.minLines = 1,
    this.prefixIcon,
    this.suffixIcon,
    this.onSuffixIconPressed,
    this.validator,
    this.errorText,
    this.enabled = true,
  }) : super(key: key);

  @override
  State<VdriveTextField> createState() => _VdriveTextFieldState();
}

class _VdriveTextFieldState extends State<VdriveTextField> {
  late FocusNode _focusNode;
  bool _isFocused = false;
  late bool _isObscured;

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    _isObscured = widget.obscureText;
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _focusNode.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
  }

  void _toggleObscureText() {
    setState(() {
      _isObscured = !_isObscured;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Text(
              widget.label!,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                    color: Colors.grey[400],
                  ),
            ),
          ),
        TextFormField(
          controller: widget.controller,
          focusNode: _focusNode,
          obscureText: _isObscured,
          enabled: widget.enabled,
          keyboardType: widget.keyboardType,
          maxLines: _isObscured ? 1 : widget.maxLines,
          minLines: widget.minLines,
          onChanged: widget.onChanged,
          onEditingComplete: widget.onEditingComplete,
          validator: widget.validator,
          decoration: InputDecoration(
            hintText: widget.hint,
            errorText: widget.errorText,
            errorMaxLines: 2,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 16,
            ),
            filled: true,
            fillColor: _isFocused
                ? Colors.grey[900]
                : Colors.grey[950],
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Colors.grey[800]!,
                width: 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Color(0xFFF59E0B),
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Colors.red,
                width: 1,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Colors.red,
                width: 2,
              ),
            ),
            prefixIcon: widget.prefixIcon != null
                ? Icon(
                    widget.prefixIcon,
                    color: _isFocused
                        ? const Color(0xFFF59E0B)
                        : Colors.grey[600],
                  )
                : null,
            suffixIcon: widget.suffixIcon != null || widget.obscureText
                ? Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: IconButton(
                      icon: Icon(
                        widget.obscureText
                            ? (_isObscured
                                ? Icons.visibility_off
                                : Icons.visibility)
                            : widget.suffixIcon,
                        color: _isFocused
                            ? const Color(0xFFF59E0B)
                            : Colors.grey[600],
                      ),
                      onPressed: widget.obscureText
                          ? _toggleObscureText
                          : widget.onSuffixIconPressed,
                    ),
                  )
                : null,
            hintStyle: TextStyle(color: Colors.grey[600]),
            labelStyle: TextStyle(color: Colors.grey[400]),
          ),
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Colors.white,
              ),
        ),
      ],
    );
  }
}
