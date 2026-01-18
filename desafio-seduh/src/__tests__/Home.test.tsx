
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

// O Next.js usa Link, às vezes precisa mockar se der erro, mas no app router costuma ir bem
// Se der erro de "Link", avise.

describe('Home Page', () => {
  it('deve renderizar o título e a instrução', () => {
    render(<Home />);
    
    expect(screen.getByText('Weather')).toBeInTheDocument();
    expect(screen.getByText('Select a city')).toBeInTheDocument();
  });

  it('deve listar todas as cidades obrigatórias', () => {
    render(<Home />);
    
    const cities = ['Dallol', 'Fairbanks', 'London', 'Recife', 'Vancouver', 'Yakutsk'];
    
    cities.forEach(city => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });
});