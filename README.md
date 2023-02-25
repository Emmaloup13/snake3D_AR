# Snake 3D Augmented Reality

## Principe

* Placer le cube de jeu dans l'espace en cliquant sur votre écran
* Pour déplacer le serpent, rien de plus simple :
 - appuyez dans la zone droite de votre écran pour qu'il aille à droite
 - appuyez dans la zone gauche de votre écran pour qu'il aille à gauche
 - appuyez dans la zone basse de votre écran pour qu'il aille en bas
 - appuyez dans la zone haute de votre écran pour qu'il aille en haut
 
* Déplacez vous autour du cube pour le voir sous tous ses angles !
 
 ## Quelques problèmes non résolus
 
 * Le déplacement est adaptatif seulement sur la face d'origine (celle que vous avez en face de vous au début) et la face droite du cube, j'ai laissé le code en commentaires pour les deux autres faces car cela ne fonctionne pas très bien.
 * Le jeu n'est pas fonctionnel car "la nourriture" ne disparaît plus lorsque le serpent la mange. Cela est dû au fait que j'ajoute ces objets au mesh du cube de jeu, et je n'arrive pas à les enlever.
 * Je n'ai pas eu le temps de faire apparaitre le score dans l'environnement AR.
 * Lorsque l'on perd, il faut réinitialiser le jeu à la main.
 
## Pour le lancer

Vous pouvez utiliser ngrok puis un qr code pour lancer le jeu

## Démo

https://user-images.githubusercontent.com/116184717/221367671-85b8bdcc-fe0c-4e94-9df2-4c3633fdba88.mp4

