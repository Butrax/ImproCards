'use client';

import { useEffect, useState, useTransition } from 'react';
import type { ManagedTheme, ThemeConfig } from '@/lib/impro-types';
import { getThemesForManager, saveThemeConfig } from '@/lib/theme-actions';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

type ThemeManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThemesUpdate: () => void;
};

export function ThemeManager({
  open,
  onOpenChange,
  onThemesUpdate,
}: ThemeManagerProps) {
  const [themes, setThemes] = useState<ManagedTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ManagedTheme | null>(null);
  const [editedConfig, setEditedConfig] = useState<ThemeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      getThemesForManager()
        .then(setThemes)
        .finally(() => setIsLoading(false));
    }
  }, [open]);

  const handleSelectTheme = (theme: ManagedTheme) => {
    setSelectedTheme(theme);
    setEditedConfig(JSON.parse(JSON.stringify(theme.config))); // Deep copy
  };

  const handleBackToList = () => {
    setSelectedTheme(null);
    setEditedConfig(null);
  };

  const handleColorChange = (color: string) => {
    if (editedConfig) {
      setEditedConfig({ ...editedConfig, color });
    }
  };

  const handleCardToggle = (cardFileName: string) => {
    if (editedConfig) {
      const currentExcluded = editedConfig.excludedCards || [];
      const newExcluded = currentExcluded.includes(cardFileName)
        ? currentExcluded.filter((c) => c !== cardFileName)
        : [...currentExcluded, cardFileName];
      setEditedConfig({ ...editedConfig, excludedCards: newExcluded });
    }
  };

  const handleSave = () => {
    if (!selectedTheme || !editedConfig) return;

    startSaving(async () => {
      const result = await saveThemeConfig(selectedTheme.name, editedConfig);
      if (result.success) {
        toast({
          title: 'Thème sauvegardé',
          description: `La configuration pour "${selectedTheme.name}" a été mise à jour.`,
        });
        onThemesUpdate();
        handleBackToList();
        // Refetch themes to have the latest state
        getThemesForManager().then(setThemes);
      } else {
        toast({
          title: 'Erreur',
          description: result.error || 'Impossible de sauvegarder le thème.',
          variant: 'destructive',
        });
      }
    });
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (selectedTheme && editedConfig) {
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
                        Choisissez une couleur et sélectionnez les cartes à inclure.
                    </SheetDescription>
                </div>
            </div>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6">
            <div className="py-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="color-picker">Couleur du thème</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="color-picker"
                            type="color"
                            className="h-10 w-16 p-1"
                            value={editedConfig.color || '#ffffff'}
                            onChange={(e) => handleColorChange(e.target.value)}
                        />
                        <Input 
                            type="text"
                            className="h-10 flex-1"
                            value={editedConfig.color || ''}
                            onChange={(e) => handleColorChange(e.target.value)}
                            placeholder="ex: hsl(50, 85%, 80%)"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Cartes</Label>
                    <div className="space-y-2 rounded-md border p-4">
                        {selectedTheme.allCards.map((cardFile) => (
                            <div key={cardFile} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`card-${cardFile}`}
                                    checked={!editedConfig.excludedCards?.includes(cardFile)}
                                    onCheckedChange={() => handleCardToggle(cardFile)}
                                />
                                <Label htmlFor={`card-${cardFile}`} className="font-normal text-sm">
                                    {cardFile.replace(/\.(jpeg|jpg|png)$/i, '').replace(/[-_]/g, ' ')}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </ScrollArea>
           <SheetFooter className="border-t px-6 py-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder
            </Button>
          </SheetFooter>
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
