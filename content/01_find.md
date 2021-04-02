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

# Premières requêtes

* Auteurs/trices : **Julie FRANCOISE, Manon MAHEO et Valentin PENISSON**

Ce chapitre traite des points suivants :
* Syntaxe de requêtes simples (syntaxe de `find`, opérateurs de comparaison, `distinct`, `count`, `sort`, `limit`)

## Interrogation des données et syntaxe de `find`
 
 ```{admonition} Remarque
Toute commande sur la collection restaurants utilise le préfixe : "db.restaurants". Il suffira d’y associer la fonction souhaitée pour avoir un résultat.
```
 Pour filtrer les données, on utilise la fonction find. 
 
 Il existe en mongoDB deux types de requêtes simples, retournant respectivement toutes les occurences d'une collection ou la premiere 
 tous les élements et aucune contrainte
 db.NYfood.find() 
 ne retourne que le premier élément de la liste de résultats
 db.NYfood.findOne()

lorsqu'on ajoute un {} vide entre parenthèses, pas de contrainte.

mais on peut aussi utiliser un document masque, si l'on souhaite fixer des contraintes sur les documents à retourner, pour cela
il suddifit de passer en argument d'une de ces fonctions un document masque contentant les valeurs souhaitées.

Par exemple, la requête suivante retourne tous les documents ayant un champ "x" dont la valeur est "y".

````{tabbed} Syntaxe

```mongoDB
db.nomDeLaCollection.find({"x":"y"})
```
````
 
````{tabbed} Exemple sur la base de données NYfood

```mongoDB
db.NYfood.find({"cuisine":"Bakery"})
```

````
 
 
 
 
 

## Les opérateurs

Les opérateurs se séparent en deux grandes parties : les **opérateurs de comparaison** et les **opérateurs logiques**

### Les opérateurs de comparaison

L'opérateur de comparaison, comme son l'indique, compare deux valeurs 



### Les opérateurs logiques
