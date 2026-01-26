'use client';

import { useState, useEffect } from 'react';
import type { ImproCard, ImproTheme } from '@/lib/impro-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

type CardDisplayProps = {
  drawnStack: { card: ImproCard; theme: ImproTheme }[];
};

const SingleCardDisplay = ({ card, theme }: { card: ImproCard; theme: ImproTheme }) => {
  const defaultImageUrl = '/Cartes/défaut.png';
  const [imageUrl, setImageUrl] = useState(card.image.imageUrl);

  useEffect(() => {
    setImageUrl(card.image.imageUrl);
  }, [card.image.imageUrl]);

  const handleImageError = () => {
    setImageUrl(defaultImageUrl);
  };

  return (
    <div className="w-full max-w-sm shrink-0 animate-in fade-in zoom-in-95 duration-500">
      <Card
        className="overflow-hidden border-4 shadow-2xl transition-all"
        style={{ borderColor: theme.color }}
      >
        <CardHeader className="p-4 text-center">
          <CardDescription className="font-bold uppercase tracking-widest" style={{ color: theme.color }}>
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
          <div className="p-4 text-center">
            <CardTitle className="font-headline text-3xl">{card.name}</CardTitle>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export function CardDisplay({ drawnStack }: CardDisplayProps) {
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

  return (
    <div className="flex flex-1 flex-wrap content-start items-start justify-center gap-6 p-4 md:p-8">
      {drawnStack.map((item, index) => (
        <SingleCardDisplay
          key={`${item.card.id}-${index}`}
          card={item.card}
          theme={item.theme}
        />
      ))}
    </div>
  );
}
