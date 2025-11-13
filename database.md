# MODELUL BAZEI DE DATE ȘI RELAȚII

## I. Tabela **Users**
- **id** – Identificator unic al utilizatorului  
- **name** – Numele complet  
- **email** – Adresa de email (unic)  
- **passwordHash** – Parola criptată  
- **createdAt** – Data creării contului  
- **role** – Rolul utilizatorului: (‘ADMIN’, ‘USER’)  

---

## II. Tabela **Foods**
- **id** – Identificator unic al alimentului  
- **name** – Numele alimentului  
- **category** – Categoria: (‘Fructe’, ‘Lactate’, ‘Carne’, ‘Băuturi’, etc.)  
- **quantity** – Cantitatea  
- **expirationDate** – Data expirării  
- **status** – Starea alimentului:
  - ‘DISPONIBIL’  
  - ‘EXPIRAT’  
  - ‘REZERVAT’  
  - ‘CONSUMAT’  
- **ownerId** – Cheie externă (FK) la Users(id), utilizatorul care a adăugat alimentul  
- **createdAt** – Data adăugării  

---

## III. Tabela **Claims**
- **id** – Identificator unic al cererii  
- **foodId** – FK → Foods(id)  
- **requestedById** – FK → Users(id) (utilizatorul care revendică)  
- **status** – Starea cererii: (‘IN ASTEPTARE’, ‘APROBATA’, ‘REFUZATA’)  
- **requestedAt** – Momentul cererii  

---

## IV. Tabela **Groups**
- **id** – Identificator unic al grupului  
- **name** – Numele grupului  
- **type** – Tip grup  
- **createdById** – FK → Users(id), creatorul grupului  

---

## V. Tabela **GroupMembers**
- **id** – Cheie primară (PK)  
- **groupId** – FK → Groups(id)  
- **userId** – FK → Users(id)  

---

# Interpretarea Relațiilor

### Relația **Users → Foods**
- **Tip:** 1:N  
- **Funcție:** Un utilizator poate avea mai multe alimente în frigider.  
- **Mapare:** `Users.id → Foods.ownerId`  

---

### Relația **Foods → Claims**
- **Tip:** 1:N  
- **Funcție:** Un aliment poate fi revendicat o singură dată.  
- **Mapare:** `Foods.id → Claims.foodId`  

---

### Relația **Users → Claims**
- **Tip:** 1:N  
- **Funcție:** Un utilizator poate revendica mai multe alimente.  
- **Mapare:** `Users.id → Claims.requestedById`  

---

### Relația **Users → Groups**
- **Tip:** 1:N  
- **Funcție:** Un utilizator poate crea mai multe grupuri.  
- **Mapare:** `Users.id → Groups.createdById`  

---

### Relația **Groups → GroupMembers**
- **Tip:** 1:N  
- **Funcție:** Un grup poate avea mai mulți membri.  
- **Mapare:** `Groups.id → GroupMembers.groupId`  

---

### Relația **Users → GroupMembers**
- **Tip:** 1:N  
- **Funcție:** Un utilizator poate face parte din mai multe grupuri.  
- **Mapare:** `Users.id → GroupMembers.userId`  


✔ Relație **M:N** între **Users** și **Groups**, implementată prin tabela intermediară **GroupMembers**.

