import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_constants.dart';

/// Application theme configuration with Material 3 dark theme
class AppTheme {
  AppTheme._();

  // Static color aliases for easy access in screens
  static const Color accentColor = AppConstants.accentAmber;
  static const Color primaryDarkColor = AppConstants.primaryDark;
  static const Color surfaceColor = AppConstants.surfaceDark;
  static const Color greenColor = AppConstants.accentGreen;
  static const Color errorColor = AppConstants.errorRed;
  static const Color textWhiteColor = AppConstants.textWhite;
  static const Color textGrayColor = AppConstants.textGray;
  static const Color borderColor = AppConstants.borderGray;

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      // Color Scheme
      colorScheme: ColorScheme.dark(
        primary: AppConstants.accentAmber,
        secondary: AppConstants.accentGreen,
        tertiary: AppConstants.primaryDark,
        surface: AppConstants.primaryDark,
        error: AppConstants.errorRed,
        onPrimary: AppConstants.surfaceDark,
        onSecondary: AppConstants.surfaceDark,
        onSurface: AppConstants.textWhite,
        onError: AppConstants.textWhite,
      ),
      // Scaffold Background
      scaffoldBackgroundColor: AppConstants.surfaceDark,
      // AppBar Theme
      appBarTheme: AppBarTheme(
        backgroundColor: AppConstants.primaryDark,
        foregroundColor: AppConstants.textWhite,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppConstants.textWhite,
        ),
      ),
      // Text Theme
      textTheme: TextTheme(
        displayLarge: GoogleFonts.poppins(
          fontSize: 32,
          fontWeight: FontWeight.w700,
          color: AppConstants.textWhite,
        ),
        displayMedium: GoogleFonts.poppins(
          fontSize: 28,
          fontWeight: FontWeight.w700,
          color: AppConstants.textWhite,
        ),
        displaySmall: GoogleFonts.poppins(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          color: AppConstants.textWhite,
        ),
        headlineMedium: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: AppConstants.textWhite,
        ),
        headlineSmall: GoogleFonts.poppins(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppConstants.textWhite,
        ),
        titleLarge: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: AppConstants.textWhite,
        ),
        titleMedium: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AppConstants.textWhite,
        ),
        titleSmall: GoogleFonts.poppins(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AppConstants.textGray,
        ),
        bodyLarge: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: AppConstants.textWhite,
        ),
        bodyMedium: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: AppConstants.textWhite,
        ),
        bodySmall: GoogleFonts.poppins(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: AppConstants.textGray,
        ),
        labelLarge: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AppConstants.textWhite,
        ),
      ),
      // Button Themes
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppConstants.accentAmber,
          foregroundColor: AppConstants.surfaceDark,
          padding: const EdgeInsets.symmetric(
            horizontal: 24,
            vertical: 12,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.buttonBorderRadius),
          ),
          elevation: 2,
          textStyle: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppConstants.accentAmber,
          side: const BorderSide(
            color: AppConstants.accentAmber,
            width: 1.5,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: 24,
            vertical: 12,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.buttonBorderRadius),
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppConstants.accentAmber,
          padding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 8,
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppConstants.primaryDark,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
          borderSide: const BorderSide(
            color: AppConstants.borderGray,
            width: 1,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
          borderSide: const BorderSide(
            color: AppConstants.borderGray,
            width: 1,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
          borderSide: const BorderSide(
            color: AppConstants.accentAmber,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
          borderSide: const BorderSide(
            color: AppConstants.errorRed,
            width: 1,
          ),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.inputBorderRadius),
          borderSide: const BorderSide(
            color: AppConstants.errorRed,
            width: 2,
          ),
        ),
        hintStyle: GoogleFonts.poppins(
          fontSize: 14,
          color: AppConstants.textGrayDark,
        ),
        labelStyle: GoogleFonts.poppins(
          fontSize: 14,
          color: AppConstants.textGray,
        ),
        errorStyle: GoogleFonts.poppins(
          fontSize: 12,
          color: AppConstants.errorRed,
        ),
      ),
      // Card Theme
      cardTheme: CardTheme(
        color: AppConstants.primaryDark,
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.cardBorderRadius),
          side: const BorderSide(
            color: AppConstants.borderGray,
            width: 0.5,
          ),
        ),
      ),
      // Floating Action Button
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: AppConstants.accentAmber,
        foregroundColor: AppConstants.surfaceDark,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      // Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: AppConstants.primaryDark,
        selectedColor: AppConstants.accentAmber,
        labelStyle: GoogleFonts.poppins(
          fontSize: 12,
          color: AppConstants.textWhite,
        ),
        secondaryLabelStyle: GoogleFonts.poppins(
          fontSize: 12,
          color: AppConstants.textWhite,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(
            color: AppConstants.borderGray,
            width: 0.5,
          ),
        ),
      ),
      // Bottom Sheet Theme
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: AppConstants.primaryDark,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
          ),
        ),
        elevation: 8,
      ),
      // Dialog Theme
      dialogTheme: DialogTheme(
        backgroundColor: AppConstants.primaryDark,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.cardBorderRadius),
        ),
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppConstants.textWhite,
        ),
        contentTextStyle: GoogleFonts.poppins(
          fontSize: 14,
          color: AppConstants.textWhite,
        ),
      ),
      // Progress Indicator Theme
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppConstants.accentAmber,
        linearMinHeight: 4,
      ),
    );
  }
}
