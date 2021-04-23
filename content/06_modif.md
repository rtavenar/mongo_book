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

# Les requêtes de modification

* Auteurs : Rémi Leduc, Léo Rouger, Clément Caillard

Ce chapitre traite des différentes requêtes de modification (insertion, modification et suppression)

## Insertion

Pour la création d'une nouvelle collection il est nécessaire de sélectionner une base. Si elle n'existe pas, elle sera alors créée.

```{code-cell}
use voitures
```

### Création d'une collection 

Il est nécessaire d'utiliser la commande `db.createCollection("NomDeLaNouvelleCollection")` pour créer une nouvelle collection au sein de la base sélectionner 

Exemple:
  
```{code-cell}
db.createCollection("ventes")
```

Ici on crée par exemple une collection vente au sein de la base voiture.

:warning: **Si vous tentez d'executer plusieur fois la commande une erreur sera créée car votre collection existe déjà.** 

### Ajout de nouveaux documents 

La commande `db.NomDeLaCollection.insert([])` permet l'ajout d'une liste de document au sein de la collection. 

Exemple: 

```{code-cell}
db.ventes.insert([{"nom" : "C1"}, {"nom" : "C2"}])
```

## Modification
### Remplacement d'un document
```{code-cell}
db.ventes.update(
	{"nom": "C1"},
	{"nom": "C1", "marque": "Citroën"}
)
```
Le document sélectionné sur la 1ère ligne est supprimé et remplacé selon les champs renseignés sur la 2nde ligne. Les champs qui ne sont pas renseignés sont donc supprimés.
<br> :warning: **Seul le 1er document de la liste sera modifié.** </br>

### Modification d'un document
Si l'on souhaite conserver les autres champs, il suffit d'inclure la 2nde ligne dans un `$set`.
```{code-cell}
db.ventes.update(
	{"nom": "C1"},
	{$set:
		{"nom": "C1", "marque": "Citroën"}
	}
)
```
Ici également, seul le 1er document de la liste répondant aux critères de la 1ère ligne sera modifié.

### Modification de plusieurs documents
Pour modifier plusieurs documents à la fois il est nécessaire d'ajouter `{multi: true}` en fin de requête.
```{code-cell}
db.ventes.update(
	{"modèle" : {$in: ["C1", "C3"]}},
	{$set: {"marque": "Citroën"}},
	{multi: true}
)
```
Cette requête par exemple ajoute un attribut "marque" : "Citroën" aux modèles C1 **et** C3.

### Upsert
L'option `upsert` (mélange de "update" et "insert") permet de mettre une condition sur la requête : si aucun document ne correspond aux conditions indiquées en 1ère ligne, alors un nouveau document est créer par les champs renseignés sur la 2nde ligne.
```{code-cell}
db.ventes.update(
	{"nom": "C1"},
	{"nom": "C1", "marque": "Citroën"},
	{upsert: true}
)
```
Dans cet exemple, si la base de données contient un élément ayant "C1" en variable "nom" alors il sera remplacé par un document ayant "C1" en variable "nom" **et** "Citroën" en variable "marque". Sinon un document `{"nom": "C1", "marque": "Citroën"}` sera créé.

## Suppression

Comme toutes les bonnes choses ont une fin, il est possible de supprimer une base, ou bien, sans être aussi radical, des éléments plus précis.
Nous allons voir ici comment procéder aux différentes suppressions :

### Suppression d'une base entière
```js
db.dropDatabase()
```
Lors de l'éxecution de cette commande, c'est la base **courante**, celle qui est pointée par _db_, qui sera supprimée.
```{admonition} Important !
:class: warning
Notez bien que tous les index qui pouvaient exister dans les collections de cette base seront également supprimés !
```

### Suppression d'une collection
```js
db.nomDeLaCollection.drop()
```
Ici encore, les index éventuellement présents dans la collection supprimée seront eux aussi effacés.

### Suppression de documents dans une collection
Nous voilà arrivés au gros morceau...
Lorsque l'on veut supprimer certains documents en particulier **sans toucher aux index**, il faut utiliser la commande suivante :
```js
db.nomDeLaCollection.remove({})
```
Lorsque l'on passe en argument un document vide, comme dans l'exemple ci-dessus, on supprime toutes les données contenues dans la collection, mais on en conserve la structure, donc les index.

La fonction _remove_ peut également recevoir des documents précis en argument :
* Condition sous la forme d'un document masque :  
   Tous les documents correspondants à la sélection seront supprimés, par exemple tous ceux dont l'attribut "marque" correspond à "Citroën" :
```js
db.nomDeLaCollection.remove({"marque" : "Citroën"})
```
* Suppression d'un seul document :  
   Pour ce faire, il convient d'utiliser l'attribut "_id" puisqu'il est unique :
```js
db.nomDeLaCollection.remove({"_id" : ObjectId("5612c6c0a5c56580cfacc342")})
``` 

Et voilà, vous savez tout sur la suppression !