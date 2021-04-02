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

# Les index

* Auteurs/trices : Adrien VIGUE, Etienne BARON, Camille MONOT

Ce chapitre traite de :
* Index + requêtes textuelles + requêtes géographiques


## À quoi servent-ils ?

Les index prennent en charge l'exécution efficace des requêtes dans MongoDB. Sans index, MongoDB doit effectuer une analyse de collection , c'est-à-dire analyser chaque document d'une collection, pour sélectionner les documents qui correspondent à l'instruction de requête. Si un index approprié existe pour une requête, MongoDB peut utiliser l'index pour limiter le nombre de documents qu'il doit inspecter. Les index de MongoDB sont similaires aux index d'autres systèmes de base de données. MongoDB définit les index au niveau de la collection et prend en charge les index sur n'importe quel champ ou sous-champ des documents dans une collection MongoDB.

En bref, les index sont un moyen de trouver rapidement et efficacement du contenu dans une base de données.

## Quand les utiliser ?

On met en place des index à chaque fois qu'on s'attend à avoir beaucoup de requêtes sur une clé (resp. un ensemble de clés). 
Par exemple, on souhaite récupérer les notes d'un étudiant à l'aide de son numéro étudiant. Il faudra alors mettre un index sur la clé "numéro étudiant" afin des réaliser des requetes efficaces pour retrouver toutes les informations de l'étudiant en fonction de son numéro.

```{admonition} ⚠️ Attention
:class: tip
On ne peut pas toujours utiliser des index. En effet, les index rendent la mise à jour de la base fastidieuse : à chaque fois que vous
rajoutez de nouvelles données, vous devez redéfinir vos index. Il n'est donc pas judicieux d'utiliser des index sur une base où vous vous
attendez à devoir faire des mises à jour régulières.
```

## Syntaxe adaptée

* Création d'un index

```javascript
db.collec.createIndex({"cle":1})
```
On crée ici un index dans la collection 'collec' de la base de données courante 'db'. On donne ensuite le nom du champs sur lequel on va ensuite créer la clé. Le ":1" signifie que l'index va trier les données dans l'ordre croissant.

_Exemple :_

```{code-cell}
use food
```

```{code-cell}
db.NYfood.createIndex({"borough" : 1})
```

Ici on crée un index "quartier" dans la collection NYfood de la base food. Le quartier étant une information importante du restaurant, il est judicieux de créer un index pour toutes les requêtes ultérieures. 

```{admonition} ✍ À noter
Si on avait mis une valeur négative à la place du 1, les données auraient été triées dans l'ordre décroissant. 
Le tri n'a cependant pas d'importance sur l'efficacité de la requête.
```
* Récupération d'index

Lorsque l'on prend en main une nouvelle base mongoDB, il est judicieux de se renseigner sur les index déja créés, afin de construire les requêtes les plus optimisées possible. Pour cela, on utilise getIndexes :

```javascript
db.collec.getIndexes()
```

La syntaxe est très simple et limpide, et donc si l'on applique cette dernière à notre exemple :

```{code-cell}
db.NYfood.getIndexes()
```

* Opérateurs bénéficiant de l’index

Construire une requête mongoDB utilisant des index ne difèrent pas d'une requête n'en utilisant pas, toutefois, certains opérateurs logiques bénéficient tout particlulièrement de la présence d'un ou plusieurs index. Il est donc pertinent de construire des index si vous pensez utilisez ces opérateurs.

_Exemple 1 : Opérateur égal (:, $eq)_

```{code-cell}
db.NYfood.find({"cuisine": "Chinese", "borough": "Brooklyn"})
```

On récupère les restaurants proposant de la cuisine chinoise dans le quartier de Brooklyn.

_Exemple 2 : Opérateur infériorité/supériorité ($lt, $lte, $gt, $gte)_

```{code-cell}
db.users.find({"age": 20,"name": {$gte: "user100000", $lte:"user100000"}})
```

On récupère les utilisateurs de 20 ans et dont l'id est compris entre 10 000 et 100 000.

## Index composés

## Index textuels
* Création d'un index
* Requêtes avancées
## Index géo-spatiaux

Les index geo-spatiaux ...
* Création d'un index

```javascript
db.coll.createIndex({"att" : "2dsphere"})
```
```javascript
var ref = {"type": "Point", "coordinates": [longitude, latitude]}
db.nomDeLaCollection.find({"clé": {$near : {$geometry : ref}}})
```

```javascript
CrownHeights= {"type": "Point", "coordinates": [-73.923, 40.676]}
db.NYfood.find({"address.loc" : {$near: {$geometry: CrownHeights}}})
```

* Requêtes avancées
test nouveau test


Adrien Etienne
