<template>
  <div id="app">
    <div class="player">
      <h1 class="title">Reproductor de Música</h1>

      <!-- Selector de archivos múltiples para cargar música -->
      <input type="file" @change="onFilesSelected" accept="audio/*" multiple class="file-input" />

      <div v-if="audioUrl" class="audio-player">
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
          <div class="main-controls">
            <button class="control-btn prev" @click="goToPrevTrack">Anterior</button>
            <button class="control-btn next" @click="playNextTrack">Siguiente</button>
          </div>

          <div class="toggle-controls">
            <button class="control-btn shuffle" @click="toggleShuffle">{{ shuffle ? 'Desactivar Aleatorio' : 'Activar Aleatorio' }}</button>
            <button class="control-btn repeat" @click="toggleRepeat">{{ repeat ? 'Desactivar Repetir' : 'Activar Repetir' }}</button>
          </div>
        </div>

        <p v-if="isPlaying" class="current-track">Reproduciendo: {{ fileName }}</p>
      </div>

      <!-- Lista de archivos seleccionados -->
      <div v-if="fileNames.length > 0" class="file-list">
        <h3 class="list-title">Archivos Seleccionados:</h3>
        <ul>
          <li v-for="(file, index) in fileNames" :key="index" @click="selectTrack(index)" class="file-item">
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
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #f0f4f8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.player {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 650px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 2.4em;
  margin-bottom: 20px;
  color: #34495e;
}

.file-input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 80%;
  margin-bottom: 30px;
  background-color: #ecf0f1;
  font-size: 1em;
}

.audio-player {
  margin-top: 30px;
}

audio {
  width: 100%;
  border-radius: 10px;
  margin-top: 20px;
}

.controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
}

.main-controls {
  display: flex;
  justify-content: center;
}

.control-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.toggle-controls {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.shuffle {
  background-color: #2ecc71;
}

.shuffle:hover {
  background-color: #27ae60;
}

.repeat {
  background-color: #f39c12;
}

.repeat:hover {
  background-color: #e67e22;
}

.current-track {
  margin-top: 20px;
  font-size: 1.2em;
  color: #7f8c8d;
}

.file-list {
  margin-top: 30px;
  text-align: left;
}

.list-title {
  font-size: 1.4em;
  margin-bottom: 15px;
  color: #34495e;
}

ul {
  padding: 0;
  list-style-type: none;
}

.file-item {
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #ecf0f1;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1em;
}

.file-item:hover {
  background-color: #bdc3c7;
  transform: translateY(-2px);
}
</style>





