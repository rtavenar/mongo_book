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
  display_name: R
  language: R
  name: ir
---

(sec:mongolite)=
# Requêtes depuis R : `mongolite`

* Auteurs/trices : **Yolan PERONNET, Faisal JAYOUZI, Paul LANCELIN**

Le chapitre suivant a pour objectif d'explorer le package mongolite permettant d'effectuer des requêtes MongoDB depuis R. La rédaction du tutoriel suivant trouve sa source dans la documentation rédigée par l'auteur du package mongolite, Jeroen Ooms. Celle-ci est accessible à l'adresse suivante : [https://jeroen.github.io/mongolite/](https://jeroen.github.io/mongolite/ "Documentation de mongolite (R)")

## Installation du package mongolite et connexion à un serveur MongoDB

### Installation et chargement du package mongolite

Les packages binaires de mongolite peuvent être installés directement depuis le CRAN via la manipulation suivante à partir de la barre d'outils :

---

**Tools -> Install Packages -> mongolite -> Install**

---

Ou via la commande suivante à exécuter dans la console ou depuis un script R :

```r
install.packages("mongolite")
```

Vous pouvez également installer la version de développement, qui contient les dernières fonctionnalités. Pour cela, exécutez la commande suivante :

```r
devtools::install_github("jeroen/mongolite")
```

```{admonition} Astuce
:class: tip

 L'installation et le chargement du package devtools au préalable sera nécessaire pour cette dernière exécution.
```

Une fois le package installé, il vous suffira de le charger dans votre envionnement de travail R via la commande suivante à exécuter dans la console ou depuis un script R :

```r
library(mongolite)
```

### Connexion à une collection d'une base de données présente sur un serveur MongoDB

Après avoir chargé les packages nécessaires dans votre environnement R, vous pourrez vous connecter à une collection d'une base de données présente sur un serveur MongoDB à partir d'un lien URI, du nom de la base de données, et du nom de la collection à laquelle on souhaite accéder. Pour ce faire, il suffit d'utiliser la fonction *mongo()* de la librairie *mongolite* de la manière suivante :

```r
coll <- mongo(collection="ma_collection", db="ma_BDD",
            url="mon_uri",
            verbose=TRUE)
```

La fonction *mongo()* prend en entrée les arguments suivants :
- collection : nom de la collection à laquelle se connecter. La valeur par défaut est "test"
- db : nom de la base de données à laquelle se connecter. La valeur par défaut est "test".
- url : adresse du serveur MongoDB au format URI standard.
- verbose : si TRUE, émet une sortie supplémentaire
- options : options de connexion supplémentaires telles que les clés et certificats SSL que nous ne developperons pas dans ce tutoriel.

```{admonition} Remarque  

La fonction mongo() prend obligatoirement en entrée le nom d'une collection d'une base de données. Nous comprenons alors que mongolite nous permet seulement d'intéragir avec une collection d'une base données, et non pas avec la base tout entière. Ici nous aurons donc qu'un seul objet pointant sur une collection avec laquelle intéragir. Nous n'aurons donc pas comme sur python et sa librarie pymongo d'objets clients et d'objets base de données. 
``` 

```{admonition} Astuce
:class: tip

L'adresse URI à spécifier dans le paramètre URL définit l'adresse du serveur et des options de connexion supplémentaires. Parmi ces options, nous pouvons notamment retrouver des mots de passe que nous vous conseillons, à l'opposé de ce qui a été fait ce tutoriel pour des fins pédagogiques, de lire dans des fichiers externes afin d'en préserver leur confidentialité. Afin d'obtenir plus de précisions sur le format exact de l'URI attendu (authentification, tunnel SSH, options SSL et options de réplique), nous vous renvoyons à la documentation.
```
Pour ce qui est de sa sortie, la fonction mongo() renvoie un objet propre à sa librairie mère, une "Mongo collection", qui, comme nous l'avons vu précédemment, pointe sur une collection d'une base de données. Regardons de plus près à quoi correspond ce type d'objet sur un exemple concret. Ici nous nous connectons à la collection "NYfood" d'une base de données "food" contenant de nombreuses informations sur les restaurants de New-York. 

```{code-cell} R
library(mongolite)
coll <- mongo(collection="NYfood", db="food",url = "mongodb://localhost:27017/food", verbose=TRUE)
print(coll)
```

Nous constatons alors que la "Mongo collection" est un environnement contenant les informations de la collection "NYfood" avec lequel nous pouvons intéragir via de nombreuses méthodes. Chacune de ces méthodes s'appliquera sur une "Mongo collection" à l'aide d'un "$" et permettra d'effectuer l'équivalent d'une requête MondoDB sur une collection. Par exemple, pour faire une simple requête find en NoSQL récupérant tous les documents d'une collection, il suffira d'écrire :

```r
coll$find()
```

Ou encore pour affichez la liste des index de la collection NYfood, il suffira d'écrire :

```r
coll$index()
```

L'objet des prochaines sections de ce chapitre sera alors d'explorer ces différentes méthodes et de voir les requêtes auxquelles elles sont équivelentes en NoSQL. Nous reviendrons notamment sur les objets renvoyés par ces différentes méthodes. Toutefois, nous pouvons d'ores et déjà remarquer qu'une méthode "find" renvoie la collection complète dans un "data frame" ce qui, dans des cas de grands volumes de données, pourrait entrainer des saturations de mémoire de votre machine. Nous verrons par la suite que pour s'affranchir de ce problème, nous pourrons utiliser une méthode "iterate", similaire à la méthode "find", renvoyant non plus un "data frame", mais un "Mongo iterator". Un "Mongo iterator" est un objet propre à *mongolite* permettant de ne pas stocker explicitement en mémoire le résultat d'une requête mais d'en conserver un itérateur.

## Requêtes de données

*MongoLite* utilise une syntaxe JSON pour interroger des collections. La requête JSON doit être écrite sous forme de chaîne de caractère dans R. Cette chaîne servirait de paramètre pour les méthodes présentées dans cette section : count(), find(), iterate(), aggregate().

### Méthode count

Avec la méthode count(query="{}") nous pouvons calculer le nombre de résultats d'une collection, ou bien le nombre de résultats d'une certaine requête. Cette méthode n'a qu'un seul argument (query), sa valeur par défaut est ("{}").

**Exemples :**

Pour afficher le nombre de résultats de la base NYfood par exemple, 


MongoLite
^^^
```r
req = "{}"
coll$count(query=req)
```

---

Équivalent NoSQL
^^^
```javascript
db.NYfood.find()
```


Et pour afficher le nombre de restaurants chinois :


MongoLite
^^^
```r
req = '{"cuisine":"Chinese"}'
coll$count(query=req)
```

---

Équivalent NoSQL
^^^
```javascript
db.NYfood.find()
```


### Méthode find

La méthode find() permet d'interroger une collection, de filtrer les lignes, et de stocker le résultat dans un DataFrame sous R. Cette méthode a 5 arguments : 

1. query : la requête NoSQL ; '{}' est la valeur par défaut
2. fields : sélection des variables ; prend en entrée une requête de sélection
3. sort : tri ; prend en entrée une requête précisant les variable(s) par lesquelles trier
4. limit : restreint le nombre de résultats qui seront retournés
5. skip : choisit la ligne de départ du DataFrame des résultats

**Exemples :**
Regardons les 5 premières lignes du dataframe contenant les noms des restaurants chinois à Brooklyn triés par ordre alphabétique inverse (i.e, de Z à A) :


MongoLite
^^^
```r
data <- coll$find(query = '{"cuisine":"Chinese", "borough":"Brooklyn"}',
                  fields = '{"name": true, "_id":false}',
                  sort = '{"name":-1}',
                  limit = 5)
print(data)
```

---

Équivalent NoSQL
^^^
```javascript
db.NYfood.find({"cuisine":"Chinese", "borough":"Brooklyn"}, {"name":true, "_id":false}).sort({"name":-1}).limit(5)
```


Rappelons que le tri par toute variable autre que l'identifiant peut être relativement lent, surtout lorsque la collection est de taille importante car seul l'identifiant est indexé.

En ajoutant un index, le champ est pré-trié et son tri est presque immédiat. Pour ajouter un index avec *mongolite*, il suffit de le déclarer avec la méthode index(add='{"variable":1}').


MongoLite
^^^
```r
coll$index(add = '{"name" : 1}')
```

---

Équivalent NoSQL
^^^
```javascript
db.NYfood.createIndex({"name": 1}
```


Il est aussi possible de faire des requêtes textuelles avec mongolite. Cela se fait à l'aide de l'opérateur $regex. Pour afficher les restaurants de Manhattan dont le nom commence par la lettre 'A' par exemple, la requête adaptée serait :



MongoLite
^^^
```r
q = '{"borough": "Manhattan", "name": {"$regex": "^A", "$options":"i"}}'
print(coll$find(query = q))
```

---

Équivalent NoSQL
^^^
```javascript
db.NYfood.find({"borough": "Manhattan", "name": {"$regex": /^A/i}}

//ou bien

db.NYfood.find({"borough": "Manhattan", "name": {"$regex": "^A", "$options" : "i"}})
```


Comme en NoSQL, l'accent circonflèxe sert à préciser que seulement les chaînes commençant par la lettre A seront acceptées. L'opérateur ("$options":"i") précise que la casse n'est pas importante (i.e, la chaine "abc" sera jugée acceptable).


### Méthode iterate

La méthode iterate() permet d'effectuer une requête et de lire les lignes une par une. Contrairement à la méthode find(), le résultat n'est pas stocké dans un dataframe.

L'itérateur dispose de 4 méthodes :

1. batch(n) : permet de parcourir n éléments à la fois
2. json() : retourne les résultats de la collection sous forme JSON (i.e, un dictionnaire entre guillemets)
3. one() : permet de parcourir un élément à la fois
4. page() : retourne les résultats de la collection sous forme de DataFrame

Lorsque l'itérateur a épuisé tous les résultats de la collection, il retourne la valeur vide (NULL). Cette méthode est plus efficace que la méthode find() lorsque la taille de la collection est importante puisque les résultats ne sont pas stockés en mémoire et donc la mémoire n'est pas saturée.

**Exemples :**
La création d'un itérateur se fait avec la méthode iterate comme ci-dessous :

```r
it <- coll$iterate()
it
```

Affichons par exemple les 5 premières lignes :

```r
it$batch(5)
```
L'affichage avec la méthode batch, qui est essentiellement des listes imbriquées, n'est pas toujours facile à visualiser et nous pouvons décider de stocker le résultat dans un dataframe pour mieux le visualiser ; cela se fait avec la méthode page(). Par exemple, pour stocker les 5 premières lignes dans un dataframe :

```r
df <- it$page(5)
```

### Méthode distinct

### Sélectionner par date

Le traitement des dates avec *mongolite* mérite une attention particulière. En effet, lorsque l'on souhaite intéragir avec une collection sur un champ de type *date*, la synthaxe sera relativement différente de celle que l'on peut utiliser en *MongoDB* ou avec *pymongo*. En raison de la classe d'une requête en mongolite (chaîne de caractère), on ne pourra pas utiliser d'objet R spécifique aux dates (comme les datetimes en python par exemple). Ainsi, toutes les dates définies dans une requête en mongolite devront être spécifiées dans un format purement JSON intégrant un opérateur *$date* et une synthaxe UTC. Concrètement, ce format sera du type : 

```javascript
{ "$date" : "AAAA-MM-JJThh:mm:ssZ" }
```

Prenons un exemple. Pour afficher la liste des restaurants ayant au moins une note postérieure au 20 janvier 2015, nous pouvons faire une requête comme celle-ci :


MongoLite
^^^
```r
q <- '{"grades.date": {"$gte": {"$date": "2015-01-20T00:00:00Z"}}}'
data <- coll$find(q)
data
```

---

Équivalent NoSQL
^^^
```javascript
date = new Date("2015-01-20")
db.NYfood.find({"grades.date":{$gte: date}})
```


## Aggrégations

La méthode aggregate() de mongolite permet d'effecteur un pipeline d'aggrégation qui n'est rien d'autre qu'une succession de plusieurs étape d'aggrégation comme (filtre, aggrégation, tri) par exemple. Dans la collection NYfood, le pipeline ci-dessous retourne le nombre de restaurants par arrondissement (borough).


MongoLite
^^^
```r
req = '[{"$group":{"_id":"$borough","nb_restos":{"$sum":1}}}]' 
it <- coll$aggregate(pipeline=req) 
print(it) 
```

---

Équivalent NoSQL
^^^
```javascript
db.NYfood.aggregate([{$group:{"_id":"$borough", "nb_restos":{"$sum":1}}}])
```

Il se peut que le DataFrame à retourner soit de taille importante (ce n'est pas le cas ici). Pour éviter toute erreur de saturation de mémoire, il est préférable d'effectuer l'aggrégation avec iterate=TRUE. Toutes les méthodes présentées dans la partie précédente seront donc applicable à l'itérateur construit. Pour reprendre l'exemple ci-dessus,

```r
req = '[{"$group":{"_id":"$borough","nb_restos":{"$sum":1}}}]' 
it <- coll$aggregate(pipeline=req, iterate=TRUE) 
print(it$page(2)) 
```

## Manipulation de données

### Méthode insert

### Méthode update

### Méthode remove

## Import et export de données

### La méthode import

### La méthode export
