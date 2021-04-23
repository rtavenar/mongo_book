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

* Auteurs/trices : Rémi Leduc, Léo Rouger, Clément Caillard

Ce chapitre traite des différentes requêtes de modification (insertion, modification, suppression)

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/06_modif.md`.

## Insertion
Ici, on cherche à utiliser la base "voitures". Si elle n'existe pas elle sera alors créée.

```{js echo = true, results = 'hide'}
use voitures
```
Création d'une nouvelle ventestion au sein de la base sélectionnés.

```js 
db.createventestion("ventes")
```


## Modification
### Remplacement d'un document
```javascript
db.ventes.update(
	{"nom": "C1"},
	{"nom": "C1", "marque": "Citroën"}
)
```
Le document sélectionné sur la 1ère ligne est supprimé et remplacé selon les champs renseignés sur la 2nde ligne. Les champs qui ne sont pas renseignés sont donc supprimés. Seul le 1er document de la liste sera modifié.

### Modification d'un document
Si l'on souhaite conserver les autres champs, il suffit d'inclure la 2nde ligne dans un `$set`.
```javascript
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
```javascript
db.ventes.update(
{"modèle" : {$in: ["C1", "C3"]}},
{$set: {"marque": "Citroën"}},
{multi: true}
)
```
Cette requête par exemple ajoute un attribut "marque" : "Citroën" aux modèles C1 et C3.
### Upsert
<<<<<<< Updated upstream

## Suppression

Ceci est un test
=======
L'option `upsert` (mélange de "update" et "insert") permet de mettre une condition sur la requête : si aucun document ne correspond aux conditions indiquées en 1ère ligne, alors un nouveau document est créer par les champs renseignés sur la 2nde ligne.
```javascript
db.ventes.update(
	{"nom": "C1"},
	{"nom": "C1", "marque": "Citroën"},
	{upsert: true}
)
```
Dans cet exemple, si la base de données contient un élément ayant "C1" en variable "nom" alors il sera remplacé par un document ayant "C1" en variable "nom" **et** "Citroën" en variable "marque". Sinon un document {"nom": "C1", "marque": "Citroën"} sera créé.
## Suppression
>>>>>>> Stashed changes
