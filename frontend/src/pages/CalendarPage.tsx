import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import AddEventModal from '../components/modals/AddEventModal';
import api from '../contexts/AuthContext';

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

    const fetchCalendarData = async () => {
      try {
        // Fetch Deals to show estimated closing dates on the calendar
        const [dealsRes, ticketsRes] = await Promise.all([
          api.get('deals/'),
          api.get('tickets/')
        ]);

        const dealEvents = (dealsRes.data.results || dealsRes.data).map((d: any) => ({
          id: `deal-${d.id}`,
          title: `🤝 ${d.title}`,
          start: d.created_at, // In a real app, use a 'close_date' field
          backgroundColor: '#B2FF4D',
          textColor: '#000',
          borderColor: '#B2FF4D',
        }));

        const ticketEvents = (ticketsRes.data.results || ticketsRes.data).map((t: any) => ({
          id: `ticket-${t.id}`,
          title: `🎫 ${t.subject}`,
          start: t.created_at,
          backgroundColor: '#3f3f46',
          textColor: '#fff',
          borderColor: '#52525b',
        }));

        setEvents([...dealEvents, ...ticketEvents]);
      } catch (err) {
        console.error("Failed to fetch calendar data", err);
      }
    };
    
    fetchCalendarData();

    const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
    };

    const handleEventChange = async (changeInfo: any) => {
  const { event } = changeInfo;
  try {
    // We only update our custom 'Event' models, not the read-only Deal/Ticket previews
    if (event.id.startsWith('event-')) {
      const dbId = event.id.replace('event-', '');
      await api.patch(`events/${dbId}/`, {
        start_time: event.startStr,
        end_time: event.endStr || event.startStr,
      });
    }
  } catch (err) {
    changeInfo.revert(); // Put it back if the API fails
    console.error("Sync failed", err);
  }
};

// 2. Handle Event Click (Details Popup)
const handleEventClick = (clickInfo: any) => {
  const { event } = clickInfo;
  alert(`Event: ${event.title}\nDescription: ${event.extendedProps.description || 'No description'}`);
  // Tip: You can replace this alert with a beautiful Radix UI Popover later!
};


  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your meetings and deal deadlines.</p>
        </div>
        <button onClick={() => { setSelectedDate(undefined); setIsModalOpen(true); }} className="flex items-center gap-2 bg-saas-neon hover:bg-saas-neonhover text-black font-bold py-2 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(178,255,77,0.3)]">
          <Plus size={18} strokeWidth={3} />
          Add Event
        </button>
      </header>

      <div className="flex-1 bg-white dark:bg-saas-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm overflow-hidden">
        <div className="calendar-container h-full">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            editable={true}
            selectable={true}
            height="100%"
            eventClassNames="rounded-lg border-none px-2 py-1 text-xs font-bold shadow-sm cursor-pointer hover:brightness-110 transition-all"
            dayHeaderClassNames="text-xs font-bold uppercase text-gray-400 py-3"
            dateClick={handleDateClick}
            eventDrop={handleEventChange}
            eventResize={handleEventChange}
            eventClick={handleEventClick}
          />
        </div>
      </div>

      <style>{`
        .fc { --fc-border-color: #2A2A2D; --fc-button-bg-color: #1E1E20; --fc-button-border-color: #2A2A2D; --fc-button-hover-bg-color: #B2FF4D; --fc-button-hover-text-color: #000; --fc-today-bg-color: rgba(178, 255, 77, 0.05); }
        .dark .fc-theme-standard td, .dark .fc-theme-standard th { border-color: #2A2A2D; }
        .fc .fc-button-primary:focus { shadow: none; }
        .fc-toolbar-title { font-weight: 800; font-size: 1.25rem !important; }
        .fc-button { border-radius: 10px !important; font-weight: 700 !important; text-transform: capitalize !important; }
      `}</style>

      <AddEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCalendarData}
        initialDate={selectedDate}
      />
    </div>
  );
}