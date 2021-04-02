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

# Attributs de type liste

* Auteurs/trices : **Malo REYNES, Lucas ROBIN, Fiona TUFFIN**

Ce chapitre traite des attributs de type liste et des différents types de requêtes que l'on peut vouloir faire sur de tels attributs

En MongoDB, un document est composé de couples clé/valeur. Une clé peut être considérée comme le nom d'une variable (attribut) à laquelle correspond une valeur pour un individu. L'attribut peut être de plusieurs types : chaîne de caractères, booléen, nombre, liste ou date. C'est aux attributs de type *liste* que nous nous intéressons ici. En MongoDB comme en python, une liste est, comme son nom l'indique, une série de valeurs, ces valeurs pouvant être de tous types. Une liste peut également contenir des sous-listes. Il est possible de réaliser plusieurs opérations sur les listes telles qu'obtenir sa taille, récupérer son minimum, son maximum, sa moyenne et autres. Il faut toutefois faire attention à certains "pièges" que nous exposerons.
 
Les exemples pour cette partie concernent les listes de notes des élèves de la collection notes de la base de données etudiants.
et l'attribut qui lui est associé sera la valeur que prend cette variable pr l'individu
et l'attribut correspondra a la valeur correspondante
# Notes :

Lorsqu'une liste n'existe pas, la condition posée dessus est automatiquement vérifiée.

Sans le $elemmatch, si les conditions sont vérifiées par la liste, c'est l'entièreté de la liste qui est retournée.
Avec le $elemmatch, on regarde toutes les notes une par une et on décide à chaque fois si elle valide nos conditions.

Est-ce qu'on s'intéresse à la création de liste en mode création de variables ?
