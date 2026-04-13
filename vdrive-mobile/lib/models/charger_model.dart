class ChargerModel {
  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final int availablePorts;
  final int totalPorts;
  final double powerKw;
  final double pricePerKwh;
  final List<String> connectorTypes;
  final String status; // 'available', 'in_use', 'offline'
  final double rating;
  final int reviews;
  final double distance;

  ChargerModel({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.availablePorts,
    required this.totalPorts,
    required this.powerKw,
    required this.pricePerKwh,
    required this.connectorTypes,
    required this.status,
    required this.rating,
    required this.reviews,
    required this.distance,
  });

  factory ChargerModel.fromJson(Map<String, dynamic> json) {
    return ChargerModel(
      id: json['id'] as String,
      name: json['name'] as String,
      address: json['address'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      availablePorts: json['availablePorts'] as int,
      totalPorts: json['totalPorts'] as int,
      powerKw: (json['powerKw'] as num).toDouble(),
      pricePerKwh: (json['pricePerKwh'] as num).toDouble(),
      connectorTypes: List<String>.from(json['connectorTypes'] as List),
      status: json['status'] as String,
      rating: (json['rating'] as num).toDouble(),
      reviews: json['reviews'] as int,
      distance: (json['distance'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'availablePorts': availablePorts,
      'totalPorts': totalPorts,
      'powerKw': powerKw,
      'pricePerKwh': pricePerKwh,
      'connectorTypes': connectorTypes,
      'status': status,
      'rating': rating,
      'reviews': reviews,
      'distance': distance,
    };
  }
}
