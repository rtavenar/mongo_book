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

# Attributs de type date

* Auteurs/trices : **TODO**

Ce chapitre traite des attributs de type dates (et sous-cas des listes de dates) et des différents types de requêtes que l'on peut vouloir faire sur de tels attributs

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/03_dates.md`.

## Exemples d'applications
Utilisation d'un objet date au format string.

Exemple d'une requête simple. On veut récupérer la liste des individus dont l'attribut date est supérieur à une date créée.
```javascript
madate = "<YYYY-mm-dd>"
db.coll.find({"varDateString" : {$gt : madate}})
```
Utilisation d'un objet date au format Date.

Exemple d'une requête simple dans la db `food`. On veut récupérer la liste des restaurants dont la date de la note est supérieure à une date créée.
```javascript
madate = new Date("<YYYY-mm-dd>")
db.NYfood.find({"grades.date": {$gt : madate}})
```
