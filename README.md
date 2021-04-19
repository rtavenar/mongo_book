# MongoDB : Notes de cours

Ce document compile des notes pour un cours de MongoDB dispensé en Master
Mathématiques Appliquées, Statistiques (parcours _Data Science_), à
l'Université de Rennes 2.

## Fonctionnement

Ceci est le document que vous allez devoir modifier collaborativement.
Il utilise des fichiers au format Markdown (extensions `.md`) qui sont
mis en forme avec Jupyter Book, un des utilitaires de la famille Jupyter (vous
connaissez dejà probablement les notebooks Jupyter) qui permet de générer des
livres au format HTML avec des bouts de code exécutables à l'intérieur.

Pour mieux vous rendre compte de ce qui vous attend, rendez vous à l'adresse
https://rtavenar.github.io/mongo_book/.

## Infos sur les connexions

Les requêtes que vous effectuerez dans le cadre de ce document seront, en pratique, exécutées sur un serveur local tournant sur la machine qui compile le document au format HTML.

Voici les infos de configuration de ce serveur :

* URI de connexion (utile surtout pour les chapitres sur les connexions depuis `R` ou `Python`) : `"mongodb://localhost:27017/nomDeLaBase"`
* Bases de données disponibles (identiques à leurs homonymes sur MongoDB Atlas) : 
  * `food`
  * `elections2007`
  * `large_db`
  * `large_db_with_index`
