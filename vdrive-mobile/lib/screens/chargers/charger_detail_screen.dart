import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/charger_model.dart';
import '../../core/theme/app_theme.dart';

class ChargerDetailScreen extends StatefulWidget {
  final String chargerId;
  final ChargerModel? charger;

  const ChargerDetailScreen({
    Key? key,
    required this.chargerId,
    this.charger,
  }) : super(key: key);

  @override
  State<ChargerDetailScreen> createState() => _ChargerDetailScreenState();
}

class _ChargerDetailScreenState extends State<ChargerDetailScreen> {
  late ChargerModel _charger;

  @override
  void initState() {
    super.initState();
    _charger = widget.charger ?? _mockCharger();
  }

  ChargerModel _mockCharger() {
    return ChargerModel(
      id: widget.chargerId,
      name: 'Al Safa Park Station',
      address: 'Al Safa St, Dubai',
      latitude: 25.1972,
      longitude: 55.2744,
      availablePorts: 3,
      totalPorts: 5,
      powerKw: 150,
      pricePerKwh: 1.25,
      connectorTypes: ['Type 2', 'CCS'],
      status: 'available',
      rating: 4.5,
      reviews: 128,
      distance: 2.3,
    );
  }

  Future<void> _launchMaps() async {
    final url =
        'https://maps.google.com/?q=${_charger.latitude},${_charger.longitude}';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkTheme.scaffoldBackgroundColor,
      body: CustomScrollView(
        slivers: [
          // Hero image with back button
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            backgroundColor: AppTheme.primaryDarkColor,
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppTheme.accentColor.withOpacity(0.8),
                      AppTheme.accentColor.withOpacity(0.4),
                    ],
                  ),
                ),
                child: Center(
                  child: Icon(
                    Icons.ev_station,
                    size: 100,
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ),
            ),
            leading: CircleAvatar(
              backgroundColor: Colors.black.withOpacity(0.3),
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),
          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header with name and status
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _charger.name,
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineSmall
                                  ?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  Icons.location_on,
                                  size: 14,
                                  color: Colors.grey[500],
                                ),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    _charger.address,
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodySmall
                                        ?.copyWith(
                                          color: Colors.grey[400],
                                        ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: _charger.status == 'available'
                              ? AppTheme.successColor.withOpacity(0.2)
                              : Colors.grey[800],
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: _charger.status == 'available'
                                ? AppTheme.successColor
                                : Colors.grey[700]!,
                          ),
                        ),
                        child: Text(
                          _charger.status == 'available'
                              ? 'Available'
                              : 'In Use',
                          style: Theme.of(context)
                              .textTheme
                              .labelSmall
                              ?.copyWith(
                                color: _charger.status == 'available'
                                    ? AppTheme.successColor
                                    : Colors.grey[400],
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Rating
                  Row(
                    children: [
                      ...List.generate(
                        5,
                        (index) => Icon(
                          index < _charger.rating.floor()
                              ? Icons.star
                              : Icons.star_border,
                          color: AppTheme.accentColor,
                          size: 16,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${_charger.rating} (${_charger.reviews} reviews)',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Colors.grey[400],
                            ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Info grid
                  _buildInfoGrid(context),
                  const SizedBox(height: 24),
                  // Buttons
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.accentColor,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Start charging coming soon'),
                          ),
                        );
                      },
                      child: Text(
                        'Start Charging',
                        style: Theme.of(context).textTheme.labelLarge?.copyWith(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: const BorderSide(
                          color: AppTheme.accentColor,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onPressed: _launchMaps,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.directions,
                            color: AppTheme.accentColor,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Get Directions',
                            style: Theme.of(context)
                                .textTheme
                                .labelLarge
                                ?.copyWith(
                                  color: AppTheme.accentColor,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Amenities
                  _buildAmenitiesSection(context),
                  const SizedBox(height: 24),
                  // Reviews
                  _buildReviewsSection(context),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildInfoCard(
          context,
          'Power',
          '${_charger.powerKw} kW',
          Icons.flash_on,
        ),
        _buildInfoCard(
          context,
          'Price',
          '${_charger.pricePerKwh.toStringAsFixed(2)} AED/kWh',
          Icons.attach_money,
        ),
        _buildInfoCard(
          context,
          'Connectors',
          _charger.connectorTypes.join(', '),
          Icons.cable,
        ),
        _buildInfoCard(
          context,
          'Available',
          '${_charger.availablePorts}/${_charger.totalPorts}',
          Icons.ev_station,
        ),
      ],
    );
  }

  Widget _buildInfoCard(
    BuildContext context,
    String label,
    String value,
    IconData icon,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.grey[800]!,
        ),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: AppTheme.accentColor,
            size: 24,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey[500],
                ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildAmenitiesSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Amenities',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _buildAmenityChip(context, 'Wi-Fi', Icons.wifi),
            const SizedBox(width: 12),
            _buildAmenityChip(context, 'Restroom', Icons.wc),
            const SizedBox(width: 12),
            _buildAmenityChip(context, 'Cafe', Icons.local_cafe),
          ],
        ),
      ],
    );
  }

  Widget _buildAmenityChip(BuildContext context, String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.grey[800]!,
        ),
      ),
      child: Row(
        children: [
          Icon(
            icon,
            size: 16,
            color: AppTheme.accentColor,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: Colors.white,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Reviews',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
        ),
        const SizedBox(height: 12),
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 24),
            child: Text(
              'Reviews coming soon',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[500],
                  ),
            ),
          ),
        ),
      ],
    );
  }
}
