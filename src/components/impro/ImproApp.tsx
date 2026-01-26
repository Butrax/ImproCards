'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ImproCard, ImproTheme } from '@/lib/impro-types';
import { Header } from './Header';
import { CardDisplay } from './CardDisplay';
import { ControlsPanel } from './ControlsPanel';
import { useToast } from '@/hooks/use-toast';
import { ThemeManager } from './ThemeManager';

export function ImproApp({ allThemes }: { allThemes: ImproTheme[] }) {
  const [currentCard, setCurrentCard] = useState<ImproCard | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ImproTheme | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(
    allThemes.map((t) => t.name)
  );
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [drawnCards, setDrawnCards] = useState<Set<string>>(new Set());
  const [players, setPlayers] = useState<string[]>([]);
  const { toast } = useToast();
  const [isThemeManagerOpen, setIsThemeManagerOpen] = useState(false);
  const router = useRouter();

  const handleThemeToggle = useCallback((themeName: string) => {
    setSelectedThemes((prev) =>
      prev.includes(themeName)
        ? prev.filter((t) => t !== themeName)
        : [...prev, themeName]
    );
  }, []);

  const handleThemesUpdate = useCallback(() => {
    router.refresh();
  }, [router]);

  const cardPool = useMemo(() => {
    let pool = allThemes
      .filter((theme) => selectedThemes.includes(theme.name))
      .flatMap((theme) => theme.cards);
    
    if (!allowDuplicates) {
      pool = pool.filter((card) => !drawnCards.has(card.id));
    }
    
    return pool;
  }, [selectedThemes, allowDuplicates, drawnCards, allThemes]);

  const handleDrawCard = () => {
    if (cardPool.length === 0) {
      if (!allowDuplicates && drawnCards.size > 0) {
        toast({
          title: 'Toutes les cartes ont été tirées !',
          description: 'Réinitialisation du paquet de cartes.',
        });
        setDrawnCards(new Set());
        // We need to re-run with the reset deck
        const freshPool = allThemes
          .filter((theme) => selectedThemes.includes(theme.name))
          .flatMap((theme) => theme.cards);
        
        if (freshPool.length === 0) {
            toast({
                title: 'Aucune carte à tirer',
                description: 'Veuillez sélectionner au moins un thème.',
                variant: 'destructive',
            });
            return;
        }

        const newCard = freshPool[Math.floor(Math.random() * freshPool.length)];
        const newTheme = allThemes.find(t => t.name === newCard.themeName) || null;
        setCurrentCard(newCard);
        setCurrentTheme(newTheme);
        setDrawnCards(new Set([newCard.id]));

      } else {
         toast({
          title: 'Aucune carte à tirer',
          description: 'Veuillez sélectionner au moins un thème.',
          variant: 'destructive',
        });
      }
      return;
    }

    const newCard = cardPool[Math.floor(Math.random() * cardPool.length)];
    const newTheme = allThemes.find(t => t.name === newCard.themeName) || null;
    
    setCurrentCard(newCard);
    setCurrentTheme(newTheme);

    if (!allowDuplicates) {
      setDrawnCards(prev => new Set(prev).add(newCard.id));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col-reverse items-center md:flex-row md:items-start">
        <ControlsPanel
          themes={allThemes}
          selectedThemes={selectedThemes}
          onThemeToggle={handleThemeToggle}
          allowDuplicates={allowDuplicates}
          onAllowDuplicatesChange={setAllowDuplicates}
          players={players}
          onPlayersChange={setPlayers}
          onDrawCard={handleDrawCard}
          onOpenThemeManager={() => setIsThemeManagerOpen(true)}
        />
        <CardDisplay card={currentCard} theme={currentTheme} />
      </main>
      <ThemeManager
        open={isThemeManagerOpen}
        onOpenChange={setIsThemeManagerOpen}
        onThemesUpdate={handleThemesUpdate}
      />
    </div>
  );
}
