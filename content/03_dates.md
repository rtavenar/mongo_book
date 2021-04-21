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

Ce chapitre traite des attributs de type dates (et sous-cas des listes de dates) et des différents types de requêtes que l'on peut vouloir faire sur de tels attributs;


## Qu'est-ce qu'une date dans MONGODB

### les différents objets Date

### créations annexes

## Transformation de formats

### présentation des formats

Ci-dessous un récapitulatif des formats disponibles

| abbreviation       |     Description     |        Valeurs possibles |
| :------------ | :-------------: | -------------: |
| %d       |     jour du mois     |        01-31 |
| %G     |   Année dans le format ISO 8601    |      0000-9999 |
| %H        |     Heure      |         00-23 |
| %L        |     Miliseconde      |         000-999 |
| %m        |     Mois      |         01-12 |
| %M        |     Minute      |         00-59 |
| %S        |     Seconde      |         00-60 |
| %u        |     jour par rapport à la semaine      |         1-7 (Lundi-Dimanche) |
| %v        |     Semaine      |         1-53 |
| %Y        |     année      |         0000-9999 |
| %z        |     décalage temporel par rapport à UTC      |         +/-[hh][mm] |
| %Z        |     décalage temporel converti en minutes      |         +/-mmm |
| %%        |     afficher le caractère pourcentage      |         % |

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
La méthode $datefromstring permet de convertir une chaine de caractère représentant une date en objet date pour pouvoir effectuer des calculs et comparaison dessus.

La méthode prend en argument : 

* la date en format texte (Obligatoire)
* Le format
* Le fuseau horaire
* Une gestion potentielle des erreurs ou des nulles. 


#### Exemples

### $dateToString

On retrouve la méthode inverse avec des arguments similaires.


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
Pour avoir les restaurants qui ont obtenu au moins une notes au mois de novembre 2014, nous utiliserions l'opérateur `$elemMatch`. Attention à donner l'attribut de type liste, ici `grades`, avant l'opérateur et à spécifier l'attribut de type date, `date`, dans `$elemMatch`.
```javascript
madate1 = new Date("2014-11-01")
madate2 = new Date("2014-12-01")
db.NYfood.find(
    {"grades": {$elemMatch: {"date": {$gte: madate1,$lt: madate2}}
               }
    }
)
```

#### Utilisation d'un objet date dans un aggregate

Il est possible d'accéder aux attributs années, mois, jours,... d'une date. Ceci est très utile pour les requêtes d'aggrégations.

Exemple d'une requête de regroupement par le mois et l'années. Nous voulons afficher mois par mois le nombre de stations de métros dans la base `keolis`.
```javascript
db.metro.aggregate([
                        {$group:
                            {_id: {month: {$month: "$lastCheckDate"},
                                   year: {$year: "$lastCheckDate"}},
                                   nb: {$sum: 1}
                            }
                        }
                      ])

``` 
