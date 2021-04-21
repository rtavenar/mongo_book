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

# Les requêtes d'agrégation

## Regroupements


* Auteurs/trices : **CASTRIQUE Jérémy, NOJAC Dimitri, VAVASSEUR Salomé**

Dans cette partie, nous allons étudier **les regroupements dans les requêtes d'aggrégation**. Dans un premier temps, nous étudierons ce qu'est l'étape de regroupement. Ensuite nous regarderons comment effectuer des calculs à l'aide des 4 d'opérateurs qui sont : **$sum, $max, $min, $count**. 
  * somme, count, max, min, avec ou sans groupe

Les requêtes de regroupement vont permettre d'effectuer des opérations d'accumulation sur des documents regroupés. Il est l'équivalent de l'opérateur GROUP BY en SQL.

## exemple de requête sans regroupement

SQL


```sql
SELECT SUM(att) as nb
FROM t
```
MongoDB

```javascript
db.coll.aggregate([
  {$group:
    {_id: null, 
    nb: {$sum: "$att"}}
  }
])
```
  
## exemple de requête avec regroupement

Pour sélectionner certains individus, il faut filtrer sur l'id.

Sur la base de NYfood, on peut notamment filtrer par quartier.

Voici un exemple de requête :

```javascript
db.NYfood.aggregate(
[
  {$group:
    {
    _id: "$borough",
    nb: {$sum: 1}
    }
  }
]
)
```

Dans cette requête, Mongodb va compter pour chaque groupe, le nombre d'individu ayant le même id et donc compter les restaurants d'un même quartiers ensemble.


## opérateur $sum

### Comptage du nombre d'individus 
#### Sans regroupement
Regardons une requête simple :

db.NYfood.aggregate(
      [{$group:{
          _id: null,
          nb: {$sum: 1}
          }
        }
       ]
)

On utilise la fonction aggregate.
Lorsqu'on utilise aggregate, il faut donner les individus sur lesquels on veut faire la requête.
Dans notre cas, on choisit tout les individus. On le note id: null
On créé notre variable qu'on appelle nb qui va faire la somme de tout les individus.


Dans cet exemple, nous avons compté le nombre d'individus sans sélection.

En pratique, cela n'a pas forcément beaucoup d'intérêt.

Il s'avère plus utile de pouvoir sélectionner le nombre de variables répondant à un critère. Pour cela, nous allons regarder avec une requête de regroupement.

#### Avec regroupement
Toujours dans la collection notes e la base étudiants, on cherche à connaitre le nombre détudiantes et d'étudiants. Pour cela, on va effectuer un regroupement sur l'attribu sexe.

```javascript
db.notes.aggregate(
      [{$group:{
          _id: "$sexe",
          nb_etud: {$sum: 1}
          }
        }
       ]
)
```

On obtient donc 2 listes diférentes:
* une contenant F et 2
* l'autre contenant M et 5

Il y a donc eu un comptage du nombre d'étudiants en fonction de la variable sexe.

L'équivalent en SQL est :

```sql
SELECT COUNT(*) AS nb_etud
FROM notes
GROUP BY sexe
```
### Additionner des variables
#### Sans regroupement
Jusqu'ici, nous avons compté le nombre d'individus grâce à l'attribu **$sum**, mais celui ci permet aussi **d'additionner des variables**.

On se place maintenant dans la collection cesars2016 de la base cinema.

```javascript
db.cesars2016.aggregate(
[
{$group:
{
_id: null,
duree_tot: {$sum: "$durée"}
}
}
]
)
```

Ici, on calcule la somme des durées des films de la base.

Son équivalent en SQL est :

```sql
SELECT SUM(durée)
AS duree_tot FROM t
```

#### Avec regroupement
Si on veut sélectionner les sommes des durées de films par genre, il suffit de rajouter un regroupement comme le suivant :

```javascript
db.cesars2016.aggregate(
[
{$group:
{
_id: "$genre",
nb: {$sum: "$durée"}
}
}
]
)
```

Dont l'équivalent en SQL est :

```sql
SELECT SUM(durée)
AS duree_tot FROM t
GROUP BY genre
```

## opérateur $count
db.notes.aggregate(

[

{

$match: {

"notes": {

$gt: 10

}

}

},

{

$count: "NB_+10"

}

]

)


## Opérateurs $min et $max

Pour cette partie on se basera sur cette collection pour les exemples :

```javascript
{ "_id" : 1, "objet" : "a", "prix" : 10, "quantité" : 2},
{ "_id" : 2, "objet" : "b", "prix" : 20, "quantité" : 1},
{ "_id" : 3, "objet" : "c", "prix" : 5, "quantité" : 5},
{ "_id" : 4, "objet" : "a", "prix" : 10, "quantité" : 10},
{ "_id" : 5, "objet" : "c", "prix" : 5, "quantité" : 10}
```

Nous allons nous intéresser aux opérateurs **$min** et **$max** au sein de l'opéarteur **$group**,
ils peuvent aussi être utilisés dans l'opérateur **$project** que nous verrons en deuxième partie de chapitre.

### Sans regroupement


**$min** et **$max** s'ils sont utilisés sans regroupement retournent respectivement la valeur minimale et la valeur maximale 
de l'attribut sur lequel ils sont appliqués et ceci sur tous les documents.

_Exemple :_

````{tabbed} MongoDB

```javascript
db.ventes.aggregate([
	{$group: {_id:null,
                  prix_max: {$max: "$prix"},
                  prix_min: {$min: "$prix"}}}
])
```
````

````{tabbed} Équivalent SQL

```sql
SELECT MAX(prix) as "prix max", MIN(prix) as "prix min"
FROM ventes
```
````

```{admonition} Titre
:class: tip

Ne pas oublier le "$" dans les attributs entre guillemets à droite des deux points pour bien faire référence à l'attribut
et non à une chaîne de caractères.
```

Cette requête renvoie la valeur maximale puis minimale que prend la variable **prix** sur tous les documents :

```javascript
{
    "_id" : null,
    "prix_max" : 20.0,
    "prix_min" : 5.0
}
```

### Avec regroupement


On peut aussi réaliser un regroupement et ainsi **$min** et **$max** renvoient toujours la valeur minimale et la valeur maximale
de l'attribut sur lequel ils sont appliqués, mais cette fois-ci en étant appliqués sur les documents de l'ensemble de documents qui partagent la même clé de regroupement.

_Exemple :_

````{tabbed} MongoDB

```javascript
db.ventes.aggregate([
	{$group: {_id:"$objet",
                  quantité_max: {$max: "$quantité"},
                  quantité_min: {$min: "$quantité"}}}
])
```
````

````{tabbed} Équivalent SQL

```sql
SELECT MAX(prix) as "prix max", MIN(prix) as "prix min"
FROM ventes
GROUP BY quantité
```
````

On groupe à l'aide de la clé **"$objet"**,
on renvoie donc la valeur maximale puis minimale que prend la variable **quantité** pour chaque **objet** différent :

```javascript
{
    "_id" : "a",
    "quantité_max" : 10.0,
    "quantité_min" : 2.0
}

/* 2 */
{
    "_id" : "b",
    "quantité_max" : 1.0,
    "quantité_min" : 1.0
}

/* 3 */
{
    "_id" : "c",
    "quantité_max" : 10.0,
    "quantité_min" : 5.0
}
```

```{admonition} Titre

Si certains documents ont une valeur de type null ou qui n'existe pas pour l'attribut sur lequel on applique $min ou $max,
les opérateurs ne prennent pas en compte les valeurs de type null ou manquantes pour le calcul.
Si tous les documents ont une valeur de type null ou qui n'existe pas, les opérateurs renvoient null pour la valeur minimale
ou la valeur maximale.

```


  Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/05_agreg.md`.

## Successions d'étapes d'agrégation

* Auteurs/trices : Marine BINARD, Arthur CONAS, Yann CAUSEUR

Cette section traite de :
* successions d'étapes d'agrégation + unwind + project + sort + limit

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/05_agreg.md`.
