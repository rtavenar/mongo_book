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

Regardons une requête simple :

db.NYfood.aggregate(
      [{$group:{
          _id: null,
          nb: {$sum: 1}
          }
        }
       ]
)

On utilise la fonction aggregate.
Lorsqu'on utilise aggregate, il faut donner les individus sur lesquels on veut faire la requête.
Dans notre cas, on choisit tout les individus. On le note id: null
On créé notre variable qu'on appelle nb qui va faire la somme de tout les individus.

## Successions d'étapes d'agrégation

* Auteurs/trices : Marine BINARD, Arthur CONAS, Yann CAUSEUR

Cette section traite de :
* successions d'étapes d'agrégation + unwind + project + sort + limit

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/05_agreg.md`.
