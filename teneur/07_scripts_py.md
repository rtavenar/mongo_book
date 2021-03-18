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

(sec:pymongo)=
# Requêtes depuis Python : `pymongo`

* Auteurs/trices : Pierre Cottais, Tom Houée, Florian Guillaume

Comment faire pour effectuer les requêtes présentes dans les chapitres 1 à 6 avec `pymongo` ?

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/07_scripts_py.md`.

Petit exemple ici d'utilisation de `pymongo` :

```{code-cell}
from pymongo import MongoClient

client = MongoClient(host="localhost", port=27017)
db = client.food

db.NYfood.find({"name": "/^A/"})
```
Test
