---
id: lesson-10
title:  Archifage et Compression 


---


# Archivage et Compression

> **Objectif :** Maîtriser les outils d'archivage et de compression sous Linux — `tar`, `gzip`, `bzip2`, `xz` et `zip` — pour sauvegarder, transférer et restaurer des données.

---

## 1. Présentation

Il n'y a pas de démon — ce sont des **commandes utilisateur** : `tar`, `gzip`, `bzip2`, `zip`, `unzip`.

### Formats disponibles

| Extension | Description | Outil |
|-----------|-------------|-------|
| `.tar` | Archive sans compression | `tar` |
| `.tar.gz` | Archive + compression gzip | `tar` + `gzip` |
| `.tar.bz2` | Archive + compression bzip2 | `tar` + `bzip2` |
| `.tar.xz` | Archive + compression xz (meilleure compression) | `tar` + `xz` |
| `.gz` | Fichier seul compressé avec gzip | `gzip` |
| `.zip` | Archive ZIP (compatible Windows) | `zip` / `unzip` |

:::tip Quel format choisir ?
- `.tar.gz` : le plus **rapide**, bon compromis — usage général
- `.tar.bz2` : meilleure compression que gzip, plus lent
- `.tar.xz` : **meilleure compression**, plus lent — idéal pour les distributions et gros fichiers
- `.zip` : à utiliser uniquement pour **compatibilité Windows**
:::

---

## 2. Options tar

| Option | Signification |
|--------|--------------|
| `c` | Créer une archive (create) |
| `x` | Extraire une archive (extract) |
| `t` | Lister le contenu (list) |
| `v` | Mode verbose (afficher les fichiers traités) |
| `f` | Spécifier le fichier archive |
| `z` | Compression gzip (`.gz`) |
| `j` | Compression bzip2 (`.bz2`) |
| `J` | Compression xz (`.xz`) |
| `C` | Changer de répertoire de destination |

:::info Mémo rapide
```
c = Create    x = eXtract    t = lisT
z = gZip      j = bzip2      J = xz
v = Verbose   f = File       C = Change dir
```
:::

---

## 3. Commandes tar

### 3.1 Créer une archive

```bash
# Archive .tar.gz (gzip)
tar -zcvf archive.tar.gz /home/said/

# Archive .tar.bz2 (bzip2)
tar -jcvf archive.tar.bz2 /var/www/

# Archive .tar.xz (xz — meilleure compression)
tar -Jcvf archive.tar.xz /var/www/
```

### 3.2 Lister le contenu

```bash
tar -ztvf archive.tar.gz
```

### 3.3 Extraire une archive

```bash
# Extraire dans le répertoire courant
tar -zxvf archive.tar.gz

# Extraire dans un répertoire spécifique
tar -zxvf archive.tar.gz -C /tmp/restaure/

# Extraire un seul fichier
tar -zxvf archive.tar.gz home/said/fichier.txt
```

:::warning Chemin relatif dans l'archive
Lors de l'extraction d'un fichier précis, utiliser le **chemin relatif** tel qu'il apparaît dans l'archive (sans `/` au début).

Vérifier d'abord avec `tar -ztvf archive.tar.gz` pour voir le chemin exact.
:::

### 3.4 Archiver vers un lecteur de bande

```bash
tar -zcvf /dev/rmt0 /home
```

---

## 4. Compression seule — gzip et bzip2

Ces outils compressent un **fichier unique** (pas un dossier). Pour les dossiers, utiliser `tar`.

```bash
# Compresser un fichier
gzip fichier.txt          # Crée fichier.txt.gz — supprime l'original
bzip2 fichier.txt         # Crée fichier.txt.bz2 — supprime l'original

# Décompresser
gunzip fichier.txt.gz
bunzip2 fichier.txt.bz2

# Voir le contenu sans décompresser
zcat fichier.txt.gz
```

:::info gzip supprime l'original
Par défaut, `gzip` et `bzip2` **suppriment le fichier original** après compression. Pour conserver l'original, utiliser l'option `-k` (keep) :
```bash
gzip -k fichier.txt
bzip2 -k fichier.txt
```
:::

---

## 5. ZIP — Compatibilité Windows

```bash
# Créer un zip (récursif pour les dossiers)
zip -r archive.zip /dossier/

# Décompresser dans le répertoire courant
unzip archive.zip

# Décompresser dans un répertoire spécifique
unzip archive.zip -d /destination/

# Lister le contenu sans extraire
unzip -l archive.zip
```

---

## 6. Commandes de Référence

```bash
# --- Créer ---
tar -zcvf archive.tar.gz  /dossier/    # gzip
tar -jcvf archive.tar.bz2 /dossier/    # bzip2
tar -Jcvf archive.tar.xz  /dossier/    # xz
zip -r archive.zip /dossier/            # zip

# --- Extraire ---
tar -zxvf archive.tar.gz               # gzip, répertoire courant
tar -jxvf archive.tar.bz2 -C /dest/   # bzip2, destination
tar -Jxvf archive.tar.xz  -C /dest/   # xz, destination
unzip archive.zip -d /dest/             # zip, destination

# --- Lister ---
tar -ztvf archive.tar.gz               # lister un .tar.gz
unzip -l archive.zip                    # lister un .zip

# --- Compression fichier seul ---
gzip  fichier.txt                       # compresser
gunzip fichier.txt.gz                   # décompresser
gzip -k fichier.txt                     # compresser sans supprimer l'original
zcat fichier.txt.gz                     # lire sans décompresser
```