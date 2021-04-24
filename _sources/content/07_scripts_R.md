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

```{admonition} Remarque

 L'installation et le chargement du package devtools au préalable sera nécessaire pour cette dernière exécution.
```

Une fois le package installé, il vous suffira de le charger dans votre envionnement de travail R via la commande suivante à exécuter dans la console ou depuis un script R :

```r
library(mongolite)
```

### Connexion à une collection d'une base de données présente sur un serveur MongoDB

Après avoir chargé les packages nécessaires dans votre environnement R, vous pourrez vous connecter à une collection d'une base de données présente sur un serveur MongoDB à partir d'un lien URI, du nom de la base de données, et du nom de la collection à laquelle vous souhaitez accéder. Pour ce faire, il suffit d'utiliser la fonction *mongo()* de la librairie *mongolite* de la manière suivante :

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

L'adresse URI à spécifier dans le paramètre URL définit l'adresse du serveur et des options de connexion supplémentaires. Parmi ces options, nous pouvons notamment retrouver des mots de passe que nous vous conseillons, à l'opposé de ce qui a été fait ce tutoriel pour des fins pédagogiques, de lire dans des fichiers externes afin d'en préserver leur confidentialité. Afin d'obtenir plus de précisions sur le format exact de l'URI attendu (authentification, tunnel SSH, options SSL et options de réplique), nous vous renvoyons à la [documentation](https://jeroen.github.io/mongolite/connecting-to-mongodb.html).
```
Pour ce qui est de sa sortie, la fonction *mongo()* renvoie un objet propre à sa librairie mère, une *Mongo collection*, qui, comme nous l'avons vu précédemment, pointe sur une collection d'une base de données. Regardons de plus près à quoi correspond ce type d'objet sur un exemple concret. Ici nous nous connectons à la collection "NYfood" d'une base de données "food" contenant de nombreuses informations sur les restaurants de New-York. 

```{code-cell} R
library(mongolite)
coll <- mongo(collection="NYfood", db="food",url = "mongodb://localhost:27017/food", verbose=TRUE)
coll
```

Nous constatons alors que la *Mongo collection* est un environnement contenant les informations de la collection "NYfood" avec lequel nous pouvons intéragir via de nombreuses méthodes. Chacune de ces méthodes s'appliquera sur une *Mongo collection* à l'aide d'un "$" et permettra d'effectuer l'équivalent d'une requête MondoDB sur une collection. Par exemple, pour faire une simple requête find en *NoSQL* récupérant tous les documents d'une collection, il suffira d'écrire :

```r
coll$find()
```

Ou encore pour affichez la liste des index de la collection NYfood, il suffira d'écrire :

```r
coll$index()
```

L'objet des prochaines sections de ce chapitre sera alors d'explorer ces différentes méthodes et de voir leurs requêtes équivalentes en NoSQL. Nous reviendrons notamment sur les objets renvoyés par ces différentes méthodes. Toutefois, nous pouvons d'ores et déjà remarquer qu'une méthode *find()* renvoie la collection complète dans un *dataframe* ce qui, dans des cas de grands volumes de données, pourrait entrainer des saturations de mémoire de votre machine. Nous verrons par la suite que pour s'affranchir de ce problème, nous pourrons utiliser une méthode *iterate()*, similaire à la méthode *find()*, renvoyant non plus un *dataframe*, mais un *Mongo iterator*. Un *Mongo iterator* est un objet propre à *mongolite* permettant de ne pas stocker explicitement en mémoire le résultat d'une requête mais d'en conserver un itérateur.

## Requêtes de données

*Mongolite* utilise une syntaxe JSON dans les arguments de ses méthodes pour interroger des collections. Cette syntaxe JSON devra être spécifiée sous forme de chaîne de caractère entre simples *quotes* dans R. Ces différentes chaînes feront alors l'objet de divers paramètres pour les méthodes présentées dans ce chapitre.

### Méthode count

Tout comme le *.count()* en MongoDB ([plus de précisions ici](https://rtavenar.github.io/mongo_book/content/01_find.html)), la méthode *count()* nous permet de calculer le nombre de résultats d'une collection, ou encore le nombre de résultats d'une certaine requête. Cette méthode n'a qu'un seul argument (query) et sa valeur par défaut est "{}". Elle renvoie un entier.

**Exemples :**

Afficher le nombre de résultats de la base NYfood par exemple :

```{code-cell} R
req = "{}"
coll$count(query=req)
```

Nous pouvons également noter l'équivalent en MongoDB :

````{tabbed} Mongolite

```r
req = "{}"
coll$count(query=req)
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.NYfood.find()
```

````

Et pour afficher le nombre de restaurants chinois :

````{tabbed} Mongolite

```r
req = '{"cuisine":"Chinese"}'
coll$count(query=req)
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.NYfood.find({"cuisine":"Chinese"})
```

````

### Méthode find

La méthode *find()* permet, à l'instar du *.find* en MongoDB ([plus de précisions ici](https://rtavenar.github.io/mongo_book/content/01_find.html)), d'interroger une collection en filtrant les documents et les champs. De plus, cette méthode intègre la possibilité de limiter, trier et skiper les documents d'un résultat. Autrement dit, cette méthode comprends en ses arguments le *.limit*, le *.sort* et le *.skip* de MongoDB. Présentons alors les 5 arguments de cette méthode : 

- query : correspond à la requête de filtrage des documents passée en premier agument d'un *.find* en MongoDB ; '{}' est la valeur par défaut
- fields : correspond à la requête de filtrage des champs passée en second argument d'un *.find* en MongoDB
- sort : correspond à la requête de tri passée argument d'un *.sort* en MongoDB
- limit : correspond à la requête de limitation du nombre de documents retournées, passée en argument d'un *.limit* en MongoDB
- skip : correspond à la requête de choix d'une ligne de départ des documents retournées, passée en argument d'un *.skip* en MongoDB

Comme nous avons pu l'énoncer précedémment, cette méthode stocke le résultat dans un dataframe sous R, prenant ainsi de la place en mémoire. Cette prise de place en mémoire peut être problématique, c'est pourquoi nous verrons par la suite l'intérêt de la méthode *iterate()* et de l'objet *Mongo iterator* qu'elle renvoie.

**Exemple :**

Regardons les 5 premières lignes du dataframe contenant les noms des restaurants chinois à Brooklyn triés par ordre alphabétique inverse (i.e, de Z à A) :

```{code-cell} R
:tags: [output_scroll]

data <- coll$find(query = '{"cuisine":"Chinese", "borough":"Brooklyn"}',
                  fields = '{"name": true, "_id":false}',
                  sort = '{"name":-1}',
                  limit = 5)
data
```

L'équivalent en MongoDB est le suivant :

````{tabbed} Mongolite

```r
data <- coll$find(query = '{"cuisine":"Chinese", "borough":"Brooklyn"}',
                  fields = '{"name": true, "_id":false}',
                  sort = '{"name":-1}',
                  limit = 5)
data
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.NYfood.find({"cuisine":"Chinese", "borough":"Brooklyn"}, 
{"name":true, "_id":false}).sort({"name":-1}).limit(5)
```

````

Rappelons que le tri par toute variable autre que l'identifiant peut être relativement lent, surtout lorsque la collection est de taille importante car seul l'identifiant est indexé. En ajoutant un index, le champ est pré-trié et son tri est presque immédiat. Pour ajouter un index avec *mongolite*, il suffit de le déclarer avec la méthode *index(add='{"variable":1}')*.

**Exemple :**

Créer un index sur le champs *name* :

````{tabbed} Mongolite

```r
coll$index(add = '{"name" : 1}')
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.NYfood.createIndex({"name": 1}
```

````

Il est aussi possible de faire des requêtes textuelles avec mongolite. Toutefois attention, cela se fait obligatoirement à l'aide de l'opérateur *$regex*. En effet, avec *mongolite* on ne peut pas faire de requêtes textuelles à l'aide d'expressions régulières car le package permettant de convertir une chaîne de caractères en fichier JSON dans R ne connait pas les expressions régulières. Hormis ce détail, la syntaxe entre simples *quotes* est la même que pour les requêtes textuelles en MongoDB ([plus de précisions ici](https://rtavenar.github.io/mongo_book/content/04_index.html)).

Ainsi, pour afficher les 10 premiers restaurants de Manhattan dont le nom commence par la lettre 'A' par exemple, la requête adaptée est :

```{code-cell} R
:tags: [output_scroll]

q = '{"borough": "Manhattan", "name": {"$regex": "^A", "$options":"i"}}'
res <- coll$find(query = q, limit=10)
print(res)
```
Notons alors l'équivalent possible en MongoDB : 

````{tabbed} Mongolite

```r
q = '{"borough": "Manhattan", "name": {"$regex": "^A", "$options":"i"}}'
coll$find(query = q, limit=10)
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.NYfood.find({"borough": "Manhattan", "name": /^A/i }).limit(10)
```

````


```{admonition} Remarque  

Comme en NoSQL, l'accent circonflèxe sert à préciser que seulement les chaînes commençant par la lettre A seront acceptées. L'opérateur *"$options":"i"* précise que la casse n'est pas importante (i.e, la chaine "abc" sera jugée acceptable).
```

---

Pour ce qui est des requêtes géospatiales, la syntaxe entre simples *quotes* est la même que pour les requêtes textuelles en MongoDB ([plus de précisions ici](https://rtavenar.github.io/mongo_book/content/04_index.html)).

### Méthode iterate

Nous avons vu précedemment que le renvoi d'une requête dans un dataframe R à l'aide de la méthode *find()* pouvait être problématique pour de grands volumes de données. La méthode *iterate()* permet de s'affranchir de ce problème. Celle-ci fonctionne exactement de la même manière que la méthode *find()* mais renvoie le résultat d'une requête non pas dans un dataframe mais dans un objet propre à *mongolite*, un *Mongo iterator*. Cet objet va permettre de ne pas stocker toutes les documents de la requête en mémoire mais de les lire un par un. Pour ce faire, il existe 4 méthodes applicables à un *Mongo iterator* :

- batch(n) : permet de parcourir n documents à la fois
- json() : retourne les résultats de la requête dans un format JSON
- one() : permet de parcourir un document à la fois
- page() : retourne les résultats de la requête sous forme de dataframe

Lorsque l'itérateur a épuisé tous les résultats de la collection, il retourne la valeur vide (NULL).

**Exemple :**

La création d'un itérateur sur l'ensemble de la collection NYfood se fait comme ci-dessous :

```{code-cell} R
it <- coll$iterate()
it
```

Affichons par exemple les 5 premières lignes :

```{code-cell} R
:tags: [output_scroll]

it$batch(5)
```

L'affichage avec la méthode batch, qui est essentiellement des listes imbriquées, n'est pas toujours facile à visualiser et nous pouvons décider de stocker le résultat dans un dataframe pour mieux le visualiser ; cela se fait avec la méthode *page()*. Par exemple, pour stocker les 5 premières lignes dans un dataframe :

```{code-cell} R
:tags: [output_scroll]

df <- it$page(5)
print(df)
```

### Méthode distinct
Tout comme le *.distinct()* en MongoDB ([plus de précisions ici](https://rtavenar.github.io/mongo_book/content/01_find.html)), la méthode *distinct()* nous renvoie les valeurs distinctes d'un champ.  

**Exemple :**   

Affichez la liste des notes existant dans la base :  

```{code-cell} R
coll$distinct(key = "grades.grade")
```

Nous pouvons également noter l'équivalent en MongoDB :

````{tabbed} Mongolite

```r
coll$distinct(key = "grades.grade")
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.NYfood.distinct("grades.grade")
```

````

### Sélectionner par date

Le traitement des dates avec *mongolite* mérite une attention particulière. En effet, lorsque l'on souhaite intéragir avec une collection sur un champ de type *date*, la syntaxe sera relativement différente de celle que l'on peut utiliser en *MongoDB* ([plus de précisions ici](https://rtavenar.github.io/mongo_book/content/03_dates.html)) ou avec *pymongo*. En raison de la classe d'une requête en mongolite (chaîne de caractère), on ne pourra pas utiliser d'objet R spécifique aux dates (comme les datetimes en python par exemple). Ainsi, toutes les dates définies dans une requête en mongolite devront être spécifiées dans un format purement JSON intégrant un opérateur *$date* et une syntaxe UTC. Concrètement, ce format sera du type : 

```javascript
{ "$date" : "AAAA-MM-JJThh:mm:ssZ" }
```

**Exemple :**

Prenons un exemple en affichant la liste des 10 premiers restaurants ayant eu au moins une note postérieure au 20 janvier 2015 :

```{code-cell} R
:tags: [output_scroll]

q <- '{"grades.date": {"$gte": {"$date": "2015-01-20T00:00:00Z"}}}'
data <- coll$find(q, limit=10)
print(data)
```

Nous pouvons noter l'équivalent en MongoDB :

````{tabbed} Mongolite

```r
q <- '{"grades.date": {"$gte": {"$date": "2015-01-20T00:00:00Z"}}}'
data <- coll$find(q, limit=10)
data
```

````

````{tabbed} Équivalent MongoDB

```javascript
date = new Date("2015-01-20")
db.NYfood.find({"grades.date":{$gte: date}}).limit(10)
```

````

## Aggrégations

Nous nous proposons dans ce paragraphe de traiter de la méthode *aggregate()* de mongolite qui permet d'éxécuter, à l'instar de d'un *.aggregate* en MongoDB, une pipeline d'aggrégation qui n'est rien d'autre qu'une succession de plusieurs étapes d'aggrégation. La méthode *aggregate()* prend comme argument une liste de dictionnaires que l'on met entre simples *quotes*. La syntaxe a utiliser pour cette liste de dictionnaires est la même que pour le *.aggregate* de MongoDB (nous vous renvoyons au chapitre sur [les requêtes d'aggrégations](https://rtavenar.github.io/mongo_book/content/05_agreg.html) pour plus de précisions). Tout comme la méthode *find()*, la méthode aggregate renvoie un *dataframe*.

**Exemple :**

Prenons un exemple : dans la collection NYfood, le pipeline ci-dessous retourne le nombre de restaurants par arrondissement (borough).

```{code-cell} R
req = '[{"$group":{"_id":"$borough","nb_restos":{"$sum":1}}}]' 
df <- coll$aggregate(pipeline=req) 
df 
```

Nous pouvons noter l'équivalent en MongoDB :

````{tabbed} Mongolite

```r
req = '[{"$group":{"_id":"$borough","nb_restos":{"$sum":1}}}]' 
df <- coll$aggregate(pipeline=req) 
df 
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.NYfood.aggregate([{$group:{"_id":"$borough", "nb_restos":{"$sum":1}}}])
```

````

Il se peut que le dataframe à retourner soit de taille importante (ce n'est pas le cas ici). Pour éviter tout problème de saturation de mémoire, il est préférable d'effectuer l'aggrégation avec l'option iterate=TRUE. Ainsi, la méthode *aggregate()* renvoie comme pour la méthode *iterate()* un *Mongo iterator*. Toutes les méthodes applicables à un *Mongo iterator* présentées précédemment s'appliqueront alors à l'objet renvoyé par la méthode *aggregate()*. Pour reprendre l'exemple ci-dessus :

```{code-cell} R
req = '[{"$group":{"_id":"$borough","nb_restos":{"$sum":1}}}]' 
it <- coll$aggregate(pipeline=req, iterate=TRUE) 
it$page(2) 
```

## Manipulation de données

### Méthode insert
La méthode *insert()* permet, à l'instar du *.insert* en MongoDB ([plus de précisions ici](https://rtavenar.github.io/mongo_book/content/06_modif.html)), d'ajouter des données à une collection. 
La méthode la plus simple, est d'insérer des données à partir d'un data frame R. Les colonnes du data frame seront automatiquement transformées en clées d'enregistrement JSON.  
  
 ```{code-cell} R
test <- mongo()
test$drop()
test$insert(iris)
```

```{admonition} Remarque
En pratique, c'est l'inverse de *mongo$find()* qui converti la collection en Data Frame.  
```

```{code-cell} R
test$find(limit = 3)
```

Il est également possible d'insérer directement des données à partir d'une chaîne de caractère JSON. Cette méthode nécessite un vecteur de caractères où chaque élément est une chaîne JSON valide.  
A noter qu'ici la méthode *insert()* crée la collection "individus" car cette dernière n'existe pas.  

```{code-cell} R
individus <- mongo("individus")
str <- c('{"prenom" : "yolan"}' , '{"prenom": "paul", "age" : 22}', '{"prenom": "faisal"}')
individus$insert(str)
```
 
```{code-cell} R
individus$find(query = '{}', fields = '{}')
```

Nous pouvons également noter l'équivalent en MongoDB :

````{tabbed} Mongolite

```r
individus <- mongo("individus")
individus$insert(c('{"prenom" : "yolan"}' , '{"prenom": "paul", "age" : 22}', '{"prenom": "faisal"}'))
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.createCollection("individus")
db.individus.insert([
{"prenom" : "yolan"}',
{"prenom": "paul", "age" : 22},
{"prenom": "faisal"}
])
```

````

### Méthode remove

La même syntaxe que nous utilisons dans *find()* pour sélectionner les enregistrements à lire, peut également être utilisée pour sélectionner les enregistrements à supprimer :  

```{code-cell} R
test$count()
```
```{code-cell} R
test$remove('{"Species" : "setosa"}')
test$count()
```
Nous pouvons noter l'équivalent en MongoDB :

````{tabbed} Mongolite
```r
test$remove('{"Species" : "setosa"}')
```
````
````{tabbed} Équivalent MongoDB

```javascript
db.test.remove(
{"Species" : "setosa"}
)
```
````

Utilisez l'option just_one pour supprimer un seul enregistrement :

```{code-cell} R
test$remove('{"Sepal_Length" : {"$lte" : 5}}', just_one = TRUE)
test$count()
```

Pour supprimer tous les documents de la collection (mais pas la collection elle-même) :  

```{code-cell} R
test$remove('{}')
test$count()
```

Nous pouvons noter l'équivalent en MongoDB :

````{tabbed} Mongolite
```r
test$remove('{}')
```
````
````{tabbed} Équivalent MongoDB

```javascript
db.test.remove({})
```
````



La méthode *drop()* supprime une collection entière. Cela inclut toutes les documents, ainsi que les métadonnées telles que les index de la collection.  

```{code-cell} R
test$drop()
```

Nous pouvons noter l'équivalent en MongoDB :

````{tabbed} Mongolite
```r
test$drop()
```
````
````{tabbed} Équivalent MongoDB

```javascript
db.test.drop()
```
````


### Méthodes update/upsert

Pour modifier des enregistrements existants, utilisez l'opérateur *update()* :  

**Modification d'un document :**  

```{code-cell} R
individus$find()
```

```{code-cell} R
individus$update('{"prenom":"yolan"}', '{"$set":{"age": 22}}')
```

```{code-cell} R
individus$find()
```

Nous pouvons noter l'équivalent en MongoDB :

````{tabbed} Mongolite

```r
individus$update('{"prenom":"yolan"}', '{"$set":{"age": 22}}')
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.individus.update(
{"prenom" : "yolan"},
{$set: {"age" : 22}}
)
```

````
  
**Mise à jour de plusieurs documents :**  
  
Par défaut, la méthode *update()* met à jour un seul document. Pour mettre à jour plusieurs documents, utilisez l'option *multi* de la méthode *update()*.  

```{code-cell} R
individus$update('{}', '{"$set":{"booleen_age": false}}', multiple = TRUE)
```
```{code-cell} R
individus$update('{"age" : {"$gte" : 0}}', '{"$set":{"booleen_age": true}}', multiple = TRUE)
```

```{code-cell} R
individus$find()
```
Nous pouvons également noter l'équivalent en MongoDB :

````{tabbed} Mongolite

```r
individus$update('{}', '{"$set":{"booleen_age": false}}', multiple = TRUE)

individus$update('{"age" : {"$gte" : 0}}', '{"$set":{"booleen_age": true}}', multiple = TRUE)
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.individus.update(
{},
{$set: {"booleen_age": false}},
{multi: true}
)

db.individus.update(
{"age" : {"$gte" : 0}},
{$set: {"booleen_age": true}},
{multi: true}
)
```

````
  
**Modification avec création d'un document si besoin :**   
  
Si aucun document ne correspond à la condition de mise à jour, le comportement par défaut de la méthode de mise à jour est de ne rien faire. En spécifiant l'option *upsert* à true, l'opération de mise à jour met à jour le ou les documents correspondants ou insère un nouveau document si aucun document correspondant n'existe.  
 
```{code-cell} R
individus$update('{"prenom":"malo"}', '{"$set":{"age": 22}}', upsert = TRUE)
```

```{code-cell} R
individus$find()
```
  
 Nous pouvons également noter l'équivalent en MongoDB :

````{tabbed} Mongolite

```r
individus$update('{"prenom":"malo"}', '{"$set":{"age": 22}}', upsert = TRUE)
```

````

````{tabbed} Équivalent MongoDB

```javascript
db.individus.update(
{"prenom":"malo"},
{$set: {"age": 22}},
{upsert: true}
)
```

````



## Import et export de données

### La méthode export/import pour JSON

Le format par défaut JSON est celui d'une ligne par document.  

```{code-cell} R
individus$export(stdout())
```

En temps normal on exporte vers un fichier que l'on précise avec *file()* :  

```{code-cell} R
individus$export(file("individus.json"))
```

On peut faire l'essai de supprimer totalement la collection et de l'importer ensuite :  

```{code-cell} R
individus$drop()
individus$count()
```

```{code-cell} R
individus$import(file("individus.json"))
individus$count()
```

### Autres formats d'export (jsonlite/bjson/...)
Pour ces autres formats ou package concernant les méthodes import()* et *export()*, nous vous renvoyons [à la page de Jeroen Ooms](https://jeroen.github.io/mongolite/import-export.html).  

## Exercices 
   
### Consignes

**Exercice 1 :**
  
1. A l'aide d'une requête d'aggrégation, récupérer le nombre de restaurants par quatier dans la collection NYfood.
2. Réaliser un barplot pour visualiser le résultat.  
  
**Exercice 2 :**
  
Cet exercice reprend l'exemple de carthographie avec leaflet de François-Xavier Jollois, disponible [en cliquant ici.](https://fxjollois.github.io/cours-2017-2018/du-abd-r/connexion-r-mongodb.html#un_peu_de_cartographie_avec_leaflet) 
  
1. A l'aide d'une requête d'aggrégation, récupérer le nom, le quartier, la longitude et la latitude des restaurant new-yorkais de la collection NYfood.
2. Afficher les différents restaurants sur la carte du monde. Que constatez vous ?
3. Réaliser une carte des restaurants new-yorkais en ajoutant une couleur en fonction du quartier (coordonnées de New-York : long: -73.9, lat  =  40.7).  

### Correction

  
**Exercice 1 :**
  
**Question 1 :**
  

```r
req = '[{"$group":{"_id":"$borough","nb_restos":{"$sum":1}}}]' 
df <- coll$aggregate(pipeline=req) 
df
```



**Question 2 :**
  
```r
library(tidyverse)

df %>%
  rename(Borough=`_id`,Nombre=nb_restos) %>%
  ggplot(aes(x=Borough, y=Nombre)) +
  geom_bar(stat="identity",aes(fill=Borough)) +
  geom_text(aes(label=Nombre), vjust=1.6, color="black", size=3.5)
```
   
**Exercice 2 :**
  
**Question 1 :**
  
```r
restos.coord = coll$aggregate(
  '[
    { "$project": { 
        "name": 1, 
        "borough": 1, 
        "lng": { "$arrayElemAt": ["$address.loc.coordinates", 0]}, 
        "lat": { "$arrayElemAt": ["$address.loc.coordinates", 1]} 
    }}
]')

head(restos.coord)
```
  
**Question 2 :**

```r
library(leaflet)

leaflet(restos.coord) %>%
  addTiles() %>%
  addCircles(lng = ~lng, lat = ~lat)
```
  
**Question 3 :**
  
```r
pal = colorFactor("Accent", restos.coord$borough)
leaflet(restos.coord) %>%
  addProviderTiles(providers$CartoDB.Positron) %>%
  setView(lng  = -73.9,
          lat  =  40.7,
          zoom =  10) %>%
  addCircles(lng = ~lng, lat = ~lat, color = ~pal(borough)) %>%
  addLegend(pal = pal, values = ~borough, opacity = 1, 
            title = "Quartier")
```
