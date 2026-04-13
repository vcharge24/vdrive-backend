import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/session_provider.dart';
import '../../widgets/session_card.dart';
import '../../core/theme/app_theme.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({Key? key}) : super(key: key);

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkTheme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.primaryDarkColor,
        elevation: 0,
        title: Text(
          'Charging History',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.accentColor,
          indicatorWeight: 3,
          labelColor: AppTheme.accentColor,
          unselectedLabelColor: Colors.grey[500],
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'In Progress'),
            Tab(text: 'Completed'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildSessionsList(context, null),
          _buildSessionsList(context, 'in_progress'),
          _buildSessionsList(context, 'completed'),
        ],
      ),
    );
  }

  Widget _buildSessionsList(BuildContext context, String? filter) {
    return Consumer<SessionProvider>(
      builder: (context, sessionProvider, _) {
        final sessions = filter == null
            ? sessionProvider.allSessions
            : filter == 'in_progress'
                ? sessionProvider.inProgressSessions
                : sessionProvider.completedSessions;

        if (sessions.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.receipt_long,
                  size: 64,
                  color: Colors.grey[700],
                ),
                const SizedBox(height: 16),
                Text(
                  'No sessions found',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Colors.white,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  filter == null
                      ? 'Start charging to see your history'
                      : 'No ${filter.replaceAll('_', ' ')} sessions',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey[500],
                      ),
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          itemCount: sessions.length + (filter == null ? 1 : 0),
          itemBuilder: (context, index) {
            // Summary card at top for "All" tab
            if (filter == null && index == 0) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _buildSummaryCard(context, sessionProvider),
              );
            }

            final sessionIndex = filter == null ? index - 1 : index;
            final session = sessions[sessionIndex];

            return Padding(
              padding: EdgeInsets.only(
                bottom: sessionIndex == sessions.length - 1 ? 0 : 12,
              ),
              child: SessionCard(
                session: session,
                onTap: () {
                  _showSessionDetailSheet(context, session);
                },
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildSummaryCard(BuildContext context, SessionProvider provider) {
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
          Text(
            'This Month',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildSummaryItem(
                context,
                '${provider.monthlySessionCount}',
                'Sessions',
                Icons.ev_station,
              ),
              _buildSummaryItem(
                context,
                '${provider.monthlyEnergyUsed.toStringAsFixed(0)} kWh',
                'Energy',
                Icons.flash_on,
              ),
              _buildSummaryItem(
                context,
                '${provider.monthlySpent.toStringAsFixed(0)} AED',
                'Spent',
                Icons.attach_money,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryItem(
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
        const SizedBox(height: 8),
        Text(
          value,
          style: Theme.of(context).textTheme.labelMedium?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey[500],
              ),
        ),
      ],
    );
  }

  void _showSessionDetailSheet(BuildContext context, dynamic session) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          expand: false,
          builder: (context, scrollController) {
            return SingleChildScrollView(
              controller: scrollController,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Handle
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey[700],
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Header
                    Text(
                      'Session Details',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                    ),
                    const SizedBox(height: 16),
                    // Charger info
                    Container(
                      decoration: BoxDecoration(
                        color: AppTheme.primaryDarkColor,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: AppTheme.accentColor.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(
                              Icons.ev_station,
                              color: AppTheme.accentColor,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  session.chargerName,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleSmall
                                      ?.copyWith(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                ),
                                Text(
                                  'Dubai, UAE',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall
                                      ?.copyWith(
                                        color: Colors.grey[400],
                                      ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Session details
                    _buildDetailRow(
                      context,
                      'Start Time',
                      session.startTime,
                      Icons.schedule,
                    ),
                    const SizedBox(height: 12),
                    _buildDetailRow(
                      context,
                      'End Time',
                      session.endTime ?? 'Ongoing',
                      Icons.schedule,
                    ),
                    const SizedBox(height: 12),
                    _buildDetailRow(
                      context,
                      'Duration',
                      session.duration,
                      Icons.timer,
                    ),
                    const SizedBox(height: 12),
                    _buildDetailRow(
                      context,
                      'Energy',
                      '${session.energyDelivered.toStringAsFixed(1)} kWh',
                      Icons.flash_on,
                    ),
                    const SizedBox(height: 12),
                    _buildDetailRow(
                      context,
                      'Connector',
                      session.connectorType,
                      Icons.cable,
                    ),
                    const SizedBox(height: 16),
                    // Cost breakdown
                    Container(
                      decoration: BoxDecoration(
                        color: AppTheme.primaryDarkColor,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Cost Breakdown',
                            style: Theme.of(context)
                                .textTheme
                                .labelMedium
                                ?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 8),
                          _buildCostRow(
                            context,
                            'Energy Cost',
                            '${(session.cost * 0.85).toStringAsFixed(2)} AED',
                          ),
                          const SizedBox(height: 6),
                          _buildCostRow(
                            context,
                            'Service Fee',
                            '${(session.cost * 0.15).toStringAsFixed(2)} AED',
                          ),
                          Divider(
                            color: Colors.grey[700],
                            margin: const EdgeInsets.symmetric(vertical: 8),
                          ),
                          _buildCostRow(
                            context,
                            'Total',
                            '${session.cost.toStringAsFixed(2)} AED',
                            bold: true,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Close button
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
                        onPressed: () => Navigator.pop(context),
                        child: Text(
                          'Close',
                          style:
                              Theme.of(context).textTheme.labelLarge?.copyWith(
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildDetailRow(
    BuildContext context,
    String label,
    String value,
    IconData icon,
  ) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: AppTheme.accentColor,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey[500],
                ),
          ),
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
        ),
      ],
    );
  }

  Widget _buildCostRow(
    BuildContext context,
    String label,
    String value, {
    bool bold = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey[400],
                fontWeight: bold ? FontWeight.bold : FontWeight.normal,
              ),
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.white,
                fontWeight: bold ? FontWeight.bold : FontWeight.normal,
              ),
        ),
      ],
    );
  }
}
