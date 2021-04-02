---
jupytext:
  cell_metadata_filter: -all
  formats: md:myst
  text_representation:
    extension: .md
    format_name: myst
    format_version: 0.12
    jupytext_version: 1.9.1
kernelspec:
  display_name: IMongo
  language: ''
  name: imongo
---

# Les requêtes d'agrégation

## Regroupements

* Auteurs/trices : Salomé Vavasseur, Jeremy Castrique, Dimitri Nojac

Cette section traite de :
  * somme, count, max, min, avec ou sans groupe

  Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/05_agreg.md`.

## Successions d'étapes d'agrégation

* Auteurs/trices : Marine BINARD, Arthur CONAS, Yann CAUSEUR

Cette section traite de :
* successions d'étapes d'agrégation + unwind + project + sort + limit


Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/05_agreg.md`.
### Introduction
Les successions d'étapes d'agrégations vont permettre d'obtenir des requêtes proches de ce qu'on peut trouver en SQL.
Contrairement à SQL où l'ordre est pré-défini (SELECT FROM WHERE ORDER BY), ici ce n'est pas le cas, il n'empêche que **l'ordre dans lequel on place
nos étapes est crucial.**

Nos étapes peuvent toutes être effectuées une à une et indépendamment. En fait, à l'intérieur de notre db.coll.aggregate([]), il y aura notre liste d'étapes,
contenues dans des crochets et séparées par des virgules, qui s'effectueront sur les données que **l'étape d'avant aura rendu.**

Il peut donc être intéressant d'éxécuter le code étape par étape pour savoir sur quelles données on travaille à un moment donné.

Commençons par regarder ce que peut faire chaque étape.


2/ Unwind
-> Pourquoi l'utiliser ?
-> Comment ça fonctionne
-> Exemple
3/ Project
-> Pourquoi l'utiliser ?
-> Comment ça fonctionne
-> Exemple
4/ Sort
-> Pourquoi l'utiliser ?
-> Comment ça fonctionne
-> Exemple
5/ Limit
-> Pourquoi l'utiliser ?
-> Comment ça fonctionne
-> Exemple
6/ Match ?
-> Pourquoi l'utiliser ?
-> Comment ça fonctionne
-> Exemple

### Quelques requêtes pour tout comprendre
`db.NYfood.aggregate([

                        {$match: {"borough": "Brooklyn"}},
                        {$unwind: "$grades"},
                        {$group: {_id: "$grades.grade", nb: {$sum: 1}}},
                        {$sort: {nb: -1}},
                        {$limit: 3}
                      ]) `

Trouver un équivalent ici en SQL paraît compliqué avec le unwind, mais par étape ici on a :

* $match : on rend un tableau avec uniquement des restaurants de brooklyn.
* $unwind : on sépare les individus du tableau rendu par l'étape précédente par leur notes.
* $group : on regroupe par notes le tableau obtenu.
* $sort : on trie le tableau eu à l'étape d'avant en fonction du nombre d'occurences de notes.
* $limit : dans ce précédent tableau, on ne rend que les trois premiers résultats.


#### Résultat final : Les 3 notes les plus données dans les restaurants du quartier de Brooklyn

` db.NYfood.aggregate([

                        {$project: {taille: {$size: "$grades"}}},
                        {$match :{taille:{$gt:2}}},
                        {$group: {_id: null,
                                  nb_min: {$min: "$taille"},
                                  nb_max: {$max: "$taille"}}
                        },         
                      ])`
Dans cette deuxième requête, on montre bien ici qu'il n'y a pas d'ordre pré-défini d'étape, et ici le $match n'est ni au début de la requête, ni à la fin.

Expliquons cette requête (qui n'a pas beaucoup d'intérêt pratique).

* $project : création de la variable taille, qui correspond au nombre de notes données à un restaurant.
* $match : Dans le tableau rendu précédemment, on ne prend que les restaurants ayant plus de 2 notes.
* $group : Sur le résultat de la requête précédente, on groupe tout les restaurants (_id : null), et on regarde le nombre minimum et maximum de notes attribuées
à un restaurant. (Ayant sélectionné les individus supérieurs à deux, le minimum ne pouvait être que 3 ou plus.

En SQL on aurait :

SELECT COUNT(*) AS taille, MAX(taille),MIN(taille)
FROM NYfood
WHERE taille>=2
#### Résultat final : Le nombre minimum et maximum de notes attribuées aux restaurants ayant au moins deux notes.

