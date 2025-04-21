class MicInput {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  /**
   * Request access to the user's microphone
   * @returns Promise that resolves when access is granted
   * @throws Error if access is denied or if the browser doesn't support the required APIs
   */
  async requestAudioInput(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });

      // Initialize audio context and analyzer
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.source = this.audioContext.createMediaStreamSource(this.stream);

      // Configure analyzer
      this.analyser.fftSize = 2048;
      this.analyser.minDecibels = -100;
      this.source.connect(this.analyser);
    } catch (error) {
      throw new Error(
        `Failed to access microphone: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get the current audio stream
   * @returns The MediaStream object if available, null otherwise
   */
  getStream(): MediaStream | null {
    return this.stream;
  }

  /**
   * Get the audio analyzer node
   * @returns The AnalyserNode if available, null otherwise
   */
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  /**
   * Get the current audio context
   * @returns The AudioContext if available, null otherwise
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Clean up resources and stop the audio stream
   */
  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new MicInput();
