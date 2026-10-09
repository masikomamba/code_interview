/**
 * Real-Time Collaborative Code Interview Platform
 * WebRTC Audio/Video & Screen Sharing Peer Manager
 */

class WebRTCManager {
  constructor() {
    this.localVideo = document.getElementById('local-video-element');
    this.remoteVideo = document.getElementById('remote-video-element');
    this.localPlaceholder = document.getElementById('local-video-placeholder');
    this.remotePlaceholder = document.getElementById('remote-video-placeholder');

    this.muteBtn = document.getElementById('toggle-mic-btn');
    this.camBtn = document.getElementById('toggle-cam-btn');
    this.shareBtn = document.getElementById('toggle-share-btn');

    this.localStream = null;
    this.screenStream = null;
    this.peers = new Map(); // targetClientId -> RTCPeerConnection

    this.isAudioMuted = false;
    this.isVideoMuted = false;
    this.isScreenSharing = false;

    this.rtcConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    this.initControls();
    this.initSocketSignaling();
  }

  async startMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 360 } },
        audio: true
      });
      if (this.localVideo) {
        this.localVideo.srcObject = this.localStream;
        this.localPlaceholder.hidden = true;
      }
    } catch (err) {
      console.warn('[WebRTC] Native camera/mic access unavailable, using simulated stream for workstation testing:', err.message);
      this.startSimulatedStream();
    }
  }

  startSimulatedStream() {
    // Generate clean canvas stream for test/offline environments
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(160, 90, 30 + Math.sin(frame * 0.1) * 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Live WebRTC Stream', 160, 140);

      requestAnimationFrame(draw);
    };
    draw();

    this.localStream = canvas.captureStream(25);
    if (this.localVideo) {
      this.localVideo.srcObject = this.localStream;
      this.localPlaceholder.hidden = true;
    }
  }

  initControls() {
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        this.isAudioMuted = !this.isAudioMuted;
        if (this.localStream) {
          this.localStream.getAudioTracks().forEach(t => { t.enabled = !this.isAudioMuted; });
        }
        this.muteBtn.classList.toggle('active-off', this.isAudioMuted);
      });
    }

    if (this.camBtn) {
      this.camBtn.addEventListener('click', () => {
        this.isVideoMuted = !this.isVideoMuted;
        if (this.localStream) {
          this.localStream.getVideoTracks().forEach(t => { t.enabled = !this.isVideoMuted; });
        }
        this.camBtn.classList.toggle('active-off', this.isVideoMuted);
        if (this.localPlaceholder) {
          this.localPlaceholder.hidden = !this.isVideoMuted;
        }
      });
    }

    if (this.shareBtn) {
      this.shareBtn.addEventListener('click', async () => {
        if (!this.isScreenSharing) {
          try {
            this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (this.localVideo) this.localVideo.srcObject = this.screenStream;
            this.isScreenSharing = true;
            this.shareBtn.classList.add('active-off');

            this.screenStream.getVideoTracks()[0].onended = () => {
              this.stopScreenShare();
            };
          } catch (err) {
            console.warn('[WebRTC] Screen share cancelled:', err.message);
          }
        } else {
          this.stopScreenShare();
        }
      });
    }
  }

  stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(t => t.stop());
      this.screenStream = null;
    }
    if (this.localVideo && this.localStream) {
      this.localVideo.srcObject = this.localStream;
    }
    this.isScreenSharing = false;
    if (this.shareBtn) this.shareBtn.classList.remove('active-off');
  }

  initSocketSignaling() {
    window.socketClient.on('PEER_JOINED', (data) => {
      // Initiate WebRTC call if we are the existing peer
      this.callPeer(data.peer.id);
    });

    window.socketClient.on('WEBRTC_SIGNAL', async (data) => {
      const { senderClientId, signal } = data;
      let pc = this.peers.get(senderClientId);

      if (!pc) {
        pc = this.createPeerConnection(senderClientId);
      }

      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        window.socketClient.send('WEBRTC_SIGNAL', {
          targetClientId: senderClientId,
          signal: answer
        });
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (signal.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        } catch (err) {
          console.warn('[WebRTC] Error adding ICE candidate:', err);
        }
      }
    });

    window.socketClient.on('PEER_LEFT', (data) => {
      const pc = this.peers.get(data.clientId);
      if (pc) {
        pc.close();
        this.peers.delete(data.clientId);
      }
      if (this.remotePlaceholder) this.remotePlaceholder.hidden = false;
    });
  }

  createPeerConnection(targetClientId) {
    const pc = new RTCPeerConnection(this.rtcConfig);

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        window.socketClient.send('WEBRTC_SIGNAL', {
          targetClientId,
          signal: { candidate: event.candidate }
        });
      }
    };

    pc.ontrack = (event) => {
      if (this.remoteVideo && event.streams && event.streams[0]) {
        this.remoteVideo.srcObject = event.streams[0];
        if (this.remotePlaceholder) this.remotePlaceholder.hidden = true;
      }
    };

    this.peers.set(targetClientId, pc);
    return pc;
  }

  async callPeer(targetClientId) {
    const pc = this.createPeerConnection(targetClientId);
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      window.socketClient.send('WEBRTC_SIGNAL', {
        targetClientId,
        signal: offer
      });
    } catch (err) {
      console.warn('[WebRTC] Failed to create call offer:', err);
    }
  }
}

window.WebRTCManager = WebRTCManager;
