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
(sec:exec)=
## Regroupements

* Auteurs/trices : **CASTRIQUE Jérémy, NOJAC Dimitri, VAVASSEUR Salomé**

Dans cette partie, nous allons étudier **les regroupements dans les requêtes d'aggrégation**. Dans un premier temps, nous étudierons ce qu'est l'étape de regroupement. Ensuite nous regarderons comment effectuer des calculs à l'aide des 4 d'opérateurs qui sont : `$sum`, `$max`, `$min`, `$count` avec ou sans groupe.

Les requêtes de regroupement vont permettre d'effectuer des opérations d'accumulation sur des documents regroupés. Il est l'équivalent de l'opérateur `GROUP BY` en SQL.

**Syntaxe**

```javascript
db.coll.aggregate([
	{$group: {_id: <expression>, // Group By Expression
      		 <field1>: { <accumulator1> : <expression1> },
      		...}
	}
])
```

Pour tous les opérateurs que nous allons étudier dans cette partie du cours, la syntaxe sera identique à celle-ci.


### Opérateur de somme

L'équivalent en SQL de l'opérateur `$sum` est `SUM` qui permet de sommer les valeurs prises pour un attribut.

**Exemple de requête sans regroupement**

````{tabbed} MongoDB

```javascript
db.coll.aggregate([
  {$group: {_id: null, 
    	   nb: {$sum: "$att"}}}
])
```
````

````{tabbed} SQL
```sql
SELECT SUM(att) as nb
FROM t
```
````

Vous remarquez qu'ici l'expression qui guide le regroupement est `null`, soit une constante.
Cela signifie que tous les documents de la base seront regroupés ensemble et qu'un seul calcul sera fait pour ce groupe.
  
**Exemple de requête avec regroupement**

Pour créer des groupes d'individus, il faut indiquer comment former ces groupes dans l'identifiant.

Sur la base de `food`, on peut par exemple filtrer par quartier.

Voici un exemple de requête :

_En mongoDB :_

```{code-cell}
use food
```

```{code-cell}
:tags: [output_scroll]

db.NYfood.aggregate([
  {$group: {_id: "$borough",
    	   nb: {$sum: {$size: "$grades"}}}}
])
```

_En SQL :_

```sql
SELECT SUM(n_grades) as nb
FROM NYfood
GROUP BY borough
```


Dans cette requête, MongoDB va regrouper les individus ayant la même valweur pour l'attribut spécifié comme `_id` et donc considérer les restaurants d'un même quartier ensemble.

L'opérateur `$sum` permet de calculer et de retourner les sommes de variables numériques (ici les sommes des nombres de notes).

```{admonition} Attention
:class: tip

Il ne prend pas en compte les variables non numériques.
```


**Syntaxe**

```javascript
db.coll.aggregate([
     {$group: {_id: { <var>,
	      somme :{ $sum: [ <expression1>, <expression2> ... ]}}}
     }
])
```


**Autre exemple**

Pour cette partie, nous allons nous placer dans cette base que nous avons créée.

```javascript
{ "_id" : 1, "objet" : "a", "prix" : 10, "quantité" : 2},
{ "_id" : 2, "objet" : "b", "prix" : 20, "quantité" : 1},
{ "_id" : 3, "objet" : "c", "prix" : 5, "quantité" : 5},
{ "_id" : 4, "objet" : "a", "prix" : 10, "quantité" : 10},
{ "_id" : 5, "objet" : "c", "prix" : 5, "quantité" : 10}
```

***Sans regroupement***
Jusqu'ici, nous avons compté le nombre d'individus grâce à l'attribu `$sum`, mais celui ci permet aussi `d'additionner des variables`.

On se place maintenant dans la collection précédente.

````{tabbed} MongoDB
```javascript
db.coll.aggregate([
	{$group: {_id: null,
		 qtt_tot: {$sum: "$quantité"}}}
])
```
````


````{tabbed} SQL
```sql
SELECT SUM(quantité) AS qtt_tot
FROM coll
```
````

***Résultat obtenu :***
```javascript
/* 1 */
{
    "_id" : null,
    "qtt_tot" : 28.0
}
```

Ici, on calcule la somme des quantités vendues.


***Avec regroupement***
Si on veut sélectionner les sommes des durées de films par genre, il suffit de rajouter un regroupement comme le suivant :

````{tabbed} MongoDB
```javascript
db.coll.aggregate([
	{$group: {_id: "$prix",
		 qtt_tot: {$sum: "$quantité"}}}
])
```
````

````{tabbed} SQL
```sql
SELECT SUM(quantité) AS qtt_tot 
FROM coll
GROUP BY prix
```
````
***Résultat obtenu :***
```javascript
/* 1 */
{
    "_id" : 20.0,
    "qtt_tot" : 1.0
}
 
/* 2 */
{
    "_id" : 10.0,
    "qtt_tot" : 12.0
}
 
/* 3 */
{
    "_id" : 5.0,
    "qtt_tot" : 15.0
}
```

### Opérateur de comptage
L'opérateur `$count` renvoie le nombre de documents présents dans l'aggrégation.

Dans cet exemple, on assigne à la valeur NB_+24 le nombre de documents ayant un individu avec un âge supérieur à 24 :

```{code-cell}
use large_db
```

```{code-cell}
:tags: [output_scroll] 

db.users.aggregate([
    {$match: {"age": {$gt: 24}}},
    {$count: "NB_+24"}
])
```

L'opérateur `$match` exclu les documents qui possèdent un individu avec un âge <24. 
L'opérateur `$count` va donc agir sur les documents ayant un individu avec un âge supérieur à 24 à l'opérateur `$gt` (plus grand que) et va assigner
à la valeur NB_+24 le nombre de documents répondant au critère.

Une autre façon (moins directe) d'effectuer des opérations de comptage est d'utiliser l'opérateur `$sum`.

***Sans regroupement***
Regardons une requête simple :

_En mongoDB :_

```{code-cell}
:tags: [output_scroll]

db.NYfood.aggregate([
      {$group:{_id: null,
              nb: {$sum: 1}}}
])
```


_En SQL :_

```sql
SELECT COUNT(*) as nb
FROM NYfood
```


On utilise la fonction aggregate.
Lorsqu'on utilise aggregate, il faut donner les individus sur lesquels on veut faire la requête.
Dans notre cas, on choisit tout les individus. On le note `id: null`.
On créé notre variable qu'on appelle nb qui va faire la somme de tout les individus.


Dans cet exemple, nous avons compté le nombre d'individus sans sélection.

En pratique, cela n'a pas forcément beaucoup d'intérêt.
Il s'avère plus utile de pouvoir sélectionner le nombre de variables répondant à un critère. Pour cela, nous allons regarder avec une requête de regroupement.

***Avec regroupement***
Toujours dans la collection NYfood de la base food, on cherche à connaitre le nombre de restaurants par type de cuisine. Pour cela, on va effectuer un regroupement sur l'attribut "cuisine".

_En mongoDB :_

```{code-cell}
:tags: [output_scroll]

db.NYfood.aggregate([
      {$group:{_id: "$cuisine",
              nb_par_cuis: {$sum: 1}}}
])
```

_En SQL :_

```sql
SELECT COUNT(*) AS nb_par_cuisine
FROM NYfood
GROUP BY cuisine
```


On obtient donc plusieurs listes différentes contenant pour chacune le nombre de restaurants dans chaque liste nommée par le type de cuisine.

Il y a donc eu un comptage du nombre de restaurants en fonction de la variable cuisine.

### Opérateurs d'extremum


**Syntaxe**

```javascript
db.coll.aggregate([
     {$group:
         {_id: { <var>,
	   max: {$max: [ <expression1>, <expression2> ... ]}}}
     }
   ]
)
```

Pour cette partie on se basera sur cette collection pour les exemples :

```javascript
{ "_id" : 1, "objet" : "a", "prix" : 10, "quantité" : 2},
{ "_id" : 2, "objet" : "b", "prix" : 20, "quantité" : 1},
{ "_id" : 3, "objet" : "c", "prix" : 5, "quantité" : 5},
{ "_id" : 4, "objet" : "a", "prix" : 10, "quantité" : 10},
{ "_id" : 5, "objet" : "c", "prix" : 5, "quantité" : 10}
```

Nous allons nous intéresser aux opérateurs `$min` et `$max` au sein de l'opéarteur `$group`,
ils peuvent aussi être utilisés dans l'opérateur `$project` que nous verrons en deuxième partie de chapitre.
En SQL, les équivalents sont les opérateurs `MIN`et `MAX.

#### Sans regroupement


`$min` et `$max` s'ils sont utilisés sans regroupement retournent respectivement la valeur minimale et la valeur maximale 
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

```{admonition} Attention
:class: tip

Ne pas oublier le "$" dans les attributs entre guillemets à droite des deux points pour bien faire référence à l'attribut
et non à une chaîne de caractères.
```

Cette requête renvoie la valeur maximale puis minimale que prend la variable `$prix` sur tous les documents :

```javascript
{
    "_id" : null,
    "prix_max" : 20.0,
    "prix_min" : 5.0
}
```

#### Avec regroupement


On peut aussi réaliser un regroupement et ainsi `$min` et `$max` renvoient toujours la valeur minimale et la valeur maximale
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

On groupe à l'aide de la clé `objet`,
on renvoie donc la valeur maximale puis minimale que prend la variable `quantité` pour chaque `objet` différent :

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

```{admonition} Null ou inexistant

Si certains documents ont une valeur de type null ou qui n'existe pas pour l'attribut sur lequel on applique `$min` ou `$max`,
les opérateurs ne prennent pas en compte les valeurs de type null ou manquantes pour le calcul.
Si tous les documents ont une valeur de type null ou qui n'existe pas, les opérateurs renvoient null pour la valeur minimale
ou la valeur maximale.

```


##  Successions d'étapes d'agrégation 

* Auteurs/trices : **Marine BINARD, Yann CAUSEUR, Arthur CONAS**


### Introduction
Les successions d'étapes d'agrégation vont permettre d'obtenir des requêtes proches de ce qu'on peut trouver en SQL.
Contrairement à SQL où l'ordre est pré-défini (`SELECT FROM WHERE ORDER BY`), ici ce n'est pas le cas. Il n'empêche que **l'ordre dans lequel on place
nos étapes est crucial.**

Nos étapes peuvent toutes être effectuées une à une et indépendamment. En fait, à l'intérieur de notre `db.coll.aggregate([])`, il y aura notre liste d'étapes,
contenues dans des crochets et séparées par des virgules, qui s'effectueront sur les données que **l'étape d'avant aura rendue.**

Il peut donc être intéressant d'éxécuter le code étape par étape pour savoir sur quelles données on travaille à un moment donné.

Dans la suite, nous présentons de nouvelles étapes d'agrégation.

### Project

***Pourquoi l'utiliser ?***  
Il peut arriver lors d'une requête d'agrégation de vouloir créer de nouvelles variables par exemple, pour des calculs. La commande `$project` permet donc de créer de nouvelles variables. Néanmoins, il faut faire attention, 
lorsque l'on crée une nouvelle variable dans une requête d'agrégation.
 Tous les attributs déjà existants pour les documents d'une collection ne sont plus mémorisés. Donc, si on veut créer une nouvelle variable, tout en gardant celles déjà existantes, il faut le mentionner dans le `$project`. 

***Comment ça fonctionne ?*** 

**Syntaxe** :  
```
db.coll.aggregate( 
  [
    {$project : {<nom_nouv_att1> : <val_att1>, <nom_nouv_att2> : <val_att2>, ... }}
  ]
)
```

Le fait de vouloir garder un attribut déjà existant fonctionne de la même façon que la création, il faut donc renommer la variable existante.   

***Exemple :***  
```{code-cell}
use food
```


```{code-cell}
db.NYfood.aggregate( 
  [
    {$project: {"n_notes" : {$size : '$grades'}}}
  ]
)
```
Sur l’exemple ci-dessus, on vient créer une variable n_notes qui prend pour valeur la taille de la liste `grades` 
(qui contient les différentes notes attribuées aux restaurants).
On cherche donc, ici, à compter le nombre de notes attribué à chaque restaurant.
 Mais tous les autres attributs du restaurant sont effacés. Par la suite,
 on ne pourra donc retrouver que le nombre de notes attribué et non le quartier 
 ou le type de restaurant. 
Si on veut afficher le quartier en question, on doit le préciser tel que :
```{code-cell}
db.NYfood.aggregate( 
  [
    {$project: {"n_notes" : {$size : '$grades'}, quartier :'$borough'}}
  ]
)
```

Avec cette requête, on peut voir le quartier du restaurant. Par ailleurs, la variable `borough` 
a été renommée `quartier`. On peut également conserver cette 
variable sans la renommer avec cette syntaxe.
```{code-cell}
db.NYfood.aggregate( 
  [
    {$project: {"n_notes" : {$size : '$grades'}, borough : 1}}
  ]
)
```
***Traduction SQL :***

L'équivalent en SQL de la commande `$project` est l'étape `SELECT` et `AS` qui 
permettent de créer de nouvelles variables. Par contre, en SQL,
l'étape `AS` est facultative, la nouvelle variable prendra 
comme nom la formule du calcul. En MongoDB, elle est obligatoire ! 
Si on ne précise pas le nom de la nouvelle variable, cela affichera 
une erreur. Pour la traduction SQL de l'exemple précédent, il convient de faire attention.
Pour rappel, les listes n'existent pas en SQL ! D'où la nécessité
dans certains moments de faire des calculs verticaux, ce qui n'est pas nécéssaire.
Dans notre cas, en SQL l'attribut `grades` serait une table à part entière (avec toutes les notes `grade`, une clé étrangère faisant référence au restaurant)
Il faudrait donc faire une jointure sur celle-ci puis grouper par restaurant (en imaginant qu'il existe un ID pour chaque restaurant)
L'exemple serait donc:   

 ```sql
 SELECT borough
 FROM NYfood NATURAL JOIN grades
 GROUP BY restoID
 HAVING COUNT(grade) AS "n_notes"
 ```
 
### Sort

***Pourquoi l'utiliser ?***

Comme dans la plus part des langages de bases de données, MongoDB ne stocke pas les documents dans une collection dans un ordre 
en particulier. C'est pourquoi l'étape `sort` (tri en français) va permettre
 de trier l'ensemble de tous les documents d'entrée afin de les renvoyer dans
 l'ordre choisi par l'utilisateur. Nous pouvons les trier dans l'ordre croissant,
 décroissant, chronologique ou bien alphabétique selon le type du champ
 souhaitant être trié. 
Il est possible de trier sur plusieurs champs à la fois, mais dans ce cas l'ordre de tri est évalué de gauche à droite. 
Le `$sort` est finalement l'équivalent du `ORDER BY` en SQL.

***Comment ça fonctionne ?***

**Syntaxe** :  
```
db.coll.aggregate(
	[
	 {$sort: {<champ1>: <sort order>, <champ2>: <sort order> ...}}
	]
)
```

Le `<sort order>` peut prendre la valeur : 1 (croissant), -1 (décroissant) ou encore `{$meta: "textScore"}`(il s'agit d'un tri de métadonnées textScore calculées dans l'ordre décroissant).

***Exemples :***

Attention à bien prendre en compte le fait que lors du 
tri sur un champ contenant des valeurs en double (ou non unique),
 les documents contenant ces valeurs peuvent être renvoyés dans 
 n'importe quel ordre.
```{code-cell}
db.NYfood.aggregate(
   [
	 {$sort : {borough : 1}}
   ]
)
```
***Traduction SQL :***

```sql
SELECT borough
FROM NYfood 
ORDER BY borough
```

En effet, dans l'exemple ci-dessus, le champ quartier n'est 
pas un champ avec des valeurs uniques. Si un ordre de tri 
cohérent est souhaité, il est important d'au moins inclure 
un champ dans votre tri qui contient des valeurs uniques. 
Généralement, le moyen le plus simple de garantir cela consiste 
à inclure le champ _id dans la requête de tri.
```{code-cell}
db.NYfood.aggregate(
   [
     {$sort : {borough : 1, _id : 1}}
   ]
)
```
Cette fois ci, la requête affichera l'ensemble 
de la collection avec les noms de quartier 
affichés par ordre alphabétique. Les collections 
du quartier de "Bronx" seront les premières à être affichées, 
puis ensuite l'ordre par identifiant sera conservé 
lorsque le nom de quartier sera le même pour plusieurs collections.

***Traduction SQL :***
 
```sql
SELECT borough
FROM NYfood 
ORDER BY borough, _id
```

### Limit
***Pourquoi l'utiliser ?***

L'étape `$limit` va simplement permettre de 
limiter le nombre de documents voulant être 
affichés par la requête. Il n'y a pas grand 
intérêt à utiliser le limit tout seul. Généralement, 
il est utilisé avec l'étape `$sort` vu précédemment.

***Comment ça fonctionne ?***

**Syntaxe** :  
```
db.coll.aggregate(
	[
	 {$limit : 5} 
	]
)
```
L'argument qui est pris par le `$limit` est toujours
 un entier positif, qui va déterminer le nombre 
 de collections que l'on souhaite afficher.

***Exemple***

Dans cet exemple, on souhaite afficher les 3 quartiers 
possédant le plus de restaurants.
```{code-cell}
db.NYfood.aggregate(
	[
     {$group: {_id: "$borough", nb: {$sum: 1}}},
     {$sort: {nb: -1}},
     {$limit: 3}
	]
) 
```					  
On remarque ici que nous ne pouvons pas utiliser 
l'étape `$limit` seul sans le sort.
 Nous avons d'abord besoin de trier le nombre 
 de restaurants par ordre décroissant puis enfin  
 préciser que nous souhaitons obtenir seulement les 
 3 premiers quartiers contenant le plus de restaurants.
 
***Traduction SQL :***
```sql
SELECT count(borough)
FROM NYfood 
GROUP BY borough
ORDER BY count(borough) desc
LIMIT 3
```

### Match

***Pourquoi l'utiliser***

`$match` peut être utilisé comme un filtre, avec une condition. On pourrait le mettre n'importe où dans notre requête mais il est particulièrement intéressant en début ou en fin de requête.


***Comment ça fonctionne ?***

**Syntaxe** : 

Le `$match` est un requête du type de celles qu'on passe à `find`.

***Exemple :***  
```{code-cell}
db.NYfood.aggregate( 
  [  
   {$match: {"borough": 'Brooklyn'}},
   {$unwind: "$grades"},
   {$group : {_id: "$grades.grade",
       n:{$sum:1}
            }
          },
    {$match:{n:{$gt:1000}}},
  ]
)
``` 



```SQL
SELECT COUNT(grade) as n
FROM NYfood
WHERE Borough='Brooklyn'
GROUP BY grade
HAVING n > 1000
``` 
Ici le premier `$match` sert comme un `WHERE`, 
et le deuxième comme un `HAVING` en SQL.

Dans tous les cas, le `$match` fait une sélection sur le jeu de données en fonction d'une condition, au moment où il est placé.

Si le `$match` est au début, il fera une sélection sur l'ensemble des données (ici `NYfood`) mais n'aura pas accès aux opérations qui sont effectuées après (comme le `$group` dans notre cas).
C'est pour cela qu'on utilise aussi le `$match` plus tard, pour avoir accès aux données créées avec nos bouts de requêtes précédents, ce qui permet ici d'avoir accès au `n`.
Cependant, ce dernier `$match` n'a pas accès à toute la base de données `NYfood` et n'agit que sur les résultats des requêtes précédentes.

### Unwind

***Pourquoi l'utiliser ?*** 
 
Il arrive que les documents de certaines collections possèdent pour attribut une liste. Lorsque l'on effectue une requête d'agrégation, il peut être nécéssaire d'agir non pas sur la liste mais sur chaque élément de la liste. Pour cela, on utilise la commande `$unwind`. Elle permet, pour chaque élément de la liste, de dupliquer le document pour chaque valeur de la liste. 

***Comment ça fonctionne ?***

**Syntaxe** :
```
db.coll.aggregate( 
  [
   {$unwind : "$att"}}
  ]
)
```
En général, un `$unwid` seul n'a peu d'intérêt.`$att` est une liste de taille 10 que la collection comporte 1000 individus, la requête d'exemple renverra un résultat de 10 000 lignes (10 * 1000)

***Exemple***
```{code-cell}
db.NYfood.aggregate( 
  [
   {$unwind :"$grades"},
   {$group: {_id : '$grades.grade', 
             n: {$sum:1}}
    },
  ]
)

```
Voici un exemple concret d'utilisation d'un `$unwind`. Dans la requête, on cherche à compter le nombre de A ayant été attribués à l'ensemble des restaurants de la collection, puis le nombre de B, C .... 
Pour que cette requête fonctionne, le `$unwind` est obligatoire, sinon on considère la liste entière des notes et on ne peut donc pas compter. 
 
 ***Traduction SQL :*** 
 
Il n'existe pas réellement d'équivalent SQL au `$unwind`. Néanmoins, il se rapproche d'une opération de jointure sans aucun filtre.

### Quelques requêtes pour tout comprendre
Afin d'illustrer le fonctionnement pas à pas, découpons une requête en détail.
Pour cet exemple, on veut  **les 3 notes les plus données dans les restaurants du quartier de Brooklyn**.
La première étape naturelle est de sélectionner les restaurants présents uniquement dans le quartier de Brooklyn.
Pour cela on utilise `$match`, qui retourne uniquement les restaurants de Brooklyn.

```{code-cell}
:tags: [output_scroll]

db.NYfood.aggregate(
	[
     {$match: {"borough": "Brooklyn"}},
    	]
) 
```
Dans un second temps, il faut voir que pour récupérer les différentes valeurs de notes, il faut acceder à chaque élément de la liste et non la liste entière. Pour y accéder, il faut utiliser la commande `$unwind`, qui rendra donc à cette étape tous les restaurants de Brooklyn associés à une note qu'il a obtenu (Attention, cela retourne beaucoup de résultats : nombre de restaurants * nombre de notes)

```{code-cell}
:tags: [output_scroll]

db.NYfood.aggregate(
	[
     {$match: {"borough": "Brooklyn"}},
     {$unwind: "$grades"},
    ]
) 
```
Ensuite, pour savoir quelle note a été la plus attribuée, il faut grouper pour chaque valeur de note. On utilise donc un `$group` sur l'attribut `$grades.grade$ (accessible grâce a `$unwind`). Puis, on décide de compter le nombre d'itérations de chaque note stockée dans la variable `nb`. Cette étape nous retourne donc le nombre de fois où chaque note a été attribuée à un restaurant.
```{code-cell}

db.NYfood.aggregate(
	[
     {$match: {"borough": "Brooklyn"}},
     {$unwind: "$grades"},
     {$group: {_id: "$grades.grade", nb: {$sum: 1}}},
    ]
) 
```
Nous sommes donc tout proches du résultat espéré. Il reste maintenant à trier les résultats par ordre décroissant, afin d'avoir les notes les plus données au début : `{$sort: {nb: -1}}`. Mais comme l'énoncé le précise, on souhaite afficher uniquement les 3 notes les plus données. Etant donné que les notes sont triées, il faut seulement préciser : `{$limit: 3}`.
```{code-cell}

db.NYfood.aggregate(
	[
     {$match: {"borough": "Brooklyn"}},
     {$unwind: "$grades"},
     {$group: {_id: "$grades.grade", nb: {$sum: 1}}},
     {$sort: {nb: -1}},
     {$limit: 3}
    ]
) 
```
On obtient bien, avec cette requête, les 3 notes les plus attribuées aux restaurants de Brooklyn !

```{code-cell}
 db.NYfood.aggregate(
	[

     {$project: {taille: {$size: "$grades"}}},
     {$match :{taille:{$gt:2}}},
     {$group: {_id: null,
      nb_min: {$min: "$taille"},
      nb_max: {$max: "$taille"}}
                        },         
    ]
) 
```
Dans cette deuxième requête, on montre bien ici qu'il n'y a pas d'ordre pré-défini d'étape, et ici le `$match` n'est ni au début de la requête, ni à la fin.

Expliquons cette requête (qui n'a pas beaucoup d'intérêt pratique).

* `$project` : création de la variable taille, qui correspond au nombre de notes données à un restaurant.
* `$match` : Dans le tableau rendu précédemment, on ne prend que les restaurants ayant plus de 2 notes.
* `$group` : Sur le résultat de la requête précédente, on groupe tout les restaurants (_id : null), et on regarde le nombre minimum et maximum de notes attribuées
à un restaurant. (Ayant sélectionné les individus supérieurs à deux, le minimum ne pouvait être que 3 ou plus.

En SQL, on aurait :
```sql
SELECT COUNT(*) AS taille, MAX(taille),MIN(taille)
FROM NYfood
WHERE taille>=2
```
**Résultat final : Le nombre minimum et maximum de notes attribué aux restaurants ayant au moins deux notes.**

