# MongoDB : Notes de cours

Ce document compile des notes pour un cours de MongoDB dispensé en Master
Mathématiques Appliquées, Statistiques (parcours _Data Science_), à
l'Université de Rennes 2.

## Proposition de découpage en 9 parties

* Syntaxe de requêtes simples (syntaxe de `find`, opérateurs de comparaison, `distinct`, `count`, `sort`, `limit`)
* Cas des listes
* Cas des dates (et sous-cas des listes de dates)
* Index + requêtes textuelles + requêtes géographiques
* Agrégation
  * somme, count, max, min, avec ou sans groupe
  * successions d'étapes d'agrégation + unwind + project + sort + limit
* Requêtes de modification
* Requêtes MongoDB depuis des programmes Python ou R
  * Utilisation de `pymongo` (utilisation de MongoDB depuis Python)
  * Utilisation de `mongolite` (utilisation de MongoDB depuis R)
