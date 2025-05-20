# 🌱 PlantApp

Willkommen bei **PlantApp** – deiner Anwendung zur Verwaltung von Pflanzen und Standorten!

---

## 📦 Benötigte Abhängigkeiten & Installation

### 1. Voraussetzungen

- **Node.js** (empfohlen: v18 oder neuer)  
  [Download Node.js](https://nodejs.org/)
- **npm** (wird mit Node.js installiert)
- **Java 21** (für Spring Boot Backend)  
  [Download Java](https://adoptium.net/)
- **Ionic CLI** (optional, für `ionic serve`)  
  Installation:  
  ```bash
  npm install -g @ionic/cli
  ```
- **Gradle Wrapper** ist im Backend-Projekt enthalten (kein globales Gradle nötig).

### 📢 WICHTIG: Java 21 erforderlich!

> **Achtung:**  
> Das Backend benötigt **zwingend Java 21**!  
> Mit anderen Java-Versionen (z.B. 17, 20) startet das Backend **nicht**.
>
> 👉 [Java 21 hier herunterladen (Adoptium)](https://adoptium.net/)

Stelle sicher, dass du Java 21 installiert hast und es als Standard-Java-Version auf deinem System gesetzt ist.  
Du kannst deine Java-Version mit folgendem Befehl prüfen:

```bash
java -version
```

Die Ausgabe sollte in etwa so aussehen:
```
openjdk version "21.0.0" ...
```
---

### 2. Frontend-Abhängigkeiten (`package.json`)

Die wichtigsten Abhängigkeiten (siehe auch deine `package.json`):

```json
"dependencies": {
  "@capacitor/core": "^7.2.0",
  "@capacitor/status-bar": "^7.0.1",
  "@ionic/react": "^8.5.4",
  "@ionic/react-router": "^8.5.4",
  "ionicons": "^7.4.0",
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "react-router": "^5.3.4",
  "react-router-dom": "^5.3.4"
},
"devDependencies": {
  "@capacitor/cli": "^7.2.0",
  "@testing-library/react": "^16.2.0",
  "@types/react": "19.0.10",
  "@types/react-dom": "19.0.4",
  "@vitejs/plugin-react": "^4.0.1",
  "typescript": "^5.1.6",
  "vite": "^5.4.19",
  "vitest": "^0.34.6"
}
```

**Installation:**  
Im Projektverzeichnis ausführen:
```bash
npm install
```

---

### 3. Backend-Abhängigkeiten

Das Backend verwendet **Spring Boot** und verwaltet die Abhängigkeiten über `build.gradle` bzw. `build.gradle.kts`.  
Die wichtigsten Komponenten sind:
- Spring Boot Starter Web
- Spring Boot Starter Security (für Auth)
- Spring Boot Starter Data JPA
- H2/MySQL/Postgres (je nach Datenbank)
- JWT-Bibliothek

**Alle Abhängigkeiten werden automatisch installiert, wenn du**  
```bash
./gradlew bootRun
```
**im Backend-Verzeichnis ausführst.**

---

## Schnellstart🚀
### 1. Backend starten (Spring Boot)

Wechsle ins Backend-Verzeichnis und starte den Server:

```bash
cd backend
./gradlew bootRun
```

- Das Backend läuft dann standardmäßig auf [http://localhost:8080](http://localhost:8080).

---

### 2. Frontend starten (Ionic React)

Wechsle ins Frontend-Verzeichnis (meist das Hauptverzeichnis) und führe aus:

#### **Variante A: Mit Ionic CLI (empfohlen)**

```bash
ionic serve
```
- Das Frontend öffnet sich automatisch im Browser (meist [http://localhost:8100](http://localhost:8100)).

#### **Variante B: Mit Vite (npm run dev)**

```bash
npm run dev
```
- Die Start-URL (z.B. [http://localhost:5173](http://localhost:5173)) wird im Terminal angezeigt.
- **Hinweis:** Die Seite öffnet sich **nicht automatisch** – bitte die URL manuell im Browser aufrufen.

---

## 📝 Hinweise

- **CORS:** Die CORS-Konfiguration ist so eingestellt, dass das Frontend auf allen gängigen lokalen Ports mit dem Backend kommunizieren kann.
- **Login/Registrierung:** Nach erfolgreichem Login/Registrierung wirst du automatisch zum Dashboard weitergeleitet.

---

## 🛠️ Technologien

- **Frontend:** Ionic React, TypeScript
- **Backend:** Spring Boot (Java)
- **Build-Tools:** Gradle, npm

---

## 👨‍💻 Entwickelt von

- Nico Biesinger
- Maximilian Seible
- Julian Stengele

---

Viel Spaß mit PlantApp! 🌿