// src/app/page.tsx
import Link from "next/link";
import Image from "next/image"; // Vamos usar o componente otimizado do Next

// Lista exata de cidades pedida no teste
const CITIES = [
  { name: 'Dallol', country: 'ET' },
  { name: 'Fairbanks', country: 'US' },
  { name: 'London', country: 'GB' },
  { name: 'Recife', country: 'BR' },
  { name: 'Vancouver', country: 'CA' },
  { name: 'Yakutsk', country: 'RU' }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      
      {/* 1. Título e Subtítulo */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-normal mb-2">Weather</h1>
        <p className="text-gray-400 text-lg">Select a city</p>
      </div>

      {/* 2. Ícone do Globo (Puxando do seu arquivo public/globe.svg) */}
      <div className="mb-20 relative w-40 h-40">
        {/* Se o nome do arquivo for diferente de globe.svg, ajuste aqui */}
        <Image 
          src="/globe.svg" 
          alt="Globe Icon" 
          fill
          className="object-contain invert" // 'invert' deixa branco se o SVG for preto
          priority
        />
      </div>

      {/* 3. Grid de Cidades (3 colunas igual na imagem) */}
      <nav className="grid grid-cols-3 gap-x-12 gap-y-8 text-center max-w-2xl">
        {CITIES.map((city) => (
          <Link 
            key={city.name} 
            href={`/city/${city.name}`}
            className="group"
          >
            <span className="text-gray-300 text-xl font-light hover:text-white transition-colors cursor-pointer block">
              {/* O Figma mostra Madrid, mas o teste pede Dallol, então mantemos Dallol */}
              {city.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Crédito/Rodapé (Opcional, só pra dar um charme) */}
      <footer className="absolute bottom-4 text-gray-700 text-xs">
        Desafio Front-end
      </footer>
    </main>
  );
}