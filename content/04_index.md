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
Par exemple, on souhaite récupérer les notes d'un étudiant à l'aide de son numéro étudiant. Il faudra alors mettre un index sur la clé "numéro étudiant" afin de réaliser des requêtes efficaces pour retrouver toutes les informations de l'étudiant en fonction de son numéro.

```{admonition} ⚠️ Attention
:class: tip
On ne peut pas toujours utiliser des index. En effet, les index rendent la mise à jour de la base fastidieuse : à chaque fois que 
vous rajoutez de nouvelles données, vous devez redéfinir vos index. Il est donc nécessaire d'utiliser avec parcimonie des index sur une base 
où vous vous attendez à devoir faire des mises à jour régulières.
```

## Syntaxe adaptée

* Création d'un index

```javascript
db.nomDeLaCollection.createIndex({"cle":1})
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

Lorsque l'on prend en main une nouvelle base mongoDB, il est judicieux de se renseigner sur les index déjà créés, afin de construire les requêtes les plus optimisées possible. Pour cela, on utilise getIndexes :

```javascript
db.collec.getIndexes()
```

La syntaxe est très simple et limpide, et donc si l'on applique cette dernière à notre exemple :

```{code-cell}
db.NYfood.getIndexes()
```

* Opérateurs bénéficiant de l’index

Construire une requête mongoDB utilisant des index ne diffèrent pas d'une requête n'en utilisant pas, toutefois, certains opérateurs logiques bénéficient tout particulièrement de la présence d'un ou plusieurs index. Il est donc pertinent de construire des index si vous pensez utiliser ces opérateurs.

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

_Exemple 3 : différence d'exécution avec et sans index_

Reprenons la requête vue à l'exemple 1, mais cette fois affichons son temps d'exécution :

```{code-cell}
db.NYfood.find({"cuisine": "Chinese", "borough": "Brooklyn"}).explain("executionStats")
```

Rajoutons maintenant l'index "cuisine" (l'index quartier ayant déjà été créé plus haut) :

```{code-cell}
db.NYfood.createIndex({"cuisine": 1})
```

On peut maintenant relancer la requête et observer la différence :

```{code-cell}
db.NYfood.find({"cuisine": "Chinese", "borough": "Brooklyn"}).explain("executionStats")
```

## Index composés

Il est également possible de créer des index non pas sur un mais sur plusieurs champs de la base de données, on appelle alors un tel index un "index composé". L'intérêt d'une telle pratique est de lier des champs entre eux et d'optimiser grandement des requêtes portant sur ces derniers. Si l'on s'attend à effectuer de telles requêtes, alors créer un index composé devient judicieux.

* Création d'un index composé

```javascript
db.nomDeLaCollection.createIndex({"cle1": 1, "cle2": 1}
```

```{admonition} ⚠️ Attention
:class: tip
L'ordre dans lequel vous déclarez vos champs à une importance capitale dans le résultat renvoyé par la requête. 
Par exemple, l'index composé suivant : db.nomDeLaCollection.createIndex({"cle2": 1, "cle1": 1}, ne correspond pas du tout
à l'index vu juste au-dessus. 
Les résultats renvoyés par une requête utilisant ces deux index seront donc totalement différents.
```

* Exemple de requête utilisant un index composé

Nous avons déjà vu un tel exemple, en effet si nous revenons un peu plus haut, nous avons déjà donné une requête de ce type :

```javascript
db.users.find({"age": 20,"name": {$gte: "user100000", $lte:"user100000"}})
```

Ici, on utilise bien l'index "age_1_name_1", car en filtrant les résultats en premier par l'âge, la deuxième partie de la requête, portant sur le nom, est bien plus efficace, car le champ de recherche est réduit grandement par la première partie.

## Requêtes et Index textuels

Lorsque l'on veut interroger notre base de données sur un champ de type "chaîne de caractères", deux méthodes s'offrent à nous : on peut utiliser soit des requêtes régulières, soit un index textuel qui a été créé sur-le-champ. L'avantage de la première méthode est une très grande précision, et on l'utilisera donc lorsque l'on recherchera du texte très précis, tandis que la seconde méthode utilise la puissance de l'index pour effectuer une recherche de type "moteur de recherche", renvoyant des résultats proches de ce qui a été demandé. Ici, comme on s'intéresse uniquement au index, nous ne développerons que la seconde méthode.


* Création d'un index textuel

Il existe deux manières de créer un index textuel, sur un attribut précis ou alors sur l'ensemble des attributs :

_Pour un attribut précis, ici "cle" :_

```javascript
db.coll.createIndex({"cle" : "text"})
```

_Pour tous les attributs :_

```javascript
db.nomDeLaCollection.createIndex({"$**" : "text"})
```

* Requêtes avancées utilisant un index textuel

Pour effectuer un requête de type "moteur de recherche", on utilise la forme suivante :

```javascript
db.nomDeLaCollection.find({$text : {$search : "ma requête"}})
```

On remarque plusieurs choses : tout d'abord, il n'est pas nécessaire de préciser le ou les champ sur lequel on veut effectuer la recherche. Ce type de requête n'était possible que sur les champs avec un index textuel, c'est sur ces derniers que le langage va requêter (c'est le sens du "$text"). Ensuite, on remarque la présence de "$search", nécessaire pour ce type de requête.

Par défaut, lorsque l’on effectue une requête contenant plusieurs termes, un OU logique est effectué : les résultats retournés sont ceux qui contiennent au moins l’un des termes. On peut également effectuer une requête impliquant une expression exacte, qui sera encadrée de guillemets échappés par un caractère "\" :

```javascript
db.nomDeLaCollection.find({$text : {$search : "\"ma requête\""}})
```

De plus, il est possible d'exclure des termes des résultats en utilisant "-", dans ce cas, un ET logique est effectué. Par exemple, dans la requête suivante, on souhaite les documents contenant "ma requête" et ne contenant pas "exemple" en même temps :

```javascript
db.nomDeLaCollection.find({$text : {$search : "ma requête -exemple"}})
```

Enfin, on peut classer les documents par pertinence par rapport à notre requête, en utilisant le score td-idf (plus d'informations disponibles ici : https://fr.wikipedia.org/wiki/TF-IDF) :

```javascript
db.nomDeLaCollection.find({$text: {$search: "ma requête"}},{"score": {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
```

Cette requête renvoie une liste des documents ordonnée par pertinence, si vous souhaitez juste afficher le score de chaque document, il suffit d'enlever `.sort({score: {$meta: "textScore"}})`.

_Exemple 1 : Liste des documents comportant le terme "famille" mais pas le terme "politique"._

```{code-cell}
db.discours.find({$text : {$search : "famille -politique"}})
```

_Exemple 2 : Liste ordonnée par pertinence des documents par rapport au terme "écologie"_ :

```{code-cell}
db.discours.find({$text: {$search: "écologie"}},{"name": true, "score": {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
```

## Index géo-spatiaux

Avec des données géo-spatiales (longitude, latitude), il est possible de créer un index géo-spatial.
En plus d'une meilleure efficacité, cet index va permettre de trouver des éléments proches d'un point donné ou bien trouver des éléments inclus dans un polygone. 

* Création d'un index

Pour créer un index géo-spatial il faut lui donner le type "2dsphere" :
```javascript
db.coll.createIndex({"att" : "2dsphere"})
```

* Requêtes avancées

Pour obtenir les éléments les plus proches d'un point on définit d'abord une variable de type "Point" avec ses coordonnées.

Le mot-clé $near est nécessaire:

```javascript
var ref = {"type": "Point", "coordinates": [longitude, latitude]}
db.nomDeLaCollection.find({"clé": {$near : {$geometry : ref}}})
```
_Exemple 1 :_
```{code-cell}
use food
var CrownHeights= {"type": "Point", "coordinates": [-73.923, 40.676]}
db.NYfood.find({"address.loc" : {$near: {$geometry: CrownHeights}}})
```
Si l'on veut trouver les éléments inclus dans un polygone la variable sera de type "Polygon" et aura plusieurs couples de coordonnées.
Pour avoir un polygone fermé, il faudra veiller à ce que les dernières coordonnées soient égales aux premières.

Le mot-clé $within remplace ici $near :

```javascript
var ref = {"type": "Polygon", "coordinates": [[[long1, lat1],
                                                 [long2, lat2],
                                                 [long3, lat3],
                                                 [long4, lat4],
                                                 [long1, lat1]]]}
db.nomDeLaCollection.find({"clé": {$within : {$geometry : ref}}})                                                 
```
_Exemple 2 :_
```{code-cell}
var eastVillage= {"type" : "Polygon", "coordinates" : [[[-73.9917900, 40.7264100],
                                                    [-73.9917900, 40.7321400],
                                                    [-73.9829300, 40.7321400],
                                                    [-73.9829300, 40.7264100],
                                                    [-73.9917900, 40.7264100]]]}
db.NYfood.find({"address.loc": {$within : {$geometry : eastVillage}}})
```



