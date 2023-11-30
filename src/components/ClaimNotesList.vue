<template>
  <div class="claim-notes-container">
    <h2>Claim Notes List for Blobs</h2>
    <ul v-if="claimNotes && claimNotes.length" class="claim-notes-list">
      <li v-for="note in claimNotes" :key="note.name" class="claim-note-item">
        <span class="claim-note-name">{{ note.name }}</span>
        <button @click="viewNoteDetails(note)">View Details</button>
        <button @click="downloadFile(note.name)">Download File</button>
      </li>
    </ul>
    <p v-else>No claim notes found.</p>
    <!-- Modal for Claim Note Details -->
    <div v-if="selectedNote" class="modal">
      <h3>{{ selectedNote.name }}</h3>
      <p v-if="selectedNote.metadata">{{ formatMetadata(selectedNote.metadata) }}</p>
      <button @click="selectedNote = null">Close</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      selectedNote: null
    };
  },
  computed: {
    ...mapState(['claimNotes', 'token']),
    apiUrl() {
      return this.$store.state.apiUrl;
    }
  },
  methods: {
    ...mapActions(['fetchClaimNotes', 'downloadFile']),
    viewNoteDetails(note) {
      this.selectedNote = note;
    },
    formatMetadata(metadata) {
      return Object.entries(metadata).map(([key, value]) => `${key}: ${value}`).join(', ');
    },
    handleDownload(filename) {
      this.downloadFile(filename);
    }
  },
  mounted() {
    this.fetchClaimNotes();
  }
};
</script>


<style>
/* Add styles for claim notes list */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;
}
</style>
