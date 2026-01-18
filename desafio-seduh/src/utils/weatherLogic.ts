import { addSeconds, getHours, parseISO } from 'date-fns';

// 1. Definimos o formato dos dados (A "cura" para o erro do any)
export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  periodName?: string; 
  displayHour?: string;
}

const TARGET_HOURS = {
  3: 'Dawn',
  9: 'Morning',
  15: 'Afternoon',
  21: 'Night'
};

// 2. Aqui usamos "ForecastItem[]" em vez de "any[]"
export const filterForecasts = (list: ForecastItem[], timezoneOffset: number) => {
  const targetHours = [3, 9, 15, 21];
  const result: ForecastItem[] = [];
  const foundHours = new Set();

  for (const targetHour of targetHours) {
    // Encontra o item mais próximo do horário alvo
    const closest = list.reduce((prev, current) => {
      const utcDate = parseISO(current.dt_txt);
      const localDate = addSeconds(utcDate, timezoneOffset);
      const hour = getHours(localDate);
      
      const prevUtc = parseISO(prev.dt_txt);
      const prevLocal = addSeconds(prevUtc, timezoneOffset);
      const prevHour = getHours(prevLocal);
      
      const diffCurrent = Math.abs(hour - targetHour);
      const diffPrev = Math.abs(prevHour - targetHour);
      
      return diffCurrent < diffPrev ? current : prev;
    });

    const periodName = Object.values(TARGET_HOURS)[targetHours.indexOf(targetHour)];
    
    if (!foundHours.has(periodName)) {
      const utcDate = parseISO(closest.dt_txt);
      const localDate = addSeconds(utcDate, timezoneOffset);
      const hour = getHours(localDate);
      
      result.push({
        ...closest,
        periodName,
        displayHour: `${hour}:00`
      });
      foundHours.add(periodName);
    }
  }

  return result;
};