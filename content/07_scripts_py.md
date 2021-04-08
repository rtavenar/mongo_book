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
3. [Requetes](#partie4)
  3.1. [Requetes simple et ces spécifictés](#partie41)
  3.2. [Les Indexes](#partie42)
  3.3. [Requetes aggrégation](#partie43)
  3.4. [Requetes modifications](#partie44)
4. [Exercices et corrections (si le temp)](#partie5)
5. [Exportation au format JSON](#partie6)

## Présentation et installation <a id="partie1"></a>

PyMongo est une librairie Python contenant des outils pour travailler avec MongoDB et MongodbAtlas. PyMongo est maintenue par les développeurs de MongoDB officiel ce qui en fait la référence dans Python. Pour une documentation détaillée de la librairie, vous pouvez consultez la documentation :

**https://pymongo.readthedocs.io/en/stable/**

Pour importer la librairie nous pouvons le faire avec la commande ```pip install pymongo```, dans une console terminal tel Anaconda Prompt par exemple.

Remarque : elle est déjà incluse dans la distribution Anaconda.

```{code-cell}
import pymongo 
```
## Connexion serveur, base de données et collections <a id="partie2"></a>

La premiere étape consiste a créer un connexion avec nos base de données sur le serveur de MongoDB. Pour effectuer cette connexion, nous devons utiliser une uri qui est une url. Il  existe différentes uri de connexion mais ici nous devons juste nous connecter à notre serveur local Mongodb. Pour voir les différents moyens de vous connecter a des serveur extérieur ou par exemple MongodbAtlas voir la page: 

**https://docs.mongodb.com/manual/reference/connection-string/.**

Ainsi notre url de connexion est "mongodb://localhost:27017" avec mongodb:// qui est notre chaine de connexion, notre host: localHost, et notre port: 271017.  
Pour utilser cette url nous utilisons la fonction MongoClient de pymongo qui nous fait notre connexion.

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

Ainsi nous pouvons voir que la fonction créer un objet de class 'pymongo.mongo_client.MongoClient' ou nous retrouvons nos informations comme le host le port etc...


La deuxième étape consiste a nous connecter a notre base de données et nos collections, nous prendons ici l'exemple de la base de données food:


**Syntax : Client.Basededonnee.Collection ou Client["BasedeDonnee"]["Collection"]**

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
Enfin, il ne nous reste plus qu'à récupérer la collection souhaité. 
Cela est le même principe pour utiliser les collections et qui cette fois nous retourne un objet 'pymongo.collection.Collection'. Ici nous prenons l'exemple de la collection NYfood.

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

En résumer, le package pymongo vous permet d'utiliser trois types d'objets via votre IDE python : les clients, les base de données et les collections. Ces objets vont avoir des méthodes attitrés nous permettant d'effectuer des requetes, nous les détaillerons dans la suite du cours.

Remarque: Vous pouvez remarquer que cela fonction comme un dictionnaire python. Toutefois, si votre base contient des caractère spéciaux, espace ou autre on vous conseille la première écriture : db["NYfood"].


## Requetes <a id="partie3"></a>

Maintenant que nous avons fait nos connexions,il nous reste a voir comment effectuer des requetes.

**Fonctionnement :**

Le fonctionement est le meme que sur l'interface MongoDb:

**Syntax : db.nomDeLaCollection.requete() ou Client["BasedeDonnee"]["Collection"].requete()**

|Requete|Fonctionement|
|------|--------|
|    find()    |    Recherche tous les individus selon les critères indiqués    |
|    find_one()   |    Affiche le premier individu correspondant aux critères indiqués    |

Mais le resultat est différent, il nous renvoie un objet de type "cursor". En effet, le module pymongo ne stockera pas les résulats dans une liste par soucis de mémoire : 

Par exemple, ici nous reccuperons toutes les boulangeries de la collection.

```{code-cell}
db.NYfood.find({"cuisine": "Bakery"})
```

Pour Acceder au contenu de la requete, il nous faut parcourir l'objet renvoyé par la requete, comme un objet itérable classique:

On affiche les deux premiers individus issue de la requete.

```{code-cell}
cursor = db.NYfood.find({"cuisine": "Bakery"})

# afficher les 2 premiers individus

for rep in cursor[:2]:    
  print(rep)
```

Ou bien :

```{code-cell}
print(list(cursor[:2]))
```

Nous pouvons afficher l'ensemble des réponse mais cela peut demander beaucoup de memoire pour votre ordinateur en fonction de la requete demander. Pour se faire, on utilise la ligne suivante.


```{}
print(list(cursor))
```


Il est donc préférable d'afficher les premier resultats pour voir si votre requete est juste. 

Si nous ne voulons afficher que le premier individu conrrespondant aux critères indiqués, ici nous demandons la première boulangerie de la collection:

```{code-cell}
db.NYfood.find_one({"cuisine": "Bakery"})
```

Ainsi, vue que notre réponse est un dictionnaire et que nous connaissons la structure alors nous pouvons aller chercher les informations qui nous intérresse.
Ainsi, nous recupérons ci-dessous la localisation et les coordonées du premier individu issue de notre requette:

```{code-cell}
print(cursor[0]["loc"]["coordinates"])
```

De plus, pour utiliser certaine methode comme sort(), nous devons le mettre sous cette forme : 

**Syntax : BasedeDonnee.Collection.requetes().methode()**

Nous ne pouvons pas utiliser ces methodes a l'objet cursor car ces methodes vont partie intégrante de la requete.

|Méthodes Python|Fonctionalité|
|------|----------|
|    sort()    |    Trie les individus    |
|    count()   |    Compte le nombre d'individu issue de la requete    |
|    limit()    |    Affiche les n premiers individus souhaités    |
|    explain()    |    Permet d’obtenir un certain nombre d’informations sur le déroulement d’une requête |
|    distinct()    |    Supprime les doublons    |
    

**Exemples :**

```{}
db.NYfood.find({"cuisine": "Bakery"}).limit(2) # Affiche les deux premiers résultats
db.NYfood.find({"cuisine": "Bakery"}).sort("name", -1)) # Trie les résultats par ordre décroissant par rapport à la variable name

```
### Requetes simples et ses spécifictés <a id="partie31"></a>


L'utilisation de pymongo implique l'utilisation de certaines specificités, deux principalement, qui marquent une différence avec MongoDb.

Premièrement, nous avons une specifité avec les opérateurs et les noms qui doivent être toujours dans des guillemets comme ```$gte```.

```{code-cell}
db.NYfood.find({"name": {"$gte" : "Y"}})
```

En ce qui concerne les dates, on utilise le module datetime et pymongo va de lui meme effectuer la conversion au format "date" de MongoDb.

Par exemple,la requete suivante affiche la liste des restaurants ayant au moins une note postérieure au 20 janvier 2015

```{code-cell}
from datetime import datetime

date = datetime.strptime("2015-01-20", "%Y-%m-%d")

db.NYfood.find({"grades.date": {"$gte": date}})

```


**Astuce**

Dans le but de rendre nos requetes plus lisible, il est possible de créer des variables python qui correspondent aux conditions que nous utilisons pour nos requetes.
 
Par exemple, nous voulons afficher la liste des étudiants qui vérifient l’une des deux conditions suivantes :
de sexe féminin ; dont le prénom commence par la lettre "M".
Vue le nombre de conditions, nous décidons d'utiliser notre astuce pour rédiger cette requete.

```{code-cell}

db = client["etudiants"]
coll = db["notes"]

dico_cond1 = {}
dico_cond2 = {}

dico_cond1["sexe"] = "F"
dico_cond2["nom"] = {"$gte" : "M", "$lt": "N"}

l = [dico1,dico2]
cursor = coll.find({"$or": l })
print(cursor[0])

```

Forme classique: 
```{code-cell}
cursorbis = coll.find({"$or": [{"sexe": "F"},
                       {"nom": {"$gte": "M", "$lt": "N"}}]})

print(cursorbis[0])
```

**Test :**

```{code-cell}
print(cursor[0] == cursorbis[0])
```

L'égalité est bien vérifié.


