'use client';

import type { ImproTheme } from '@/lib/impro-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Drama, Settings, Trash2, Users, Wand2, Shuffle, Plus, Settings2, RotateCcw, FolderKanban, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

type ControlsPanelProps = {
  themes: ImproTheme[];
  selectedThemes: string[];
  onThemeToggle: (themeName: string) => void;
  onSelectAllThemes: (checked: boolean) => void;
  themesCheckboxState: boolean | 'indeterminate';
  allowDuplicates: boolean;
  onAllowDuplicatesChange: (checked: boolean) => void;
  groupByTheme: boolean;
  onGroupByThemeChange: (checked: boolean) => void;
  players: string[];
  onPlayersChange: (players: string[]) => void;
  onDrawCard: () => void;
  onReset: () => void;
  onOpenThemeManager: () => void;
  onOpenAdvancedDraw: () => void;
};

export function ControlsPanel({
  themes,
  selectedThemes,
  onThemeToggle,
  onSelectAllThemes,
  themesCheckboxState,
  allowDuplicates,
  onAllowDuplicatesChange,
  groupByTheme,
  onGroupByThemeChange,
  players,
  onPlayersChange,
  onDrawCard,
  onReset,
  onOpenThemeManager,
  onOpenAdvancedDraw,
}: ControlsPanelProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [newPlayer, setNewPlayer] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState(2);
  const [generatedTeams, setGeneratedTeams] = useState<string[][]>([]);
  const [allowPlayerDuplicates, setAllowPlayerDuplicates] = useState(true);
  const [drawnPlayers, setDrawnPlayers] = useState<string[]>([]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);


  const resetPlayerSelections = () => {
    setSelectedPlayer(null);
    setGeneratedTeams([]);
  };

  const handleAddPlayer = () => {
    if (newPlayer.trim() && !players.includes(newPlayer.trim())) {
      onPlayersChange([...players, newPlayer.trim()]);
      setNewPlayer('');
      resetPlayerSelections();
      setDrawnPlayers([]);
    }
  };

  const handleRemovePlayer = (playerToRemove: string) => {
    onPlayersChange(players.filter((p) => p !== playerToRemove));
    resetPlayerSelections();
    setDrawnPlayers([]);
  };

  const handleAllowPlayerDuplicatesChange = (checked: boolean) => {
    setAllowPlayerDuplicates(checked);
    if (checked) {
        setDrawnPlayers([]);
    }
  }

  const handleSelectRandomPlayer = () => {
    resetPlayerSelections();
    if (players.length === 0) return;

    let availablePlayers = players;
    if (!allowPlayerDuplicates) {
        availablePlayers = players.filter(p => !drawnPlayers.includes(p));
    }

    if (availablePlayers.length === 0) {
        setDrawnPlayers([]);
        setSelectedPlayer(null);
        return;
    }

    const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    setSelectedPlayer(randomPlayer);

    if (!allowPlayerDuplicates) {
        setDrawnPlayers(prev => [...prev, randomPlayer]);
    }
  };

  const handleGenerateTeams = () => {
    if (players.length < 2 || teamSize < 2) {
      setGeneratedTeams([]);
      return;
    }
    resetPlayerSelections();

    const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    const newTeams: string[][] = [];

    while (shuffledPlayers.length > 0) {
      newTeams.push(shuffledPlayers.splice(0, teamSize));
    }

    const lastTeam = newTeams[newTeams.length - 1];
    if (lastTeam && lastTeam.length < teamSize) {
      const needed = teamSize - lastTeam.length;
      const candidates = players.filter(p => !lastTeam.includes(p));
      const shuffledCandidates = candidates.sort(() => 0.5 - Math.random());
      
      const completion = shuffledCandidates.slice(0, needed);
      lastTeam.push(...completion);
    }

    setGeneratedTeams(newTeams);
  };
  
  if (!isMounted) {
    return (
      <Card className="w-full md:w-96 lg:w-[450px] m-4 md:m-0 md:mr-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl">Panneau de Contrôle</CardTitle>
          <Button variant="ghost" size="icon" disabled>
              <Settings2 className="h-6 w-6" />
              <span className="sr-only">Gérer les thèmes</span>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <div className="space-y-1">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full md:w-96 lg:w-[450px] m-4 md:m-0 md:mr-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">Panneau de Contrôle</CardTitle>
        <Button variant="ghost" size="icon" onClick={onOpenThemeManager}>
            <Settings2 className="h-6 w-6" />
            <span className="sr-only">Gérer les thèmes</span>
        </Button>
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
               <div className="flex items-center space-x-2 border-b pb-2 mb-2">
                <Checkbox
                  id="select-all-themes"
                  checked={themesCheckboxState}
                  onCheckedChange={onSelectAllThemes as (checked: boolean) => void}
                />
                <Label htmlFor="select-all-themes" className="text-base font-medium">Tout sélectionner</Label>
              </div>
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
                <>
                  <Separator className="my-2" />
                  <div className="space-y-4 text-center">
                    <div>
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
                    <div className="flex items-center justify-center space-x-2 rounded-lg border p-3">
                        <Label htmlFor="allow-player-duplicates" className="text-sm flex-grow-0">Tirages multiples</Label>
                        <Switch
                          id="allow-player-duplicates"
                          checked={allowPlayerDuplicates}
                          onCheckedChange={handleAllowPlayerDuplicatesChange}
                        />
                    </div>
                  </div>
                  
                  <Separator className="my-2" />

                  <div className="space-y-4">
                      <h4 className="font-medium text-center">Générer des équipes</h4>
                      <div className="flex items-center justify-center gap-2">
                          <Label htmlFor="team-size">Taille</Label>
                          <Input
                              id="team-size"
                              type="number"
                              min="2"
                              className="w-20"
                              value={teamSize}
                              onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 2)}
                          />
                          <Button onClick={handleGenerateTeams} disabled={players.length < 2}>
                              <Users className="mr-2 h-4 w-4" />
                              Générer
                          </Button>
                      </div>

                      {generatedTeams.length > 0 && (
                          <div className="space-y-2 pt-2">
                              <ul className="space-y-2">
                                  {generatedTeams.map((team, index) => (
                                      <li key={index} className="flex items-center justify-center gap-2 rounded-md bg-muted/50 p-2 text-sm">
                                          <span className="font-bold">Équipe {index + 1}:</span>
                                          <span>{team.join(', ')}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
                </>
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
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="group-by-theme" className="flex items-center gap-2 text-base">
                  <FolderKanban className="h-5 w-5" />
                  Regrouper par thème
                </Label>
                <Switch
                  id="group-by-theme"
                  checked={groupByTheme}
                  onCheckedChange={onGroupByThemeChange}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button size="lg" className="w-full text-lg" onClick={onDrawCard}>
          <Wand2 className="mr-2 h-5 w-5" />
          Tirer une carte !
        </Button>
        <Button variant="secondary" className="w-full" onClick={onOpenAdvancedDraw}>
          <Target className="mr-2 h-4 w-4" />
          Tirage Avancé
        </Button>
         <Button variant="outline" className="w-full" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Réinitialiser le plateau
        </Button>
      </CardContent>
    </Card>
  );
}
