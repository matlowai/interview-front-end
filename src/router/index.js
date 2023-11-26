import { createRouter, createWebHistory } from 'vue-router';
import PolicyholdersList from '../components/PolicyholdersList.vue';
import NewPolicyholder from '../components/NewPolicyholder.vue';
import EditPolicyholder from '../components/EditPolicyholder.vue';
import ClaimNotesList from '../components/ClaimNotesList.vue';
import UploadClaimNote from '../components/UploadClaimNote.vue';
import GenerateClaimNotes from '../components/GenerateClaimNotes';
import ManageClaim from '../components/ManageClaim.vue'; // New component for adding or editing a claim
import ViewClaims from '../components/ViewClaims.vue'; // New component for viewing claims of a policyholder

const routes = [
  { path: '/', component: PolicyholdersList },
  { path: '/new', component: NewPolicyholder },
  { path: '/edit/:id', component: EditPolicyholder },
  { path: '/claims', component: ClaimNotesList },
  { path: '/claims/new', component: UploadClaimNote },
  { path: '/claims/gen', component: GenerateClaimNotes },
  { path: '/claims/manage/:id', component: ManageClaim }, // New route for managing claims
  { path: '/claims/view/:id', component: ViewClaims }, // New route for viewing claims
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
