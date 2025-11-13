# Rute

## I. Rute Back-End

## 1. Autentificare
- POST /api/v1/auth/register: (Public) Creează un cont nou de utilizator.
- POST /api/v1/auth/login: (Public) Permite autentificarea și returnează un token JWT.
- GET /api/v1/auth/me: (Autentificat) Returnează profilul utilizatorului curent.
---
## 2. Rute Utilizatori
- GET /api/v1/users/:id: (Autentificat) Afișează profilul unui utilizator.
- PUT /api/v1/users/:id: (Autentificat) Actualizează datele profilului propriu.
---
## 3. Rute Alimente
- POST /api/v1/foods: (Autentificat) Adaugă un aliment nou.
- GET /api/v1/foods: (Autentificat) Afișează toate alimentele utilizatorului curent.
- GET /api/v1/foods/available: (Autentificat) Afișează toate alimentele marcate ca „disponibile”.
- GET /api/v1/foods/:id: (Autentificat) Afișează detaliile unui aliment.
- PUT /api/v1/foods/:id: (Autentificat) Editează un aliment existent (doar al utilizatorului).
- DELETE /api/v1/foods/:id: (Autentificat) Șterge un aliment.
- PATCH /api/v1/foods/:id/status: (Autentificat) Schimbă starea alimentului.
---
## 4. Rute Alerte Expirare
- GET /api/v1/alerts/today: (Autentificat) Returnează alimentele care expiră azi.
- GET /api/v1/alerts/soon: (Autentificat) Returnează alimentele care expiră în următoarele 3 zile.
---
## 5. Rute Claims
- POST /api/v1/claims/:foodId: (Autentificat) Creează o cerere de revendicare pentru un aliment disponibil.
- GET /api/v1/claims: (Autentificat) Afișează cererile făcute de utilizator.
- GET /api/v1/claims/received: (Autentificat) Afișează cererile primite pentru alimentele utilizatorului.
- PATCH /api/v1/claims/:id/approve: (Autentificat, Proprietar aliment) Aprobă cererea.
- PATCH /api/v1/claims/:id/reject: (Autentificat, Proprietar aliment) Respinge cererea.
---
## 6. Rute Grupuri
- POST /api/v1/groups: (Autentificat) Creează un grup nou.
- GET /api/v1/groups: (Autentificat) Afișează grupurile utilizatorului.
- GET /api/v1/groups/:groupId: (Autentificat) Afișează detaliile unui grup.
- POST /api/v1/groups/:groupId/invite/:userId: (Autentificat, Creator grup) Invită un utilizator în grup.
- GET /api/v1/groups/:groupId/foods: (Autentificat) Afișează alimentele disponibile doar în acel grup.
---
## 7. Integrare Social Media
- GET /api/v1/share/:foodId

## II. Rute Front-End

###/login: Pagina principală pentru autentificarea utilizatorilor (acces public).
###/register: Pagina de creare a unui cont nou.
###/dashboard: Pagina principală după autentificare; afișează alimentele utilizatorului și notificările de expirare.
###/foods: Lista completă a alimentelor utilizatorului din frigider. Afișează filtre, categorii, status și opțiuni de editare/ștergere.
###/foods/new: Formular pentru adăugarea unui aliment nou.
###/foods/:id: Pagina cu detaliile unui aliment specific (în funcție de permisiuni). Permite modificarea alimentului sau schimbarea statusului.
###/foods/available: Pagina cu alimentele disponibile oferite de alți utilizatori.
###/claims: Pagina cu cererile trimise de utilizator pentru revendicare.
###/claims/received: Pagina cu cererile primite pentru alimentele utilizatorului (vizibil doar proprietarului).
###/groups: Pagina cu lista tuturor grupurilor din care utilizatorul face parte.
###/groups/new: Formular pentru crearea unui grup nou.
###/groups/:groupId: Afișează detaliile unui grup: nume, tip, membri.
###/groups/:groupId/invite: Pagină pentru invitarea altor utilizatori în grup (disponibilă doar creatorului grupului).
###/groups/:groupId/foods: Afișează doar alimentele „disponibile” partajate în acel grup.
###/share/:foodId: Pagină pentru generarea linkului sau textului de share pentru social media.


  (Autentificat) Generează un text sau link pregătit pentru distribuire pe rețele sociale.

