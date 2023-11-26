<template>
    <div class="claim-notes-container">
      <h2>Claim Notes List</h2>
      <ul v-if="claimNotes && claimNotes.length" class="claim-notes-list">
        <li v-for="note in claimNotes" :key="note.name" class="claim-note-item">
          <span class="claim-note-name">{{ note.name }}</span>
          <!-- Display some metadata -->
          <button @click="viewNoteDetails(note)">View Details</button>
        </li>
      </ul>
      <p v-else>No claim notes found.</p>
  
      <!-- Modal for Claim Note Details -->
      <div v-if="selectedNote" class="modal">
        <h3>{{ selectedNote.name }}</h3>
        <p>{{ selectedNote.content }}</p>
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
      ...mapState(['claimNotes'])
    },
    methods: {
      ...mapActions(['fetchClaimNotes']),
      viewNoteDetails(note) {
        this.selectedNote = note;
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
  