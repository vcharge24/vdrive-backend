import 'package:flutter/foundation.dart';
import '../models/charger_model.dart';

class ChargerProvider extends ChangeNotifier {
  List<ChargerModel> _allChargers = [];
  List<ChargerModel> _filteredChargers = [];
  String _searchQuery = '';
  String _selectedFilter = 'All';

  List<ChargerModel> get allChargers => _allChargers;
  List<ChargerModel> get filteredChargers => _filteredChargers;
  List<ChargerModel> get nearbyChargers =>
      _allChargers.where((c) => c.distance < 5).toList();

  ChargerProvider() {
    _initializeMockData();
  }

  void _initializeMockData() {
    _allChargers = [
      ChargerModel(
        id: '1',
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
      ),
      ChargerModel(
        id: '2',
        name: 'Emirates Mall Chargers',
        address: 'Sheikh Zayed Rd, Dubai',
        latitude: 25.1432,
        longitude: 55.1982,
        availablePorts: 1,
        totalPorts: 4,
        powerKw: 120,
        pricePerKwh: 1.40,
        connectorTypes: ['Type 2', 'CCS', 'CHAdeMO'],
        status: 'available',
        rating: 4.8,
        reviews: 245,
        distance: 3.8,
      ),
      ChargerModel(
        id: '3',
        name: 'Downtown Charging Hub',
        address: 'Downtown Dubai, Dubai',
        latitude: 25.1942,
        longitude: 55.2732,
        availablePorts: 0,
        totalPorts: 3,
        powerKw: 180,
        pricePerKwh: 1.55,
        connectorTypes: ['CCS'],
        status: 'in_use',
        rating: 4.3,
        reviews: 89,
        distance: 1.5,
      ),
      ChargerModel(
        id: '4',
        name: 'Marina Promenade',
        address: 'Marina Walk, Dubai',
        latitude: 25.0851,
        longitude: 55.1397,
        availablePorts: 5,
        totalPorts: 6,
        powerKw: 100,
        pricePerKwh: 1.30,
        connectorTypes: ['Type 2'],
        status: 'available',
        rating: 4.2,
        reviews: 156,
        distance: 8.4,
      ),
      ChargerModel(
        id: '5',
        name: 'Business Bay Fast Chargers',
        address: 'Business Bay, Dubai',
        latitude: 25.1889,
        longitude: 55.2738,
        availablePorts: 2,
        totalPorts: 2,
        powerKw: 200,
        pricePerKwh: 1.65,
        connectorTypes: ['CCS', 'CHAdeMO'],
        status: 'available',
        rating: 4.7,
        reviews: 203,
        distance: 2.1,
      ),
    ];
    _filteredChargers = _allChargers;
  }

  void searchChargers(String query) {
    _searchQuery = query.toLowerCase();
    _applyFilters();
  }

  void filterChargers(String filter) {
    _selectedFilter = filter;
    _applyFilters();
  }

  void _applyFilters() {
    _filteredChargers = _allChargers.where((charger) {
      // Search filter
      final matchesSearch = _searchQuery.isEmpty ||
          charger.name.toLowerCase().contains(_searchQuery) ||
          charger.address.toLowerCase().contains(_searchQuery);

      // Status filter
      bool matchesFilter = true;
      if (_selectedFilter == 'Available') {
        matchesFilter = charger.status == 'available';
      } else if (_selectedFilter == 'Type 2') {
        matchesFilter = charger.connectorTypes.contains('Type 2');
      } else if (_selectedFilter == 'CCS') {
        matchesFilter = charger.connectorTypes.contains('CCS');
      } else if (_selectedFilter == 'CHAdeMO') {
        matchesFilter = charger.connectorTypes.contains('CHAdeMO');
      }

      return matchesSearch && matchesFilter;
    }).toList();

    notifyListeners();
  }
}
