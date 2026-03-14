---
id: tp-lesson-00
title: TP — Les Commandes de Base Linux
sidebar_label: TP Commandes de Base
---

# TP — Les Commandes de Base Linux

6 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 — Navigation et Structure de Base

**Objectif :** Se familiariser avec la navigation dans l arborescence Linux.

**1. Afficher le repertoire courant.**

<details>
<summary>Voir la reponse</summary>

```bash
pwd
```

</details>

---

**2. Aller dans le repertoire `/etc` puis revenir au repertoire personnel.**

<details>
<summary>Voir la reponse</summary>

```bash
cd /etc
cd ~
```

</details>

---

**3. Lister tous les fichiers du repertoire `/etc` avec les details (droits, taille, date), y compris les fichiers caches.**

<details>
<summary>Voir la reponse</summary>

```bash
ls -al /etc
```

</details>

---

**4. Lister le repertoire `/var/log` trie par taille decroissante avec les tailles lisibles.**

<details>
<summary>Voir la reponse</summary>

```bash
ls -lhS /var/log
```

</details>

---

**5. Revenir au repertoire precedent sans taper son chemin complet.**

<details>
<summary>Voir la reponse</summary>

```bash
cd -
```

</details>

---

**6. Remonter de deux niveaux dans l arborescence.**

<details>
<summary>Voir la reponse</summary>

```bash
cd ../..
```

</details>

---

## TP n°2 — Creation d Arborescence

**Objectif :** Creer l arborescence suivante en utilisant le minimum de commandes.

```
/
└── ISTAHH/
    ├── Direction/
    ├── Formation/
    │   ├── Tertiaire/
    │   └── NTIC/
    │       ├── ExerciceAlgo
    │       └── TPprogram
    └── CDS/
```

---

**1. Creer toute l arborescence ISTAHH en une seule commande.**

<details>
<summary>Voir la reponse</summary>

```bash
mkdir -p /ISTAHH/{Direction,Formation/{Tertiaire,NTIC},CDS}
```

</details>

---

**2. Creer les fichiers `ExerciceAlgo` et `TPprogram` dans `/ISTAHH/Formation/NTIC`.**

<details>
<summary>Voir la reponse</summary>

```bash
touch /ISTAHH/Formation/NTIC/ExerciceAlgo
touch /ISTAHH/Formation/NTIC/TPprogram
```

Ou en une seule commande :

```bash
touch /ISTAHH/Formation/NTIC/{ExerciceAlgo,TPprogram}
```

</details>

---

**3. Verifier que l arborescence est correcte.**

<details>
<summary>Voir la reponse</summary>

```bash
ls -R /ISTAHH
```

</details>

---

**4. Copier le fichier `/etc/named.conf` dans le repertoire `/ISTAHH`.**

<details>
<summary>Voir la reponse</summary>

```bash
cp /etc/named.conf /ISTAHH/
```

</details>

---

**5. Copier les fichiers `named.ca` et `localhost.zone` depuis `/var/named/chroot/var/named/` vers `/ISTAHH/Formation`.**

<details>
<summary>Voir la reponse</summary>

```bash
cp /var/named/chroot/var/named/named.ca /ISTAHH/Formation/
cp /var/named/chroot/var/named/localhost.zone /ISTAHH/Formation/
```

Ou en une seule commande :

```bash
cp /var/named/chroot/var/named/{named.ca,localhost.zone} /ISTAHH/Formation/
```

</details>

---

**6. Creer un lien symbolique de chaque fichier copie en question 5 dans `/ISTAHH/Formation`.**

<details>
<summary>Voir la reponse</summary>

```bash
ln -s /ISTAHH/Formation/named.ca /ISTAHH/Formation/lien_named.ca
ln -s /ISTAHH/Formation/localhost.zone /ISTAHH/Formation/lien_localhost.zone
```

</details>

---

**7. Copier le fichier `/var/named/localdomain.zone` vers `/ISTAHH/Formation` en lui donnant le nom `istahh.ma`.**

<details>
<summary>Voir la reponse</summary>

```bash
cp /var/named/localdomain.zone /ISTAHH/Formation/istahh.ma
```

</details>

---

## TP n°3 — Arborescence Complexe et Gestion de Fichiers

**Objectif :** Creer l arborescence suivante en une seule commande, puis effectuer des operations sur les fichiers.

```
/
├── Gestion/
├── Develop/
│   ├── SAID/
│   └── ALI/
│       ├── Formation/
│       └── Doc/
└── Commerce/
    ├── groupeTC1
    └── groupeTC2
```

---

**1. Creer toute l arborescence en une seule commande.**

<details>
<summary>Voir la reponse</summary>

```bash
mkdir -p /{Gestion,Develop/{SAID,ALI/{Formation,Doc}},Commerce}
```

</details>

---

**2. Creer les fichiers `groupeTC1` et `groupeTC2` dans `/Commerce`.**

<details>
<summary>Voir la reponse</summary>

```bash
touch /Commerce/{groupeTC1,groupeTC2}
```

</details>

---

**3. Creer les fichiers `TPLinux` et `TPCisco` dans le repertoire `/Develop/ALI/Formation`.**

<details>
<summary>Voir la reponse</summary>

```bash
touch /Develop/ALI/Formation/{TPLinux,TPCisco}
```

</details>

---

**4. Copier les fichiers `TPLinux` et `TPCisco` sur le repertoire `/Develop/ALI`.**

<details>
<summary>Voir la reponse</summary>

```bash
cp /Develop/ALI/Formation/{TPLinux,TPCisco} /Develop/ALI/
```

</details>

---

**5. Deplacer les fichiers `groupeTC1` et `groupeTC2` dans `/Gestion`.**

<details>
<summary>Voir la reponse</summary>

```bash
mv /Commerce/{groupeTC1,groupeTC2} /Gestion/
```

</details>

---

**6. Afficher le contenu du fichier `/etc/named.conf`.**

<details>
<summary>Voir la reponse</summary>

```bash
cat /etc/named.conf
# ou page par page
less /etc/named.conf
```

</details>

---

**7. Chercher tous les fichiers `.conf` dans le repertoire `/etc`.**

<details>
<summary>Voir la reponse</summary>

```bash
find /etc -name '*.conf'
```

</details>

---

**8. Chercher le fichier `resolv.conf` dans `/etc` et ses sous-repertoires.**

<details>
<summary>Voir la reponse</summary>

```bash
find /etc -name 'resolv.conf'
```

</details>

---

**9. Chercher tous les fichiers appartenant a l utilisateur `root`.**

<details>
<summary>Voir la reponse</summary>

```bash
find / -user root
```

</details>

---

**10. Chercher le numero de la ligne ou se trouve l utilisateur `nasser` dans `/etc/passwd`.**

<details>
<summary>Voir la reponse</summary>

```bash
grep -n nasser /etc/passwd
```

</details>

---

**11. Creer un lien symbolique du fichier `/var/named/chroot/var/named/localhost.zone` dans le repertoire `/Develop`.**

<details>
<summary>Voir la reponse</summary>

```bash
ln -s /var/named/chroot/var/named/localhost.zone /Develop/lien_localhost.zone
```

</details>

---

**12. Creer deux repertoires `CoursWin` et `coursCisco` dans le repertoire `/Develop/ALI/Formation`.**

<details>
<summary>Voir la reponse</summary>

```bash
mkdir /Develop/ALI/Formation/{CoursWin,coursCisco}
```

</details>

---

**13. Afficher les fichiers du repertoire `/etc` classes en ordre croissant de taille.**

<details>
<summary>Voir la reponse</summary>

```bash
ls -lhS --reverse /etc
# ou
ls -lhsr /etc
```

</details>

---

## TP n°4 — Droits et Permissions

**Objectif :** Maitriser la gestion des permissions sur les fichiers et repertoires.

---

**1. Creer un fichier `script.sh` et lui donner les droits `rwxr-xr--` en notation numerique.**

<details>
<summary>Voir la reponse</summary>

```bash
touch script.sh
chmod 754 script.sh
```

Verification : `rwx = 7`, `r-x = 5`, `r-- = 4` → `754`

</details>

---

**2. Creer un fichier `cle_privee.key` et le rendre accessible uniquement par son proprietaire (lecture + ecriture).**

<details>
<summary>Voir la reponse</summary>

```bash
touch cle_privee.key
chmod 600 cle_privee.key
```

</details>

---

**3. Creer un repertoire `public_web` et donner les droits suivants : proprietaire tout, groupe lecture+execution, autres lecture+execution.**

<details>
<summary>Voir la reponse</summary>

```bash
mkdir public_web
chmod 755 public_web
```

</details>

---

**4. Creer le repertoire `/shared/docs` et retirer le droit d ecriture aux autres de maniere recursive.**

<details>
<summary>Voir la reponse</summary>

```bash
mkdir -p /shared/docs
chmod -R o-w /shared/docs
```

</details>

---

**5. Changer le proprietaire du repertoire `monRep` et tout son contenu pour l utilisateur `said` et le groupe `TRI`.**

<details>
<summary>Voir la reponse</summary>

```bash
chown -R said:TRI monRep
```

</details>

---

**6. Un fichier `rapport.txt` a les permissions `-rw-r--r--`. Calculer sa valeur numerique et expliquer qui peut faire quoi.**

<details>
<summary>Voir la reponse</summary>

Valeur numerique : `644`

| Entite | Droits | Peut faire |
|--------|--------|-----------|
| Proprietaire | `rw-` = 6 | Lire et ecrire |
| Groupe | `r--` = 4 | Lire uniquement |
| Autres | `r--` = 4 | Lire uniquement |

```bash
chmod 644 rapport.txt
```

</details>

---

**7. Ajouter le droit d execution au proprietaire d un script sans toucher aux droits du groupe et des autres.**

<details>
<summary>Voir la reponse</summary>

```bash
chmod u+x script.sh
```

</details>

---

## TP n°5 — Recherche Avancee et Redirections

**Objectif :** Maitriser `grep`, `find`, les pipes et les redirections.

---

**1. Chercher le mot `root` dans `/etc/passwd` et afficher les numeros de ligne, sans tenir compte de la casse.**

<details>
<summary>Voir la reponse</summary>

```bash
grep -ni root /etc/passwd
```

</details>

---

**2. Afficher toutes les lignes de `/etc/passwd` qui ne contiennent PAS le mot `nologin`.**

<details>
<summary>Voir la reponse</summary>

```bash
grep -v nologin /etc/passwd
```

</details>

---

**3. Compter le nombre d utilisateurs qui ont `bash` comme shell dans `/etc/passwd`.**

<details>
<summary>Voir la reponse</summary>

```bash
grep -c bash /etc/passwd
```

</details>

---

**4. Chercher recursivement le mot `nameserver` dans tous les fichiers du repertoire `/etc`.**

<details>
<summary>Voir la reponse</summary>

```bash
grep -rn nameserver /etc
```

</details>

---

**5. Sauvegarder la liste de tous les fichiers `.conf` de `/etc` dans un fichier `liste_conf.txt`.**

<details>
<summary>Voir la reponse</summary>

```bash
find /etc -name '*.conf' > liste_conf.txt
```

</details>

---

**6. Chercher les fichiers modifies dans les 3 derniers jours dans `/var/log` et ajouter le resultat a la fin du fichier `rapport.txt`.**

<details>
<summary>Voir la reponse</summary>

```bash
find /var/log -mtime -3 >> rapport.txt
```

</details>

---

**7. Afficher les 20 dernieres lignes de `/var/log/syslog` en filtrant uniquement les lignes contenant `error`.**

<details>
<summary>Voir la reponse</summary>

```bash
tail -n 20 /var/log/syslog | grep -i error
```

</details>

---

**8. Trouver tous les fichiers `.log` dans `/var/log` et les supprimer.**

<details>
<summary>Voir la reponse</summary>

```bash
find /var/log -name '*.log' -exec rm {} \;
```

</details>

---

**9. Lister tous les processus actifs, filtrer ceux qui contiennent `apache` et sauvegarder le resultat dans `processus_apache.txt`.**

<details>
<summary>Voir la reponse</summary>

```bash
ps aux | grep apache > processus_apache.txt
```

</details>

---

**10. Afficher les 5 plus gros fichiers du repertoire `/var/log`.**

<details>
<summary>Voir la reponse</summary>

```bash
ls -lhS /var/log | head -n 6
```

</details>

---

## TP n°6 — TP Complet (Scenario Reel)

**Objectif :** Simuler la mise en place d un environnement de travail pour une equipe de developpement.

**Contexte :** Tu es administrateur systeme. Tu dois preparer l environnement de travail pour une entreprise `OFPPT` avec deux equipes : `Linux` et `Windows`.

---

**1. Creer l arborescence suivante en une seule commande :**

```
/OFPPT/
├── Linux/
│   ├── cours/
│   ├── tp/
│   │   ├── tp1/
│   │   └── tp2/
│   └── projets/
└── Windows/
    ├── cours/
    ├── tp/
    └── projets/
```

<details>
<summary>Voir la reponse</summary>

```bash
mkdir -p /OFPPT/{Linux/{cours,tp/{tp1,tp2},projets},Windows/{cours,tp,projets}}
```

</details>

---

**2. Creer les fichiers suivants :**
- `intro_linux.txt` dans `/OFPPT/Linux/cours`
- `intro_windows.txt` dans `/OFPPT/Windows/cours`
- `exercice1.sh` et `exercice2.sh` dans `/OFPPT/Linux/tp/tp1`

<details>
<summary>Voir la reponse</summary>

```bash
touch /OFPPT/Linux/cours/intro_linux.txt
touch /OFPPT/Windows/cours/intro_windows.txt
touch /OFPPT/Linux/tp/tp1/{exercice1.sh,exercice2.sh}
```

</details>

---

**3. Donner les permissions correctes :**
- `exercice1.sh` et `exercice2.sh` : executable par le proprietaire, lisible par les autres
- Le repertoire `/OFPPT/Linux/projets` : tous les droits au proprietaire, lecture+execution au groupe, rien aux autres

<details>
<summary>Voir la reponse</summary>

```bash
chmod 744 /OFPPT/Linux/tp/tp1/exercice1.sh
chmod 744 /OFPPT/Linux/tp/tp1/exercice2.sh
chmod 750 /OFPPT/Linux/projets
```

</details>

---

**4. Changer le proprietaire de tout `/OFPPT/Linux` pour l utilisateur `omar` et le groupe `linux_team`.**

<details>
<summary>Voir la reponse</summary>

```bash
chown -R omar:linux_team /OFPPT/Linux
```

</details>

---

**5. Copier le fichier `/etc/hostname` dans `/OFPPT/Linux/cours` en le renommant `nom_serveur.txt`.**

<details>
<summary>Voir la reponse</summary>

```bash
cp /etc/hostname /OFPPT/Linux/cours/nom_serveur.txt
```

</details>

---

**6. Creer un lien symbolique de `/OFPPT/Linux/cours/intro_linux.txt` dans `/OFPPT/Windows/cours` sous le nom `reference_linux.txt`.**

<details>
<summary>Voir la reponse</summary>

```bash
ln -s /OFPPT/Linux/cours/intro_linux.txt /OFPPT/Windows/cours/reference_linux.txt
```

</details>

---

**7. Chercher tous les fichiers `.sh` dans `/OFPPT` et sauvegarder la liste dans `/OFPPT/liste_scripts.txt`.**

<details>
<summary>Voir la reponse</summary>

```bash
find /OFPPT -name '*.sh' > /OFPPT/liste_scripts.txt
```

</details>

---

**8. Afficher le contenu de `/etc/passwd`, filtrer uniquement les lignes contenant `bash`, compter le nombre de resultats et sauvegarder dans `/OFPPT/Linux/cours/utilisateurs_bash.txt`.**

<details>
<summary>Voir la reponse</summary>

```bash
grep bash /etc/passwd | wc -l > /OFPPT/Linux/cours/utilisateurs_bash.txt
# ou afficher ET sauvegarder
grep bash /etc/passwd | tee /OFPPT/Linux/cours/utilisateurs_bash.txt | wc -l
```

</details>

---

**9. Supprimer recursivement le repertoire `/OFPPT/Windows/tp` et tout son contenu.**

<details>
<summary>Voir la reponse</summary>

```bash
rm -rf /OFPPT/Windows/tp
```

</details>

---

**10. Afficher la structure finale complete de `/OFPPT` avec tous les fichiers et repertoires.**

<details>
<summary>Voir la reponse</summary>

```bash
ls -R /OFPPT
# ou avec find pour un affichage plus clair
find /OFPPT
```

</details>

---

:::tip Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/linux/quizz-00-les-commandes-de-base)

:::