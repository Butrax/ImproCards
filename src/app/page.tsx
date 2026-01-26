import { ImproApp } from '@/components/impro/ImproApp';
import { generateThemes } from '@/lib/impro-data';

export default function Home() {
  const themes = generateThemes();
  return <ImproApp allThemes={themes} />;
}
