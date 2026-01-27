'use client';

import { useState, useEffect } from 'react';
import type { ImproCard, ImproTheme } from '@/lib/impro-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Sparkles, X } from 'lucide-react';
import { cn, getContrastingTextColor } from '@/lib/utils';
import { Button } from '../ui/button';

type CardDisplayProps = {
  drawnStack: { card: ImproCard; theme: ImproTheme }[];
  groupByTheme: boolean;
  onRemoveCard: (index: number) => void;
};

const SingleCardDisplay = ({ card, theme, totalDrawn, onRemove }: { card: ImproCard; theme: ImproTheme; totalDrawn: number, onRemove: () => void }) => {
  const defaultImageUrl = '/Cartes/défaut.png';
  const [imageUrl, setImageUrl] = useState(card.image.imageUrl);
  const [isMarked, setIsMarked] = useState(false);
  const textColor = getContrastingTextColor(theme.color);

  useEffect(() => {
    setImageUrl(card.image.imageUrl);
  }, [card.image.imageUrl]);

  const handleImageError = () => {
    setImageUrl(defaultImageUrl);
  };

  // Adjust properties based on the number of cards to display
  let containerClass = 'max-w-sm'; // For 1 card
  let titleClass = 'text-3xl';
  let themeClass = 'text-sm';
  let paddingClass = 'p-4';

  if (totalDrawn >= 2 && totalDrawn <= 3) {
    containerClass = 'max-w-xs'; // ~320px
    titleClass = 'text-2xl';
  } else if (totalDrawn >= 4 && totalDrawn <= 6) {
    containerClass = 'max-w-[280px]';
    titleClass = 'text-xl';
    paddingClass = 'p-3';
    themeClass = 'text-xs';
  } else if (totalDrawn >= 7 && totalDrawn <= 12) {
    containerClass = 'max-w-[240px]';
    titleClass = 'text-lg';
    paddingClass = 'p-3';
    themeClass = 'text-xs';
  } else if (totalDrawn > 12) {
    containerClass = 'max-w-[200px]';
    titleClass = 'text-base';
    paddingClass = 'p-2';
    themeClass = 'text-[10px]';
  }

  return (
    <div
      className={cn('relative group/card w-full shrink-0 animate-in fade-in zoom-in-95 duration-500 cursor-pointer', containerClass)}
      onClick={() => setIsMarked(!isMarked)}
    >
        <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 z-10 h-6 w-6 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"
            onClick={(e) => {
                e.stopPropagation();
                onRemove();
            }}
            aria-label="Retirer la carte"
        >
            <X className="h-4 w-4" />
        </Button>
      <Card
        className={cn(
          'overflow-hidden shadow-2xl transition-all h-full flex flex-col',
          isMarked && 'ring-4 ring-black ring-offset-2 ring-offset-background'
        )}
      >
        <CardHeader 
            className={cn('text-center', paddingClass)} 
            style={{ backgroundColor: theme.color, color: textColor }}
        >
          <CardDescription 
            className={cn('font-bold uppercase tracking-widest', themeClass)} 
            style={{ color: textColor }}
          >
            {card.themeName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <div className="aspect-[3/2] w-full bg-muted">
            <Image
              src={imageUrl}
              alt={card.image.description}
              width={600}
              height={400}
              data-ai-hint={card.image.imageHint}
              className="h-full w-full object-contain"
              onError={handleImageError}
              priority
            />
          </div>
        </CardContent>
         <div 
            className={cn('text-center', paddingClass)}
            style={{ backgroundColor: theme.color, color: textColor }}
        >
            <CardTitle className={cn('font-headline', titleClass)}>{card.name}</CardTitle>
        </div>
      </Card>
    </div>
  );
};


export function CardDisplay({ drawnStack, groupByTheme, onRemoveCard }: CardDisplayProps) {
  if (drawnStack.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
          <Sparkles className="h-16 w-16" />
          <h2 className="font-headline text-2xl font-bold">Prêt à improviser ?</h2>
          <p>
            Ajustez les paramètres et tirez une carte pour commencer votre
            prochaine aventure !
          </p>
        </div>
      </div>
    );
  }

  if (groupByTheme) {
    const groupedByTheme = drawnStack.reduce((acc, item, index) => {
      const themeName = item.theme.name;
      if (!acc[themeName]) {
        acc[themeName] = { theme: item.theme, items: [] };
      }
      acc[themeName].items.push({ card: item.card, originalIndex: index });
      return acc;
    }, {} as Record<string, { theme: ImproTheme; items: {card: ImproCard, originalIndex: number}[] }>);

    return (
      <div className="w-full flex-1 flex-col space-y-8 overflow-y-auto p-4 md:p-6">
        {Object.values(groupedByTheme).map(({ theme, items }) => (
          <section key={theme.name}>
            <h2 className="mb-4 text-2xl font-headline font-bold" style={{ color: theme.color }}>
              {theme.name}
            </h2>
            <div className="flex flex-wrap content-start items-start justify-start gap-4">
              {items.map(({ card, originalIndex }) => (
                <SingleCardDisplay
                  key={`${card.id}-${originalIndex}`}
                  card={card}
                  theme={theme}
                  totalDrawn={drawnStack.length}
                  onRemove={() => onRemoveCard(originalIndex)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-wrap content-start items-start justify-center gap-4 p-4 md:p-6">
      {drawnStack.map((item, index) => (
        <SingleCardDisplay
          key={`${item.card.id}-${index}`}
          card={item.card}
          theme={item.theme}
          totalDrawn={drawnStack.length}
          onRemove={() => onRemoveCard(index)}
        />
      ))}
    </div>
  );
}
