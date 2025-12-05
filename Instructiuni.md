# Documentație Tehnică – Food Waste App Backend

**Context:** Aplicație pentru reducerea risipei alimentare  
**Componentă:** Server Backend (Node.js / Express / JavaScript / Prisma ORM)

---


# **1. Descriere Generală**

Backend-ul aplicației *Food Waste App* oferă o interfață API REST prin care utilizatorii pot interacționa cu sistemul de gestionare a alimentelor, revendicări și grupuri. Arhitectura este modulară și separă clar responsabilitățile între:

- **[Rute](./back-end/src/routes/)** – expun endpoint-urile HTTP  
- **[Controllere](./back-end/src/controllers/)** – implementează logica de business  
- **[Middleware](./back-end/src/middlewares/)** – gestionează autentificarea și validarea  
- **[Prisma ORM](./back-end/prisma/schema.prisma)** – persistarea datelor în SQLite  

### Funcționalități principale:

- Autentificare utilizatori (înregistrare, login, profil)
- Publicare alimente disponibile
- Revendicare alimente
- Creare și gestionare grupuri
- Conectare entități într-o bază de date relațională

---

# **2. Cerințe de Sistem**

Pentru a rula backend-ul sunt necesare:

- Node.js instalat  
- npm (inclus în Node.js)  
- Git  
- Un mediu local cu suport pentru SQLite  

---

# **3. Instalare și Configurare**

## **3.1 Instalarea dependențelor**

Clonați repository-ul și instalați pachetele necesare:


```bash
cd back-end
npm install
```

## **3.2 Crearea fișierului `.env`**

În directorul `back-end`, creați fișierul:

`.env`

**Conținut recomandat:**

```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="cheie_secreta_jwt"
```

## **3.3 Inițializarea bazei de date**

Prisma generează baza SQLite și tabelele pe baza fișierului `schema.prisma`:
```bash
npx prisma db push
```

Aceasta creează structurile:

- User

- Food

- Claim

- Group

- GroupMember

---

# **4. Pornirea Aplicației**

Rulați backend-ul în modul de dezvoltare:
```bash
npm run dev
```

Backend-ul va fi disponibil la:
[http://localhost:4000/api](http://localhost:4000/api)

---

# **5. Documentație API**
Toate rutele sunt prefixate cu:
```bash
/api
```
## **5.1 Modulul Autentificare**

### Metodă | Rută | Acces | Descriere
| Metodă | Rută | Acces | Descriere |
|--------|------|--------|-----------|
| POST | /api/auth/register | Public | Creează un utilizator nou |
| POST | /api/auth/login | Public | Autentificare și generare token JWT |
| GET  | /api/auth/me | Autentificat | Returnează datele utilizatorului curent |

### Principalele operații:

- validarea parolelor cu bcrypt

- generarea token-ului JWT

- protejarea rutelor cu middleware

## **5.2 Modulul Alimente (Foods)**

### Metodă | Rută | Acces | Descriere
| Metodă | Rută | Acces | Descriere |
|--------|------|--------|-----------|
| POST | /api/foods/add | Autentificat | Adaugă un aliment disponibil |
| GET  | /api/foods/mine | Autentificat | Returnează alimentele utilizatorului |
| GET  | /api/foods/available | Autentificat | Lista alimentelor publice ale altora |

### Modelul Food conține:

- nume

- categorie

- cantitate

- data expirării

- status

- referință către proprietar

## **5.3 Modulul Revendicări (Claims)**


### Metodă | Rută | Acces | Descriere
| Metodă | Rută | Acces | Descriere |
|--------|------|--------|-----------|
| POST | /api/claims/:foodId | Autentificat | Creează o revendicare pentru un aliment |
| GET  | /api/claims/mine | Autentificat | Afișează revendicările utilizatorului |


### Logica gestionează:

- evitarea dublării revendicărilor

- actualizarea statusului alimentului

- legături Food → Claim → User

## **5.4 Modulul Grupuri (Groups)**


### Metodă | Rută | Acces | Descriere
| Metodă | Rută | Acces | Descriere |
|--------|------|--------|-----------|
| POST | /api/groups/create | Autentificat | Creează un grup nou |
| POST | /api/groups/:groupId/invite/:userId | Autentificat | Invita utilizatori într-un grup |
| GET  | /api/groups/mine | Autentificat | Afișează grupurile utilizatorului |

### Gestionarea grupurilor include:

- utilizator creator

- membri ai grupului

- relație pivot prin GroupMember

---

# **6. Arhitectura Proiectului**

Structura aplicației urmează modelul modular:
```text
back-end/
 ├── prisma/
 │   ├── schema.prisma
 │   └── migrations/
 ├── src/
 │   ├── controllers/
 │   ├── routes/
 │   ├── middlewares/
 │   ├── index.js
 ├── package.json
 ├── package-lock.json
 └── .gitignore
```
### Descrierea componentelor:

- **[index.js](./back-end/src/index.js)** – inițializează Express și conectează toate rutele  
- **[routes/](./back-end/src/routes/)** – mapează URL-urile către controllere  
- **[controllers/](./back-end/src/controllers/)** – logica principală pentru operații CRUD  
- **[middlewares/](./back-end/src/middlewares/)** – gestionează autentificarea JWT  
- **[prisma/schema.prisma](./back-end/prisma/schema.prisma)** – definește structura completă a bazei de date  

---

# **7. Structura Bazei de Date (schema.prisma)**

### Include modelele:

User – utilizatori și date personale

Food – alimentele postate

Claim – revendicările

Group – grupuri definite de utilizatori

GroupMember – apartenența la grup

---

# **8. Flux General al Sistemului**

- Utilizatorul își creează cont și se autentifică.

- Poate posta alimente care devin vizibile altora.

- Alți utilizatori pot revendica alimente disponibile.

- Utilizatorii pot crea grupuri pentru colaborare.

- Prisma gestionează comunicarea cu baza de date.
