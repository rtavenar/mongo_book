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
Sur l’exemple ci-dessus on vient créer une varibale n_notes qui prend pour valeur la taille de la liste grades (qui contient les différentes attribuées au restaurant), on cherche donc ici à compter le nombre de notes attribué à chaque restaurant. Mais tous les autres attributs du restaurant sont effacés. Par la suite on ne pourra donc retrouver que le nombre de note attribué et non le quartier ou le type de restaurant. 
Si je veux afficher le quartier en question je dois le préciser tel que :
```
db.NYfood.aggregate( 
  [
   {$project: {"n_notes" : {$size : '$grades'}, quartier :'$borough'}}
]
)
```

Avec cette requête je peux voir le quartier du restaurant, par ailleurs la variable borough a été renommé quartier. Je peux également conserver cette variable sans la renomer avec cette syntaxe.
```
db.NYfood.aggregate( 
  [
   {$project: {"n_notes" : {$size : '$grades'}, borough : 1}}
]
)
```

4/ Sort

-> Pourquoi l'utiliser ?

Comme dans la plus part des langages de bases de données, MongoDB ne stocke pas les documents dans une collection dans un ordre en particulier. C'est pourquoi l'étape 'sort' (tri en français) va permettre de trier l'ensemble de tous les documents d'entrée afin de les renvoyer dans l'ordre choisi par l'utlisateur. Nous pouvons les trier dans l'ordre croissant, décroissant, chronologique ou bien alphébétique selon le type du champ souhaitant être trié. 
Il est possible de trier sur plusieurs champs à la fois, mais dans ce cas l'ordre de tri est évalué de gauche à droite. 
Le '$sort' est finalement l'équivalent du order by en SQL.

-> Comment ça fonctionne

Voici la syntaxe de base pour l'étape '$sort' :
```
db.collection.aggregate(
	[
		{ $sort: { <champ1>: <sort order>, <champ2>: <sort order> ... } }
	]
)
```

Le <sort order> peut prendre la valeur : 1 (croissant), -1 (décroissant) ou encore { $meta: "textScore" } (il s'agit d'unn tri de métadonnées textScore calculées dans l'ordre décroissant)

-> Exemples

Attention à bien prendre en compte le fait que lors du tri sur un champ contenant des valeurs en double (ou non unique), les documents contenant ces valeurs peuvent être renvoyés dans n'importe quel ordre.
```
db.NYfood.aggregate(
   [
     { $sort : { borough : 1} }
   ]
)
```
En effet, dans l'exemple ci-dessus, le champ quartier n'est pas un champ avec des valeurs uniques. Si un ordre de tri cohérent est souhaité, il est important d'au moins inclure un champ dans votre tri qui contient des valeurs uniques. Généralement, le moyen le plus simple de garantir cela consiste à inclure le champ _id dans la requête de tri.
```
db.NYfood.aggregate(
   [
     { $sort : { borough : 1, _id: 1 } }
   ]
)
```
Cette fois ci, la reqête affichera l'ensemble de la collection avec les noms de quartier affichés par ordre alphabétique. Les collections du quartier de "Bronx" seront les premières à être affichées, puis ensuite l'ordre par identifiant sera conservé lorsque le nom de quartier sera le même pour plusieurs collections.


5/ Limit
-> Pourquoi l'utiliser ?
L'étape "$limit" va simplement permettre de limiter le nombre de documents voulant être affichés par la requête. Il n'y a pas grand intérêt à utiliser le limit tout seul. Généralement, il est utilisé avec l'étape sort vu précédemment.

-> Comment ça fonctionne

Voici la syntaxe de base pour l'étape '$limit' :
```
db.collection.aggregate(
	[
		{ $limit : 5 } 
	]
)
```
L'argument qui est pris par le $limit est toujours un entier positif, qui va déterminer le nombre de collections que l'on souhaite afficher.

-> Exemple

Dans cet exemple, on souhaite afficher les 3 quartiers possédant le plus de restaurants.
```
db.NYfood.aggregate([
                        {$group: {_id: "$borough", nb: {$sum: 1}}},
                        {$sort: {nb: -1}},
                        {$limit: 3}
					]) 
```					  
On remarque ici que nous ne pouvons pas utiliser l'étape '$limit' seul sans le sort. Nous avons d'abord besoin de trier le nombre de restaurants par ordre décroissant puis enfin préciser que nous souhaitons obtenir seulement les 3 premiers quartiers contenant le plus de restaurants.

6/ Match ?
-> Pourquoi l'utiliser ?
-> Comment ça fonctionne
-> Exemple

### Quelques requêtes pour tout comprendre
```
db.NYfood.aggregate([

                        {$match: {"borough": "Brooklyn"}},
                        {$unwind: "$grades"},
                        {$group: {_id: "$grades.grade", nb: {$sum: 1}}},
                        {$sort: {nb: -1}},
                        {$limit: 3}
                      ]) 
```

Trouver un équivalent ici en SQL paraît compliqué avec le unwind, mais par étape ici on a :

* $match : on rend un tableau avec uniquement des restaurants de brooklyn.
* $unwind : on sépare les individus du tableau rendu par l'étape précédente par leur notes.
* $group : on regroupe par notes le tableau obtenu.
* $sort : on trie le tableau eu à l'étape d'avant en fonction du nombre d'occurences de notes.
* $limit : dans ce précédent tableau, on ne rend que les trois premiers résultats.


#### Résultat final : Les 3 notes les plus données dans les restaurants du quartier de Brooklyn

```
 db.NYfood.aggregate([

                        {$project: {taille: {$size: "$grades"}}},
                        {$match :{taille:{$gt:2}}},
                        {$group: {_id: null,
                                  nb_min: {$min: "$taille"},
                                  nb_max: {$max: "$taille"}}
                        },         
                      ]) 
```
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

