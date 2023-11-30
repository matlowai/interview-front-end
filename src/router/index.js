import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import PolicyholdersList from '../components/PolicyholdersList.vue';
import NewPolicyholder from '../components/NewPolicyholder.vue';
import EditPolicyholder from '../components/EditPolicyholder.vue';
import ClaimNotesList from '../components/ClaimNotesList.vue';
import UploadClaimNote from '../components/UploadClaimNote.vue';
import GenerateClaimNotes from '../components/GenerateClaimNotes';
import ManageClaim from '../components/ManageClaim.vue';
import ViewClaims from '../components/ViewClaims.vue';
import Login from '@/views/Login.vue';
import Analysis from '../components/Analysis'

const routes = [
  { path: '/', component: PolicyholdersList },
  { path: '/new', component: NewPolicyholder },
  { path: '/edit/:id', component: EditPolicyholder },
  { path: '/claims', component: ClaimNotesList },
  { path: '/claims/new', component: UploadClaimNote },
  { path: '/claims/gen', component: GenerateClaimNotes },
  { path: '/claims/manage/:id', component: ManageClaim }, // New route for managing claims
  { path: '/claims/view/:id', component: ViewClaims }, // New route for viewing claims
  { path: '/login', component: Login, name: 'login' },
  { path: '/analysis', component: Analysis}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  const isTokenExpired = !tokenExpiry || new Date().getTime() > parseInt(tokenExpiry);

  if (to.path !== '/login' && (!token || isTokenExpired)) {
    store.commit('CLEAR_TOKEN'); // Clear expired token
    next('/login');
  } else if (to.path === '/login' && to.query.code) {
    try {
      await store.dispatch('login', to.query.code);
      next('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
