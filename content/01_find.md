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

## Opérateurs

Les opérateurs se séparent en deux grandes parties : les **opérateurs de comparaison** et les **opérateurs logiques**

### Opérateurs de comparaison

L'opérateur de comparaison permet de ?????????



### Opérateurs logiques

Les différents opérateurs logiques en MongoDB sont : `and`, `or` et `nor`. Ces opérateurs de tester plusieurs conditions simultanément

#### `and` logique

L'opérateur `and` renvoie les documents qui remplissent l'ensemble des conditions. Pour faire une requête avec un `and` logique en MongoDB, il suffit de séparer par une virgule chaque condition. L'exemple ci-dessous nous montre l'équivalence entre MongoDB et le langage SQL : 

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

Le résultat de la requête sera les documents validant les deux conditions suivantes : `a` = **1** et `b` = **5**.

#### `or` logique

L'opérateur `or` permet de renvoyer les documents qui remplissent au moins un des conditions de la requête. Le `or` logique se construit de la manière suivane : `$or : [{condition 1}, ... , {condition i}]`. Voici un exemple faisant le parralèle entre le langage MongoDB et le langage SQL :

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
Le résultat de la requête sera les documents validant au moins un des deux conditions suivantes : `a` = **1** ou `b` = **5**.

#### `nor` logique

L'opérateur `nor` permet de renvoyer les documents ne validant pas une liste de condition(s). Voici sa syntaxe qui est très semblable à celle de `or` : 

MongoDB
^^^
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
