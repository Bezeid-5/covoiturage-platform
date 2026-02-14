# Documentation Projet Covoiturage - RimUber

## 📋 Vue d'ensemble du Projet

**Nom** : RimUber - Plateforme de Covoiturage  
**Stack Technique** :
- **Backend** : Spring Boot (Java 17), Spring Security, JPA/Hibernate, MySQL
- **Frontend** : Angular 18, Bootstrap 5, SweetAlert2, RxJS
- **Architecture** : REST API, JWT Authentication, Single Page Application (SPA)

---

## 🏗️ Architecture Générale

### Backend (Spring Boot)

#### Structure des Packages
```
com.covoiturage.backend/
├── config/          # Configuration (Security, CORS)
├── controller/      # REST Controllers (API endpoints)
├── dto/            # Data Transfer Objects
├── entity/         # Entités JPA (modèles de données)
├── repository/     # Repositories JPA
├── service/        # Logique métier
├── enums/          # Énumérations (Role, Status)
└── security/       # JWT, Authentication
```

#### Entités Principales
1. **User** : Utilisateurs (Passager, Conducteur, Admin)
2. **Trajet** : Trajets publiés par les conducteurs
3. **Reservation** : Réservations des passagers
4. **Message** : Messagerie interne
5. **Rating** : Évaluations des conducteurs

#### Sécurité
- **JWT (JSON Web Token)** : Authentification stateless
- **Spring Security** : Protection des endpoints
- **CORS** : Configuration pour Angular (localhost:4100)
- **Roles** : PASSENGER, DRIVER, ADMIN

### Frontend (Angular)

#### Structure des Modules
```
src/app/
├── core/           # Services globaux (auth, guards)
├── shared/         # Composants réutilisables (rating, messaging)
├── auth/           # Login, Register
├── dashboards/     # Dashboards (Passenger, Driver, Admin)
├── trajets/        # Gestion des trajets
├── reservations/   # Gestion des réservations
└── admin/          # Administration
```

#### Routing
- **Routes imbriquées** : `/passenger`, `/driver`, `/admin` avec children
- **Guards** : `authGuard` pour protéger les routes
- **Lazy Loading** : Chargement à la demande des composants

---

## 🎯 Fonctionnalités Implémentées

### 1. Authentification & Autorisation

#### Backend
**Fichiers clés** :
- `AuthController.java` : Endpoints `/auth/login`, `/auth/register`
- `JwtUtil.java` : Génération et validation des tokens JWT
- `SecurityConfig.java` : Configuration Spring Security

**Endpoints** :
```java
POST /api/auth/register  // Inscription
POST /api/auth/login     // Connexion (retourne JWT)
```

**Token JWT** : Contient `userId`, `email`, `role`, `exp`

#### Frontend
**Fichiers clés** :
- `auth.service.ts` : Gestion login/logout, stockage token
- `auth.guard.ts` : Protection des routes
- `login.component.ts` : Formulaire de connexion

**Flow** :
1. User login → Backend retourne JWT
2. JWT stocké dans `localStorage`
3. Chaque requête HTTP inclut le token (Authorization header)
4. Redirection selon le rôle : `/passenger`, `/driver`, ou `/admin`

---

### 2. Gestion des Trajets

#### Backend
**Fichiers clés** :
- `TrajetController.java` : CRUD trajets
- `TrajetService.java` : Logique métier
- `TrajetRepository.java` : Requêtes JPA

**Endpoints** :
```java
POST   /api/trajets          // Publier un trajet
GET    /api/trajets          // Lister tous les trajets
GET    /api/trajets/{id}     // Détails d'un trajet
GET    /api/trajets/search   // Recherche (ville départ/arrivée, date)
DELETE /api/trajets/{id}     // Supprimer un trajet
```

**Entité Trajet** :
```java
@Entity
public class Trajet {
    private Long id;
    private String departureCity;
    private String arrivalCity;
    private LocalDate date;
    private LocalTime time;
    private Integer availableSeats;
    private Double price;
    @ManyToOne
    private User driver;
}
```

#### Frontend
**Fichiers clés** :
- `publish-ride.component.ts` : Formulaire publication
- `ride-list.component.ts` : Liste des trajets
- `ride-detail.component.ts` : Détails + réservation

**Fonctionnalités** :
- Recherche par ville et date
- Affichage des trajets disponibles
- Réservation de places
- Contact du conducteur (messagerie)

---

### 3. Système de Réservations

#### Backend
**Fichiers clés** :
- `ReservationController.java`
- `ReservationService.java`

**Endpoints** :
```java
POST /api/reservations        // Créer une réservation
GET  /api/reservations/my     // Mes réservations
PUT  /api/reservations/{id}/cancel  // Annuler
```

**Logique** :
- Vérification des places disponibles
- Mise à jour automatique des `availableSeats` du trajet
- Statuts : PENDING, CONFIRMED, CANCELLED

#### Frontend
**Fichiers clés** :
- `my-reservations.component.ts` : Liste des réservations
- Affichage par statut (badges colorés)
- Bouton "Évaluer" pour les trajets terminés

---

### 4. Notation des Conducteurs

#### Backend
**Fichiers clés** :
- `RatingController.java`
- `RatingService.java`

**Endpoints** :
```java
POST /api/ratings                      // Noter un conducteur
GET  /api/ratings/driver/{id}          // Notes d'un conducteur
GET  /api/ratings/driver/{id}/stats    // Moyenne + total
```

**Entité Rating** :
```java
@Entity
public class Rating {
    private Long id;
    @ManyToOne
    private User driver;
    @ManyToOne
    private User passenger;
    @ManyToOne
    private Trajet trajet;
    private Integer score;  // 1-5
    private String comment;
}
```

#### Frontend
**Fichiers clés** :
- `rating.component.ts` : Formulaire de notation (5 étoiles)
- `rating.service.ts` : Appels API
- Affichage dans `ride-detail.component.ts`

**Flow** :
1. Passager termine un trajet
2. Bouton "Évaluer" apparaît dans "Mes réservations"
3. Modal avec 5 étoiles + commentaire
4. Note affichée sur le profil du conducteur

---

### 5. Messagerie Interne

#### Backend
**Fichiers clés** :
- `MessageController.java`
- `MessageService.java`
- `ConversationDTO.java`

**Endpoints** :
```java
POST /api/messages                    // Envoyer un message
GET  /api/messages/conversation       // Messages entre 2 users
GET  /api/messages/conversations      // Liste des conversations
PUT  /api/messages/{id}/read          // Marquer comme lu
```

**Entité Message** :
```java
@Entity
public class Message {
    private Long id;
    @ManyToOne
    private User sender;
    @ManyToOne
    private User receiver;
    private String content;
    private LocalDateTime timestamp;
    private Boolean isRead;
}
```

#### Frontend
**Fichiers clés** :
- `messaging.component.ts` : Widget de chat
- `messaging-page.component.ts` : Page dédiée (liste + chat)
- `messaging.service.ts` : Appels API

**Fonctionnalités** :
- Widget flottant sur la page de détail du trajet
- Page `/messages` avec liste des conversations
- Polling toutes les 5 secondes pour nouveaux messages
- Badge de messages non lus

---

### 6. Interface Admin

#### Backend
**Fichiers clés** :
- `AdminController.java`
- Endpoints pour statistiques et gestion

**Endpoints** :
```java
GET    /api/admin/stats              // Statistiques globales
GET    /api/admin/users              // Liste des utilisateurs
PUT    /api/admin/users/{id}/role    // Changer le rôle
DELETE /api/admin/trajets/{id}       // Supprimer un trajet
```

**Statistiques** :
```java
{
  "totalUsers": 7,
  "totalTrajets": 4,
  "totalReservations": 10,
  "usersByRole": {
    "PASSENGER": 3,
    "DRIVER": 3,
    "ADMIN": 1
  }
}
```

#### Frontend
**Fichiers clés** :
- `admin-dashboard.component.ts` : Layout avec sidebar
- `admin-overview.component.ts` : Vue d'ensemble (stats)
- `user-management.component.ts` : Gestion utilisateurs

**Fonctionnalités** :
- Cartes de statistiques animées
- Gestion des utilisateurs (changement de rôle)
- Modération des trajets
- Sidebar persistante (comme Driver/Passenger)

---

## 🎨 Améliorations UI/UX

### 1. SweetAlert2
- Remplacement de tous les `alert()` natifs
- Modals élégantes pour confirmations
- Animations fluides

### 2. Devise
- Changement de € à **MRU** (Ouguiya mauritanienne)

### 3. Placeholders
- "Jean" / "Dupont" → "Prénom" / "Nom"

### 4. Design Cohérent
- Sidebar sticky pour tous les dashboards
- Routes imbriquées
- Active state highlighting
- Cartes avec hover effects

---

## 🔧 Points Techniques Importants

### Backend

#### 1. JPA Repositories
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole(Role role);  // Pour les stats admin
}
```

#### 2. DTOs vs Entities
- **Entities** : Modèles de base de données (JPA)
- **DTOs** : Objets de transfert (API responses)
- Évite d'exposer les entités directement

#### 3. Service Layer
- Logique métier séparée des controllers
- Transactions gérées avec `@Transactional`
- Conversion Entity ↔ DTO

### Frontend

#### 1. Services Angular
```typescript
@Injectable({ providedIn: 'root' })
export class RideService {
  constructor(private http: HttpClient) {}
  
  getRides(): Observable<Trajet[]> {
    return this.http.get<Trajet[]>(`${apiUrl}/trajets`);
  }
}
```

#### 2. Guards
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
```

#### 3. Reactive Forms
- Validation côté client
- FormGroup / FormControl
- Validators (required, email, pattern)

---

## 📊 Base de Données

### Tables Principales
```sql
users (id, email, password, firstName, lastName, role)
trajets (id, departureCity, arrivalCity, date, time, availableSeats, price, driver_id)
reservations (id, trajet_id, passenger_id, seats, status)
messages (id, sender_id, receiver_id, content, timestamp, is_read)
ratings (id, driver_id, passenger_id, trajet_id, score, comment)
```

### Relations
- User → Trajet (1:N) : Un conducteur publie plusieurs trajets
- Trajet → Reservation (1:N) : Un trajet a plusieurs réservations
- User → Rating (1:N) : Un conducteur reçoit plusieurs notes
- User → Message (1:N) : Un utilisateur envoie/reçoit des messages

---

## 🚀 Déploiement & Exécution

### Backend
```bash
cd backend
./mvnw spring-boot:run
# Serveur : http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm start
# Application : http://localhost:4100
```

### Configuration
- **Backend** : `application.properties` (DB, JWT secret)
- **Frontend** : `environment.ts` (API URL)

---

## 📝 Questions Fréquentes du Professeur

### Backend

**Q: Comment fonctionne l'authentification JWT ?**
R: Le client envoie email/password → Backend valide → Génère un JWT contenant userId, role, exp → Client stocke le token → Chaque requête inclut le token dans le header `Authorization: Bearer <token>` → Backend valide le token et extrait les infos.

**Q: Pourquoi utiliser des DTOs ?**
R: Pour séparer la couche de présentation de la couche de persistance, éviter d'exposer les entités JPA directement (sécurité), et contrôler exactement quelles données sont envoyées au client.

**Q: Comment gérez-vous les transactions ?**
R: Avec `@Transactional` sur les méthodes de service. Spring gère automatiquement le commit/rollback en cas d'erreur.

**Q: Quelle est la différence entre @RestController et @Controller ?**
R: `@RestController` = `@Controller` + `@ResponseBody`. Les méthodes retournent directement des objets JSON au lieu de vues HTML.

### Frontend

**Q: Pourquoi utiliser des Guards ?**
R: Pour protéger les routes et empêcher l'accès aux pages sans authentification. Le guard vérifie si l'utilisateur est connecté avant d'autoriser la navigation.

**Q: Comment gérez-vous l'état de l'application ?**
R: Avec des Services Angular (singleton) qui stockent l'état et utilisent RxJS (BehaviorSubject, Observable) pour notifier les composants des changements.

**Q: Quelle est la différence entre Component et Service ?**
R: **Component** : Gère l'UI et l'interaction utilisateur. **Service** : Contient la logique métier et les appels API. Les services sont injectés dans les composants.

**Q: Pourquoi utiliser Lazy Loading ?**
R: Pour réduire le temps de chargement initial. Les modules sont chargés uniquement quand l'utilisateur navigue vers la route correspondante.

---

## 🎓 Concepts Clés à Maîtriser

### Backend
1. **REST API** : Principes (GET, POST, PUT, DELETE)
2. **JPA/Hibernate** : ORM, relations (@ManyToOne, @OneToMany)
3. **Spring Security** : Filtres, authentification, autorisation
4. **Dependency Injection** : @Autowired, constructeur injection
5. **Layered Architecture** : Controller → Service → Repository

### Frontend
1. **Components** : Lifecycle hooks (ngOnInit, ngOnDestroy)
2. **Services** : Dependency Injection, HttpClient
3. **Routing** : Navigation, Guards, Lazy Loading
4. **RxJS** : Observables, Operators (map, switchMap, tap)
5. **Forms** : Reactive Forms, Validation

---

## 📚 Ressources Utiles

- **Spring Boot Docs** : https://spring.io/projects/spring-boot
- **Angular Docs** : https://angular.io/docs
- **JWT** : https://jwt.io
- **Bootstrap** : https://getbootstrap.com

---

**Bonne chance pour votre présentation ! 🚀**
