
import { filterForecasts, ForecastItem } from '../utils/weatherLogic';

// Mock de um item simples para não repetir código
const createMockItem = (dt_txt: string, temp: number): ForecastItem => ({
  dt: 0,
  dt_txt,
  main: { temp, humidity: 50 },
  weather: [{ main: 'Clear', description: 'céu limpo', icon: '01d' }],
  wind: { speed: 10 }
});

describe('Weather Logic - filterForecasts', () => {
  it('deve retornar exatamente 4 períodos (Dawn, Morning, Afternoon, Night)', () => {
    // Simulamos uma lista de horários (a API manda a cada 3h)
    const mockList = [
      createMockItem('2023-10-10 00:00:00', 20),
      createMockItem('2023-10-10 03:00:00', 22), // Dawn alvo
      createMockItem('2023-10-10 06:00:00', 23),
      createMockItem('2023-10-10 09:00:00', 25), // Morning alvo
      createMockItem('2023-10-10 12:00:00', 27),
      createMockItem('2023-10-10 15:00:00', 28), // Afternoon alvo
      createMockItem('2023-10-10 18:00:00', 26),
      createMockItem('2023-10-10 21:00:00', 24), // Night alvo
    ];

    // Offset 0 (UTC)
    const result = filterForecasts(mockList, 0);

    expect(result).toHaveLength(4);
    expect(result[0].periodName).toBe('Dawn');
    expect(result[1].periodName).toBe('Morning');
    expect(result[2].periodName).toBe('Afternoon');
    expect(result[3].periodName).toBe('Night');
  });

  it('deve encontrar a hora mais próxima se a exata não existir (Lógica do Reduce)', () => {
    // Cenário: A API mandou 04:00 em vez de 03:00. 
    // Sua lógica deve ser esperta e pegar 04:00 para "Dawn" (alvo 03:00).
    const mockList = [
      createMockItem('2023-10-10 04:00:00', 22), // Mais perto de 03:00
      createMockItem('2023-10-10 08:00:00', 25), // Mais perto de 09:00
      createMockItem('2023-10-10 14:00:00', 28), // Mais perto de 15:00
      createMockItem('2023-10-10 22:00:00', 24), // Mais perto de 21:00
    ];

    const result = filterForecasts(mockList, 0);

    expect(result[0].displayHour).toBe('4:00'); // Pegou 4h pq era o mais perto
    expect(result[0].periodName).toBe('Dawn');
  });
});