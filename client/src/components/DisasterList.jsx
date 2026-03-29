'use client';

import { AlertTriangle, MapPin, Users, Clock } from 'lucide-react';
import { useDisasterStore } from '@/lib/store';

export function DisasterList({ maxItems, onSelectIncident }: DisasterListProps) {
  const { incidents } = useDisasterStore();

  const displayIncidents = maxItems ? incidents.slice(0, maxItems);

  const severityColors = {
    critical,
    high,
    medium,
    low,
  };

  const severityBadgeColors = {
    critical,
    high,
    medium,
    low,
  };

  if (displayIncidents.length === 0) {
    return (
      <div className="p-8 bg-white rounded-lg border border-gray-200 text-center">
        <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No active incidents at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayIncidents.map((incident) => (
        <div
          key={incident.id}
          onClick={() => onSelectIncident?.(incident.id)}
          className={`p-4 rounded-lg border transition-all cursor-pointer hover{
            severityColors[incident.severity}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3">
              <div
                className={`w-3 h-3 rounded-full mt-1 ${
                  severityBadgeColors[incident.severity}`}
              />
              <div>
                <h3 className="font-semibold">{incident.title}</h3>
                <p className="text-sm opacity-75 mt-1">{incident.description}</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-semibold whitespace-nowrap ml-2">
              {incident.severity.toUpperCase()}
            </span>
          </div>

          <div className="space-y-1 text-sm mt-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 opacity-75" />
              <span>{incident.location[0].toFixed(2)}, {incident.location[1].toFixed(2)}</span>
            </div>

            {incident.affectedAreas && incident.affectedAreas.length > 0 && (
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 opacity-75 mt-0.5" />
                <div>
                  <div className="flex flex-wrap gap-1">
                    {incident.affectedAreas.map((area, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-white bg-opacity-50 rounded text-xs">
                        {area.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 opacity-75" />
              <span className="text-xs opacity-75">
                {new Date(incident.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
