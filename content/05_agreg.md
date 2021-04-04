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

* Auteurs/trices : **TODO**

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
Il arrive que les documents de certaines collections possèdent pour attribut une liste. Lorsque l'on effectue une requête d'aggrégation il peut être nécéssaire d'agir non pas sur la liste mais sur chaque élement de la liste. Pour cela on utilise la commande **$unwid**. Elle permet pour chaque élément de la liste de dupliquer le document  pour chaque valeur de la liste. 
-> Comment ça fonctionne  
**Syntaxe** :
```
db.coll.aggregate( 
  [
   {$unwid : "$att"}}
  ]
)
```
En général un $unwid seul a peu d'intérêt, $att est une liste de taille 10 que la collection comporte 1000 individus, la requête d'exemple renvenra un résultat de 10 000 lignes (10 * 1000)
-> Exemple
```
db.NYfood.aggregate( 
  [
   {$unwind :"$grades"},
   {$group: {_id : '$grades.grade', 
             n: {$sum:1}}
    },
]
)

```
Voici un exemple concret d'utilisation d'un **$unwid**. Dans la requête on cherche à compter le nombre de A ayant été attribués à l'ensemble des restaurants de la collection, puis le nombre de B, C .... 
Pour que cette requête fonction le $unwid est obligatoire sinon on considère la liste entière des notes et ne peux donc pas compter.  

3/ Project  
-> Pourquoi l'utiliser ?  
Il peut arriver lors d'une requête d'aggrégation de vouloir créer de nouvelles variables par exemple, pour des calculs. La commande **$project** permet donc de créer de nouvelles variables. Néanmoins, il faut faire attention, lorsque l'on crée une nouvelle variable dans une requête d'aggrégation tout les attributs déja existants pour les documents d'une collection ne sont plus mémoriser. Donc, si on veut créer une nouvelle variable tout en gardant les déja existantes il faut le mentionner le **$project**. 
-> Comment ça fonctionne  
**Syntaxe** :  
```
db.coll.aggregate( 
  [
   {$project : {nom_nouv_att1 : val_att1, nom_nouv_att2 : val_att2, ... }}
  ]
)
```

Le fait de vouloir garder un attribut déja existant fonctionne de la même façon que la création, il faut donc renomer la variable existante.   
-> Exemple  
Exemple réalalisé sur la collection **NYfood** :  
```
db.NYfood.aggregate( 
  [
   {$project: {"n_notes" : {$size : '$grades'}}}
]
)
```
Sur l’exemple ci-dessus on viens créer une varibale n_notes qui prend pour valeur la taille de la liste grades (qui contient les différentes attribuées au restaurant), on cherche donc ici à compter le nombre de notes attribué à chaque restaurant. Mais tous les autres attributs du restaurant sont effacés. Par la suite on ne pourra donc retrouver que le nombre de note attribué et non le quartier ou le type de restaurant. 
Si je veux afficher le quartier en question je dois le préciser tel que :
```
db.NYfood.aggregate( 
  [
   {$project: {"n_notes" : {$size : '$grades'}, quartier :'$borough'}}
]
)
```

Avec cette requête je peux voir le quartier du restaurant, par ailleurs la variable borough a été renomé quartier. Je peux également conserver cette variable sans la renomer avec cette syntaxe.
```
db.NYfood.aggregate( 
  [
   {$project: {"n_notes" : {$size : '$grades'}, borough : 1}}
]
)
```

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
```db.NYfood.aggregate([

                        {$match: {"borough": "Brooklyn"}},
                        {$unwind: "$grades"},
                        {$group: {_id: "$grades.grade", nb: {$sum: 1}}},
                        {$sort: {nb: -1}},
                        {$limit: 3}
                      ]) ```

Trouver un équivalent ici en SQL paraît compliqué avec le unwind, mais par étape ici on a :

* $match : on rend un tableau avec uniquement des restaurants de brooklyn.
* $unwind : on sépare les individus du tableau rendu par l'étape précédente par leur notes.
* $group : on regroupe par notes le tableau obtenu.
* $sort : on trie le tableau eu à l'étape d'avant en fonction du nombre d'occurences de notes.
* $limit : dans ce précédent tableau, on ne rend que les trois premiers résultats.


#### Résultat final : Les 3 notes les plus données dans les restaurants du quartier de Brooklyn

``` db.NYfood.aggregate([

                        {$project: {taille: {$size: "$grades"}}},
                        {$match :{taille:{$gt:2}}},
                        {$group: {_id: null,
                                  nb_min: {$min: "$taille"},
                                  nb_max: {$max: "$taille"}}
                        },         
                      ])```
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

