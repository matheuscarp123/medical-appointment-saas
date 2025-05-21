import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { checkDoctorAvailability } from '../services/appointmentService';

interface AppointmentCalendarProps {
  doctorId: string;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  doctorId,
  onDateSelect,
  selectedDate
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoading(true);
        const { slots } = await checkDoctorAvailability(doctorId, currentMonth);
        setAvailableDates(slots);
      } catch (error) {
        console.error('Erro ao carregar disponibilidade:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [doctorId, currentMonth]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => isSameDay(availableDate, date));
  };

  const isDateSelected = (date: Date) => {
    return selectedDate ? isSameDay(date, selectedDate) : false;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePrevMonth} sx={{ color: theme.palette.primary.main }}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ color: theme.palette.primary.main }}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <Typography
            key={day}
            variant="body2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: theme.palette.text.secondary
            }}
          >
            {day}
          </Typography>
        ))}

        {daysInMonth.map((date, index) => {
          const isAvailable = isDateAvailable(date);
          const isSelected = isDateSelected(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <motion.div
              key={date.toString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                onClick={() => isAvailable && onDateSelect(date)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  cursor: isAvailable ? 'pointer' : 'default',
                  backgroundColor: isSelected
                    ? theme.palette.primary.main
                    : isAvailable
                    ? theme.palette.success.light
                    : theme.palette.error.light,
                  opacity: isCurrentMonth ? 1 : 0.5,
                  color: isSelected ? 'white' : theme.palette.text.primary,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: isAvailable ? 'scale(1.1)' : 'none',
                    boxShadow: isAvailable ? '0 0 10px rgba(0,0,0,0.2)' : 'none'
                  }
                }}
              >
                <Typography variant="body2">
                  {format(date, 'd')}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.success.light }} />
          <Typography variant="body2">Disponível</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.error.light }} />
          <Typography variant="body2">Indisponível</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AppointmentCalendar; 