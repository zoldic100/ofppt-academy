---
id: lesson-12

title:  Archifage et Compression 


---

# APT et DNF — Gestionnaires de Paquets

> **Objectif :** Maîtriser la gestion des paquets sous Linux avec `apt` (Ubuntu/Debian) et `dnf` (Fedora/RHEL/CentOS) — installation, mise à jour, recherche, nettoyage et gestion des dépôts.

---

## 1. Fichiers Principaux

| Fichier | Ubuntu (apt) | Fedora (dnf) |
|---------|-------------|--------------|
| Sources dépôts | `/etc/apt/sources.list` | `/etc/yum.repos.d/*.repo` |
| Sources additionnelles | `/etc/apt/sources.list.d/` | `/etc/yum.repos.d/` |
| Configuration | `/etc/apt/apt.conf` | `/etc/dnf/dnf.conf` |
| Cache paquets | `/var/cache/apt/archives/` | `/var/cache/dnf/` |
| Base de données | `/var/lib/dpkg/` | `/var/lib/rpm/` |

---

## 2. Commandes APT (Ubuntu/Debian)

### 2.1 Mise à jour

```bash
# Mettre à jour la liste des paquets disponibles
sudo apt update

# Mettre à jour tous les paquets installés
sudo apt upgrade -y

# Mise à jour complète avec résolution avancée des dépendances
sudo apt dist-upgrade -y
```

:::info `upgrade` vs `dist-upgrade`
- `apt upgrade` : met à jour les paquets sans jamais en supprimer
- `apt dist-upgrade` : peut supprimer des paquets obsolètes pour résoudre les conflits de dépendances — plus agressif mais plus complet
:::

### 2.2 Installer et Supprimer

```bash
# Installer un ou plusieurs paquets
sudo apt install nom_paquet -y
sudo apt install paquet1 paquet2 paquet3 -y

# Supprimer un paquet (garde les fichiers de config)
sudo apt remove nom_paquet

# Supprimer un paquet + ses fichiers de configuration
sudo apt purge nom_paquet
```

:::tip `remove` vs `purge`
Utiliser `purge` pour une désinstallation propre — `remove` laisse les fichiers de configuration, ce qui peut causer des conflits si on réinstalle le paquet plus tard.
:::

### 2.3 Rechercher et Inspecter

```bash
# Rechercher un paquet par mot-clé
apt search mot_clé
apt-cache search mot_clé

# Afficher les informations d'un paquet
apt show nom_paquet
apt-cache show nom_paquet

# Lister les paquets installés
dpkg -l
apt list --installed
```

### 2.4 Nettoyer

```bash
# Supprimer tous les paquets téléchargés du cache
sudo apt clean

# Supprimer uniquement les vieilles versions du cache
sudo apt autoclean

# Supprimer les dépendances devenues inutiles
sudo apt autoremove
```

### 2.5 Gérer les Dépôts

```bash
# Ajouter un dépôt PPA
sudo add-apt-repository ppa:nom/ppa
sudo apt update
```

---

## 3. Commandes DNF (Fedora/RHEL/CentOS)

### 3.1 Mise à jour

```bash
# Mettre à jour la liste et tous les paquets
sudo dnf update -y
sudo dnf upgrade -y
```

### 3.2 Installer et Supprimer

```bash
# Installer un paquet
sudo dnf install nom_paquet -y

# Supprimer un paquet
sudo dnf remove nom_paquet
```

:::info DNF conserve les fichiers de configuration
Contrairement à `apt purge`, `dnf remove` laisse toujours les fichiers de configuration. Pour les supprimer manuellement, il faut les trouver dans `/etc/` et les effacer.
:::

### 3.3 Rechercher et Inspecter

```bash
# Rechercher un paquet
dnf search mot_clé

# Afficher les informations d'un paquet
dnf info nom_paquet

# Lister les paquets installés
dnf list installed
rpm -qa
```

### 3.4 Nettoyer

```bash
# Nettoyer tout le cache DNF
sudo dnf clean all

# Supprimer les dépendances inutilisées
sudo dnf autoremove
```

### 3.5 Gérer les Dépôts et Groupes

```bash
# Lister les dépôts actifs
dnf repolist

# Ajouter un dépôt
sudo dnf config-manager --add-repo https://url/du/repo.repo

# Installer un groupe de paquets
sudo dnf groupinstall "Development Tools"

# Lister les groupes disponibles
dnf grouplist
```

:::tip Groupes de paquets DNF
Les groupes permettent d'installer un ensemble cohérent de paquets en une seule commande. Exemples courants :
- `"Development Tools"` — compilateurs et outils de développement
- `"Web Server"` — Apache et dépendances
- `"Virtualization"` — KVM et outils de virtualisation
:::

---

## 4. Tableau Comparatif APT vs DNF

| Action | APT (Ubuntu) | DNF (Fedora) |
|--------|-------------|--------------|
| Mettre à jour la liste | `apt update` | `dnf check-update` |
| Mettre à jour tout | `apt upgrade` | `dnf upgrade` |
| Installer | `apt install paquet` | `dnf install paquet` |
| Supprimer | `apt remove paquet` | `dnf remove paquet` |
| Supprimer + config | `apt purge paquet` | *(configs conservées)* |
| Rechercher | `apt search motclé` | `dnf search motclé` |
| Infos paquet | `apt show paquet` | `dnf info paquet` |
| Lister installés | `dpkg -l` | `rpm -qa` / `dnf list installed` |
| Nettoyer cache | `apt clean` | `dnf clean all` |
| Supprimer inutilisés | `apt autoremove` | `dnf autoremove` |
| Lister dépôts | `apt-cache policy` | `dnf repolist` |

---

## 5. Commandes de Référence

```bash
# === APT (Ubuntu) ===
sudo apt update                     # rafraîchir la liste
sudo apt upgrade -y                 # mettre à jour
sudo apt install <paquet> -y        # installer
sudo apt remove <paquet>            # supprimer
sudo apt purge <paquet>             # supprimer + config
apt search <motclé>                 # rechercher
apt show <paquet>                   # infos
dpkg -l                             # lister installés
sudo apt autoremove                 # nettoyer dépendances inutiles
sudo apt clean                      # vider le cache

# === DNF (Fedora) ===
sudo dnf update -y                  # mettre à jour
sudo dnf install <paquet> -y        # installer
sudo dnf remove <paquet>            # supprimer
dnf search <motclé>                 # rechercher
dnf info <paquet>                   # infos
rpm -qa                             # lister installés
sudo dnf autoremove                 # nettoyer dépendances inutiles
sudo dnf clean all                  # vider le cache
dnf repolist                        # lister dépôts
sudo dnf groupinstall "Groupe"      # installer un groupe
```