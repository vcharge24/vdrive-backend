class SessionModel {
  final String id;
  final String chargerId;
  final String chargerName;
  final String startTime;
  final String? endTime;
  final String duration;
  final double energyDelivered;
  final double cost;
  final String status; // 'in_progress', 'completed', 'cancelled'
  final String connectorType;
  final double progress; // 0.0 to 1.0

  SessionModel({
    required this.id,
    required this.chargerId,
    required this.chargerName,
    required this.startTime,
    this.endTime,
    required this.duration,
    required this.energyDelivered,
    required this.cost,
    required this.status,
    required this.connectorType,
    required this.progress,
  });

  factory SessionModel.fromJson(Map<String, dynamic> json) {
    return SessionModel(
      id: json['id'] as String,
      chargerId: json['chargerId'] as String,
      chargerName: json['chargerName'] as String,
      startTime: json['startTime'] as String,
      endTime: json['endTime'] as String?,
      duration: json['duration'] as String,
      energyDelivered: (json['energyDelivered'] as num).toDouble(),
      cost: (json['cost'] as num).toDouble(),
      status: json['status'] as String,
      connectorType: json['connectorType'] as String,
      progress: (json['progress'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'chargerId': chargerId,
      'chargerName': chargerName,
      'startTime': startTime,
      'endTime': endTime,
      'duration': duration,
      'energyDelivered': energyDelivered,
      'cost': cost,
      'status': status,
      'connectorType': connectorType,
      'progress': progress,
    };
  }
}
