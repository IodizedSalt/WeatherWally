import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

document.addEventListener('DOMContentLoaded', async () => {
const api_route_local = "http://localhost:3000"
const api_route_l = "http://192.168.1.160:3000"
  const res = await fetch('http://192.168.1.160:3000/weather');
  // const res = await fetch(api_route_local + '/weather');
  const rawData = await res.json();
  const data = rawData.data;

  const dailyStats = {};
  const events = [];
  // const events = [];


  for (const timestamp in data) {
    const date = new Date(timestamp).toISOString().split('T')[0];
    const entry = data[timestamp];

    if (!dailyStats[date]) {
      dailyStats[date] = {
        temps: [],
        humidity: [],
        wind: [],
        pressure: [],
        cloud: []
      };
    }

    dailyStats[date].temps.push(entry.air_temperature);
    dailyStats[date].humidity.push(entry.relative_humidity);
    dailyStats[date].wind.push(entry.wind_speed);
    dailyStats[date].pressure.push(entry.air_pressure_at_sea_level);
    dailyStats[date].cloud.push(entry.cloud_area_fraction);
    if (entry.greenhouse_min) {
       dailyStats[date].greenhouse_min = entry.greenhouse_min;
       console.log(entry)
     }
  }
  
Object.entries(dailyStats).forEach(([date, values]) => {
  const low = Math.min(...values.temps).toFixed(1);
  const high = Math.max(...values.temps).toFixed(1);
  const avg = (values.temps.reduce((a, b) => a + b, 0) / values.temps.length).toFixed(1);

  const commonProps = {
    allDay: true,
    start: date,
    extendedProps: {
      avgTemp: avg,
      humidity: (values.humidity.reduce((a, b) => a + b, 0) / values.humidity.length).toFixed(1),
      wind: (values.wind.reduce((a, b) => a + b, 0) / values.wind.length).toFixed(1),
      pressure: (values.pressure.reduce((a, b) => a + b, 0) / values.pressure.length).toFixed(1),
      cloud: (values.cloud.reduce((a, b) => a + b, 0) / values.cloud.length).toFixed(1),
    }
  };

  events.push(
    {
      title: `High: ${high}°C`,
      color: '#f44336',
      extendedProps: { ...commonProps.extendedProps, type: 'high', value: high },
      ...commonProps,
      displayOrder: 1
    },
     {
      title: `Low: ${low}°C`,
      color: '#2196f3',
      extendedProps: { ...commonProps.extendedProps, type: 'low', value: low },
      ...commonProps,
      displayOrder: 0
    }
  );
  if (values.greenhouse_min) {

    events.push({
      title: `${"Min:" + values.greenhouse_min }°C`,
      start: date,
      allDay: true,
      color: '#4caf50',
      displayOrder: 2,
      extendedProps: {
        type: 'greenhouse_min',
        note: values.greenhouse_min
      }
    });
  }
});
  const calendarEl = document.getElementById('calendar');

  const calendar = new Calendar(calendarEl, {
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin
    ],

    initialView: 'dayGridMonth',

    headerToolbar: {
      left: 'prev,next',
      center: 'title',
    },

    events: events,

    eventOrder: 'displayOrder',

    eventClick(info) {
      const p = info.event.extendedProps;

      alert(
        `Date: ${info.event.startStr}\n` +
        `Avg Temp: ${p.avgTemp}°C\n` +
        `Humidity: ${p.humidity}%\n` +
        `Wind Speed: ${p.wind} m/s\n` +
        `Pressure: ${p.pressure} hPa\n` +
        `Cloud Coverage: ${p.cloud}%`
      );
    },

    dateClick(info) {

      // info.dateStr = clicked date
      const note = prompt(`Add note for ${info.dateStr}`);

      if (!note) return;

      calendar.addEvent({
        title: note,
        start: info.dateStr,
        allDay: true,
        color: '#4caf50',
        extendedProps: {
          userCreated: true
        }
      });

      // fetch(api_route_local + '/greenhouse-min', {
      fetch('http://192.168.1.160:3000/greenhouse-min', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: info.dateStr,
          greenhouse_min: note
        })
      });
     
    }
  });

  calendar.render();
});