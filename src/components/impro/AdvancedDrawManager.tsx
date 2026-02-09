'use client';

import { useState } from 'react';
import type { ImproTheme, ImproCard } from '@/lib/impro-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Hand } from 'lucide-react';

type AdvancedDrawManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allThemes: ImproTheme[];
  onDraw: (cards: ImproCard[]) => void;
};

export function AdvancedDrawManager({
  open,
  onOpenChange,
  allThemes,
  onDraw,
}: AdvancedDrawManagerProps) {
  const { toast } = useToast();
  const [randomDrawCounts, setRandomDrawCounts] = useState<Record<string, number>>({});
  const [manualSelections, setManualSelections] = useState<Record<string, boolean>>({});

  const handleRandomDrawCountChange = (themeName: string, count: number) => {
    setRandomDrawCounts(prev => ({
      ...prev,
      [themeName]: Math.max(0, count),
    }));
  };

  const handleManualSelectionChange = (cardId: string, checked: boolean) => {
    setManualSelections(prev => {
        const newSelections = {...prev};
        if (checked) {
            newSelections[cardId] = true;
        } else {
            delete newSelections[cardId];
        }
        return newSelections;
    });
  };

  const executeRandomDraw = () => {
    const cardsToDraw: ImproCard[] = [];
    let error = false;

    for (const themeName in randomDrawCounts) {
      const count = randomDrawCounts[themeName];
      if (count > 0) {
        const theme = allThemes.find(t => t.name === themeName);
        if (theme && theme.cards.length > 0) {
          const availableCards = [...theme.cards];
          if (count > availableCards.length) {
              toast({
                  variant: 'destructive',
                  title: 'Tirage impossible',
                  description: `Pas assez de cartes disponibles dans le thème "${themeName}".`,
              });
              error = true;
              break;
          }
          for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * availableCards.length);
            const selectedCard = availableCards.splice(randomIndex, 1)[0];
            cardsToDraw.push(selectedCard);
          }
        }
      }
    }

    if (!error) {
        if(cardsToDraw.length > 0) {
            onDraw(cardsToDraw);
            toast({
                title: 'Tirage réussi !',
                description: `${cardsToDraw.length} cartes ont été ajoutées au plateau.`,
            });
            onOpenChange(false);
        } else {
             toast({
                variant: 'destructive',
                title: 'Aucune carte sélectionnée',
                description: `Veuillez spécifier le nombre de cartes à tirer.`,
            });
        }
    }
  };
  
  const executeManualDraw = () => {
      const selectedIds = Object.keys(manualSelections);
      if (selectedIds.length === 0) {
          toast({
              variant: 'destructive',
              title: 'Aucune carte sélectionnée',
              description: 'Veuillez cocher les cartes que vous souhaitez ajouter.',
          });
          return;
      }
      
      const cardsToAdd: ImproCard[] = [];
      allThemes.forEach(theme => {
          theme.cards.forEach(card => {
              if (manualSelections[card.id]) {
                  cardsToAdd.push(card);
              }
          });
      });
      
      onDraw(cardsToAdd);
      toast({
          title: 'Sélection réussie !',
          description: `${cardsToAdd.length} cartes ont été ajoutées au plateau.`,
      });
      onOpenChange(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        setRandomDrawCounts({});
        setManualSelections({});
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Tirage Avancé</DialogTitle>
          <DialogDescription>
            Composez votre session en choisissant précisément les cartes à tirer.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="random" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="random">
                <Wand2 className="mr-2 h-4 w-4" />
                Tirage Aléatoire Spécifique
            </TabsTrigger>
            <TabsTrigger value="manual">
                <Hand className="mr-2 h-4 w-4" />
                Sélection Manuelle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="random" className="flex-grow flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow pr-4 -mr-4">
                <div className="space-y-4 py-4">
                    {allThemes.map(theme => (
                        <div key={theme.name} className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor={`count-${theme.name}`} className="text-lg" style={{color: theme.color}}>{theme.name}</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id={`count-${theme.name}`}
                                    type="number"
                                    min="0"
                                    className="w-24"
                                    placeholder="0"
                                    value={randomDrawCounts[theme.name] || ''}
                                    onChange={(e) => handleRandomDrawCountChange(theme.name, parseInt(e.target.value, 10) || 0)}
                                />
                                <Label htmlFor={`count-${theme.name}`}>cartes</Label>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
             <DialogFooter className="pt-4 border-t">
                <Button onClick={executeRandomDraw} size="lg">
                    <Wand2 className="mr-2"/>
                    Lancer le tirage
                </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="manual" className="flex-grow flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow">
              <Accordion type="multiple" className="w-full py-4">
                {allThemes.map(theme => (
                  <AccordionItem value={theme.name} key={theme.name}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.color, border: '1px solid #ccc' }}></div>
                           {theme.name}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
                        {theme.cards.map(card => (
                          <div key={card.id} className="flex items-center space-x-2 p-2 rounded-md border">
                            <Checkbox
                              id={card.id}
                              checked={!!manualSelections[card.id]}
                              onCheckedChange={(checked) => handleManualSelectionChange(card.id, !!checked)}
                            />
                            <Label htmlFor={card.id} className="text-sm font-normal cursor-pointer flex-grow">{card.name}</Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
             <DialogFooter className="pt-4 border-t">
                <Button onClick={executeManualDraw} size="lg">
                    <Hand className="mr-2"/>
                    Ajouter les cartes au plateau
                </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
