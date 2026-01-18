// src/services/api.ts

// 👇 Substitua o texto abaixo pela sua chave (Mantenha as aspas!)
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY; 
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getCityData = async (cityName: string) => {
  try {
    // Montamos a URL na mão para ter certeza que o appid vai entrar
    const currentUrl = `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=pt_br`;
    const forecastUrl = `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=pt_br`;

    console.log("Vai buscar:", currentUrl); // <--- Isso vai mostrar a URL completa no console

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok) throw new Error(`Erro API Current: ${currentRes.status}`);
    if (!forecastRes.ok) throw new Error(`Erro API Forecast: ${forecastRes.status}`);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    return {
      current: currentData,
      forecast: forecastData
    };

  } catch (error) {
    console.error("Erro fatal:", error);
    return null;
  }
};