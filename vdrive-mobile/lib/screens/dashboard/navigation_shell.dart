import 'package:flutter/material.dart';
import '../chargers/charger_list_screen.dart';
import '../history/history_screen.dart';
import '../profile/profile_screen.dart';
import 'dashboard_screen.dart';
import '../../core/theme/app_theme.dart';

class NavigationShell extends StatefulWidget {
  const NavigationShell({Key? key}) : super(key: key);

  @override
  State<NavigationShell> createState() => _NavigationShellState();
}

class _NavigationShellState extends State<NavigationShell> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const ChargerListScreen(),
    const HistoryScreen(),
    const ProfileScreen(),
  ];

  void _onNavigation(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // Go to home tab first if not already there
        if (_selectedIndex != 0) {
          setState(() => _selectedIndex = 0);
          return false;
        }
        return true;
      },
      child: Scaffold(
        backgroundColor: AppTheme.darkTheme.scaffoldBackgroundColor,
        body: IndexedStack(
          index: _selectedIndex,
          children: _screens,
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: _onNavigation,
          type: BottomNavigationBarType.fixed,
          backgroundColor: AppTheme.primaryDarkColor,
          selectedItemColor: AppTheme.accentColor,
          unselectedItemColor: Colors.grey[600],
          elevation: 8,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.ev_station),
              label: 'Chargers',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.receipt_long),
              label: 'History',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
