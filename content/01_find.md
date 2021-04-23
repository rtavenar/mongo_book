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

# Premières requêtes en MongoDB

Auteurs/trices : **Julie FRANCOISE, Manon MAHEO et Valentin PENISSON**

---

## Introduction à MongoDB

Dans un **système de base de données relationnelles** *(comme les bases de données SQL)*, les données sont stockées par **ligne** *(appelées n-uplets)* dans des **tables** *(également appelées relations)*. Le modèle de données relationnel est un modèle **très structuré**, comportant des **attributs typés** *(les colonnes/attributs des tables ont un type précis qu'il soit numérique, alphanumérique ou temporel)* et des **contraintes d'intégrité** *(comme par exemple celle de l'unicité des valeurs de la clé primaire, la clé primaire étant un ensemble d'attributs permettant d'identifier de manière unique chaque n-uplet de la relation)*. Dans ce type de structure, il est nécessaire d'établir des **jointures sur plusieurs tables** afin de tirer des informations pertinentes sur la base de données.


**Dans MongoDB, les données sont modélisées sous forme de document sous un style JSON.** On ne parle plus de tables, ni d'enregistrements mais de **collections** et de **documents**. 

Une collection est un ensemble de documents, c'est l'équivalent d'une table dans un modèle relationnel. Un document est un enregistrement, une ligne dans le modèle de données relationnel. Ce système de gestion de données nous évite de faire des jointures de tables car **toutes les informations nécessaires sont stockées dans un même document**. 

De plus, l'utilisation de bases de données NoSQL avec MongoDB nous permet plus de flexibilité en termes de mise à jour de la structure des données : aucun modèle n'est supposé sur les données, aucun attribut n'est obligatoire et il n'y a pas de type fixé pour un attribut. 


Tout document appartient donc à une collection et a un champ appelé `_id` qui identifie le document dans la base de données. Prenons pour exemple la base de données `étudiants`. Voici un exemple de document : 

```javascript
{
    "_id" : ObjectId("56011920de43611b917d773d"),
    "nom" : "Paul",
    "notes" : [ 
        10.0, 
        12.0
    ],
    "sexe" : "M"
}
```

> On a une **association de clés et de valeurs**, un document est équivalent aux objets JSON *(et ressemble aux dictionnaires en python)*. Dans ce document, on a accès au **nom de l'étudiant** par la clé `nom`, à **ses notes** par la clé `notes` *(attention, ici on a une **liste de valeurs** entre crochets, ce type d'attribut n'est par exemple pas disponible dans le modèle relationnel)* et à **son sexe** par la clé `sexe`. L'étudiant représenté par ce document, est identifié à l'aide d'une clé `_id`. 
 
Les clés se doivent d'être des **chaînes de caractères** mais nous pouvons avoir comme valeur de ces clés des *valeurs booléennes, des nombres, des chaînes de caractères, des dates ou des listes de valeurs* comme nous venons de le voir. Les clés et les valeurs sont **sensibles à la casse et au type**. Chaque clé doît être **unique**, il n'est pas possible d'avoir deux fois la même clé dans un document. 

**Pour effectuer des requêtes sur une base de données MongoDB et filtrer les données, il est indispensable d'utiliser ces indications clés et valeurs.** 

```{admonition} Avant de commencer, il vous faut : 

Tout d'abord, il est nécessaire d'avoir installé un serveur comme par exemple le serveur **MongoDB Atlas** qui tourne en continu. Après avoir démarré le serveur, il vous faut lancer une connexion client, le **client Robot 3T** est idéal pour des requêtes en MongoDB. Il ne vous reste plus qu'à choisir une base de données ou en importer une et sélectionner *"Open Shell"* par clique droit sur la base pour faire vos requêtes !    
```

Dans ce chapitre, nous étudierons dans un premier temps [**comment interroger les données d'une base de données MongoDB avec la fonction find**](#find). Dans un second temps, nous regarderons comment effectuer des [requêtes plus complexes, impliquant des **opérateurs de comparaison**](#operateurs). Quelques [**méthodes utiles**](#methodes) pour des requêtes en MongoDB, une [**fiche "résumé" des quelques points à retenir**](#resume) et un petit [**quiz**](#quiz) sont donnés à la fin de ce chapitre.

---

## <a name="find"></a> Requêtes d'interrogation et de filtrage des données

**Pour récupérer des documents stockés dans une collection, il est nécessaire d'utiliser la fonction `find`.**
 
 ```{admonition} Remarque
 
Toute commande sur une collection intitulée collectionName utilise le préfixe db : `db.collectionName`. Il suffit d’y associer la fonction souhaitée pour avoir un résultat. En l'occurence, ici la syntaxe de données d'interrogation MongoDB est `db.collectionName.find()`.
```

### Syntaxe d'interrogation de données sans et avec condition

En MongoDB, lorsque l'on interroge les données, il existe deux types de requêtes simples, retournant respectivement **toutes les occurences d'une collection** ou **seulement la première**. Que l'on souhaite récupérer la première occurrence de la liste des résultats ou bien toute la liste des résultats, voici la syntaxe :  

````{panels}

Retourner toutes les occurences 
d'une collection avec find()
^^^
```javascript
 db.collectionName.find()
 db.collectionName.find({}) 
```

---

Retourner uniquement la première occurence
d'une collection avec findOne()
^^^
```javascript
db.collectionName.findOne()
db.collectionName.findOne({})
```

````

> À noter : Dans les deuxièmes propositions de chaque cas présenté ci-dessus, on a des accolades entre les parenthèses de la fonction. Ces accolades correspondent au *document masque*. Elles sont vides ce qui indique que nous ne posons pas de condition sur les documents à retourner. 

Au contraire, si l’on souhaite **fixer des contraintes sur les documents à retourner**, il suffit de passer en argument d’une de ces fonctions un document masque contenant les valeurs souhaitées. La requête suivante retourne tous les documents ayant un champ "x" dont la valeur est "y". 

La base de données food contient une collection NYfood qui recense un ensemble de restaurants américains et nous donne pour chaque restaurant des informations sur son quartier, son adresse, son type de cuisine, son nom, ses notes obtenues et son identifiant. Voici un extrait d'un document présent dans la collection NYfood : 

```javascript
{
    "_id" : ObjectId("6006c1882822efb1c9290f68"),
    "address" : {
        "building" : "265-15",
        "loc" : {
            "type" : "Point",
            "coordinates" : [ 
                -73.7032601, 
                40.7386417
            ]
        },
        "street" : "Hillside Avenue",
        "zipcode" : "11004"
    },
    "borough" : "Queens",
    "cuisine" : "Ice Cream, Gelato, Yogurt, Ices",
    "grades" : [ 
        {
            "date" : ISODate("2014-10-28T00:00:00.000Z"),
            "grade" : "A",
            "score" : 9
        }, 
        {
            "date" : ISODate("2013-09-18T00:00:00.000Z"),
            "grade" : "A",
            "score" : 10
        }, 
        {
            "date" : ISODate("2012-09-20T00:00:00.000Z"),
            "grade" : "A",
            "score" : 13
        }
    ],
    "name" : "Carvel Ice Cream",
    "restaurant_id" : "40361322"
}   
    
```

En utilisant la syntaxe précédente, on recherche par exemple les documents de la collection NYfood correspondant à des **boulangeries** *(pour lesquels le champ "cuisine" vaut "Bakery")* **du Bronx** *(pour lesquels le champ "borough" vaut "Bronx")*. Dans cet exemple sur la base de données NYfood, la virgule représente un **ET logique** entre les contraintes.     

````{tabbed} Syntaxe

```javascript
db.nomDeLaCollection.find({"x":"y"})
```

````
 
````{tabbed} Exemple sur la base de données food

```javascript
db.NYfood.find(
    {"cuisine": "Bakery", "borough": "Bronx"}
)
```

````

````{tabbed} Parallèle avec le langage SQL

```sql
SELECT *
FROM NYfood
WHERE cuisine = 'Bakery' AND borough = 'Bronx'
```

````

### Poser une condition sur une clé de sous-document 

Il se peut que pour une clé d'un document, comme par exemple l'adresse d'un restaurant dans la collection NYfood, nous disposons d'un **sous-document** contenant à la fois les coordonnées GPS et l'adresse postale. Plutôt qu'une liste de valeur comme présentée précédemment, nous avons comme valeur de la clé un nouveau document. 

Si l'on souhaite **poser une condition sur une clé ou plusieurs clés de sous-document**, on utilise alors la syntaxe suivante :

```javascript
db.NYfood.find({"adress.zipcode": "10462"})
```
où `adress` est le sous-document et `zipcode` la clé de ce dernier. Dans cet exemple, nous nous intéressons aux restaurants pour lesquels le zipcode est "10462".

### Projection des données

Les résultats obtenus jusqu’à présent sont parfois assez indigestes, notamment parce que toutes les clés sont retournées pour tous les documents. Il est possible de limiter cela en spécifiant les clés à retourner comme second argument de la fonction `find()`. On appelle ça une **projection**.

<dl>
  <dt>Projection</dt>
  <dd>La projection permet de sélectionner les informations à renvoyer. Si, par exemple, je m’intéresse uniquement aux noms des boulangeries du Bronx, je vais     limiter les informations retournées en précisant comme deuxième argument de ma recherche find, la clé name avec la valeur true. C'est un argument optionnel !</dd>
</dl>

````{tabbed} Projection en MongoDB

```javascript
db.NYfood.find({"cuisine": "Bakery", "borough": "Bronx"}, {"name": true})
```

````

````{tabbed} Projection en SQL

```sql
SELECT name
FROM NYfood
WHERE cuisine = 'Bakery' AND 'borough' = 'Bronx'
```

````

C'est donc l'équivalent du `SELECT name` en SQL. Jusqu'ici, on utilisais le `SELECT *` *(pour all)* c'est-à-dire qu'on récupérait toutes les valeurs de chaque clé ou de chaque attribut.

```{admonition} Embellissez vos résultats ! 
:class: tip

Les résultats de la fonction `find()` peuvent apparaître désorganisés. MongoDB fournit `pretty()` qui affiche les résultats sous une forme plus lisible. La syntaxe est la suivante : `collectionName.find().pretty()` 😉
```

Pour plus de renseignements sur la **fonction `find()`**, consultez la documentation MongoDB [disponible ici](https://docs.mongodb.com/manual/reference/method/db.collection.find/).

---

## <a name="operateurs"></a> Requêtes plus complexes en utilisant des opérateurs 

Les opérateurs se séparent en deux grandes parties : les **opérateurs de comparaison** et les **opérateurs logiques**.

 ```{admonition} Remarque
 
La syntaxe des requêtes avec des opérateurs de comparaison est la suivante : `db.nomDeLaCollection.find({"x": {operateur: valeur}})`. Le sous-document contenant l'opératuer peut en fait contenir plusieurs opérateurs et ainsi ne seront retournées que les documents vérifiant toutes les conditions.
```

### Opérateurs de comparaison

L'opérateur de comparaison permet de comparer deux élements entre eux. Le tableau suivant regroupe l'ensemble des opérateurs de comparaison : 

| Opérateur logique 	| Mot clé en MongoDB 	| 
|-	|-	|
| = 	| $eq 	|
| négation 	| $ne 	|
| < 	| $lt 	|
| > 	| $gt 	|
| ≤ 	| $lte 	|
| ≥ 	| $gte 	|
| ∈ 	| $in 	|
| ∉ 	| $nin 	|
| clé existante 	| $exists 	|
| \|.\| 	| $size 	|

Les opérateurs `$eq`, `$ne`, `$lt`, `$gt`, `$lte`, `$gte` s'utilisent de la même façon en MongoDB. Ces opérateurs comparent la valeur d'une variable à une valeur fixe (nombre, booléen, chaine de caractères...).

````{panels}

MongoDB
^^^
```javascript
db.t.find(
    {"a": {$gte : 1}
    }
)
```

---

SQL
^^^
```sql
SELECT *
FROM t
WHERE a >= 1 
```

````

Les opérateurs `$in` et `$nin` s'utilisent de la même façon en MongoDB. Ces opérateurs testent l'existence de la valeur d'une variable dans une liste. Sa façon de l'utiliser en MongoDB est la suivante : 

````{panels}

MongoDB
^^^
```javascript
db.t.find(
    {"a": { $in: ["chaine1", "chaine2"] }
    }
)
```

---

SQL
^^^
```sql
SELECT *
FROM t
WHERE a IN ("chaine1", "chaine2")
```

````

L'opérateur `$exists` vérifie l'existence d'une clé dans un document. Sa syntaxe en MongoDB est : 

```javascript
db.t.find(
    {"a": { $exists: true}
    }
)
```

> Cette requête renvera donc les documents ayant une clé `a`.

Enfin, l'opérateur `$size` permet des récuperer les documents avec des sous-documents d'une certaine taille. Sa syntaxe en MongoDB s'écrit comme suit :

```javascript
db.t.find(
    {"a": { $size: 5}
    }
)
```
Le résultat obtenu est l'ensemble des documents pour lesquels la clé `a` est de taille **5**.

### Opérateurs logiques

Les différents opérateurs logiques en MongoDB sont : `and`, `or`, `not` et `nor`. Ces opérateurs permettent de tester plusieurs conditions simultanément.

#### `and` logique

L'opérateur `and` renvoie les documents qui remplissent l'ensemble des conditions. Pour faire une requête avec un `and` logique en MongoDB, il suffit de séparer par une virgule chaque condition. L'exemple ci-dessous nous montre l'équivalence entre MongoDB et le langage SQL : 

````{panels}

MongoDB
^^^
```javascript
db.t.find(
    {"a": 1, "b": 5}
)
```

---

SQL
^^^
```sql
SELECT *
FROM t
WHERE a = 1 and b = 5
```

````

Le résultat de la requête sera les documents validant les deux conditions suivantes : `a` = **1** et `b` = **5**.

#### `or` logique

L'opérateur `or` permet de renvoyer les documents qui remplissent au moins un des conditions de la requête. Le `or` logique se construit de la manière suivane : `$or : [{condition 1}, ... , {condition i}]`. Voici un exemple faisant le parralèle entre le langage MongoDB et le langage SQL :

````{panels}

MongoDB
^^^
```javascript
db.t.find(
    {$or : [
      {"a": 1},
      {"b": 5}
      ]
    }
)
```

---

SQL
^^^
```sql
SELECT *
FROM t
WHERE a = 1 or b = 5
```

````

Le résultat de la requête sera les documents validant au moins un des deux conditions suivantes : `a` = **1** ou `b` = **5**.

#### `nor` logique

L'opérateur `nor` permet de renvoyer les documents ne validant pas une liste de condition(s). Voici sa syntaxe qui est très semblable à celle de `or` : 

```javascript
db.t.find(
    {$nor : [
      {"a": 1},
      {"b": "blue"}
      ]
    }
)
```

Le résultat de cette requête sera l'ensemble des documents ne contenant pas la valeur **1** pour la variable `a` et **"blue"** pour la variable `b`.

#### `not` logique

Pour plus de renseignements sur **les opérateurs**, consultez la documentation MongoDB [disponible à cette adresse](https://docs.mongodb.com/manual/reference/operator/query/).

---

## <a name="methodes"></a> Méthodes utiles pour des requêtes en MongoDB 

### Connaître la liste des collections dans une base de données

Pour connaître la **liste des collections** contenues dans une base de données, on utilise la commande suivante sur la base de données considérée :

```javascript
db.getCollectionInfos()
```

### Valeurs distinctes d'un champ : la méthode `distinct`

La méthode `distinct` permet de renvoyer **toutes les valeurs distinctes du champ spécifié**. C'est l'équivalent du `SELECT DISTINCT` en SQL.
Par exemple, la requête suivante en MongoDB permet d'afficher la **liste des notes attribuées à des restaurants du quartier « Manhattan » pour la collection NYfood.**

````{panels}

Syntaxe et exemple en MongoDB
^^^
```javascript
db.collectionName.distinct(champ, {...})
db.NYfood.distinct("grades.grade", {"borough": "Manhattan"}) 
```

---

Équivalent de la syntaxe en SQL
^^^
```sql
SELECT DISTINCT(champ)
FROM collectionName
WHERE ...
```

````

> À noter : il n'y a pas d'équivalent en SQL pour l'exemple des notes attribuées aux restaurants du quartier "Manhattan" présenté ici puisque **un attribut ne peut pas être une liste de valeurs en SQL**. 

### Compter le nombre d'éléments : la méthode `count`

La méthode `count` permet de **compter le nombre de documents dans une collection**. On peut l'utiliser directement sur la collection de base pour connaître le nombre de documents dans la collection ou bien l'utiliser après avoir exécuter une requête puisque la méthode `count()` accepte un document masque elle aussi.

````{tabbed} Sur une collection sans requête

```javascript
db.NYfood.count()
```
````

````{tabbed} Sur une collection après requête

```javascript
db.NYfood.find({"cuisine": "Bakery"}).count()
```
````

> Bien entendu, les résultats seront différents car nous n'avons pas le même nombre de documents avant et après un filtrage de données. Dans le premier exemple, on souhaite afficher le **nombre de documents dans la collection NYfood** tandis que dans le deuxième, on récupère le **nombre de documents correspondant à des boulangeries** *(pour lesquels le champ "cuisine" vaut "Bakery")*. 

### Trier la récupération des documents : la méthode `sort`

La méthode `sort` sert à **trier les documents de sortie** à partir d'une ou plusieurs clés. Pour choisir l'ordre de tri, il suffit de mettre `1` pour trier dans un **ordre croissant** et `-1` pour trier dans un **ordre décroissant**.

Par exemple, pour trier les documents de sortie en fonction de la clé `key1` de façon croissante on utilisera la syntaxe suivante :

```javascript
db.collectionName.find({}).sort(
  {"key1" : 1}
)
```

Il est également possible de faire un **tri sur plusieurs clés** :

```javascript
db.collectionName.find({}).sort(
  {"key1" : 1, "key2" : -1}
)
```

### Limiter la récupération des documents : la méthode `limit`

La méthode `limit` permet de **limiter le nombre de documents renvoyés**. Elle accepte les arguments numériques. Voici la syntaxe :

```javascript
db.collectionName.find({}).limit(2)
```

---

## Pour conclure ce chapitre 

### <a name="resume"></a> Fiche "résumé" pour bien démarrer en MongoDB

Objectif | Syntaxe 
--- | --- 
Récupérer toutes les occurrences de la collection | `db.collectionName.find({})`
Récupérer la première occurrence de la collection | `db.collectionName.findOne({})`
Filtrer les données | `db.collectionName.find({"x": valeur})`
Limiter l'affichage des clés | `db.collectionName.find({}, {"key": true}) `
Formater les documents de sortie | `db.collectionName.find({}).pretty()`  
Requêtes avec des opérateurs de comparaison | `db.collectionName.find({"x": {operateur: valeur}})`  
Trier les documents de sortie | `db.collectionName.find().sort({"key" : 1})`
Compter les documents de sortie | `db.collectionName.find({}).count()`
Limiter les documents de sortie | `db.collectionName.find({}).limit(2)` 
Valeurs distinctes d'un champ | `db.collectionName.distinct(champ, {})`

**Pour vous tester et être certain que vous avez bien compris, répondez aux questions du quiz ci-dessous.**

### <a name="quiz"></a> Quiz "Premières requêtes en MongoDB" : À vous de jouer ! 

**Qu'est-ce qui caractérise MongoDB ?**

1. C'est un modèle orienté graphique
2. C'est un modèle orienté document
3. C'est un modèle structuré

*Réponse 2 : C'est un modèle orienté document.*

**Que nous renvoie cette requête sur la collection `notes` de la base `etudiants` ?**

```javascript
db.notes.find({}, {"nom": true, "_id": false}) 
```

1. Affiche **tout** le contenu de la collection `notes`
2. Les noms des étudiants de la base et la clé `_id` qui identifie chaque étudiant
3. Tous les noms des étudiants de la base, mais pas les autres clés

*Réponse 3 : L'argument `"_id": false` permet de retirer l'affichage de la clé `id`. On ne récupère que le noms des étudiants de la base.*

**Comment récupérer la liste des étudiants ayant obtenu exactement deux notes ?**

1. `db.notes.find({"notes": {$size: 2}})`
2. `db.notes.find({"notes": {$exists: true}})`
3. `db.notes.find({$or: [{"notes": {$size: 1}},{"notes": {$size: 2}}]})`

*Réponse 1 : L'opérateur `$size` permet de prendre en compte la taille de la liste de valeurs, telle qu'une liste de notes. Ici on souhaite que la liste de notes soit précisement de taille 2.*

**Quel opérateur permet de ne renvoyer que les documents qui ne vérifient aucune condition de la liste ?**

1. L'opérateur `$eq`
2. L'opérateur `$nor`
3. L'opérateur `$gt`

*Réponse 2 : L'opérateur `$nor` permet de ne renvoyer que les documents qui ne vérifient aucune condition de la liste.*

**Quelle méthode ci-dessous ne fait pas partie du langage MongoDB ?**

1. `db.collectionName.find({}).orderby({"key" : 1})`
2. `db.collectionName.find({}).sort({"key" : 1})`
3. `db.collectionName.find({}).limit(3)`

*Réponse 1 : Bien que `ORDER BY` soit une instruction en SQL, ce n'est pas disponible pour les bases de données en MongoDB.*


Afin que le langage MongoDB n'ait plus aucun secret pour vous, nous vous invitons à lire les **chapitres suivants** et à consultez la [documentation MongoDB](https://docs.mongodb.com) !
