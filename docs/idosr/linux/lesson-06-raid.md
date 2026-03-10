---
id: lesson-06
title: RAID LOGICIEL – mdadm
---
---

# RAID Logiciel — mdadm

> **Objectif :** Créer, surveiller et gérer des arrays RAID logiciels sous Linux avec `mdadm`, et assurer leur persistance au redémarrage.

---

## 1. Présentation

`mdadm` est l'outil standard pour gérer le **RAID logiciel** sous Linux. Le service `mdmonitor` assure la surveillance des arrays en arrière-plan.

### 1.1 Installation

| Distribution | Commande |
|-------------|----------|
| **Ubuntu Server** | `sudo apt install mdadm -y` |
| **Fedora** | `sudo dnf install mdadm -y` |

```bash
# Activer la surveillance au démarrage
sudo systemctl enable mdmonitor
```

### 1.2 Fichiers principaux

| Fichier | Rôle |
|---------|------|
| `/etc/mdadm/mdadm.conf` | Configuration persistante RAID (Ubuntu) |
| `/etc/mdadm.conf` | Configuration persistante RAID (Fedora) |
| `/proc/mdstat` | Etat en temps réel de tous les arrays RAID |

---

## 2. Niveaux RAID

| RAID | Type | Disques min | Tolérance panne | Espace utile |
|------|------|-------------|----------------|--------------|
| **RAID 0** | Striping — performances | 2 | 0 (aucune) | N x taille |
| **RAID 1** | Mirroring — redondance | 2 | 1 disque | 1 x taille |
| **RAID 5** | Striping + parité | 3 | 1 disque | (N-1) x taille |
| **RAID 6** | Double parité | 4 | 2 disques | (N-2) x taille |
| **RAID 10** | Mirror + Stripe | 4 | 1 par miroir | N/2 x taille |

:::tip Choisir le bon niveau RAID
- **RAID 0** : performances maximales, zéro tolérance aux pannes — uniquement pour données non critiques
- **RAID 1** : protection simple, idéal pour les OS et données critiques
- **RAID 5** : bon compromis espace/redondance — le plus utilisé en production
- **RAID 6** : comme RAID 5 mais supporte 2 pannes simultanées
- **RAID 10** : performances + redondance — nécessite 4 disques minimum
:::

---

## 3. Créer un Array RAID

```bash
# RAID 1 avec 2 disques
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc

# RAID 5 avec 3 disques + 1 spare (disque de secours)
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd --spare-devices=1 /dev/sde

# Créer avec un disque manquant (à reconstruire plus tard)
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb missing
```

:::info Disque spare
Un **spare** est un disque de secours en attente. En cas de panne d'un disque actif, `mdadm` déclenche automatiquement la reconstruction sur le spare sans intervention manuelle.
:::

---

## 4. Surveiller un Array

```bash
# Etat rapide de tous les arrays
cat /proc/mdstat

# Surveillance en temps réel
watch cat /proc/mdstat

# Détails complets d'un array
sudo mdadm --detail /dev/md0
```

**Lecture de `/proc/mdstat` :**

| Indicateur | Signification |
|-----------|---------------|
| `[UU]` | Tous les disques sont sains |
| `[U_]` | Un disque est en panne |
| `[S]` | Disque spare en attente |
| `resync` | Reconstruction en cours |

---

## 5. Gérer les Disques

```bash
# Ajouter un disque (spare ou remplacement)
sudo mdadm --manage /dev/md0 --add /dev/sde

# Marquer un disque comme défaillant
sudo mdadm --manage /dev/md0 --fail /dev/sdc

# Retirer un disque (doit être marqué défaillant d'abord)
sudo mdadm --manage /dev/md0 --remove /dev/sdc

# Arrêter un array
sudo mdadm --stop /dev/md0

# Réassembler un array arrêté
sudo mdadm --assemble /dev/md0 /dev/sdb /dev/sdc
```

:::warning Procédure de remplacement d'un disque
1. `--fail` pour marquer le disque défaillant
2. `--remove` pour le retirer logiquement
3. Remplacer physiquement le disque
4. `--add` pour ajouter le nouveau disque
5. La reconstruction démarre automatiquement
:::

---

## 6. Etendre un Array RAID

```bash
# 1. Ajouter le nouveau disque à l'array
sudo mdadm --manage --add /dev/sde /dev/md0

# 2. Augmenter le nombre de disques actifs
sudo mdadm --grow /dev/md0 --raid-devices=4

# 3. Etendre le système de fichiers
sudo resize2fs /dev/md0
```

---

## 7. Rendre le RAID Persistant

Sans cette étape, l'array RAID ne sera pas reconnu au redémarrage.

**Ubuntu Server :**
```bash
sudo mdadm --detail --scan | tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u
```

**Fedora :**
```bash
sudo mdadm --detail --scan | tee -a /etc/mdadm.conf
sudo dracut --force
```

:::danger Ne pas oublier cette étape
Sans `update-initramfs` (Ubuntu) ou `dracut --force` (Fedora), le RAID **ne sera pas monté au démarrage** même si la configuration est correcte dans `mdadm.conf`.
:::

---

## 8. Formater, Monter et fstab

```bash
# Formater l'array
sudo mkfs.ext4 /dev/md0

# Créer le point de montage et monter
sudo mkdir /mnt/raid
sudo mount /dev/md0 /mnt/raid
```

**Montage permanent dans `/etc/fstab` :**

```
/dev/md0   /mnt/raid   ext4   defaults   0 2
```

---

## 9. Procédure Complète — Exemple RAID 5

```bash
# 1. Installer mdadm
sudo apt install mdadm -y

# 2. Créer l'array RAID 5 avec 3 disques + 1 spare
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd --spare-devices=1 /dev/sde

# 3. Vérifier la reconstruction (attendre [UUU])
watch cat /proc/mdstat

# 4. Formater et monter
sudo mkfs.ext4 /dev/md0
sudo mkdir /mnt/raid
sudo mount /dev/md0 /mnt/raid

# 5. Rendre persistant
sudo mdadm --detail --scan | tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u

# 6. Ajouter dans fstab
echo "/dev/md0   /mnt/raid   ext4   defaults   0 2" | sudo tee -a /etc/fstab
```

---

## 10. Commandes de Référence

```bash
# --- Création ---
sudo mdadm --create /dev/md0 --level=X --raid-devices=N /dev/sdX ...

# --- Surveillance ---
cat /proc/mdstat
sudo mdadm --detail /dev/md0
sudo mdadm --query /dev/sdb           # infos sur un disque membre

# --- Gestion ---
sudo mdadm --manage /dev/md0 --add /dev/sdX       # ajouter
sudo mdadm --manage /dev/md0 --fail /dev/sdX      # marquer défaillant
sudo mdadm --manage /dev/md0 --remove /dev/sdX    # retirer
sudo mdadm --stop /dev/md0                         # arrêter
sudo mdadm --assemble /dev/md0 /dev/sdX ...        # réassembler

# --- Extension ---
sudo mdadm --grow /dev/md0 --raid-devices=N

# --- Persistance ---
sudo mdadm --detail --scan | tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u    # Ubuntu
sudo dracut --force         # Fedora
```