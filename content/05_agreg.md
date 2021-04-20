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


* Auteurs/trices : **CASTRIQUE Jérémy, NOJAC Dimitri, VAVASSEUR Salomé**

Dans cette partie, nous allons étudier **les regroupements dans les requêtes d'aggrégation**. Dans un premier temps, nous étudierons ce qu'est l'étape de regroupement. Ensuite nous regarderons comment effectuer des calculs à l'aide des 4 d'opérateurs qui sont : **$sum, $max, $min, $count**. 
  * somme, count, max, min, avec ou sans groupe

Les requêtes de regroupement vont permettre d'effectuer des opérations d'accumulation sur des documents regroupés. Il est l'équivalent de l'opérateur GROUP BY en SQL.

**exemple de requête sans regroupement**

SQL


```sql
SELECT SUM(att) as nb
FROM t
```
MongoDB

```javascript
db.coll.aggregate([
  {$group:
    {_id: null, 
    nb: {$sum: "$att"}}
  }
])
```
  
**exemple de requête avec regroupement**

Pour sélectionner certains individus, il faut filtrer sur l'id.

Sur la base de NYfood, on peut notamment filtrer par quartier.

Voici un exemple de requête :


En SQL

```sql
SELECT SUM(att) as nb
FROM t
GROUP BY borough
```

En MongoDB
```javascript
db.NYfood.aggregate(
[
  {$group:
    {
    _id: "$borough",
    nb: {$sum: 1}
    }
  }
]
)
```

Dans cette requête, Mongodb va compter pour chaque groupe, le nombre d'individu ayant le même id et donc compter les restaurants d'un même quartiers ensemble.


Dans la suite, nous allons traîter de différents opérateurs possibles à faire avec ou sans regroupement :

* $sum
* $count
* $min / $max


**opérateur $sum**

L'opérateur $sum permet de calculer la somme d'un attribut ou d'additionner les valeurs d'un attribu.

Regardons une requête simple sans regroupement :

On utilise la fonction aggregate.
Lorsqu'on utilise aggregate, il faut donner les individus sur lesquels on veut faire la requête.
On se place dans la collection notes de la base étudiants.
Ici, on choisit tout les individus. On le note id: null
On créé notre variable qu'on appelle nb_etud qui va faire la somme de tout les individus et calculer le nombre d'étudiants.

```javascript
db.notes.aggregate(
      [{$group:{
          _id: null,
          nb_etud: {$sum: 1}
          }
        }
       ]
)
```

Son équivalent en SQL est :

```sql
SELECT COUNT(*) as nb_etud
FROM notes

```


 Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/05_agreg.md`.

## Successions d'étapes d'agrégation

* Auteurs/trices : Marine BINARD, Arthur CONAS, Yann CAUSEUR

Cette section traite de :
* successions d'étapes d'agrégation + unwind + project + sort + limit
;
Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/05_agreg.md`.
