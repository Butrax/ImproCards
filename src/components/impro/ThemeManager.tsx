'use client';

import { useEffect, useState } from 'react';
import type { ManagedTheme } from '@/lib/impro-types';
import { getThemesForManager } from '@/lib/theme-actions';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowLeft } from 'lucide-react';

type ThemeManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThemesUpdate: () => void;
  excludedCards: Record<string, string[]>;
  onExcludedCardsChange: (config: Record<string, string[]>) => void;
};

export function ThemeManager({
  open,
  onOpenChange,
  onThemesUpdate,
  excludedCards,
  onExcludedCardsChange,
}: ThemeManagerProps) {
  const [themes, setThemes] = useState<ManagedTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ManagedTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setSelectedTheme(null);
      getThemesForManager()
        .then(setThemes)
        .finally(() => setIsLoading(false));
    }
  }, [open]);

  const handleSelectTheme = (theme: ManagedTheme) => {
    setSelectedTheme(theme);
  };

  const handleBackToList = () => {
    setSelectedTheme(null);
  };

  const handleCardToggle = (cardFileName: string) => {
    if (selectedTheme) {
      const themeName = selectedTheme.name;
      const currentExcluded = excludedCards[themeName] || [];
      const newExcluded = currentExcluded.includes(cardFileName)
        ? currentExcluded.filter((c) => c !== cardFileName)
        : [...currentExcluded, cardFileName];
      onExcludedCardsChange({ ...excludedCards, [themeName]: newExcluded });
    }
  };
  
  const handleSheetOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      onThemesUpdate();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <SheetHeader className="border-b px-6 pb-4">
            <SheetTitle>Chargement des thèmes</SheetTitle>
            <SheetDescription>
              Veuillez patienter pendant que nous chargeons vos thèmes.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </>
      );
    }

    if (selectedTheme) {
      const themeExcludedCards = excludedCards[selectedTheme.name] || [];
      return (
        <>
          <SheetHeader className="border-b px-6 pb-4">
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackToList}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <SheetTitle>Gérer "{selectedTheme.name}"</SheetTitle>
                    <SheetDescription>
                        Sélectionnez les cartes à inclure.
                    </SheetDescription>
                </div>
            </div>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6">
            <div className="py-6 space-y-6">
                <div className="space-y-2">
                    <Label>Cartes</Label>
                    <div className="space-y-2 rounded-md border p-4">
                        {selectedTheme.allCards.map((cardFile) => (
                            <div key={cardFile} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`card-${cardFile}`}
                                    checked={!themeExcludedCards.includes(cardFile)}
                                    onCheckedChange={() => handleCardToggle(cardFile)}
                                />
                                <Label htmlFor={`card-${cardFile}`} className="font-normal text-sm">
                                    {cardFile.replace(/\.(jpeg|jpg|png|gif|bmp)$/i, '').replace(/[-_]/g, ' ')}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </ScrollArea>
        </>
      );
    }
    
    return (
        <>
            <SheetHeader className="border-b px-6 pb-4">
                <SheetTitle>Gérer les thèmes</SheetTitle>
                <SheetDescription>
                Cliquez sur un thème pour le configurer.
                </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-2">
                    {themes.map((theme) => (
                        <Button
                        key={theme.name}
                        variant="ghost"
                        className="w-full justify-start text-base h-12"
                        onClick={() => handleSelectTheme(theme)}
                        >
                            <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: theme.config.color || 'transparent', border: '1px solid #ccc' }}></div>
                            {theme.name}
                        </Button>
                    ))}
                    {themes.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">Aucun thème trouvé dans `public/Cartes`.</p>
                    )}
                </div>
            </ScrollArea>
        </>
    )
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
