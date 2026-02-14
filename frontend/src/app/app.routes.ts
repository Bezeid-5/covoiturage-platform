import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'auth/login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'auth/register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },

    // Passenger routes
    {
        path: 'passenger',
        loadComponent: () => import('./dashboards/passenger/passenger-dashboard.component').then(m => m.PassengerDashboardComponent),
        canActivate: [authGuard],
        children: [
            { path: '', loadComponent: () => import('./dashboards/passenger/passenger-overview.component').then(m => m.PassengerOverviewComponent) },
            { path: 'search', loadComponent: () => import('./trajets/ride-list/ride-list.component').then(m => m.RideListComponent) },
            { path: 'reservations', loadComponent: () => import('./reservations/my-reservations/my-reservations.component').then(m => m.MyReservationsComponent) },
            { path: 'messages', loadComponent: () => import('./shared/messaging/messaging-page.component').then(m => m.MessagingPageComponent) },
        ]
    },

    // Driver routes
    {
        path: 'driver',
        loadComponent: () => import('./dashboards/driver/driver-dashboard.component').then(m => m.DriverDashboardComponent),
        canActivate: [authGuard],
        children: [
            { path: '', loadComponent: () => import('./dashboards/driver/driver-overview.component').then(m => m.DriverOverviewComponent) },
            { path: 'my-rides', loadComponent: () => import('./driver/my-rides/my-rides.component').then(m => m.MyRidesComponent) },
            { path: 'reservations', loadComponent: () => import('./driver/driver-reservations/driver-reservations.component').then(m => m.DriverReservationsComponent) },
            { path: 'publish', loadComponent: () => import('./trajets/publish-ride/publish-ride.component').then(m => m.PublishRideComponent) },
            { path: 'messages', loadComponent: () => import('./shared/messaging/messaging-page.component').then(m => m.MessagingPageComponent) },
        ]
    },

    // Admin routes
    {
        path: 'admin',
        loadComponent: () => import('./dashboards/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [authGuard],
        children: [
            { path: '', loadComponent: () => import('./dashboards/admin/admin-overview.component').then(m => m.AdminOverviewComponent) },
            { path: 'users', loadComponent: () => import('./admin/user-management/user-management.component').then(m => m.UserManagementComponent) },
            { path: 'rides', loadComponent: () => import('./admin/ride-moderation/ride-moderation.component').then(m => m.RideModerationComponent) },
        ]
    },

    // Shared routes (accessible by all authenticated users)
    // Shared routes (access via dashboard preferred)
    // { path: 'rides', loadComponent: () => import('./trajets/ride-list/ride-list.component').then(m => m.RideListComponent), canActivate: [authGuard] },
    // { path: 'reservations/my', loadComponent: () => import('./reservations/my-reservations/my-reservations.component').then(m => m.MyReservationsComponent), canActivate: [authGuard] },
    { path: 'rides/publish', loadComponent: () => import('./trajets/publish-ride/publish-ride.component').then(m => m.PublishRideComponent), canActivate: [authGuard] }, // Driver specific, moved to children? No, sidebar link points to /driver/publish. I can remove this global one too? Let's check. Driver sidebar uses /driver/publish. Yes. I'll comment it out.
    // { path: 'rides/publish', ... }
    { path: 'rides/:id', loadComponent: () => import('./trajets/ride-detail/ride-detail.component').then(m => m.RideDetailComponent), canActivate: [authGuard] },

    { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
