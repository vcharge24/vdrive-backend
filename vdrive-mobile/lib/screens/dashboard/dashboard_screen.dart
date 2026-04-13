import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/charger_provider.dart';
import '../../providers/session_provider.dart';
import '../../widgets/stat_card.dart';
import '../../widgets/charger_card.dart';
import '../../widgets/session_card.dart';
import '../../core/theme/app_theme.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _onRefresh() async {
    // Refresh logic can be added here
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Data refreshed')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkTheme.scaffoldBackgroundColor,
      body: RefreshIndicator(
        onRefresh: _onRefresh,
        color: AppTheme.accentColor,
        child: CustomScrollView(
          controller: _scrollController,
          slivers: [
            // Header
            SliverAppBar(
              floating: true,
              elevation: 0,
              backgroundColor: AppTheme.primaryDarkColor,
              flexibleSpace: FlexibleSpaceBar(
                title: _buildHeader(context),
                centerTitle: false,
                titlePadding: const EdgeInsets.all(16),
                expandedTitleScale: 1.0,
              ),
            ),
            // Main content
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),
                    // Active charging session
                    _buildActiveSessionCard(context),
                    const SizedBox(height: 24),
                    // Quick stats
                    _buildQuickStats(context),
                    const SizedBox(height: 24),
                    // Nearby chargers
                    _buildNearbyChargers(context),
                    const SizedBox(height: 24),
                    // Recent sessions
                    _buildRecentSessions(context),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        final userName = authProvider.user?.firstName ?? 'User';
        final hour = DateTime.now().hour;
        final greeting = hour < 12
            ? 'Good morning'
            : hour < 17
                ? 'Good afternoon'
                : 'Good evening';

        return Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '$greeting, $userName',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                  ),
                  Text(
                    'Ready to charge?',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.grey[400],
                        ),
                  ),
                ],
              ),
            ),
            CircleAvatar(
              radius: 24,
              backgroundColor: AppTheme.accentColor,
              backgroundImage: authProvider.user?.avatarUrl != null
                  ? NetworkImage(authProvider.user!.avatarUrl!)
                  : null,
              child: authProvider.user?.avatarUrl == null
                  ? Text(
                      userName.isNotEmpty ? userName[0].toUpperCase() : 'U',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    )
                  : null,
            ),
          ],
        );
      },
    );
  }

  Widget _buildActiveSessionCard(BuildContext context) {
    return Consumer<SessionProvider>(
      builder: (context, sessionProvider, _) {
        final activeSession = sessionProvider.activeSession;

        if (activeSession == null) {
          return const SizedBox.shrink();
        }

        return Container(
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.accentColor.withOpacity(0.3)),
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    activeSession.chargerName,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.successColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'In Progress',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: AppTheme.successColor,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: activeSession.progress,
                  minHeight: 8,
                  backgroundColor: Colors.grey[700],
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppTheme.accentColor,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildStatItem(
                    context,
                    '${activeSession.energyDelivered.toStringAsFixed(1)} kWh',
                    'Energy',
                    Icons.flash_on,
                  ),
                  _buildStatItem(
                    context,
                    activeSession.timeElapsed,
                    'Time',
                    Icons.schedule,
                  ),
                  _buildStatItem(
                    context,
                    '${activeSession.estimatedCost.toStringAsFixed(2)} AED',
                    'Cost',
                    Icons.attach_money,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accentColor,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () {
                    // Navigate to session details
                  },
                  child: Text(
                    'View Details',
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatItem(
    BuildContext context,
    String value,
    String label,
    IconData icon,
  ) {
    return Column(
      children: [
        Icon(
          icon,
          color: AppTheme.accentColor,
          size: 20,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey[500],
              ),
        ),
      ],
    );
  }

  Widget _buildQuickStats(BuildContext context) {
    return Consumer2<SessionProvider, AuthProvider>(
      builder: (context, sessionProvider, authProvider, _) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your Stats',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: StatCard(
                    icon: Icons.ev_station,
                    value: '${sessionProvider.totalSessions}',
                    label: 'Sessions',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: StatCard(
                    icon: Icons.flash_on,
                    value: '${sessionProvider.totalEnergyUsed.toStringAsFixed(0)} kWh',
                    label: 'Energy Used',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: StatCard(
                    icon: Icons.public,
                    value: '${sessionProvider.co2Saved.toStringAsFixed(1)} kg',
                    label: 'CO2 Saved',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: StatCard(
                    icon: Icons.attach_money,
                    value: '${sessionProvider.totalSpent.toStringAsFixed(0)} AED',
                    label: 'Total Spent',
                  ),
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _buildNearbyChargers(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Nearby Chargers',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
        ),
        const SizedBox(height: 12),
        Consumer<ChargerProvider>(
          builder: (context, chargerProvider, _) {
            final nearbyChargers = chargerProvider.nearbyChargers;

            if (nearbyChargers.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  child: Text(
                    'No chargers nearby',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[500],
                        ),
                  ),
                ),
              );
            }

            return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: List.generate(
                  nearbyChargers.length,
                  (index) => Padding(
                    padding: EdgeInsets.only(
                      right: index == nearbyChargers.length - 1 ? 0 : 12,
                    ),
                    child: SizedBox(
                      width: 280,
                      child: ChargerCard(
                        charger: nearbyChargers[index],
                        onTap: () {
                          // Navigate to charger detail
                        },
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildRecentSessions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Sessions',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
            ),
            TextButton(
              onPressed: () {
                // Navigate to history
              },
              child: Text(
                'View All',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: AppTheme.accentColor,
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Consumer<SessionProvider>(
          builder: (context, sessionProvider, _) {
            final recentSessions = sessionProvider.recentSessions;

            if (recentSessions.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  child: Text(
                    'No charging sessions yet',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[500],
                        ),
                  ),
                ),
              );
            }

            return Column(
              children: List.generate(
                recentSessions.length,
                (index) => Padding(
                  padding: EdgeInsets.only(
                    bottom: index == recentSessions.length - 1 ? 0 : 12,
                  ),
                  child: SessionCard(
                    session: recentSessions[index],
                    onTap: () {
                      // Show session detail
                    },
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
