'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ImproCard, ImproTheme } from '@/lib/impro-types';
import { Header } from './Header';
import { CardDisplay } from './CardDisplay';
import { ControlsPanel } from './ControlsPanel';
import { useToast } from '@/hooks/use-toast';
import { ThemeManager } from './ThemeManager';
import { AdvancedDrawManager } from './AdvancedDrawManager';

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
  const [excludedCards, setExcludedCards] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const [isThemeManagerOpen, setIsThemeManagerOpen] = useState(false);
  const [isAdvancedDrawOpen, setIsAdvancedDrawOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedPlayers = localStorage.getItem('impro-app-players');
      if (savedPlayers) {
        setPlayers(JSON.parse(savedPlayers));
      }
      const savedExcludedCards = localStorage.getItem('impro-app-excluded-cards');
      if (savedExcludedCards) {
        setExcludedCards(JSON.parse(savedExcludedCards));
      }
    } catch (e) {
      console.error('Could not load data from localStorage.', e);
    }
  }, []);

  const handlePlayersChange = useCallback((newPlayers: string[]) => {
    setPlayers(newPlayers);
    try {
      localStorage.setItem('impro-app-players', JSON.stringify(newPlayers));
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder les joueurs.',
      });
    }
  }, [toast]);
  
  const handleExcludedCardsChange = useCallback((newExcludedConfig: Record<string, string[]>) => {
    setExcludedCards(newExcludedConfig);
    try {
      localStorage.setItem('impro-app-excluded-cards', JSON.stringify(newExcludedConfig));
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder la configuration des thèmes.',
      });
    }
  }, [toast]);

  const handleThemeToggle = useCallback((themeName: string) => {
    setSelectedThemes((prev) =>
      prev.includes(themeName)
        ? prev.filter((t) => t !== themeName)
        : [...prev, themeName]
    );
  }, []);

  const handleSelectAllThemes = useCallback((checked: boolean) => {
    setSelectedThemes(checked ? allThemes.map(t => t.name) : []);
  }, [allThemes]);

  const handleThemesUpdate = useCallback(() => {
    router.refresh();
  }, [router]);

  const cardPool = useMemo(() => {
    let pool = allThemes
      .filter((theme) => selectedThemes.includes(theme.name))
      .flatMap((theme) => {
        const excludedForTheme = excludedCards[theme.name] || [];
        return (theme.cards || []).filter(card => {
            const fileName = card.image.imageUrl.split('/').pop();
            return fileName ? !excludedForTheme.includes(fileName) : true;
        });
      });
    
    if (!allowDuplicates) {
      pool = pool.filter((card) => !drawnCards.has(card.id));
    }
    
    return pool;
  }, [selectedThemes, allowDuplicates, drawnCards, allThemes, excludedCards]);

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
          description: 'Veuillez sélectionner au moins un thème ou vérifier les cartes exclues.',
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

  const handleAdvancedDraw = useCallback((cardsToDraw: ImproCard[]) => {
    const newDrawnItems: DrawnItem[] = [];
    const newDrawnCardIds = new Set<string>();
    
    cardsToDraw.forEach(card => {
        const theme = allThemes.find(t => t.name === card.themeName);
        if (theme) {
            newDrawnItems.push({ card, theme });
            if (!allowDuplicates) {
                newDrawnCardIds.add(card.id);
            }
        }
    });

    setDrawnStack(prev => [...prev, ...newDrawnItems]);

    if (!allowDuplicates) {
      setDrawnCards(prev => new Set([...prev, ...newDrawnCardIds]));
    }
  }, [allThemes, allowDuplicates]);

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

  const areAllThemesSelected = allThemes.length > 0 && selectedThemes.length === allThemes.length;
  const isAnyThemeSelected = selectedThemes.length > 0;
  const themesCheckboxState = areAllThemesSelected ? true : (isAnyThemeSelected ? 'indeterminate' : false);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col-reverse items-center md:flex-row md:items-start">
        <ControlsPanel
          themes={allThemes}
          selectedThemes={selectedThemes}
          onThemeToggle={handleThemeToggle}
          onSelectAllThemes={handleSelectAllThemes}
          themesCheckboxState={themesCheckboxState}
          allowDuplicates={allowDuplicates}
          onAllowDuplicatesChange={setAllowDuplicates}
          groupByTheme={groupByTheme}
          onGroupByThemeChange={setGroupByTheme}
          players={players}
          onPlayersChange={handlePlayersChange}
          onDrawCard={handleDrawCard}
          onReset={handleReset}
          onOpenThemeManager={() => setIsThemeManagerOpen(true)}
          onOpenAdvancedDraw={() => setIsAdvancedDrawOpen(true)}
        />
        <CardDisplay drawnStack={drawnStack} groupByTheme={groupByTheme} onRemoveCard={handleRemoveCard} />
      </main>
      <ThemeManager
        open={isThemeManagerOpen}
        onOpenChange={setIsThemeManagerOpen}
        onThemesUpdate={handleThemesUpdate}
        excludedCards={excludedCards}
        onExcludedCardsChange={handleExcludedCardsChange}
      />
      <AdvancedDrawManager
        open={isAdvancedDrawOpen}
        onOpenChange={setIsAdvancedDrawOpen}
        allThemes={allThemes}
        onDraw={handleAdvancedDraw}
      />
    </div>
  );
}
