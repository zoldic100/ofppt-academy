---
id: lesson-08
title: Routing
---



# Routage Linux — Statique et Dynamique (BIRD)

> **Objectif :** Configurer le routage statique et dynamique sous Linux, activer le forwarding IP, et utiliser BIRD2 pour les protocoles de routage dynamique (OSPF, BGP, RIP).

---

## 1. Présentation

| Type | Démon | Description |
|------|-------|-------------|
| **Statique** | `kernel (ip route)` | Routes ajoutées manuellement dans la table de routage |
| **Dynamique** | `bird2` | Démon de routage — OSPF, BGP, RIP, etc. |

### 1.1 Installation

Le routage statique est **natif** sous Linux — aucune installation requise.

Pour le routage dynamique avec BIRD :

| Distribution | Commande |
|-------------|----------|
| **Ubuntu Server** | `sudo apt install bird2 -y` |
| **Fedora** | `sudo dnf install bird2 -y` |

### 1.2 Fichiers principaux

| Fichier | Rôle |
|---------|------|
| `/etc/sysctl.conf` | Activer le forwarding IP permanent (`ip_forward=1`) |
| `/proc/sys/net/ipv4/ip_forward` | Forwarding IP temporaire (`0` = désactivé, `1` = activé) |
| `/etc/bird/bird.conf` | Configuration BIRD (Ubuntu + Fedora) |

---

## 2. Routage Statique

### 2.1 Activer le Forwarding IP

:::danger Forwarding IP obligatoire
Sans `ip_forward = 1`, le serveur Linux **ne routera pas** les paquets entre ses interfaces — il se comportera comme un simple hôte, pas un routeur.
:::

```bash
# Temporaire (perdu au redémarrage)
echo 1 > /proc/sys/net/ipv4/ip_forward

# Vérifier l'état actuel
cat /proc/sys/net/ipv4/ip_forward
```

**Permanent — modifier `/etc/sysctl.conf` :**

```bash title="/etc/sysctl.conf"
# Décommenter ou ajouter cette ligne
net.ipv4.ip_forward = 1
```

```bash
# Appliquer sans redémarrer
sudo sysctl -p
```

---

### 2.2 Gérer les Routes Statiques

```bash
# Ajouter une route vers un réseau
sudo ip route add 10.0.0.0/8 via 192.168.1.1 dev enp0s3

# Ajouter une route par défaut (gateway)
sudo ip route add default via 192.168.1.1

# Supprimer une route
sudo ip route del 10.0.0.0/8

# Afficher la table de routage
ip route show
route -n
```

:::info Différence entre `ip route show` et `route -n`
- `ip route show` : commande moderne, sortie claire
- `route -n` : commande legacy, affiche les adresses en numérique (plus rapide, pas de résolution DNS)

Les deux affichent la même table de routage.
:::

---

### 2.3 Routes Statiques Permanentes

Les routes ajoutées avec `ip route add` sont **temporaires** et perdues au redémarrage. Pour les rendre permanentes :

**Ubuntu Server — via Netplan :**

```yaml title="/etc/netplan/00-installer-config.yaml"
network:
  ethernets:
    enp0s3:
      routes:
        - to: 10.0.0.0/8
          via: 192.168.1.1
```

```bash
sudo netplan apply
```

**Fedora — via NetworkManager :**

```bash title="/etc/sysconfig/network-scripts/route-enp0s3"
10.0.0.0/8 via 192.168.1.1
```

```bash
sudo systemctl restart NetworkManager
```

---

## 3. Routage Dynamique — BIRD2

**BIRD** (Bird Internet Routing Daemon) est un démon de routage open source qui supporte plusieurs protocoles : **OSPF**, **BGP**, **RIP**, **BFD**.

### 3.1 Configuration OSPF — `/etc/bird/bird.conf`

```conf title="/etc/bird/bird.conf"
# Identifiant unique du routeur (généralement son IP principale)
router id 192.168.1.1;

# Exporter les routes apprises vers la table de routage kernel
protocol kernel {
    ipv4 { export all; };
}

# Découverte automatique des interfaces réseau
protocol device {}

# OSPF v2 — protocole de routage à état de lien
protocol ospf v2 {
    ipv4 { export all; };
    area 0 {
        interface "enp0s3" {
            type broadcast;
            cost 10;
        };
    };
}
```

**Paramètres OSPF expliqués :**

| Paramètre | Rôle |
|-----------|------|
| `router id` | Identifiant unique du routeur dans le domaine OSPF |
| `protocol kernel` | Synchronise les routes BIRD avec la table de routage Linux |
| `protocol device` | Permet à BIRD de détecter les interfaces réseau |
| `area 0` | Zone backbone OSPF — toutes les zones doivent être connectées à area 0 |
| `type broadcast` | Type d'interface — utiliser `broadcast` pour Ethernet |
| `cost 10` | Métrique de l'interface — plus le coût est bas, plus la route est préférée |

:::tip Protocoles supportés par BIRD2
- **OSPF** : routage interne, idéal pour les réseaux d'entreprise
- **BGP** : routage entre systèmes autonomes (Internet, datacenters)
- **RIP** : routage simple par vecteur de distance (déprécié en production)
- **BFD** : détection rapide de pannes de liens
:::

---

### 3.2 Démarrer BIRD

```bash
# Démarrer le service
sudo systemctl start bird

# Activer au démarrage
sudo systemctl enable bird

# Vérifier l'état
sudo systemctl status bird
```

---

### 3.3 Vérifier et Diagnostiquer

```bash
# Vérifier les routes apprises par BIRD
sudo birdc show route

# Vérifier les voisins OSPF (adjacences)
sudo birdc show ospf neighbors

# Afficher la table de routage Linux (routes injectées par BIRD)
ip route show

# Accéder au shell interactif BIRD
sudo birdc
```

**Dans le shell `birdc` :**

```
show route            # toutes les routes
show ospf neighbors   # voisins OSPF
show protocols        # état de tous les protocoles
configure             # recharger la config sans redémarrer
quit                  # quitter
```

:::info Vérifier une adjacence OSPF
Après démarrage, vérifier que les voisins OSPF sont en état **Full** :
```bash
sudo birdc show ospf neighbors
```
Un voisin en état `ExStart` ou `2-Way` indique un problème de configuration réseau ou de `router id` dupliqué.
:::

---

## 4. Commandes de Référence

```bash
# --- Forwarding IP ---
cat /proc/sys/net/ipv4/ip_forward     # vérifier
echo 1 > /proc/sys/net/ipv4/ip_forward  # activer temporairement
sudo sysctl -p                         # appliquer sysctl.conf

# --- Routes statiques ---
ip route show                          # afficher la table
ip route add <réseau> via <gw>         # ajouter une route
ip route del <réseau>                  # supprimer une route
ip route add default via <gw>          # route par défaut

# --- BIRD ---
sudo systemctl start|stop|restart|status bird
sudo birdc show route
sudo birdc show ospf neighbors
sudo birdc show protocols
sudo birdc configure                   # recharger config à chaud

# --- Diagnostic réseau ---
traceroute <destination>               # tracer le chemin
ping -c 4 <destination>               # tester la connectivité
ip neigh show                          # table ARP
```