(sec:git)=
# Annexe B : Utilisation de `git`

Pour rédiger collectivement ces notes de cours, vous allez utiliser un
gestionnaire de versions appelé `git`.
Cette annexe présente les bases du fonctionnement de `git` dans le but de vous
permettre de contribuer à la rédaction de ce document.

## Le principe des gestionnaires de version

La gestion de versions est un procédé qui permet de conserver toutes les
versions (ou "révisions") d'un ensemble de fichiers.
Chaque modification ou ensemble de modifications sur un fichier crée une
nouvelle version de ce fichier.
Cela s'avère particulièrement utile dans le cadre de fichiers édités de manière
collaborative : chaque utilisateur peut amener des modifications et créer
de nouvelles versions et, au besoin, on peut revenir en arrière à une
version précédente.

Contrairement à des systèmes d'édition collaborative synchrone
(type Google Docs), l'idée des gestionnaires de version dont on parlera ici
est que chacun puisse travailler sur sa version
de son côté (sans forcément être connecté à internet).
Lorsque plusieurs utilisateurs modifient la même partie d'un fichier,
cela peut mener à ce que l'on appelle des **conflits de versions** :
nous verrons [plus bas](sec:conflits) comment gérer ces conflits.

Les systèmes de gestion de version sont très utilisés dans le cadre de projets
logiciels pour maintenir les fichiers de code source, mais peuvent être utilisés
plus largement (comme dans le cas de ces notes de cours rédigées
collectivement).

### Les branches

Un aspect important de ces systèmes est la notion de **branche**.
Pour comprendre cette notion, prenons un exemple :

```{admonition} Exemple de branches

Supposons que Mme X travaille sur un document en utilisant une gestionnaire
de version.
Son document comporte les chapitres A, B et C.
Elle travaille, par défaut, sur la branche principale (que l'on appellera
`main`, pour "principale", ici).
Puis, à un certain point, elle se dit qu'elle essaierait bien de voir ce que
donnerait la ré-organisation de son document en chapitres ordonnés B, C puis A.
Bien sûr, cela va demander un certain nombre de changements dans le document,
et comme elle n'est pas sûre du résultat, elle va créer une nouvelle branche
auquel elle donnera un nom (par exemple `reordonnancement_chapitres`) pour
implémenter ces modifications.

Une fois ces modifications mises en oeuvre, deux solutions :

- soit Mme X n'est pas satisfaite de la nouvelle organisation, et elle décide
finalement de conserver l'organisation initiale qui est toujours disponible sur
la branche `main` : il lui suffit alors de rebasculer sur cette branche `main`
et de continuer à travailler ;
- soit Mme X trouve que cette nouvelle version est meilleure que l'originale
et va donc transférer les changements opérés vers la branche `main` : on dit
qu'elle _merge_ la branche `reordonnancement_chapitres` dans la branche `main`.
```

Cette notion de branches permet notamment d'avoir plusieurs collaborateurs d'un
même projet qui implémentent leurs modifications dans des branches séparées,
lesquelles ne seront intégrées au projet que si le résultat est satisfaisant.

## Le logiciel `git`

Pour l'édition collaborative de ce document, nous allons utiliser `git`,
qui est une référence en termes de logiciels de gestion de version.

Tout d'abord, un peu de vocabulaire.
Un **dépôt** est un "projet" `git` : il peut contenir plusieurs **branches**
qui, elles-mêmes, contiennent plusieurs versions d'un certain nombre de
fichiers.
On appelle **commit** un point d'enregistrement des modifications des fichiers
d'un dépôt.

```{admonition} Ligne de commande

Pour mieux comprendre ces concepts, nous introduisons dans la suite
des lignes de commande permettant
d'accéder à certaines fonctionnalités de base de `git`.
Sachez que ces commandes ont toutes des équivalents dans les interfaces
graphiques telles que GitHub Desktop (voir [plus bas](sec:gh-desktop)), si vous
êtes plus à l'aise avec ces interfaces.
```

Lorsque l'on a modifié (=créé, modifié ou supprimé) un fichier et que l'on
veut que les changements effectués sur ce fichier soient ajoutés au prochain
_commit_ que l'on va faire, on écrit :

```bash
git add <NOM_DU_FICHIER_MODIFIE>
```

Notez qu'il faudra ajouter les fichiers dont les modifications sont à prendre
en compte avant chaque commit.

Pour créer un _commit_ à partir des fichiers précédemment ajoutés, on
utilise ensuite la commande :

```bash
git commit -m "Ajouté une présentation de git dans le document"
```

Cela va donc créer un nouveau point d'enregistrement sur **la version locale**
de notre dépôt.
On peut s'en rendre compte avec la commande suivante :

```bash
git log
```

```text
commit 724ced693ff4823fe96721970c4a61f80472e122 (HEAD -> main, origin/main)
Author: Romain Tavenard <romain.tavenard@univ-rennes2.fr>
Date:   Tue Feb 16 13:44:25 2021 +0100

    Ajouté une présentation de git dans le document
```

On voit dans la sortie ci-dessus plusieurs choses :

1. le commit en question a un identifiant (`724ced693ff48...`),
2. ce commit correspond à la version courante (`HEAD`) de la branche courante
`main` du dépôt local,
3. cette branche courante du dépôt local est synchronisée avec la branche
`main` du dépôt distant qui est ici appelé `origin` (d'où le `origin/main`),
4. chaque commit a un auteur, une date et un texte associé.

````{admonition} Quels fichiers dans un commit ?
:class: tip
Avant de déclencher un _commit_, il est préférable de s'assurer que toutes les
modifications que l'on souhaite enregistrer ont bien été ajoutées.
Cela peut se faire à l'aide de la commande :

```bash
git status
```

qui affiche l'état du projet de travail local (branche courante, fichiers sur
le point d'être commités, et plus encore).
````

On remarque de plus que `git log` ne nous informe que sur les commits
ayant été enregistrés sur la branche courante.
Pour aller voir au delà, on peut lister les branches existantes sur le dépôt :

```bash
git branch
```

qui donnera une sortie du type :

```text
ajout_intro
* main
truc_super_chouette_avec_un_nom_plus_malin_que_ca
```

Ici, on voit que l'on est en train de travailler sur la branche `main`
(c'est le sens du symbole `*`) et que deux autres branches co-existent.

Si l'on souhaite "basculer" sur la branche `ajout_intro`, on fera :

```bash
git checkout ajout_intro
```

````{admonition} Basculer sur une nouvelle branche
:class: tip
Si l'on souhaite créer une nouvelle branche pour commencer à travailler dessus,
on utilisera plutôt :

```bash
git checkout -b <NOM_DE_LA_NOUVELLE_BRANCHE>
```
````

À ce moment, tous les fichiers du répertoire se mettent à jour pour
correspondre au contenu tel qu'enregistré dans le dernier commit de la branche
`ajout_intro`.
Supposons que l'on ait fait un certain nombre de modifications
(**enregistrées dans des commits !**)
qui nous semblent satisfaisantes dans cette branche, on pourra vouloir la
_merger_ (vive le franglais!) dans la branche principale avec :

```bash
git checkout main
git merge ajout_intro
```

La première de ces deux commandes demande de revenir sur la branche `main`
et la seconde demande d'y intégrer les changements issus de la branche
`ajout_intro`.

Toutes les commandes listées ci-dessus permettent de travailler avec des
versions locales des branches d'un dépôt.
Toutefois, lorsque l'on travaille de manière collaborative, on aura recours à
un dépôt distant avec lequel les différent(e)s contributeurs/trices du projet
se synchroniseront régulièrement.
Typiquement, dans notre cas, ce dépôt distant sera hébergé par GitHub (voir
[plus bas](sec:github)).

La première étape sera donc de récupérer le code hébergé sur le dépôt distant
pour créer votre dépôt local :

```bash
git clone <LIEN_VERS_LE_DEPOT_DISTANT> <NOM_DU_REPERTOIRE_A_CREER>
```

où `<LIEN_VERS_LE_DEPOT_DISTANT>` est une URL se terminant par `.git`
(qui vous sera fournie par GitHub).

Lorsque l'on souhaite envoyer nos modifications locales (celles correspondant
au dernier commit enregistré sur la branche courante) vers le dépôt distant,
on exécutera :

```bash
git push origin <NOM_DE_LA_BRANCHE_CIBLE_SUR_LE_DEPOT_DISTANT>
```

Dans la commande ci-dessus, `origin` est un nom permettant d'identifier
le dépôt distant (il est courant de nommer ce dépôt `origin`) et le deuxième
argument de la commande `push` est le nom de la branche cible sur le dépôt
distant (ce sera le même
que le nom que vous utilisez en local, pour éviter de vous mélanger les
pinceaux).

De même, lorsque des modifications ont été apportées sur le dépôt distant
et que vous souhaitez les incoporer à votre dépôt local, vous utiliserez la
commande :

```bash
git pull origin <NOM_DE_LA_BRANCHE_CIBLE_SUR_LE_DEPOT_DISTANT>
```

(sec:conflits)=
### La gestion des conflits

Lorsque plusieurs personnes travaillent sur un même projet, il se peut qu'elles
modifient les mêmes fichiers. Tant qu'elles ne travaillent pas sur la même
partie du fichier, `git` sera capable de faire une synthèse de leurs
modifications automatiquement, lors des étapes de `merge` et de `pull`.

Si par contre ces personnes
modifient un même morceau d'un même fichier de deux manières différentes, qui ne
sont pas compatibles entre elles, on dit qu'il y a un conflit entre les
versions de ces deux personnes.
Il va falloir décider si l'on garde l'une des deux versions ou l'autre, ou bien
si l'on propose une synthèse de ces deux versions.
En `git`, les conflits sont indiqués comme suit dans les fichiers source
concernés :

```diff
Ici, du texte commun aux versions des deux collaborateurs.

>>>>>>>>>optionA
Ici, le texte correspondant à la proposition de l'un(e) des
collaborateurs/trices.
===========
Ici, le texte correspondant à la proposition de l'autre collaborateur/trice.
<<<<<<<<<<optionB

Ici, du texte commun aux versions des deux collaborateurs.
```

où `optionA` et `optionB` sont des identifiants des deux versions en conflit
(par exemple les noms des branches concernées).

La résolution du conflit consistera donc à remplacer la section entre
`>>>>>>>>>optionA` et `<<<<<<<<<<optionB` par la meilleure synthèse possible
des deux propositions.

````{admonition} Cas d'usage

Supposons que l'on ait un dépôt local dont la branche principale (`main`)
ne contienne qu'un fichier `texte.md` dont le contenu est :

```text
Ceci est le seul fichier de ce dépôt
```

On souhaite se mettre à travailler dessus, et on crée pour cela une branche :

```bash
git checkout -b super_modifs
```

Dans cette branche, on modifie le contenu du fichier comme suit :

```text
Ceci est le seul et unique fichier de ce dépôt
```

On fait un commit, puis on retourne sur la branche principale (`main`).

Au lieu de tout de suite merger le contenu de la branche `super_modifs`, on
reprend le fichier tel qu'il est stocké dans la branche `main` et on le modifie
pour obtenir :

```text
Ceci est le seul fichier de ce super dépôt
```

Là encore, on commit notre changement, puis on essaie de merger le contenu de
la branche `super_modifs` :

```bash
git merge super_modifs
```

On obtient le message d'erreur suivant :

```
Auto-merging texte.md
CONFLICT (content): Merge conflict in texte.md
Automatic merge failed; fix conflicts and then commit the result.
```

Et si maintenant, on affiche le contenu de notre fichier, on trouve :

```diff
<<<<<<< HEAD
Ceci est le seul fichier de ce super dépôt
=======
Ceci est le seul et unique fichier de ce dépôt
>>>>>>> super_modifs
```

`git`, en tentant de merger la branche `super_modifs` dans la branche `main`,
a trouvé un conflit et vous l'indique ici.

Plus précisément, la partie `HEAD` correspond à la version de la branche
courante et la partie `super_modifs` à la version de la branche du même nom.

On doit donc manuellement finaliser ce merge en mettant à jour notre fichier
pour qu'il contienne :

```diff
Ceci est le seul et unique fichier de ce super dépôt
```

Une fois cela fait, on commit le résultat et le tour est joué :

```bash
git add texte.md
git commit -m "Finalisation merge super_modifs"
```

````

(sec:github)=
## Le service web GitHub

GitHub est un service web qui fournit à la fois des fonctionnalités
d'hébergement de dépôts `git` (votre dépôt distant pour ce projet sera donc
hébergé sur GitHub) ainsi que des outils supplémentaires de gestion de projet.

Pour être très pragmatique, dans le cadre de la rédaction de ce document, vous
aurez besoin de :

1. vous créer un compte GitHub par étudiant(e) ;
2. créer votre propre version du dépôt contenant ce document (on parle de
_fork_, et sur la page d'accueil de chaque projet, un lien pour cela
est fourni en haut à droite) ;
3. cloner votre _fork_ localement, c'est-à-dire sur votre machine (un lien pour
cela est indiqué par un bouton vert sur la page d'accueil de votre _fork_) ;
4. envoyer vos modifications locales vers votre _fork_ sur GitHub ;
5. créer une **Pull Request** sur le dépôt initial (`rtavenar/mongo_book`)
pour demander l'intégration de vos changements sur le dépôt de "référence".

(sec:gh-desktop)=
## Le client GitHub Desktop

GitHub fournit une interface graphique permettant de manipuler vos dépôts
`git`, nommée GitHub Desktop.
N'hésitez pas à l'utiliser si les lignes de commande vous font peur.
Ce logiciel semble être disponible sur les principaux OS
(cf [ce lien](https://github.com/shiftkey/desktop) pour les utilisateurs Linux).

## À vous de jouer

Une fois les parties de ce document attribuées chacune à un groupe, vous
devrez :

1. suivre les étapes indiquées [plus haut](sec:github) pour faire une première
Pull Request dans laquelle la seule modification est l'ajout de vos noms et
prénoms dans l'en-tête du fichier correspondant à votre chapitre
(date limite à définir)
2. à l'issue du projet, vous aurez une deuxième Pull Request à faire qui
permettra de demander l'intégration de votre chapitre rédigé dans l'ouvrage
complet
(date limite à définir)
