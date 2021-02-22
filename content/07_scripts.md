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
---

# Effectuer des requêtes depuis des programmes Python ou R

## Requêtes depuis Python : `pymongo`

* Auteurs/trices : **TODO**

Comment faire pour effectuer les requêtes présentes dans les chapitres 1 à 6 avec `pymongo` ?

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/07_scripts.md`.

Petit exemple ici d'utilisation de `pymongo` :

```{code-cell} python3
from pymongo import MongoClient

client = MongoClient(host="localhost", port=1234)
db = client.food

db.NYfood.find({"name": "/^A/"})
```




## Requêtes depuis R : `mongolite`

* Auteurs/trices : **TODO**

Comment faire pour effectuer les requêtes présentes dans les chapitres 1 à 6 avec `mongolite` ?

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/07_scripts.md`.

```{code-cell} python3
:tags: ["hide-cell"]

%load_ext rpy2.ipython
```

```{code-cell} python3
%%R

library(mongolite)
coll <- mongo("NYfood", url = "mongodb://localhost:1234/food")
print(coll)
```
