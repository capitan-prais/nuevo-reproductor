<template>
  <div id="app">
    <div class="player">
      <h1>Reproductor de Música</h1>

      <!-- Selector de archivos múltiples para cargar música -->
      <input type="file" @change="onFilesSelected" accept="audio/*" multiple />

      <div v-if="audioUrl">
        <audio
          ref="audio"
          controls
          :src="audioUrl"
          @ended="onAudioEnded"
          autoplay
        >
          Tu navegador no soporta el elemento de audio.
        </audio>

        <div class="controls">
          <button @click="goToPrevTrack">Anterior</button>
          <button @click="playNextTrack">Siguiente</button>
          <button @click="toggleShuffle">{{ shuffle ? 'Desactivar Aleatorio' : 'Activar Aleatorio' }}</button>
          <button @click="toggleRepeat">{{ repeat ? 'Desactivar Repetir' : 'Activar Repetir' }}</button>
        </div>

        <p v-if="isPlaying">Reproduciendo: {{ fileName }}</p>
      </div>

      <!-- Lista de archivos seleccionados -->
      <div v-if="fileNames.length > 0">
        <h3>Archivos Seleccionados:</h3>
        <ul>
          <li v-for="(file, index) in fileNames" :key="index" @click="selectTrack(index)">
            {{ file.name }}
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      audioUrl: null, // URL del archivo de audio
      audioFiles: [], // Array de archivos de audio
      isPlaying: false, // Estado de reproducción
      fileNames: [], // Lista de nombres de archivos
      currentTrackIndex: 0, // Índice de la canción actual
      shuffle: false, // Estado de aleatorización
      repeat: false, // Estado de repetición
      fileName: '', // Nombre del archivo actual
    };
  },
  methods: {
    // Cargar archivos seleccionados
    onFilesSelected(event) {
      const files = event.target.files;
      const validAudioFiles = [];

      // Filtrar solo archivos de audio válidos
      Array.from(files).forEach(file => {
        if (file.type.startsWith('audio/')) {
          validAudioFiles.push(file);
        } else {
          console.log('Archivo no válido:', file.name);
        }
      });

      if (validAudioFiles.length > 0) {
        // Agregar archivos a la lista
        this.audioFiles.push(...validAudioFiles);
        this.fileNames.push(...validAudioFiles);
        
        // Configurar la canción actual
        this.currentTrackIndex = this.audioFiles.length - 1;
        this.loadAudio(); // Cargar la canción seleccionada
      } else {
        console.log('No se seleccionaron archivos de audio válidos.');
      }
    },

    // Cargar la canción seleccionada
    loadAudio() {
      if (this.audioFiles.length > 0) {
        this.audioUrl = URL.createObjectURL(this.audioFiles[this.currentTrackIndex]);
        this.fileName = this.audioFiles[this.currentTrackIndex].name;
        this.playAudio(); // Reproducir la canción cargada
      }
    },

    // Reproducir la canción
    playAudio() {
      const audio = this.$refs.audio;
      if (audio) {
        audio.play().then(() => {
          this.isPlaying = true;
        }).catch(error => {
          console.error('Error al intentar reproducir la canción:', error);
        });
      }
    },

    // Función para avanzar a la siguiente canción
    playNextTrack() {
      if (this.shuffle) {
        // Aleatorio
        this.currentTrackIndex = Math.floor(Math.random() * this.audioFiles.length);
      } else {
        // Secuencial
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.audioFiles.length;
      }

      this.loadAudio(); // Cargar la siguiente canción y reproducirla
    },

    // Función para volver a la canción anterior
    goToPrevTrack() {
      if (this.shuffle) {
        this.currentTrackIndex = Math.floor(Math.random() * this.audioFiles.length); // Aleatorio
      } else {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.audioFiles.length) % this.audioFiles.length; // Anterior
      }

      this.loadAudio(); // Cargar la canción anterior y reproducirla
    },

    // Activar o desactivar aleatorio
    toggleShuffle() {
      this.shuffle = !this.shuffle;
      this.repeat = false; // Desactivar repetición cuando aleatorio está activado
    },

    // Activar o desactivar repetición
    toggleRepeat() {
      this.repeat = !this.repeat;
    },

    // Llamar cuando la canción termina
    onAudioEnded() {
      if (!this.repeat) {
        this.playNextTrack();  // Pasar a la siguiente canción automáticamente
      } else {
        // Si la repetición está activada, simplemente reproducimos la misma canción
        this.loadAudio(); // Recargar y reproducir la misma canción
      }
    },

    // Seleccionar una canción de la lista
    selectTrack(index) {
      this.currentTrackIndex = index;
      this.loadAudio(); // Cargar la canción seleccionada
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.player {
  margin: 20px;
}

.controls button {
  margin: 10px;
}

audio {
  width: 100%;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 5px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

li:hover {
  background-color: #f0f0f0;
}
</style>
