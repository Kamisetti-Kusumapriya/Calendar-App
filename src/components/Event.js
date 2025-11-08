import React from 'react';
import './Event.css';

const Event = ({ event, hasConflict }) => {
  // Format time to AM/PM
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate duration in minutes
  const getDuration = () => {
    const [startHours, startMinutes] = event.startTime.split(':').map(Number);
    const [endHours, endMinutes] = event.endTime.split(':').map(Number);
    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;
    return endInMinutes - startInMinutes;
  };

  const duration = getDuration();
  const tooltipText = `${event.title}\n${formatTime(event.startTime)} - ${formatTime(event.endTime)} (${duration} min)${hasConflict ? '\n⚠️ Time conflict detected' : ''}`;

  return (
    <div
      className={`event ${hasConflict ? 'conflict' : ''}`}
      style={{ backgroundColor: event.color }}
      title={tooltipText}
    >
      <span className="event-time">{formatTime(event.startTime)}</span>
      <span className="event-title">{event.title}</span>
      {hasConflict && (
        <span className="conflict-indicator" title="Time conflict">⚠️</span>
      )}
    </div>
  );
};

export default Event;
