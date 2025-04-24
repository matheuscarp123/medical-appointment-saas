import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import AppointmentCalendar from './AppointmentCalendar';
import { checkDoctorAvailability } from '../services/appointmentService';

// Mock do serviço de consultas
jest.mock('../services/appointmentService', () => ({
  checkDoctorAvailability: jest.fn(),
}));

const mockTheme = createTheme();

describe('AppointmentCalendar', () => {
  const mockDoctorId = 'doctor123';
  const mockOnDateSelect = jest.fn();
  const mockDate = new Date(2023, 5, 15); // 15 de junho de 2023
  const tomorrow = new Date(2023, 5, 16);
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock da data atual para testes consistentes
    jest.useFakeTimers().setSystemTime(mockDate);
    
    // Mock da resposta do serviço
    (checkDoctorAvailability as jest.Mock).mockResolvedValue({
      available: true,
      slots: [tomorrow],
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renderiza o calendário com o mês atual', async () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <AppointmentCalendar
          doctorId={mockDoctorId}
          onDateSelect={mockOnDateSelect}
        />
      </ThemeProvider>
    );

    // Verifica se o mês está sendo exibido
    expect(screen.getByText(/junho 2023/i)).toBeInTheDocument();
    
    // Verifica se os dias da semana estão sendo exibidos
    expect(screen.getByText('Dom')).toBeInTheDocument();
    expect(screen.getByText('Seg')).toBeInTheDocument();
    
    // Verifica se o serviço foi chamado com os parâmetros corretos
    await waitFor(() => {
      expect(checkDoctorAvailability).toHaveBeenCalledWith(mockDoctorId, expect.any(Date));
    });
  });

  it('permite navegar entre meses', async () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <AppointmentCalendar
          doctorId={mockDoctorId}
          onDateSelect={mockOnDateSelect}
        />
      </ThemeProvider>
    );
    
    // Botões de navegação devem estar presentes
    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Navega para o próximo mês
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText(/julho 2023/i)).toBeInTheDocument();
    });
    
    // Navega para o mês anterior (volta para junho)
    fireEvent.click(prevButton);
    await waitFor(() => {
      expect(screen.getByText(/junho 2023/i)).toBeInTheDocument();
    });
  });

  it('chama onDateSelect quando uma data disponível é clicada', async () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <AppointmentCalendar
          doctorId={mockDoctorId}
          onDateSelect={mockOnDateSelect}
          selectedDate={mockDate}
        />
      </ThemeProvider>
    );

    // Aguarda o carregamento das datas disponíveis
    await waitFor(() => {
      expect(checkDoctorAvailability).toHaveBeenCalled();
    });

    // Os dias do calendário são renderizados dinamicamente, então precisamos encontrar
    // o elemento que representa o dia de amanhã e clicar nele
    const tomorrowDate = screen.getByText('16');
    fireEvent.click(tomorrowDate);

    // Verifica se a função de callback foi chamada com a data correta
    expect(mockOnDateSelect).toHaveBeenCalledWith(expect.any(Date));
  });
}); 