'use client';

import type { ImproTheme } from '@/lib/impro-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Drama, Settings, Trash2, Users, Wand2, Shuffle, Plus } from 'lucide-react';
import { useState } from 'react';

type ControlsPanelProps = {
  themes: ImproTheme[];
  selectedThemes: string[];
  onThemeToggle: (themeName: string) => void;
  allowDuplicates: boolean;
  onAllowDuplicatesChange: (checked: boolean) => void;
  players: string[];
  onPlayersChange: (players: string[]) => void;
  onDrawCard: () => void;
};

export function ControlsPanel({
  themes,
  selectedThemes,
  onThemeToggle,
  allowDuplicates,
  onAllowDuplicatesChange,
  players,
  onPlayersChange,
  onDrawCard,
}: ControlsPanelProps) {
  const [newPlayer, setNewPlayer] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleAddPlayer = () => {
    if (newPlayer.trim() && !players.includes(newPlayer.trim())) {
      onPlayersChange([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const handleRemovePlayer = (playerToRemove: string) => {
    onPlayersChange(players.filter((p) => p !== playerToRemove));
  };

  const handleSelectRandomPlayer = () => {
    if (players.length > 0) {
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      setSelectedPlayer(randomPlayer);
    }
  };

  return (
    <Card className="w-full md:w-96 lg:w-[450px] m-4 md:m-0 md:mr-4">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Panneau de Contrôle</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Accordion type="multiple" defaultValue={['themes', 'players']} className="w-full">
          <AccordionItem value="themes">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Drama className="h-5 w-5" />
                Thèmes
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {themes.map((theme) => (
                <div key={theme.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={theme.name}
                    checked={selectedThemes.includes(theme.name)}
                    onCheckedChange={() => onThemeToggle(theme.name)}
                    style={{ '--accent-color': theme.color } as React.CSSProperties}
                  />
                  <Label htmlFor={theme.name} className="text-base">{theme.name}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="players">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Joueurs
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Nom du joueur"
                  value={newPlayer}
                  onChange={(e) => setNewPlayer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                />
                <Button type="button" size="icon" onClick={handleAddPlayer}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {players.map((player) => (
                  <li key={player} className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                    <span>{player}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemovePlayer(player)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              {players.length > 0 && (
                <div className="text-center">
                    <Button variant="secondary" onClick={handleSelectRandomPlayer}>
                        <Shuffle className="mr-2 h-4 w-4"/>
                        Choisir un joueur au hasard
                    </Button>
                    {selectedPlayer && (
                        <p className="mt-2 text-lg font-bold text-primary animate-in fade-in">
                            {selectedPlayer} !
                        </p>
                    )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="settings">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres du tirage
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pt-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="allow-duplicates" className="text-base">Autoriser les doublons</Label>
                <Switch
                  id="allow-duplicates"
                  checked={allowDuplicates}
                  onCheckedChange={onAllowDuplicatesChange}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button size="lg" className="w-full text-lg" onClick={onDrawCard}>
          <Wand2 className="mr-2 h-5 w-5" />
          Tirer une carte !
        </Button>
      </CardContent>
    </Card>
  );
}
