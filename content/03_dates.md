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

* Auteurs/trices : **HAMELIN Marine, GARY Gaston, RALIN Kévin, ABOULKACEM Zakaria**

Ce chapitre traite des attributs de type dates (et sous-cas des listes de dates) et des différents types de requêtes que l'on peut vouloir faire sur de tels attributs

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/03_dates.md`.


## Qu'est-ce qu'une date dans MONGODB

### les différents formats

### créations annexes

## Transformation de formats

### $dateFromString


```javascript
 { $dateFromString: {
     dateString: <dateStringExpression>,
     format: <formatStringExpression>,
     timezone: <tzExpression>,
     onError: <onErrorExpression>,
     onNull: <onNullExpression>
} }
```
#### Exemples

### $dateToString

```javascript
 { $dateToString: {
    date: <dateExpression>,
    format: <formatString>,
    timezone: <tzExpression>,
    onNull: <expression>
} }
```
#### Exemples

## Exemples d'applications
#### Utilisation d'un objet date au format string.

Exemple d'une requête simple. On veut récupérer la liste des individus dont l'attribut date est supérieur à une date créée.
```javascript
madate = "<YYYY-mm-dd>"
db.coll.find({"varDateString" : {$gt : madate}})
```
#### Utilisation d'un objet date au format Date.

Exemple d'une requête simple dans la db `food`. On veut récupérer la liste des restaurants dont la date de la note est supérieure à une date créée.
```javascript
madate = new Date("<YYYY-mm-dd>")
db.NYfood.find({"grades.date": {$gt : madate}})
```
#### Utilisation d'un objet date dans une requête d'égalité.

Exemple d'une requête simple dans la base de donnée `etudiants`. On veut récupérer les étudiants nés le 13 février 1995. Il est important d'utiliser l'encadrement. En effet, lors de la création d'une date, la précision est à la seconde près. 
La requête suivante nous renvoie donc les étudiants nés le 13 février 1995 à 00 heures, 00 minutes et 00 secondes.
```javascript
madate = new Date("1995-02-13")
db.notes.find(
    {"ddn": madate}
)
```
Pour avoir les étudiants nés le 13 février 1995, nous utiliserions la requête suivante :
```javascript
madateinf = new Date("1995-02-13")
madatesup = new Date("1995-02-14")
db.notes.find(
    {"ddn": {$gte: madateinf,
             $lt: madatesup}}
)
```

#### Utilisation d'un objet date dans une liste.

Exemple d'une requête où l'attribut `date` de type date est inclus dans la liste `grades` dans la base de donnée `etudiants`. La requête suivante nous retourne les restaurants possédant au moins une note attribué après le 5 octobre 2014.
```javascript
madate = new Date("2014-10-05")
db.NYfood.find(
    {"grades.date": {$gt: madate}}
)
```
