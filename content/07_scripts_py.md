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
