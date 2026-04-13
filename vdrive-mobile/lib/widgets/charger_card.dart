import 'package:flutter/material.dart';
import '../models/charger_model.dart';
import '../core/theme/app_theme.dart';

class ChargerCard extends StatelessWidget {
  final ChargerModel charger;
  final VoidCallback? onTap;

  const ChargerCard({
    Key? key,
    required this.charger,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final statusColor = charger.status == 'available'
        ? AppTheme.successColor
        : charger.status == 'in_use'
            ? Colors.orange
            : Colors.red;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.grey[800]!,
            ),
          ),
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with name and status
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      charger.name,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: statusColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              // Address
              Row(
                children: [
                  Icon(
                    Icons.location_on,
                    size: 12,
                    color: Colors.grey[500],
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      charger.address,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.grey[400],
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              // Distance and power
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${charger.distance} km away',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: Colors.grey[400],
                        ),
                  ),
                  Row(
                    children: [
                      Icon(
                        Icons.flash_on,
                        size: 12,
                        color: AppTheme.accentColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${charger.powerKw} kW',
                        style: Theme.of(context)
                            .textTheme
                            .labelSmall
                            ?.copyWith(
                              color: AppTheme.accentColor,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 8),
              // Price and available ports
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${charger.pricePerKwh.toStringAsFixed(2)} AED/kWh',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.successColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${charger.availablePorts}/${charger.totalPorts} Available',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: AppTheme.successColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                          ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              // Connector types
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: List.generate(
                  charger.connectorTypes.length,
                  (index) => _buildConnectorBadge(
                    context,
                    charger.connectorTypes[index],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildConnectorBadge(BuildContext context, String connector) {
    IconData icon;
    switch (connector.toUpperCase()) {
      case 'TYPE 2':
        icon = Icons.cable;
        break;
      case 'CCS':
        icon = Icons.power;
        break;
      case 'CHADEMO':
        icon = Icons.bolt;
        break;
      default:
        icon = Icons.cable;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 8,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        color: Colors.grey[800],
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 10,
            color: AppTheme.accentColor,
          ),
          const SizedBox(width: 4),
          Text(
            connector,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: Colors.grey[300],
                  fontSize: 10,
                ),
          ),
        ],
      ),
    );
  }
}
