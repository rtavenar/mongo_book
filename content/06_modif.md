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

## Modification
### Remplacement d'un document
```javascript
db.collec.update(
	{"nom": "C1"},
	{"nom": "C1", "marque": "Citroën"}
)
```
Les documents sélectionnés sur la 1ère ligne sont supprimés et remplacés selon les champs renseignés sur la 2nde ligne. Les champs qui ne sont pas renseignés sont donc supprimés.

### Modification d'un ou plusieurs documents
Si l'on souhaite conserver les autres champs, il suffit d'inclure la 2nde ligne dans un `$set`.
```javascript
db.collec.update(
	{"nom": "C1"},
	{$set:
		{"nom": "C1", "marque": "Citroën"}
	}
)
```

### Upsert

## Suppression