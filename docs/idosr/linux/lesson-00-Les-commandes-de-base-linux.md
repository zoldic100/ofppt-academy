---
id: lesson-00
title: Les Commandes de Base Linux
---

## Introduction au Shell Linux

Le shell est l'interface en ligne de commande (CLI) qui permet de communiquer avec le noyau Linux en saisissant des commandes textuelles. C'est l'outil fondamental de tout administrateur système.

Structure d'une commande Linux :

```bash
commande [options] [arguments]

# Exemples :
ls -al /etc
cp -r /source /destination
find /home -name '*.txt'
```

Les options commencent par `-` (forme courte : `-l`) ou `--` (forme longue : `--list`). Les arguments sont les fichiers ou dossiers sur lesquels s'applique la commande.

Raccourcis clavier essentiels :

| Raccourci | Action |
|---|---|
| `Tab` | Autocomplétion des commandes et chemins |
| `Ctrl + C` | Interrompre la commande en cours |
| `Ctrl + L` | Effacer l'ecran (equivalent de `clear`) |
| `Ctrl + A` | Aller au debut de la ligne |
| `Ctrl + E` | Aller a la fin de la ligne |
| Fleche haut | Rappeler la commande precedente (historique) |

---

## 1. Structure du Systeme de Fichiers Linux

Avant toute chose, il est essentiel de comprendre l'arborescence Linux. Contrairement a Windows, tout part d'une seule racine `/`.

### Repertoires importants

| Repertoire | Role | Contenu typique |
|---|---|---|
| `/` | Racine du systeme de fichiers | Point de depart de tout |
| `/etc` | Fichiers de configuration | `nginx/`, `ssh/`, `hosts`, `fstab`, `crontab`, `passwd` |
| `/var/log` | Logs systeme et applications | `syslog`, `auth.log`, `nginx/access.log`, `dmesg` |
| `/home` | Repertoires personnels des utilisateurs | `/home/username/` |
| `/root` | Repertoire personnel du superutilisateur root | Configurations et fichiers de root |
| `/srv` | Donnees des services heberges | Sites web, fichiers partages, FTP |
| `/mnt` | Montage temporaire de systemes de fichiers | Disques externes, partages reseau temporaires |
| `/bin` | Binaires essentiels pour tous les utilisateurs | `ls`, `cp`, `mv`, `cat`, `chmod` |
| `/sbin` | Binaires systeme essentiels (admin) | `fdisk`, `mkfs`, `ifconfig`, `reboot` |
| `/usr` | Programmes et bibliotheques utilisateurs | `/usr/bin/`, `/usr/lib/`, `/usr/share/` |
| `/usr/local` | Logiciels installes manuellement | `/usr/local/bin/`, `/usr/local/etc/` |
| `/tmp` | Fichiers temporaires (effaces au redemarrage) | Fichiers de session, caches temporaires |
| `/var` | Donnees variables (logs, spools, caches) | `/var/mail/`, `/var/spool/`, `/var/cache/` |
| `/var/www` | Racine web par defaut (Apache/Nginx) | `html/`, sites web |
| `/boot` | Fichiers de demarrage du systeme | Kernel (`vmlinuz`), GRUB, initramfs |
| `/dev` | Fichiers de peripheriques | `sda`, `tty`, `null`, `random`, `zero` |
| `/media` | Points de montage pour medias amovibles | Cles USB, CD-ROM (auto-montage) |

### Hierarchie FHS (Filesystem Hierarchy Standard)

- **Statique** (`/bin`, `/sbin`, `/lib`, `/usr` ) → Lecture seule, partageable
- **Variable** (`/var`, `/tmp`) → Ecriture frequente, locale
- **Configuration** (`/etc`) → Locale, admin uniquement
- **Home** (`/home`, `/root`) → Donnees utilisateurs

---

## 2. Navigation dans l'Arborescence

### `pwd` - Afficher le repertoire courant

`pwd` signifie *Print Working Directory*. Tres utile quand on se perd dans l'arborescence.

```bash
pwd
# Exemple de sortie : /home/said/Formation
```

### `ls` - Lister le contenu d'un repertoire

Signification : *list segment*. Equivalent Windows : `dir`

```bash
# Lister le repertoire courant
ls

# Lister avec details (droits, proprietaire, taille, date)
ls -l

# Lister TOUS les fichiers y compris les caches (commencant par .)
ls -a

# Combine : tout + details
ls -al

# Taille lisible (Ko, Mo, Go) + details
ls -lh

# Trie par taille decroissante
ls -lhS

# Trie par date (plus recent en premier)
ls -lt

# Lister un repertoire specifique
ls -al /etc

# Lister recursivement (sous-dossiers inclus)
ls -R /etc
```

### `cd` - Changer de repertoire

Signification : *change directory*.

```bash
# Aller a la racine
cd /

# Aller dans le repertoire personnel de l'utilisateur courant
cd ~
cd

# Aller dans un repertoire specifique
cd /var/www

# Remonter d'un niveau (repertoire parent)
cd ..

# Remonter de deux niveaux
cd ../..

# Revenir au repertoire precedent
cd -
```

---

## 3. Gestion des Fichiers et Repertoires

### `mkdir` - Creer des repertoires

Signification : *make directory*. Equivalent Windows : `mkdir` / `md`

```bash
# Creer un repertoire simple
mkdir photos

# Creer des repertoires imbriques (parents inclus si inexistants)
mkdir -p Ali/Formation/TPLinux

# Creer plusieurs repertoires en une seule commande
mkdir rep1 rep2 rep3

# Creer une arborescence complexe
mkdir -p public/docs/html public/src/cpp

mkdir -p public/{docs/html,src/cpp}

mkdir -p /home/{omar/{documents,telechargements,bureau},said/{documents/{cours,projets},images/{photos,captures}}}

# Resultat :

tree
/home/
├── omar/
│   ├── documents/
│   ├── telechargements/
│   └── bureau/
└── said/
    ├── documents/
    │   ├── cours/
    │   └── projets/
    └── images/
        ├── photos/
        └── captures/
``````
### `rmdir` - Supprimer un repertoire vide

Signification : *remove directory*. Equivalent Windows : `rmdir` / `rd`

> `rmdir` ne fonctionne que sur les repertoires **vides**. Pour supprimer un repertoire avec contenu, utiliser `rm -rf`.

```bash
# Supprimer un repertoire vide
rmdir LeRep

# Supprimer et les parents s'ils deviennent vides
rmdir -p rep1/rep2/rep3
```

### `touch` - Creer un fichier vide

```bash
# Creer un fichier vide
touch monfichier.txt

# Creer plusieurs fichiers
touch fichier1.txt fichier2.txt fichier3.txt

# Mettre a jour l'horodatage d'un fichier existant
touch fichierExistant
```

### `cp` - Copier des fichiers et repertoires

Signification : *copy*. Equivalent Windows : `copy` / `xcopy`

```bash
# Copier un fichier dans un repertoire
cp monFichier /destination

# Copier en renommant
cp monFichier copie_monFichier

# Copier un repertoire entier (recursif)
cp -r /monRep /ailleurs

# Copier en preservant droits, dates, proprietaires (archive)
cp -a /source /destination

# Demander confirmation avant ecrasement
cp -i monFichier /destination
```

### `mv` - Deplacer ou renommer

Signification : *move*. Equivalent Windows : `move` / `ren`

```bash
# Deplacer un fichier
mv monFichier /stagiaire/

# Renommer un fichier
mv ancienNom nouveauNom

# Renommer un repertoire
mv stagiaire Formation

# Deplacer plusieurs fichiers
mv fichier1 fichier2 /destination/

# Demander confirmation avant ecrasement
mv -i monFichier /destination
```

### `rm` - Supprimer des fichiers

Signification : *remove*. Equivalent Windows : `del` / `erase`

> **Attention** : `rm` est une commande dangereuse. Il n'y a **pas de corbeille** en ligne de commande - la suppression est definitive.

```bash
# Supprimer un fichier
rm CeFichier

# Demander confirmation avant suppression
rm -i CeFichier

# Supprimer un repertoire et tout son contenu
rm -rf /tmp/LeRep

# Supprimer tous les fichiers .log du repertoire courant
rm *.log
```

> Ne jamais executer `rm -rf /*` : cela supprime tout le systeme sans confirmation.

---

## 4. Affichage et Lecture de Fichiers

### `cat` - Afficher le contenu d'un fichier

Signification : *concatenate*. Equivalent Windows : `type`

```bash
# Afficher le contenu d'un fichier
cat monFichier

# Afficher avec numeros de lignes
cat -n monFichier

# Afficher les caracteres de controle
cat -v monFichier

# Creer un fichier avec redirection (Ctrl+D pour terminer)
cat > nouveauFichier.txt

# Concatener deux fichiers dans un troisieme
cat -n fichier1.txt fichier2.txt > fichier3.txt
```

### `more` et `less` - Affichage pagine

```bash
# more : afficher page par page (Espace = page suivante, q = quitter)
more monFichier
more -sf monFichier    # Regroupe les lignes vides, ne coupe pas les longues

# less : navigation complete (haut/bas, recherche /motif, q = quitter)
less monFichier
less -e monFichier     # Quitte automatiquement a la fin du fichier

# Exemple pratique : lire un fichier de config long
less /etc/named.conf
less /var/log/syslog
```

> `less` est superieur a `more` : il permet de naviguer en arriere et de chercher des termes avec `/motif`.

### `head` et `tail` - Debut et fin d'un fichier

```bash
# Afficher les 10 premieres lignes (defaut)
head monFichier

# Afficher les N premieres lignes
head -n 20 monFichier

# Afficher les 10 dernieres lignes
tail monFichier

# Afficher les N dernieres lignes
tail -n 50 /var/log/messages

# Surveiller un fichier de log en temps reel
tail -f /var/log/syslog
```

### Redirections `>` et `>>`

```bash
# > Redirige la sortie vers un NOUVEAU fichier (ecrase si existant)
ls -al > liste_fichiers.txt
cat fichier1 fichier2 > fusion.txt

# >> Ajoute la sortie a la FIN d'un fichier existant
echo 'fin du texte' >> monFichier.txt
date >> /var/log/mon_log.txt

# | Pipe : envoyer la sortie d'une commande vers une autre
ls -alR / | grep doc
cat /etc/passwd | grep root
ps aux | grep apache
```

---

## 5. Recherche de Fichiers et de Texte

### `grep` - Rechercher dans le contenu

Signification : *Global Regular Expression Print*. Equivalent Windows : `find`

```bash
# Rechercher 'stage' dans un fichier
grep stage monFichier

# Afficher les numeros de ligne
grep -n stage monFichier

# Insensible a la casse
grep -i stage monFichier

# Recherche recursive dans tous les sous-repertoires
grep -rn config /etc

# Compter le nombre de lignes correspondantes
grep -c root /etc/passwd

# Afficher les lignes qui NE contiennent PAS le motif
grep -v root /etc/passwd

# Chercher l'utilisateur 'nasser' et son numero de ligne
grep -n nasser /etc/passwd

# Utiliser avec un pipe
cat /etc/passwd | grep -n said
```

Options `grep` les plus utiles :

| Option | Description |
|---|---|
| `-n` | Affiche le numero de ligne |
| `-i` | Insensible a la casse |
| `-r` | Recherche recursive dans les sous-repertoires |
| `-c` | Retourne le nombre de lignes correspondantes |
| `-v` | Affiche les lignes qui ne correspondent PAS |

### `find` - Rechercher des fichiers

Signification : *rechercher*. La recherche est recursive par defaut.

```bash
# Rechercher un fichier par nom
find /home -name stage.txt

# Rechercher tous les fichiers .conf dans /etc
find /etc -name '*.conf'

# Recherche insensible a la casse
find /etc -iname 'resolv.conf'

# Chercher les fichiers modifies dans les 5 derniers jours
find . -mtime -5

# Chercher uniquement les fichiers (pas les repertoires)
find /home -mtime -1 ! -type d

# Chercher les fichiers appartenant a root
find . -user root

# Chercher par type (f=fichier, d=repertoire, l=lien)
find /etc -type f -name '*.conf'

# Trouver ET supprimer les fichiers .wmv et .wma
find . \( -name '*.wmv' -o -name '*.wma' \) -exec rm {} \;
```

Options `find` les plus utiles :

| Option | Description | Exemple |
|---|---|---|
| `-name` | Nom exact (sensible casse) | `find /etc -name named.conf` |
| `-iname` | Nom insensible a la casse | `find /etc -iname '*.Conf'` |
| `-type f` | Fichiers normaux uniquement | `find /home -type f` |
| `-type d` | Repertoires uniquement | `find / -type d -name logs` |
| `-type l` | Liens symboliques | `find / -type l` |
| `-user` | Appartient a cet utilisateur | `find / -user root` |
| `-mtime` | Modifie depuis N jours | `find . -mtime -7` |
| `-exec` | Executer une commande sur le resultat | `find . -name '*.log' -exec rm {} \;` |

---

## 6. Liens Physiques et Symboliques

### Types de liens

| Type | Description | Analogie Windows |
|---|---|---|
| Lien physique (hard link) | Autre nom pour le meme fichier (meme inode). Fonctionne uniquement sur le meme systeme de fichiers. | Pas d'equivalent exact |
| Lien symbolique (soft link) | Raccourci vers un fichier ou repertoire. Peut pointer vers n'importe quel chemin. | Raccourci Windows (.lnk) |

### `ln` - Creer des liens

Signification : *link*.

```bash
# Creer un lien symbolique (le plus utilise)
ln -s /chemin/source NomDuLien

# Exemples :
ln -s /var/named/chroot/var/named/named.root /var/named.root
ln -s Rep1/Rep2/Monfichier MonLien

# Creer un lien physique
ln Monfichier unRep/AutreNom

# Forcer l'ecrasement du lien existant
ln -sf /nouvelle/source MonLien

# Verifier les liens symboliques (indiques par -> dans ls -la)
ls -la
```

> Si le fichier source d'un lien symbolique est supprime, le lien devient *casse* (dangling symlink). Un lien physique lui survit car ils partagent le meme inode.

---

## 7. Droits et Permissions

### Lecture des permissions

Chaque fichier Linux a des permissions sur 3 niveaux : **U**(tilisateur) | **G**(roupe) | **O**(thers/Autres)

```bash
# Exemple de sortie ls -l :
-rwxr-xr-- 1 said TRI 4096 Jan 06 09:00 monScript.sh
drwxr-xr-x 2 root root 4096 Jan 06 09:00 monRep/
lrwxrwxrwx 1 root root   12 Jan 06 09:00 monLien -> /var/log

# Decodage : -rwxr-xr--
# -   = type (- fichier, d repertoire, l lien)
# rwx = droits proprietaire (r=lire, w=ecrire, x=executer)
# r-x = droits groupe (lecture + execution, pas d'ecriture)
# r-- = droits autres (lecture uniquement)
```

Valeurs numeriques des permissions :

| Valeur | Permission | Signification |
|---|---|---|
| 4 | `r` | Lecture (Read) |
| 2 | `w` | Ecriture (Write) |
| 1 | `x` | Execution (eXecute) |
| 0 | `-` | Aucun droit |

### `chmod` - Modifier les permissions

```bash
# Syntaxe numerique : chmod UGO fichier
chmod 755 monFichier     # U=7(rwx) G=5(r-x) O=5(r-x)
chmod 644 monFichier     # U=6(rw-) G=4(r--) O=4(r--)
chmod 600 monFichier     # U=6(rw-) G=0(---) O=0(---) - Prive

# Syntaxe symbolique
chmod u+x monScript.sh   # Ajouter execution au proprietaire
chmod g-w monFichier     # Retirer ecriture au groupe
chmod o-w /shared/docs   # Retirer ecriture aux autres
chmod a+r monFichier     # Ajouter lecture a tous (all)

# Recursif sur un repertoire
chmod -R o-w /shared/docs
chmod -R 644 /var/www/html
```

Permissions courantes :

| Octal | Droits | Cas d'usage typique |
|---|---|---|
| `777` | `rwxrwxrwx` | Partage public - DANGEREUX |
| `755` | `rwxr-xr-x` | Executables, repertoires web |
| `644` | `rw-r--r--` | Fichiers texte, configs lisibles |
| `640` | `rw-r-----` | Configs sensibles |
| `600` | `rw-------` | Cles SSH, fichiers prives |

### `chown` - Changer le proprietaire

Signification : *change owner*. Equivalent Windows : `cacls`

```bash
# Changer le proprietaire
chown said MonFichier

# Changer proprietaire ET groupe
chown said:TRI monFichier

# Changer recursivement sur un repertoire
chown -R said:TRI monRep
```

### `chgrp` - Changer le groupe proprietaire

Signification : *change group*.

```bash
# Changer le groupe d'un fichier
chgrp TDI TPLinux

# Changer recursivement
chgrp -R TRI Formation

# Changer le groupe d'un lien symbolique (pas la cible)
chgrp -h TRI monLien
```

---

## 8. Commandes Systeme et Informations

### Informations systeme

```bash
uname -a        # Version du noyau et infos systeme
uname -r        # Version du noyau uniquement
hostname        # Nom de la machine
who             # Utilisateurs connectes
whoami          # Identite de l'utilisateur courant
id              # UID, GID et groupes
df -h           # Espace disque utilise
du -sh /var/log # Taille d'un repertoire
ip a            # Interfaces reseau
```

### Gestion des processus

```bash
ps aux          # Lister tous les processus actifs
top             # Voir les processus en temps reel
kill -9 1234    # Tuer un processus par son PID
pkill apache2   # Tuer par nom de processus
```

### `su` et `sudo` - Elevation de privileges

```bash
su -            # Devenir root (charge l'environnement complet de root)
sudo commande   # Executer une commande en tant que root
su - said       # Se connecter avec l'environnement de said
exit            # Quitter le mode root
```

> Difference entre `su -` et `su` : `su -` charge l'environnement complet de root (PATH, variables...). `su` seul garde l'environnement de l'utilisateur courant.

---

## 9. Archivage et Logs

### `tar` - Archivage

```bash
# Sauvegarder un repertoire
tar -zcvf archive.tar.gz /home

# Restaurer une archive
tar -zxvf archive.tar.gz
```

### Affichage des logs systeme

```bash
tail -50 /var/log/messages   # Affiche les 50 dernieres lignes du log systeme
tail -f /var/log/syslog      # Surveiller un log en temps reel
cat /proc/ioports            # Affiche les ports d'entree/sortie utilises
```

---

## 10. Tableau Recapitulatif

| Commande | Syntaxe cle | Description |
|---|---|---|
| `ls` | `ls -al /etc` | Lister fichiers avec details + caches |
| `ls` | `ls -lhS` | Lister trie par taille decroissante |
| `cd` | `cd ..` / `cd -` / `cd ~` | Parent / Precedent / Home |
| `pwd` | `pwd` | Afficher le repertoire courant |
| `mkdir` | `mkdir -p parent/enfant` | Creer arborescence complete |
| `rmdir` | `rmdir -p rep1/rep2` | Supprimer repertoires vides + parents |
| `touch` | `touch fichier.txt` | Creer un fichier vide |
| `cp` | `cp -r /src /dst` | Copier recursivement |
| `cp` | `cp -a /src /dst` | Copier avec preservation des droits |
| `mv` | `mv ancien nouveau` | Renommer ou deplacer |
| `rm` | `rm -rf /rep` | Supprimer repertoire + contenu |
| `cat` | `cat -n fichier` | Afficher avec numeros de lignes |
| `less` | `less /var/log/syslog` | Afficher en mode navigation |
| `tail` | `tail -f /var/log/syslog` | Surveiller un log en temps reel |
| `grep` | `grep -rn motif /etc` | Recherche recursive avec n° ligne |
| `find` | `find /etc -name '*.conf'` | Trouver fichiers par nom |
| `ln` | `ln -s /source lien` | Creer un lien symbolique |
| `chmod` | `chmod 755 script.sh` | Modifier les permissions |
| `chown` | `chown -R user:grp /rep` | Changer proprietaire recursivement |
| `>` | `commande > fichier` | Redirection (ecrase) |
| `>>` | `commande >> fichier` | Redirection (ajoute en fin) |
| `\|` | `cmd1 \| cmd2` | Pipe : chainer les commandes |

:::TP et Quiz disponible

Testez vos connaissances sur cette lecon :
### Quizzes: [Faire le quiz ](/quizzes/linux/quizz-00-les-commandes-de-base)
### TP: [Faire les TP ](/TP/linux/tp-lesson-00)

:::