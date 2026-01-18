
"use client";

import { useEffect, useState, use } from 'react';
import { getCityData } from '@/services/api';
import { filterForecasts, ForecastItem } from '@/utils/weatherLogic';
import Link from 'next/link';

// --- Interfaces ---
interface CurrentWeather {
  name: string;
  dt: number; // Data atual para calcularmos hora local se precisar
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number; 
  };
  wind: {
    speed: number; 
  };
  sys: {
    sunrise: number; 
    sunset: number;  
  };
  timezone: number; // Necessário para calcular a hora certa do sol
}

interface CityData {
  current: CurrentWeather;
  forecast: ForecastItem[];
}

export default function CityPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const cityName = decodeURIComponent(resolvedParams.name);
  const [data, setData] = useState<CityData | null>(null);

  useEffect(() => {
    async function load() {
      const result = await getCityData(cityName);
      if (result) {
        
        const filteredForecast = filterForecasts(result.forecast.list, result.forecast.city.timezone);
        
        // Injetamos o timezone no objeto current para facilitar o uso no render
        const currentWithTimezone = {
          ...result.current,
          timezone: result.forecast.city.timezone
        };

        setData({ 
          current: currentWithTimezone, 
          forecast: filteredForecast 
        });
      }
    }
    load();
  }, [cityName]);

  // Função auxiliar para formatar hora (Nascer/Pôr do sol)
  const formatTime = (timestamp: number, timezoneOffset: number) => {
    // Ajusta o timestamp UTC para a hora local da cidade
    // (timestamp é segundos, Date espera ms, timezoneOffset é segundos)
    const date = new Date((timestamp + timezoneOffset) * 1000);
    
    // Como já somamos o deslocamento manualmente, pegamos a hora UTC dessa nova data
    // Isso é um truque comum para exibir hora local sem brigar com o fuso do navegador do usuário
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC' 
    });
  };

  if (!data) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;

  // Lógica de Cores (Mantive a sua, só refinando para o layout)
  const weatherMain = data.current.weather[0].main;
  let bgClass = 'bg-[#57CBDB]'; // Azul padrão do layout (Clear)
  
  if (weatherMain === 'Clouds') bgClass = 'bg-gray-400';
  if (weatherMain === 'Rain' || weatherMain === 'Drizzle') bgClass = 'bg-slate-700';
  if (weatherMain === 'Thunderstorm') bgClass = 'bg-indigo-900';
  if (weatherMain === 'Snow') bgClass = 'bg-gray-200 text-gray-800';
  if (weatherMain === 'Clear') bgClass = 'bg-[#4AAEE7]'; // Azul mais vivo

  // Cor do texto baseada no fundo (se for neve, texto escuro)
  const textColor = weatherMain === 'Snow' ? 'text-gray-800' : 'text-white';
  const subTextColor = weatherMain === 'Snow' ? 'text-gray-600' : 'text-gray-100';

  return (
    <main className={`min-h-screen flex flex-col items-center justify-between p-6 ${bgClass} ${textColor} transition-colors duration-500`}>
      
      {/* 1. Header (Voltar + Nome da Cidade) */}
      <div className="w-full flex flex-col items-center relative mt-4">
        <Link href="/" className="absolute left-0 top-1 text-sm opacity-80 hover:opacity-100 hover:underline">
          &larr; Voltar
        </Link>
        
        <h1 className="text-4xl font-medium tracking-wide">{data.current.name}</h1>
        <p className={`text-xl font-light capitalize ${subTextColor} mt-1`}>
          {data.current.weather[0].description}
        </p>
      </div>

      {/* 2. Hero Section (Temp Gigante + Ícone Gigante) */}
      <div className="flex flex-col items-center my-8">
        <div className="text-[8rem] leading-none font-thin tracking-tighter">
          {Math.round(data.current.main.temp)}
          <span className="text-4xl font-light align-top mt-4 inline-block">°C</span>
        </div>
        
        {/* Ícone Grande Centralizado */}
        <div className="relative w-40 h-40 mt-[-10px]">
             <img 
               src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`} 
               alt="weather icon" 
               className="w-full h-full object-contain drop-shadow-lg"
             />
        </div>
      </div>

      {/* 3. Previsão Horária (Dawn, Morning, Afternoon, Night) */}
      <div className="w-full max-w-md">
        <div className="grid grid-cols-4 gap-2 text-center mb-8">
          {data.forecast.map((item) => (
            <div key={item.dt} className="flex flex-col items-center space-y-2">
               <span className={`text-sm ${subTextColor}`}>{item.periodName}</span>
               <img 
                 src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                 alt="icon" 
                 className="w-10 h-10"
               />
               <span className="font-semibold text-lg">{Math.round(item.main.temp)}°C</span>
            </div>
          ))}
        </div>

        {/* Linha Divisória */}
        <div className={`w-full h-px ${weatherMain === 'Snow' ? 'bg-gray-400' : 'bg-white/30'} mb-8`}></div>

        {/* 4. Rodapé de Detalhes (Wind, Sunrise, Sunset, Humidity) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          {/* Wind Speed */}
          <div className="flex flex-col">
            <span className={`text-xs ${subTextColor} mb-1`}>Wind speed</span>
            <span className="font-medium text-lg">{data.current.wind.speed} m/s</span>
          </div>

          {/* Sunrise */}
          <div className="flex flex-col">
            <span className={`text-xs ${subTextColor} mb-1`}>Sunrise</span>
            <span className="font-medium text-lg">
              {formatTime(data.current.sys.sunrise, data.current.timezone)}
            </span>
          </div>

          {/* Sunset */}
          <div className="flex flex-col">
            <span className={`text-xs ${subTextColor} mb-1`}>Sunset</span>
            <span className="font-medium text-lg">
              {formatTime(data.current.sys.sunset, data.current.timezone)}
            </span>
          </div>

          {/* Humidity */}
          <div className="flex flex-col">
            <span className={`text-xs ${subTextColor} mb-1`}>Humidity</span>
            <span className="font-medium text-lg">{data.current.main.humidity}%</span>
          </div>

        </div>
      </div>

      {/* Espaçamento final para não colar no fundo em telas pequenas */}
      <div className="h-8"></div>
    </main>
  );
}