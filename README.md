# Aplicație web pentru a preveni risipa de alimente

## Obiectiv:
Realizarea unei aplicații web prin care utilizatorii pot să ofere alimente pe care nu le mai consumă.

## Descriere:
Aplicația încurajează utilizatorii să conștientizeze risipa de alimente într-un mod distractiv și bazat pe comunitate.

---

## Funcționalități:

### 1. Gestionare alimente:
- Adăugarea alimentelor cu:
  - nume  
  - categorie (fructe, lactate, carne, băuturi etc.)  
  - data expirării  
  - cantitate  
- Editarea alimentelor existente  
- Ștergerea alimentelor  
- Filtrare după categorie  
- Vizualizarea listei complete a alimentelor din frigider  

---

### 2. Alerte expirare:
- Notificări pentru:
  - produse care expiră astăzi  
  - produse care expiră în următoarele 3 zile  
- Utilizatorul poate:
  - marca produsul ca “disponibil”  
  - marca produsul ca “consumat”  

---

### 3. Sistem de distribuire alimente:
- Un utilizator poate face public un aliment ca „disponibil”  
- Produsul devine vizibil pentru:
  - prieteni  
  - grupuri din care utilizatorul face parte  
- Orice alt utilizator poate da **claim**  
- Proprietarul validează sau anulează cererea  

---

### 4. Grupuri de prieteni:
- Crearea unui grup nou (ex: Vegetarieni, Carnivori etc.)  
- Invitarea utilizatorilor în grup  
- Etichetarea grupului  
- Vizualizarea produselor disponibile doar pentru grup  

---

### 5. Autentificare și profil utilizator:
- Creare cont  
- Login utilizator  
- Login administrator  
- Vizualizare profil:
  - nume  
  - grupuri din care face parte  

---

### 6. Integrare social media:
- Utilizatorul poate distribui un produs disponibil pe rețele sociale.  

---

## Tehnologii:
- **Front-end:** React.js  
- **Back-end:** Node.js, Express, Prisma ORM, SQLite  

---

## Restricții:
- Fiecare aliment trebuie să aibă nume, categorie și dată de expirare.  
- Un aliment poate avea doar stările: **disponibil**, **consumat**, **expirat**, **rezervat**.  
- Produsele expirate nu pot fi marcate ca „disponibile”.  
- Un aliment „disponibil” poate fi revendicat o singură dată.  
- Data expirării nu poate fi în trecut la adăugarea unui aliment.  

---
