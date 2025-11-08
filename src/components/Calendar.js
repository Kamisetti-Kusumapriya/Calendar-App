import React, { useState } from 'react';
import dayjs from 'dayjs';
import './Calendar.css';
import eventsData from '../data/events.json';
import Event from './Event';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const today = dayjs();

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    const days = [];
    let day = startDate;

    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return eventsData.filter(event => event.date === dateStr);
  };

  // Check if events have time conflicts
  const checkConflicts = (events) => {
    if (events.length <= 1) return events.map(e => ({ ...e, hasConflict: false }));

    const sortedEvents = [...events].sort((a, b) => {
      const timeA = parseInt(a.startTime.replace(':', ''));
      const timeB = parseInt(b.startTime.replace(':', ''));
      return timeA - timeB;
    });

    return sortedEvents.map((event, index) => {
      const [startHours, startMinutes] = event.startTime.split(':').map(Number);
      const [endHours, endMinutes] = event.endTime.split(':').map(Number);
      const eventStart = startHours * 60 + startMinutes;
      const eventEnd = endHours * 60 + endMinutes;

      let hasConflict = false;

      for (let i = 0; i < sortedEvents.length; i++) {
        if (i === index) continue;

        const [otherStartHours, otherStartMinutes] = sortedEvents[i].startTime.split(':').map(Number);
        const [otherEndHours, otherEndMinutes] = sortedEvents[i].endTime.split(':').map(Number);
        const otherStart = otherStartHours * 60 + otherStartMinutes;
        const otherEnd = otherEndHours * 60 + otherEndMinutes;

        if (
          (eventStart >= otherStart && eventStart < otherEnd) ||
          (eventEnd > otherStart && eventEnd <= otherEnd) ||
          (eventStart <= otherStart && eventEnd >= otherEnd)
        ) {
          hasConflict = true;
          break;
        }
      }

      return { ...event, hasConflict };
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-header-left">
          <h1>{currentDate.format('MMMM YYYY')}</h1>
          <button className="today-btn" onClick={goToToday}>
            Today
          </button>
        </div>
        <div className="calendar-nav">
          <button onClick={goToPreviousMonth} className="nav-btn">
            ‹
          </button>
          <button onClick={goToNextMonth} className="nav-btn">
            ›
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.month() === currentDate.month();
          const isToday = day.isSame(today, 'day');
          const dayEvents = getEventsForDate(day);
          const eventsWithConflicts = checkConflicts(dayEvents);

          return (
            <div
              key={index}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
            >
              <div className="day-number">{day.format('D')}</div>
              <div className="day-events">
                {eventsWithConflicts.slice(0, 2).map((event, eventIndex) => (
                  <Event key={eventIndex} event={event} hasConflict={event.hasConflict} />
                ))}
                {eventsWithConflicts.length > 2 && (
                  <div className="more-events">
                    +{eventsWithConflicts.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
