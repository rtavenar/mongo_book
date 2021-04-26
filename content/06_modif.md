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

Ce chapitre traite des différentes requêtes de modification ([insertion](sec:insertion), [modification](sec:modification) et [suppression](sec:suppression)).

(sec:insertion)=
## Insertion

Pour la création d'une nouvelle collection, il est nécessaire de sélectionner une base. Si elle n'existe pas, elle sera alors créée.

```{code-cell}
use voitures
```

### Création d'une collection 

Il est nécessaire d'utiliser la commande `db.createCollection("NomDeLaNouvelleCollection")` pour créer une nouvelle collection au sein de la base sélectionnée.  
Exemple:
  
```{code-cell}
db.createCollection("ventes")
```

Ici, on crée par exemple une collection "ventes" au sein de la base "voitures".

```{admonition}
:class: warning
Si vous tentez d'exécuter plusieurs fois la commande, une erreur surviendra car votre collection existe déjà.
```

### Ajout de nouveaux documents 

La commande `db.NomDeLaCollection.insert([])` permet l'ajout d'une liste de document au sein de la collection.  
Exemple: 

```{code-cell}js
db.ventes.insert([{"nom" : "C1"}, {"nom" : "C2"}])
```

Si on exécute la ligne suivante, on retrouve bien les documents créés :

```{code-cell}
db.ventes.find({})
```

(sec:modification)=
## Modification
### Remplacement d'un document
```{code-cell}
db.ventes.update(
	{"nom": "C1"},
	{"nom": "C1", "marque": "Citroën"}
)
```
Le document sélectionné sur la première ligne est supprimé et remplacé selon les champs renseignés sur la seconde ligne. Les champs qui ne sont pas renseignés sont donc supprimés.

```{admonition}
:class: warning
Seul le premier document de la liste sera modifié.
```

### Modification d'un document
Si l'on souhaite conserver les autres champs, il suffit d'inclure la seconde ligne dans un `$set`.
```{code-cell}
db.ventes.update(
	{"nom": "C2"},
	{$set:
		{"marque": "Citroën"}
	}
)
```
Ici également, seul le premier document de la liste répondant aux critères de la première ligne sera modifié.

### Modification de plusieurs documents
Pour modifier plusieurs documents à la fois, il est nécessaire d'ajouter `{multi: true}` en fin de requête.
```{code-cell}
db.ventes.update(
	{"nom" : {$in: ["C1", "C2"]}},
	{$set: {"pays": "France"}},
	{multi: true}
)
```
Cette requête, par exemple, ajoute un attribut "pays" ayant la valeur "France" aux modèles C1 **et** C2.

### Upsert
L'option `upsert` (mélange de "update" et "insert") permet de mettre une condition sur la requête : si aucun document ne correspond aux conditions indiquées en première ligne, alors un nouveau document est créé par les champs renseignés sur la seconde ligne.
```{code-cell}
db.ventes.update(
	{"nom": "C1"},
	{$set : {"nom": "C1", "Nombre de roues": 4}},
	{upsert: true}
)
```
Ici, on ajoute une nouvelle variable "Nombre de roues" à laquelle on attribue la valeur 4 au modèle "C1".

```{code-cell}
db.ventes.update(
	{"nom": "Twingo"},
	{$set : {"Nombre de roues": 4}},
	{upsert: true}
)
```
Cette fois-ci, un nouveau document est ajouté à la base.

(sec:suppression)=
## Suppression

Comme toutes les bonnes choses ont une fin, il est possible de supprimer une base, ou bien, sans être aussi radical, des éléments plus précis.
Nous allons voir ici comment procéder aux différentes suppressions :

### Suppression d'une base entière
```js
db.dropDatabase()
```
Lors de l'exécution de cette commande, c'est la base **courante**, celle qui est pointée par _db_, qui sera supprimée.
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
```{code-cell}
db.ventes.remove({"marque" : "Citroën"})
```
* Suppression d'un seul document :  
   Pour ce faire, il convient d'utiliser l'attribut "_id" puisqu'il est unique :
```js
db.nomDeLaCollection.remove({"_id" : ObjectId("5612c6c0a5c56580cfacc342")})
``` 

Et voilà, vous savez tout sur la création, la suppression et la modification de bases !