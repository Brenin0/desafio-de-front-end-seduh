
import { render, screen, act } from '@testing-library/react';
import { Suspense } from 'react';
import CityPage from '../app/city/[name]/page';
import { getCityData } from '@/services/api';

// Mock do serviço de API
jest.mock('@/services/api', () => ({
  getCityData: jest.fn(),
}));

const mockCityData = {
  current: {
    name: 'Recife',
    dt: 1700000000,
    weather: [{ main: 'Clear', description: 'céu limpo', icon: '01d' }],
    main: { temp: 30, temp_min: 28, temp_max: 32, humidity: 60 },
    wind: { speed: 5 },
    sys: { sunrise: 1700000000, sunset: 1700040000 },
    timezone: -10800
  },
  forecast: {
    city: { timezone: -10800 },
    list: [
        // Criamos 4 itens distintos para Dawn, Morning, Afternoon, Night
        {
            dt: 1700000001, // ID Único
            dt_txt: '2023-10-10 03:00:00',
            main: { temp: 22, humidity: 80 },
            weather: [{ main: 'Clear', description: 'clear', icon: '01d' }],
            wind: { speed: 3 }
        },
        {
            dt: 1700000002, // ID Único
            dt_txt: '2023-10-10 09:00:00',
            main: { temp: 28, humidity: 50 },
            weather: [{ main: 'Clear', description: 'clear', icon: '01d' }],
            wind: { speed: 4 }
        },
        {
            dt: 1700000003, // ID Único
            dt_txt: '2023-10-10 15:00:00',
            main: { temp: 30, humidity: 45 },
            weather: [{ main: 'Clear', description: 'clear', icon: '01d' }],
            wind: { speed: 5 }
        },
        {
            dt: 1700000004, // ID Único
            dt_txt: '2023-10-10 21:00:00',
            main: { temp: 25, humidity: 70 },
            weather: [{ main: 'Clear', description: 'clear', icon: '01d' }],
            wind: { speed: 4 }
        }
    ]
  }
};

describe('CityPage', () => {
  it('deve mostrar os dados da cidade corretamente', async () => {
    // Configura o mock para retornar os dados
    (getCityData as jest.Mock).mockResolvedValue(mockCityData);
    
    // Cria a promessa resolvida para o params
    const paramsPromise = Promise.resolve({ name: 'Recife' });

    // Renderiza com Suspense
    // Usamos 'await act' para garantir que o React processe o estado inicial
    await act(async () => {
      render(
        <Suspense fallback={<div>Carregando Teste...</div>}>
          <CityPage params={paramsPromise} />
        </Suspense>
      );
    });

    
    // O findBy fica tentando achar o elemento por até 1 segundo (padrão).
    
    const cityName = await screen.findByText('Recife');
    expect(cityName).toBeInTheDocument();

    const temp = await screen.findByText('30');
    expect(temp).toBeInTheDocument();

    const wind = await screen.findByText('Wind speed');
    expect(wind).toBeInTheDocument();
  });
});