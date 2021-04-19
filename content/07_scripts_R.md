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
  display_name: R
  language: R
  name: ir
---

(sec:mongolite)=
# Requêtes depuis R : `mongolite`

* Auteurs/trices : **Yolan PERONNET, Faisal JAYOUZI, Paul LANCELIN**

Comment faire pour effectuer les requêtes présentes dans les chapitres 1 à 6 avec `mongolite` ?

Le fichier que vous devez modifier pour ce chapitre est `mongo_book/content/07_scripts_R.md`.

```{code-cell} R
library(mongolite)
coll <- mongo("NYfood", url = "mongodb://localhost:27017/food")
print(coll)
```
