import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Loader2 } from 'lucide-react';
import AddEventModal from '../components/modals/AddEventModal';
import api from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function CalendarPage() {
  const { theme } = useTheme();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      // Fetch Deals to show estimated closing dates on the calendar
      const [dealsRes, ticketsRes] = await Promise.all([
        api.get('deals/'),
        api.get('tickets/')
      ]);

      const dealEvents = (dealsRes.data.results || dealsRes.data).map((d: any) => ({
        id: `deal-${d.id}`,
        title: `🤝 ${d.title}`,
        start: d.created_at, 
        backgroundColor: 'rgba(178, 255, 77, 0.15)',
        textColor: 'var(--color-saas-neon)',
        borderColor: 'var(--color-saas-neon)',
        extendedProps: { type: 'deal', amount: d.amount }
      }));

      const ticketEvents = (ticketsRes.data.results || ticketsRes.data).map((t: any) => ({
        id: `ticket-${t.id}`,
        title: `🎫 ${t.subject}`,
        start: t.created_at,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        textColor: '#818cf8',
        borderColor: '#818cf8',
        extendedProps: { type: 'ticket', priority: t.priority }
      }));

      setEvents([...dealEvents, ...ticketEvents]);
    } catch (err) {
      console.error("Failed to fetch calendar data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleEventChange = async (changeInfo: any) => {
    const { event } = changeInfo;
    try {
      if (event.id.startsWith('event-')) {
        const dbId = event.id.replace('event-', '');
        await api.patch(`events/${dbId}/`, {
          start_time: event.startStr,
          end_time: event.endStr || event.startStr,
        });
      }
    } catch (err) {
      changeInfo.revert();
      console.error("Sync failed", err);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const { event } = clickInfo;
    const type = event.extendedProps.type;
    const subject = type === 'deal' ? 'Deal Detail' : 'Ticket Detail';
    alert(`${subject}: ${event.title}\nDate: ${new Date(event.start).toLocaleDateString()}`);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-12 h-12 border-4 border-saas-neon border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(178,255,77,0.3)]"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-saas-neon rounded-full"></div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Schedule</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-[0.2em] ml-4">Manage meetings and key deadlines</p>
        </div>
        <button 
          onClick={() => { setSelectedDate(undefined); setIsModalOpen(true); }} 
          className="group flex items-center gap-3 bg-saas-neon hover:scale-105 active:scale-95 text-black font-black py-4 px-8 rounded-[1.25rem] transition-all shadow-2xl shadow-saas-neon/20 uppercase text-xs tracking-[0.1em]"
        >
          <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" /> New Event
        </button>
      </header>

      <div className="flex-1 bg-white dark:bg-saas-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm overflow-hidden relative group">
        <div className="calendar-container h-full relative z-10">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            events={events}
            editable={true}
            selectable={true}
            height="100%"
            dayMaxEvents={true}
            eventClassNames="rounded-xl border-none px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm cursor-pointer hover:scale-[1.02] transition-all duration-300 active:scale-95"
            dayHeaderClassNames="text-[10px] font-black uppercase text-gray-400 py-4 tracking-[0.2em]"
            dateClick={handleDateClick}
            eventDrop={handleEventChange}
            eventResize={handleEventChange}
            eventClick={handleEventClick}
          />
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saas-neon/5 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-saas-neon/10 transition-colors duration-1000 pointer-events-none"></div>
      </div>

      <style>{`
        .fc { 
          --fc-border-color: ${theme === 'dark' ? '#2A2A2D' : '#F1F5F9'}; 
          --fc-button-bg-color: ${theme === 'dark' ? '#1E1E20' : '#FFFFFF'}; 
          --fc-button-border-color: ${theme === 'dark' ? '#2A2A2D' : '#E2E8F0'}; 
          --fc-button-hover-bg-color: #B2FF4D; 
          --fc-button-hover-text-color: #000; 
          --fc-button-active-bg-color: #B2FF4D;
          --fc-button-active-border-color: #B2FF4D;
          --fc-today-bg-color: ${theme === 'dark' ? 'rgba(178, 255, 77, 0.05)' : 'rgba(178, 255, 77, 0.08)'}; 
          --fc-page-bg-color: transparent;
        }
        .fc-theme-standard td, .fc-theme-standard th { border-color: inherit; }
        .fc-toolbar-title { font-weight: 900 !important; font-size: 1.25rem !important; text-transform: uppercase !important; letter-spacing: -0.025em !important; color: ${theme === 'dark' ? '#FFFFFF' : '#0F172A'} !important; }
        .fc-button { border-radius: 12px !important; font-weight: 900 !important; text-transform: uppercase !important; font-size: 10px !important; letter-spacing: 0.1em !important; border-width: 1px !important; height: 38px !important; transition: all 0.3s ease !important; }
        .fc-button-primary:not(:disabled):active, .fc-button-primary:not(:disabled).fc-button-active { background-color: #B2FF4D !important; color: black !important; border-color: #B2FF4D !important; box-shadow: 0 10px 20px rgba(178, 255, 77, 0.2) !important; }
        .fc-button-primary:focus { box-shadow: none !important; }
        .fc-daygrid-day-number { font-weight: 900 !important; font-size: 11px !important; color: ${theme === 'dark' ? '#52525B' : '#94A3B8'} !important; padding: 12px !important; }
        .fc-day-today .fc-daygrid-day-number { color: #B2FF4D !important; }
        .fc-daygrid-event-harness { margin-bottom: 4px !important; }
        .fc-scrollgrid { border-radius: 2rem !important; overflow: hidden !important; border: none !important; }
        .fc-col-header-cell { background: ${theme === 'dark' ? 'rgba(30, 30, 32, 0.5)' : 'rgba(248, 250, 252, 0.5)'} !important; }
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