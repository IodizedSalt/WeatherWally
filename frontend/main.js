import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', async () => {

  const API = 'http://192.168.1.160:3000';
  const API_LOCAL = 'http://localhost:3000';


  // const res = await fetch(`${API_LOCAL}/weather`);
  const res = await fetch(`${API}/weather`);
  const rawData = await res.json();

  const data = rawData.data;
  const extraNotes = rawData.extra_notes || {};

  const dailyStats = {};
  const events = [];


  for (const timestamp in data) {

    const date =
      new Date(timestamp)
        .toISOString()
        .split('T')[0];

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

    dailyStats[date].temps.push(
      entry.air_temperature
    );

    dailyStats[date].humidity.push(
      entry.relative_humidity
    );

    dailyStats[date].wind.push(
      entry.wind_speed
    );

    dailyStats[date].pressure.push(
      entry.air_pressure_at_sea_level
    );

    dailyStats[date].cloud.push(
      entry.cloud_area_fraction
    );
  }

  Object.entries(dailyStats).forEach(([date, values]) => {

    const low =
      Math.min(...values.temps).toFixed(1);

    const high =
      Math.max(...values.temps).toFixed(1);

    const avg =
      (
        values.temps.reduce((a, b) => a + b, 0)
        / values.temps.length
      ).toFixed(1);

    const commonProps = {

      allDay: true,

      start: date,

      extendedProps: {

        avgTemp: avg,

        humidity:
          (
            values.humidity.reduce((a, b) => a + b, 0)
            / values.humidity.length
          ).toFixed(1),

        wind:
          (
            values.wind.reduce((a, b) => a + b, 0)
            / values.wind.length
          ).toFixed(1),

        pressure:
          (
            values.pressure.reduce((a, b) => a + b, 0)
            / values.pressure.length
          ).toFixed(1),

        cloud:
          (
            values.cloud.reduce((a, b) => a + b, 0)
            / values.cloud.length
          ).toFixed(1),
      }
    };

    events.push({

      title: `High: ${high}°C`,

      color: '#f44336',

      extendedProps: {
        ...commonProps.extendedProps,
        type: 'high',
        value: high
      },

      ...commonProps,

      displayOrder: 1
    });

    events.push({

      title: `Low: ${low}°C`,

      color: '#2196f3',

      extendedProps: {
        ...commonProps.extendedProps,
        type: 'low',
        value: low
      },

      ...commonProps,

      displayOrder: 0
    });
  });

  Object.entries(extraNotes).forEach(([date, entries]) => {

    entries.forEach((entry) => {

      if (entry.type === 'greenhouse_min') {

        events.push({

          title: `Min: ${entry.value}°C`,

          start: date,

          allDay: true,

          color: '#4caf50',

          displayOrder: 2,

          extendedProps: {
            type: 'greenhouse_min',
            greenhouse_min: entry.value
          }
        });
      }

      if (entry.type === 'note') {

        events.push({

          title: entry.value,

          start: date,

          allDay: true,

          color: '#666557',

          displayOrder: 3,

          extendedProps: {
            type: 'note',
            note: entry.value
          }
        });
      }
    });
  });

  let selectedDate = null;
  let modalSelectedDate = null;

  const entryModal = new bootstrap.Modal(
    document.getElementById('entryModal')
  );

  const calendarEl =
    document.getElementById('calendar');

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
    
      events,
      eventOrder: 'displayOrder',
    
      dayCellDidMount(info) {
    
        const openEntry = () => {
    
          selectedDate = info.date.toISOString()
            .split('T')[0];
          console.log(selectedDate)
          const dateLabel =
          document.getElementById(
            'selectedDateLabel'
          );
        
        if (dateLabel) {
          dateLabel.textContent =
          selectedDate;
        }
          document.getElementById('noteInput').value = '';
          document.getElementById('greenhouseInput').value = '';
    
          document.getElementById('entryType').value = 'note';
    
          updateEntryFields();
    
          entryModal.show();
        };
    
        info.el.addEventListener('click', (e) => {
          if (e.target.closest('.fc-event')) {
            return;
          }
        
          openEntry();
        });
        info.el.addEventListener(
          'touchend',
          (e) => {
        
            if (e.target.closest('.fc-event')) {
              return;
            }
        
            e.preventDefault();
            openEntry();
          },
          { passive: false }
        );
      },
    
      eventClick(info) {

        const p = info.event.extendedProps;

        if (p.type === 'note') {
          alert(`Note:\n${p.note}`);
          return;
        }

        if (p.type === 'greenhouse_min') {
          alert(
            `Greenhouse Min:\n${p.greenhouse_min}°C`
          );
          return;
        }

        alert(
          `Date: ${info.event.startStr}\n` +
          `Avg Temp: ${p.avgTemp}°C\n` +
          `Humidity: ${p.humidity}%\n` +
          `Wind Speed: ${p.wind} m/s\n` +
          `Pressure: ${p.pressure} hPa\n` +
          `Cloud Coverage: ${p.cloud}%`
        );
      }
    });


  const entryType =
    document.getElementById('entryType');
  entryType.addEventListener('change', updateEntryFields);

  document
    .getElementById('saveEntryBtn')
    .addEventListener('click', async () => {

      const type = entryType.value;

      let value = '';

      if (type === 'note') {

        value =
          document.getElementById('noteInput').value;

        if (!value) return;

        calendar.addEvent({

          title: value,

          start: selectedDate,

          allDay: true,

          color: '#ffdf00',

          displayOrder: 3,

          extendedProps: {
            type: 'note',
            note: value
          }
        });
      }

      console.log(type)
      if (type === 'greenhouse_min') {

        value =
          document.getElementById('greenhouseInput').value;

        if (!value) return;

        calendar.addEvent({

          title: `Min: ${value}°C`,

          start: selectedDate,

          allDay: true,

          color: '#4caf50',

          displayOrder: 2,

          extendedProps: {
            type: 'greenhouse_min',
            greenhouse_min: value
          }
        });
      }

      await fetch(`${API}/entry`, {
        // await fetch(`${API_LOCAL}/entry`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          date: selectedDate,

          type: type,

          value: value
        })
      });

      entryModal.hide();
    });

  function updateEntryFields() {

    const type =
      document.getElementById('entryType').value;

    const noteField =
      document.getElementById('noteField');

    const greenhouseField =
      document.getElementById('greenhouseField');

    if (type === 'note') {

      noteField.style.display = 'block';
      greenhouseField.style.display = 'none';

    } else {

      noteField.style.display = 'none';
      greenhouseField.style.display = 'block';
    }
  }
  calendar.render();
});