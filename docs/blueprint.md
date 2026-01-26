# **App Name**: ImproCards

## Core Features:

- Chargement dynamique des cartes: Charge et catégorise automatiquement les images des cartes à partir des sous-dossiers du répertoire 'Cartes'.
- Affichage des cartes: Affiche le nom du thème (nom du dossier) au dessus de l'image de la carte sélectionnée et son nom de fichier (sans l'extension) en dessous. Affiche une image par défaut pour les fichiers illisibles. Les cartes sont affichées avec un joli design, un cadre de couleur pastel autour de l'image, la couleur change selon la thématique. La couleur serait définie au hasard au premier chargement, mais il y a un fichier .json dans le dossier du thème enregistrant le code de la couleur, ce qui permettrait que l'utilisateur puisse changer manuellement cette couleur selon son envie.
- Sélection des thèmes: Permet aux utilisateurs de sélectionner les thèmes de cartes (sous-dossiers) à inclure dans le tirage au sort.
- Paramètres de tirage des cartes: Implémente des paramètres pour le comportement du tirage des cartes, tels que 'Autoriser les doublons' et 'Exclure des cartes spécifiques'.
- Gestion des joueurs: Permet la saisie manuelle des noms des joueurs et une fonctionnalité pour sélectionner aléatoirement les joueurs.

## Style Guidelines:

- Couleur primaire : Orange chaud (#FF7F50) pour évoquer la créativité et l'énergie.
- Couleur de fond : Pêche pâle (#FAF0E6) pour une sensation douce et invitante.
- Couleur d'accent : Sarcelle (#48D1CC) pour mettre en évidence les éléments interactifs et les appels à l'action.
- Police du titre : 'Playfair' (serif) pour une sensation élégante ; Police du corps : 'PT Sans' (sans-serif) pour la lisibilité.
- Utiliser des icônes simples et expressives qui se rapportent aux thèmes d'improvisation courants (par exemple, bulles de dialogue, lumières de scène).
- Disposition propre, basée sur des cartes, pour présenter clairement les thèmes et les cartes sélectionnés.
- Transitions subtiles lors du tirage des cartes, avec un effet légèrement plus spectaculaire pour les actions clés telles que le tirage de toutes les cartes.