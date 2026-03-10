---
id: lesson-04
title: LVM – Gestion des Disques  
---

---

# LVM — Gestion des Volumes Logiques

> **Objectif :** Comprendre et maîtriser LVM (Logical Volume Manager) pour créer, étendre, réduire et supprimer des volumes logiques sous Linux.

---

## 1. Présentation

LVM est un **outil kernel** — il n'y a pas de démon principal. Le service `lvm2-monitor` assure uniquement la surveillance.

### 1.1 Installation

| Distribution | Commande |
|-------------|----------|
| **Ubuntu Server** | `sudo apt install lvm2 -y` |
| **Fedora** | `sudo dnf install lvm2 -y` |

### 1.2 Fichiers principaux

| Fichier | Rôle |
|---------|------|
| `/etc/lvm/lvm.conf` | Configuration globale LVM |
| `/etc/fstab` | Montages permanents des volumes logiques |

---

## 2. Ordre Obligatoire de Création

:::danger Ordre OBLIGATOIRE — ne jamais inverser
```
PV  →  VG  →  LV  →  mkfs  →  mount
```
**PV d'abord, toujours.** Inverser cet ordre provoque des erreurs irrécupérables.
:::

| Etape | Composant | Description |
|-------|-----------|-------------|
| 1 | **PV** — Physical Volume | Disque physique initialisé pour LVM |
| 2 | **VG** — Volume Group | Groupe de disques physiques |
| 3 | **LV** — Logical Volume | Volume logique découpé depuis le VG |
| 4 | **mkfs** | Formatage du volume logique |
| 5 | **mount** | Montage dans l'arborescence Linux |

---

## 3. Création pas à pas

### 3.1 Créer des volumes physiques (PV)

```bash
# Initialiser un seul disque
sudo pvcreate /dev/sdb

# Initialiser plusieurs disques en une commande
sudo pvcreate /dev/sdc /dev/sdd

# Vérifier
sudo pvs
sudo pvdisplay
```

### 3.2 Créer un groupe de volumes (VG)

```bash
# Créer le VG avec plusieurs PV
sudo vgcreate NomVG /dev/sdb /dev/sdc

# Vérifier
sudo vgs
sudo vgdisplay
```

### 3.3 Créer un volume logique (LV)

```bash
# Créer un LV avec une taille fixe
sudo lvcreate -L 50G -n NomLV NomVG

# Créer un LV qui utilise tout l'espace disponible
sudo lvcreate -l 100%FREE -n NomLV NomVG

# Vérifier
sudo lvs
sudo lvdisplay
sudo lvscan
```

### 3.4 Formater et monter

```bash
# Formater en ext4
sudo mkfs.ext4 /dev/NomVG/NomLV

# Créer le point de montage et monter
sudo mkdir -p /mnt/data
sudo mount /dev/NomVG/NomLV /mnt/data
```

**Montage permanent dans `/etc/fstab` :**

```fstab title="/etc/fstab"
/dev/NomVG/NomLV   /mnt/data   ext4   defaults   0 2
```

---

## 4. Etendre un VG et un LV

```bash
# 1. Initialiser le nouveau disque comme PV
sudo pvcreate /dev/sde

# 2. Ajouter le PV au VG existant
sudo vgextend NomVG /dev/sde

# 3. Etendre le LV
sudo lvextend -L +20G /dev/NomVG/NomLV

# 4. Etendre le systeme de fichiers SANS demonter
sudo resize2fs /dev/NomVG/NomLV     # ext4
sudo xfs_growfs /mnt/data           # XFS (Fedora par defaut)
```

:::tip Extension a chaud
Avec **ext4** et **XFS**, l'extension peut se faire **sans demonter** le volume. C'est l'un des grands avantages de LVM en production.
:::

---

## 5. Réduire un LV

:::danger Ordre OBLIGATOIRE pour la réduction — ext4 uniquement
```
umount → e2fsck → resize2fs → lvreduce → mount
```
**resize2fs AVANT lvreduce, toujours.** Inverser cet ordre détruit les données.
:::

```bash
# 1. Demonter le volume
sudo umount /mnt/data

# 2. Verifier le systeme de fichiers
sudo e2fsck -f /dev/NomVG/NomLV

# 3. Reduire le systeme de fichiers
sudo resize2fs /dev/NomVG/NomLV 30G

# 4. Reduire le volume logique
sudo lvreduce -L 30G /dev/NomVG/NomLV

# 5. Remonter
sudo mount /dev/NomVG/NomLV /mnt/data
```

:::warning XFS ne peut pas etre réduit
**XFS** ne supporte que l'extension, **jamais la réduction**. Si vous avez besoin de réduire, il faut sauvegarder les données, supprimer le volume et le recréer.
:::

---

## 6. Snapshots

Un snapshot est une **copie instantanée** de l'état d'un volume à un moment donné. Utile avant une mise à jour risquée ou une modification de base de données.

```bash
# Creer un snapshot (10G d'espace pour stocker les differences)
sudo lvcreate --size 10G --snapshot --name snap1 /dev/NomVG/NomLV

# Restaurer depuis un snapshot (le LV doit etre demonté)
sudo umount /mnt/data
sudo lvconvert --merge /dev/NomVG/snap1

# Supprimer un snapshot
sudo lvremove /dev/NomVG/snap1
```

:::info Comment fonctionne un snapshot
Le snapshot ne copie pas toutes les données immédiatement. Il enregistre uniquement les **blocs modifiés** après sa création (Copy-on-Write). Plus vous modifiez de données après le snapshot, plus il consomme d'espace.
:::

---

## 7. Suppression (ordre OBLIGATOIRE)

:::danger Ordre de suppression
```
umount → lvremove → vgremove → pvremove
```
:::

```bash
# 1. Demonter
sudo umount /mnt/data

# 2. Supprimer le volume logique
sudo lvremove /dev/NomVG/NomLV

# 3. Supprimer le groupe de volumes
sudo vgremove NomVG

# 4. Supprimer les volumes physiques
sudo pvremove /dev/sdb /dev/sdc
```

---

## 8. Commandes de Référence

```bash
# --- PV ---
sudo pvcreate /dev/sdX          # initialiser un disque
sudo pvs                        # liste courte
sudo pvdisplay                  # details complets
sudo pvremove /dev/sdX          # supprimer

# --- VG ---
sudo vgcreate NomVG /dev/sdX    # creer
sudo vgextend NomVG /dev/sdX    # ajouter un PV
sudo vgreduce NomVG /dev/sdX    # retirer un PV
sudo vgs                        # liste courte
sudo vgdisplay                  # details complets
sudo vgremove NomVG             # supprimer

# --- LV ---
sudo lvcreate -L 50G -n NomLV NomVG   # creer (taille fixe)
sudo lvcreate -l 100%FREE -n NomLV NomVG  # tout l'espace
sudo lvextend -L +20G /dev/NomVG/NomLV    # etendre
sudo lvreduce -L 30G /dev/NomVG/NomLV     # reduire
sudo lvs                        # liste courte
sudo lvdisplay                  # details complets
sudo lvscan                     # scanner tous les LV
sudo lvremove /dev/NomVG/NomLV  # supprimer

# --- Systeme de fichiers ---
sudo mkfs.ext4 /dev/NomVG/NomLV   # formater ext4
sudo resize2fs /dev/NomVG/NomLV   # redimensionner ext4
sudo xfs_growfs /mnt/data         # etendre XFS
sudo e2fsck -f /dev/NomVG/NomLV   # verifier ext4
```