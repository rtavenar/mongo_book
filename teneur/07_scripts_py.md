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
4. [Exercices et corrections (si le tempxs)](#partie5)
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

