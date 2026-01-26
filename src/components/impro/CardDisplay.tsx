'use client';

import { useState, useEffect } from 'react';
import type { ImproCard, ImproTheme } from '@/lib/impro-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type CardDisplayProps = {
  drawnStack: { card: ImproCard; theme: ImproTheme }[];
  groupByTheme: boolean;
};

const SingleCardDisplay = ({ card, theme, totalDrawn }: { card: ImproCard; theme: ImproTheme; totalDrawn: number }) => {
  const defaultImageUrl = '/Cartes/défaut.png';
  const [imageUrl, setImageUrl] = useState(card.image.imageUrl);

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
  let borderClass = 'border-4';

  if (totalDrawn >= 2 && totalDrawn <= 3) {
    containerClass = 'max-w-xs'; // ~320px
    titleClass = 'text-2xl';
  } else if (totalDrawn >= 4 && totalDrawn <= 6) {
    containerClass = 'max-w-[280px]';
    titleClass = 'text-xl';
    paddingClass = 'p-3';
    borderClass = 'border-2';
    themeClass = 'text-xs';
  } else if (totalDrawn >= 7 && totalDrawn <= 12) {
    containerClass = 'max-w-[240px]';
    titleClass = 'text-lg';
    paddingClass = 'p-3';
    borderClass = 'border-2';
    themeClass = 'text-xs';
  } else if (totalDrawn > 12) {
    containerClass = 'max-w-[200px]';
    titleClass = 'text-base';
    paddingClass = 'p-2';
    borderClass = 'border-2';
    themeClass = 'text-[10px]';
  }

  return (
    <div className={cn('w-full shrink-0 animate-in fade-in zoom-in-95 duration-500', containerClass)}>
      <Card
        className={cn('overflow-hidden shadow-2xl transition-all', borderClass)}
        style={{ borderColor: theme.color }}
      >
        <CardHeader className={cn('text-center', paddingClass)}>
          <CardDescription className={cn('font-bold uppercase tracking-widest', themeClass)} style={{ color: theme.color }}>
            {card.themeName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
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
          <div className={cn('text-center', paddingClass)}>
            <CardTitle className={cn('font-headline', titleClass)}>{card.name}</CardTitle>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export function CardDisplay({ drawnStack, groupByTheme }: CardDisplayProps) {
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
    const groupedByTheme = drawnStack.reduce((acc, item) => {
      const themeName = item.theme.name;
      if (!acc[themeName]) {
        acc[themeName] = { theme: item.theme, cards: [] };
      }
      acc[themeName].cards.push(item.card);
      return acc;
    }, {} as Record<string, { theme: ImproTheme; cards: ImproCard[] }>);

    return (
      <div className="w-full flex-1 flex-col space-y-8 overflow-y-auto p-4 md:p-6">
        {Object.values(groupedByTheme).map(({ theme, cards }) => (
          <section key={theme.name}>
            <h2 className="mb-4 text-2xl font-headline font-bold" style={{ color: theme.color }}>
              {theme.name}
            </h2>
            <div className="flex flex-wrap content-start items-start justify-start gap-4">
              {cards.map((card, index) => (
                <SingleCardDisplay
                  key={`${card.id}-${index}`}
                  card={card}
                  theme={theme}
                  totalDrawn={drawnStack.length}
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
        />
      ))}
    </div>
  );
}
