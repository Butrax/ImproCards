'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ImproCard, ImproTheme } from '@/lib/impro-types';
import { Header } from './Header';
import { CardDisplay } from './CardDisplay';
import { ControlsPanel } from './ControlsPanel';
import { useToast } from '@/hooks/use-toast';
import { ThemeManager } from './ThemeManager';

type DrawnItem = {
  card: ImproCard;
  theme: ImproTheme;
};

export function ImproApp({ allThemes }: { allThemes: ImproTheme[] }) {
  const [drawnStack, setDrawnStack] = useState<DrawnItem[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(
    allThemes.map((t) => t.name)
  );
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [groupByTheme, setGroupByTheme] = useState(false);
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
          description: 'Réinitialisation du paquet. Tirez à nouveau !',
        });
        setDrawnCards(new Set());
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
    const newTheme = allThemes.find(t => t.name === newCard.themeName);

    if (!newTheme) {
      toast({
        title: 'Erreur',
        description: `Thème introuvable pour la carte "${newCard.name}".`,
        variant: 'destructive',
      });
      return;
    }
    
    setDrawnStack(prev => [...prev, { card: newCard, theme: newTheme }]);

    if (!allowDuplicates) {
      setDrawnCards(prev => new Set(prev).add(newCard.id));
    }
  };

  const handleReset = useCallback(() => {
    setDrawnStack([]);
    setDrawnCards(new Set());
    toast({
      title: 'Plateau réinitialisé',
      description: 'Toutes les cartes tirées ont été retirées.',
    });
  }, [toast]);
  
  const handleRemoveCard = useCallback((indexToRemove: number) => {
    const removedItem = drawnStack[indexToRemove];
    if (!allowDuplicates && removedItem) {
        setDrawnCards(prev => {
            const newSet = new Set(prev);
            newSet.delete(removedItem.card.id);
            return newSet;
        });
    }
    setDrawnStack(prev => prev.filter((_, index) => index !== indexToRemove));
  }, [drawnStack, allowDuplicates]);

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
          groupByTheme={groupByTheme}
          onGroupByThemeChange={setGroupByTheme}
          players={players}
          onPlayersChange={setPlayers}
          onDrawCard={handleDrawCard}
          onReset={handleReset}
          onOpenThemeManager={() => setIsThemeManagerOpen(true)}
        />
        <CardDisplay drawnStack={drawnStack} groupByTheme={groupByTheme} onRemoveCard={handleRemoveCard} />
      </main>
      <ThemeManager
        open={isThemeManagerOpen}
        onOpenChange={setIsThemeManagerOpen}
        onThemesUpdate={handleThemesUpdate}
      />
    </div>
  );
}
