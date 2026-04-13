import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/charger_provider.dart';
import '../../widgets/charger_card.dart';
import '../../core/theme/app_theme.dart';

class ChargerListScreen extends StatefulWidget {
  const ChargerListScreen({Key? key}) : super(key: key);

  @override
  State<ChargerListScreen> createState() => _ChargerListScreenState();
}

class _ChargerListScreenState extends State<ChargerListScreen> {
  late TextEditingController _searchController;
  String _selectedFilter = 'All';
  final List<String> _filterOptions = ['All', 'Available', 'Type 2', 'CCS', 'CHAdeMO'];

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    context.read<ChargerProvider>().searchChargers(query);
  }

  void _onFilterChanged(String filter) {
    setState(() {
      _selectedFilter = filter;
    });
    context.read<ChargerProvider>().filterChargers(filter);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkTheme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.primaryDarkColor,
        elevation: 0,
        title: Text(
          'Find Chargers',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Search bar
                TextField(
                  controller: _searchController,
                  onChanged: _onSearchChanged,
                  decoration: InputDecoration(
                    hintText: 'Search chargers, locations...',
                    hintStyle: TextStyle(color: Colors.grey[600]),
                    prefixIcon: Icon(
                      Icons.search,
                      color: Colors.grey[600],
                    ),
                    filled: true,
                    fillColor: AppTheme.surfaceColor,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                        color: Colors.grey[700]!,
                      ),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                        color: Colors.grey[700]!,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(
                        color: AppTheme.accentColor,
                      ),
                    ),
                  ),
                  style: const TextStyle(color: Colors.white),
                ),
                const SizedBox(height: 16),
                // Filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: List.generate(
                      _filterOptions.length,
                      (index) => Padding(
                        padding: EdgeInsets.only(
                          right: index == _filterOptions.length - 1 ? 0 : 8,
                        ),
                        child: FilterChip(
                          label: Text(_filterOptions[index]),
                          selected: _selectedFilter == _filterOptions[index],
                          onSelected: (selected) {
                            if (selected) {
                              _onFilterChanged(_filterOptions[index]);
                            }
                          },
                          backgroundColor: AppTheme.surfaceColor,
                          selectedColor: AppTheme.accentColor.withOpacity(0.3),
                          labelStyle: TextStyle(
                            color: _selectedFilter == _filterOptions[index]
                                ? AppTheme.accentColor
                                : Colors.grey[400],
                            fontWeight: FontWeight.w500,
                          ),
                          side: BorderSide(
                            color: _selectedFilter == _filterOptions[index]
                                ? AppTheme.accentColor
                                : Colors.grey[700]!,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Charger list
          Expanded(
            child: Consumer<ChargerProvider>(
              builder: (context, chargerProvider, _) {
                final chargers = chargerProvider.filteredChargers;

                if (chargers.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.ev_station,
                          size: 64,
                          color: Colors.grey[700],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No chargers found',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                color: Colors.white,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Try adjusting your search or filters',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Colors.grey[500],
                              ),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: chargers.length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: EdgeInsets.only(
                        bottom: index == chargers.length - 1 ? 16 : 12,
                        top: index == 0 ? 8 : 0,
                      ),
                      child: ChargerCard(
                        charger: chargers[index],
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            '/charger/${chargers[index].id}',
                          );
                        },
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Toggle map view
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Map view coming soon'),
            ),
          );
        },
        backgroundColor: AppTheme.accentColor,
        child: const Icon(
          Icons.map,
          color: Colors.black,
        ),
      ),
    );
  }
}
