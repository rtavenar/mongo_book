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
  display_name: Python 3
  language: python
  name: python3
output:
  html_document:
    df_print: paged
  pdf_document: default
---


# Interogation de base de données NoSql de type MongoDb grace à python

(sec:pymongo)=
# Requêtes depuis Python : `pymongo`

* Auteurs : Pierre Cottais, Tom Houée, Florian Guillaume

**Comment faire pour effectuer les requêtes présentes dans les chapitres 1 à 6 avec `pymongo` ?**


**Sommaire :**


1. [Présentation et installation](#partie1)
2. [Connexion serveur, base de données et collections](#partie2)
3. [Requêtes](#partie3)  
  3.1. [Requêtes simple et ces spécifictés](#partie31)  
  3.2. [Les Index](#partie32)  
  3.3. [Requête d'aggrégation](#partie33)  
  3.4. [Requête de modifications](#partie34)  
4. [Exercices et corrections (si le temp)](#partie4)
5. [Exportation au format JSON](#partie5)

## Présentation et installation <a id="partie1"></a>
PyMongo est une librairie Python contenant des outils pour travailler avec MongoDB et MongodbAtlas. PyMongo est maintenue par les développeurs de MongoDB officiel ce qui en fait la référence dans Python. Pour une documentation détaillée de la librairie, vous pouvez consulter la documentation :

**https://pymongo.readthedocs.io/en/stable/**

Pour importer la librairie, nous pouvons le faire avec la commande ```pip install pymongo```, dans un terminal tel Anaconda Prompt par exemple.
Remarque : elle est déjà incluse dans la distribution Anaconda.
```{code-cell}
import pymongo 
```

## Connexion serveur, base de données et collections <a id="partie2"></a>
La première étape consiste a créer une connexion avec nos bases de données sur le serveur de MongoDB. Pour effectuer cette connexion, nous devons utiliser une URI qui est une URL. Il  existe différentes URI de connexion, mais ici nous devons juste nous connecter à notre serveur local Mongodb. Pour voir les différents moyens de vous connecter a des serveurs extérieurs ou par exemple MongodbAtlas voir la page: 

**https://docs.mongodb.com/manual/reference/connection-string/.**

Ainsi notre URL de connexion est "mongodb://localhost:27017" avec notre :
* chaine de connexion : mongodb://
* host: localHost
* port: 271017.  

Pour utilser cette URL nous utilisons la fonction MongoClient de pymongo qui nous fait notre connexion.
```{code-cell}
from pymongo  import MongoClient

client = MongoClient(host="localhost", port=27017)

# ou bien 

db_uri = "mongodb://localhost:27017/"
client = MongoClient(db_uri)

# affichage un objet
print(client)
```
```{code-cell}
print(type(client))
```

Ainsi, nous pouvons voir que la fonction créer un objet de class 'pymongo.mongo_client.MongoClient' ou nous retrouvons nos informations comme le host le port etc...
La deuxième étape consiste à nous connecter à notre base de données et nos collections, nous prendons ici l'exemple de la base de données *food*:

**Syntax : Client.BasedeDonnee.Collection ou Client["BasedeDonnee"]["Collection"]**

```{code-cell}
db_name = "food"
db = client[db_name]

# ou bien

db = client.food

print(db)
```
```{code-cell}
print(type(db))
```

Ainsi, il nous retourne un objet de classe 'pymongo.database.Database'. 
Enfin, il ne nous reste plus qu'à récupérer la collection souhaitée. Cela est le même principe pour utiliser les collections et qui cette fois nous retourne un objet 'pymongo.collection.Collection'. Ici, nous prenons l'exemple de la collection *NYfood*.
```{code-cell}
coll_name = "NYfood"
coll = db[coll_name]

# meme syntax qu'auparavant

coll = db.NYfood

print(coll)
```

```{code-cell}
print(type(coll))
```

De plus, pymongo a une fonction bien pratique qui permet d'afficher la liste des collection contenue dans une base de données :
```{code-cell}
db.list_collection_names()
```

En résumer, le package pymongo vous permet d'utiliser trois types d'objets via votre IDE python : les clients, les bases de données et les collections. Ces objets vont avoir des méthodes attitrées nous permettant d'effectuer des requêtes, nous les détaillerons dans la suite du cours.

Remarque: Vous pouvez remarquer que cela fonction comme un dictionnaire python. Toutefois, si votre base contient des caractères spéciaux, espace ou autre on vous conseille la première écriture : Client["BasedeDonnee"]["Collection"].

## Requetes <a id="partie3"></a>
Maintenant que nous avons fait nos connexions, il nous reste à voir comment effectuer des requêtes.

**Fonctionnement :**
Le fonctionement est le même que sur l'interface MongoDb:

**Syntax : db.nomDeLaCollection.requete() ou Client["BasedeDonnee"]["Collection"].requete()**

|Requete|Fonctionement|
|------|--------|
|    find()    |    Recherche tous les individus selon les critères indiqués    |
|    find_one()   |    Affiche le premier individu correspondant aux critères indiqués    |

Mais le résultat est différent, il nous renvoie un objet de type "Cursor". En effet, le module pymongo ne stockera pas les résultats dans une liste par souci de mémoire : 
Par exemple, ici nous réccupérons toutes les boulangeries de la collection *NYfood*.
```{code-cell}
db.NYfood.find({"cuisine": "Bakery"})
```

Ainsi, pour accéder au contenu de la requête il nous faut parcourir l'objet renvoyé par celle-ci, comme un objet itérable en Python.
Exemple, on affiche les deux premiers individus issue de la requête.
```{code-cell}
cursor = db.NYfood.find({"cuisine": "Bakery"})

# afficher les 2 premiers individus
for rep in cursor[:2]:    
  print(rep)
```

Nous pouvons afficher l'ensemble des réponses, mais cela peut demander beaucoup de mémoire pour votre ordinateur en fonction de la requête demander. Pour ce faire, on utilise la ligne suivante.
```python
print(list(cursor))
```

Il est donc préférable d'afficher les premiers resultats pour voir si votre requête est juste. Par exemple avec la requête *find_one()* affiche que le premier individu correspondant aux critères indiqués, exemple la première boulangerie de la collection:
```{code-cell}
db.NYfood.find_one({"cuisine": "Bakery"})
```

De plus, vue que notre réponse est un dictionnaire et que nous connaissons la structure alors nous pouvons aller chercher les informations qui nous intéressent.
Ainsi, nous récupérons ci-dessous la localisation et les coordonnées du premier individu issue de notre requête:
```{code-cell}
cursor = db.NYfood.find({"cuisine": "Bakery"})
cursor=list(cursor)
print(cursor[0]["address"]["loc"]["coordinates"])
```

De plus, pour utiliser certaines méthodes sur nos requêtes comme sort(), c'est sensiblement la même syntaxe que Mongodb:
**Syntax : Client.BasedeDonnee.Collection.requetes().methode() ou Client["BasedeDonnee"]["Collection"].requete().methode()**
Mais nous ne pouvons pas utiliser ces méthodes à l'objet *Cursor* car ces méthodes font partie intégrante de la requête.

|Méthodes Python|Fonctionalité|
|------|----------|
|    sort()    |    Trie les individus    |
|    count()   |    Compte le nombre d'individu issue de la requete    |
|    limit()    |    Affiche les n premiers individus souhaités    |
|    explain()    |    Permet d’obtenir un certain nombre d’informations sur le déroulement d’une requête |
|    distinct()    |    Supprime les doublons    |
    
**Exemples :**
```python
db.NYfood.find({"cuisine": "Bakery"}).limit(2) # Affiche les deux premiers résultats
db.NYfood.find({"cuisine": "Bakery"}).sort("name", -1)) # Trie les résultats par ordre décroissant par rapport à la variable name
db.NYfood.find({"cuisine": "Bakery"}).limit(2).explain("executionStats") # Affiche les informations 
db.NYfood.distinct("grades.grade", {"cuisine": "Bakery"}) #  liste des notes attribuées aux boulangeries
```
### Requetes simples et ses spécifictés <a id="partie31"></a>
L'utilisation de pymongo implique l'utilisation de certaines specificités, deux principalement qui marquent une différence avec MongoDb.
Premièrement, nous avons une spécifité avec les opérateurs et les noms qui doivent être toujours dans des guillemets comme ```$gte```.
Exemple:
```{code-cell}
db.NYfood.find({"name": {"$gte" : "Y"}})
```

La deuxième spécificité concerne les dates, on utilise le module datetime et pymongo va de lui même effectuer la conversion au format "date" de MongoDb.
Exemple, liste des restaurants ayant au moins une note postérieure au 20 janvier 2015
```{code-cell}
from datetime import datetime

date = datetime.strptime("2015-01-20", "%Y-%m-%d")

db.NYfood.find({"grades.date": {"$gte": date}})
```

**Astuce**
Dans le but de rendre nos requêtes plus lisible, il est possible de créer des variables python qui correspondent aux conditions que nous utilisons pour nos requêtes.
Par exemple, nous voulons afficher la liste des restaurants qui vérifient l’une des ces conditions suivantes :
* le restaurant appartient aux quartiers de "Manhattan"
* le restaurant est une boulangerie du Bronx commençant par la lettre "P"

```{code-cell}
db = client["food"]
coll = db["NYfood"]

dico_cond1 = {}
dico_cond1["borough"] = "Manhattan"

dico_cond2 = {}
dico_cond2["borough"] = "Bronx"
dico_cond2["cuisine"] = "Bakery"
dico_cond2["name"] = {"$gte": "P", "$lt": "Q"}

req = {}
req["$or"] = [dico_cond1, dico_cond2]

cursor = coll.find(req)
cursor = list(cursor)
print(cursor[0])
```

Forme plus brutale: 
```{code-cell}
cursorbis = coll.find({$or: [{"borough": "Manhattan"}, 
			     {"cuisine": "Bakery", "borough": "Bronx", "name": {"$gte": "P", "$lt": "Q"}}
			     ]})
cursorbis = list(cursorbis)
print(cursorbis[0])
```

De plus, nous pouvons remarquer que ce sont deux objets *Cursor* différents, mais qu'ils ont bien le même contenu.
```{code-cell}
print(cursorbis == cursor)
print(cursorbis[0] == cursor[0])
```

### Les index <a id="partie32"></a>
Les index sont des structures de données spéciales qui stockent une petite partie de l'ensemble de données de la collection sous une forme facile à parcourir. L'index stocke la valeur d'un champ spécifique ou d'un ensemble de champs, triés par la valeur du champ. Ainsi, l'utilisations avec pymongo est la même qu'en mongoDB.

|Requete|Fonctionement|
|--------|--------|
|    index_information()    |  Pour obtenir la liste des indexs de la collection      |
|    create_index()   |    Créeation d'un index   |
|  drop_index()     | Suppression d'un index      |

**Exemple:**
L'ensemble des index de la collection NYfood:
```{code-cell}
db = client["food"]
coll = db["NYfood"]

for k, v  in coll.index_information().items():
    print("{}, {} \n".format(k, v))
```

```python
db.NYfood.drop_index("borough_1")
db.NYfood.create_index("borough_1")
```

### Les requêtes d'agrégation <a id="partie33"></a>
Les requêtes d'agrégation ont pour but de faire des calculs simples (agrégats) sur toute la collection ou seulement sur certains groupes. Pour ce faire, on utilise la méthode ```aggregate()``` .

Dans l'exemple ci-dessous, on souhaite compter le nombre de restaurants dans la collection en les regroupant par quartier.
```{code-cell}
# aggrégation
cursor_agreg = coll.aggregate([
  {"$group": {"_id": "$borough",
              "nb_restos": {"$sum": 1}}
  }
])

# affichage
for agreg in cursor_agreg:
    print(agreg["nb_restos"], "restaurants dans le quartier", agreg["_id"])
```

**Bonus, exemple d'utilsation du resultat d'une aggregation** 
La méthode aggregate nous permets de faire des calculs, des regroupement, etc... Mais on a envie d'exploiter ce résultat en créant un graphique ou en le stockant dans un fichier à part par exemple et c'est possible.
Création d'un graphique montrant pour chaque valeur possible de note, le nombre de fois qu’elle a été attribuée.
```python
import matplotlib.pyplot as plt

cursor.agrr = client.food.NYfood.aggregate([
                                              {"$unwind": "$grades"},
                                              {"$group": {_id: "$grades.grade", nb: {"$sum": 1}}}
                                            ])

# exploitation du resultat                                  
l_nb = []
l_grade = []
for obj in cursor.agrr :
    l_nb.append(obj["nb"])
    l_grade.append(obj["_id"])


plt.figure(figsize = (10, 5))
plt.bar(l_grade, l_nb, color ='blue', width = 0.4)
plt.xlabel("Note")
plt.ylabel("Count")
plt.title("Number of times assigned to a note")
plt.show()
```

### Les modifications <a id="partie34"></a>
Contrairement aux requêtes d'interrogation, les requêtes de modifications peuvent modifier la base de données.Avec la librairie pymongo l'ecriture est la mêm qu'en MongoDB.

|Requete|Fonctionement|
|--------|--------|
|  insert_one()	|  Insertion d'un seul document  	|
|  insert_many()   |	Insertion d'une liste de documents   |
|  delete_one() 	|   Suppression d'un document	|
|  delete_many() 	|   Suppression d'une liste de documents	|
|  update_one() 	|   Modification d'un document	|
|  update_many() 	|   Modification d'une liste de documents	|
|  replace_one() 	|   Remplacement d'un document	|

```python
db.NYfood.insert_one(
  {
	"_id" : ObjectId("nouvel_id_resto"),
	"address" : {
    	"building" : "3",
    	"loc" : {
        	"type" : "Point",
        	"coordinates" : [
            	-1.6773,
            	48.111
        	]
    	},
    	"street" : "Rue du Vau Saint-Germainl",
    	"zipcode" : "35000"
	},
	"borough" : "KilKenny's Pub",
	"cuisine" : "Bar, Pub",
	"grades" : [
    	{
        	"date" : ISODate("2021-04-08T00:00:00.000Z"),
        	"grade" : "A",
        	"score" : 9
    	}
	],
	"name" : "KilKenny's Pub",
	"restaurant_id" : "99999999"
}
)
```

Remarque : si la collection NYfood n'existe pas encore dans la base de données. Elle sera automatiquement créée lors de l'insertion d'un document dans cette nouvelle collection. La méthode ```db.create_collection()``` est donc facultative.

## Exercices et corrections <a id="partie4"></a>
*Trouvez les restaurants qui n'ont recu que des notes égales à B.

````{tabbed} Python

```python
condi1 = {"grades.grade": {"$exists": False}}
condi2 = {"grades.grade": {"$size": 0}}
condi3 = {"grades.grade": {"$gt": "B"}}
condi4 = {"grades.grade": {"$lt": "B"}}

l = [condi1, condi2, condi3, condi4]

req = {"$nor": l }

cursor = db.NYfood.find(req)

print(list(cursor[:2]))
```

````
````{tabbed} MongoDB

```javascript
db.NYfood.find({$nor: [{"grades.grade": {$exists: false}},
{"grades.grade": {$size: 0}},
{"grades.grade": {$gt: "B"}},{"grades.grade": {$lt: "B"}}]})

```

````

On vous demande de conserver les quartiers ayant moins de 1000 restaurants.
````{tabbed} Python
```python
dico_match = {"$match": {"borough": {"$ne": "Missing"}}}

dico_group = {"$group": {"_id": "$borough", "nb_restos": {"$sum":1}}}

dico_match2 = {"$match": {"nb_restos": {"$lt": 1000}}}
dico_sort = {"$sort": {"nb_restos": -1}}

l = [dico_match, dico_group, dico_match2, dico_sort]
             
db.NYfood.aggregate(l)
```
````

````{tabbed} MongoDB


```javascript
db.NYfood.aggregate([
{$match: {"borough": {$ne: "Missing"}}},
{$group: {_id: "$borough",
nb_restos: {$sum:1}}},
{$match: {nb_restos: {$lt: 1000}}},
{$sort: {"nb_restos": -1}}
])
```
````


Trouvez tous les restaurants qui possède le mot "Pizza" dans le nom de l'enseigne.
````{tabbed} Python
```python
db.NYfood.find({"name": "/Pizza/"})

```
````

````{tabbed} MongoDB
```javascript
db.NYfood.find({"name": /Pizza/})
```
````

## Exportation au format JSON <a id="partie5"></a>
Les résultats obtenus après une requête peuvent être conservé dans le but d'un projet ou d'une étude quelconque. Ainsi, nous vous proposons d'enregistrer vos requêtes sous la forme d'un format JSON.

Remarque: le module JSON ne peut écrire dans un fichier avec des données de types classiques comme liste, dictionnaire, nombre, caractère . En l'occurrence, un identifiant qui aura une classe "ObjectID" ne pourra être écrit dans le fichier directement. De même pour les objets datetime. Nous nous devons donc de les convertir en chaine de caractère au préalable.
```{code-cell}
import json

cursor = db.NYfood.find({"cuisine": "Bakery"})

cursor = list(cursor[:10])

for elt in cursor:
    elt["_id"] = str(elt["_id"])
    for grade in elt["grades"]:
        grade["date"] = grade["date"].strftime("%Y-%d-%m")
        
dico = {"Bakery" : cursor}

with open("Bakery", 'w', encoding='utf-8') as jsonFile:
    json.dump(dico, jsonFile, indent=4)
```
