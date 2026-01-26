import { Theater } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b bg-card p-4">
      <div className="container mx-auto flex items-center gap-4">
        <Theater className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-foreground">
          ImproCards
        </h1>
      </div>
    </header>
  );
}
