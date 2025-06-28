'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Script from 'next/script';
import { FaTimes, FaUserCircle, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    SpeechSDK: any;
  }
}

interface AvatarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

// Azure configuration from environment variables
const AZURE_KEY = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
const AZURE_REGION = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '';

// Azure OpenAI configuration from environment variables
const AZURE_OPENAI_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || '';
const AZURE_OPENAI_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY || '';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AvatarOverlay({ isOpen, onClose, isDarkMode }: AvatarOverlayProps) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'avatar' | 'chat'>('avatar');
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mediaEnabled, setMediaEnabled] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  
  // Add debug logging function
  const addDebugLog = useCallback((message: string) => {
    console.log(message);
    if (isMobile) {
      setDebugLogs(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${message}`]);
    }
  }, [isMobile]);
  
  const avatarSynthesizerRef = useRef<any>(null);
  const peerConnectionRef = useRef<any>(null);
  const recognizerRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentSpeakingTaskRef = useRef<any>(null);

  const cleanup = useCallback(() => {
    console.log('Cleaning up avatar session...');
    if (avatarSynthesizerRef.current) {
      avatarSynthesizerRef.current.close();
      avatarSynthesizerRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
      recognizerRef.current.close();
      recognizerRef.current = null;
    }
    setSessionStarted(false);
    setSpeaking(false);
    setError('');
    setIsConnecting(false);
    setIsListening(false);
    setConnectionAttempts(0);
    // Clear mobile flags on cleanup
    if (isMobile) {
      localStorage.removeItem('avatarMobileFailed');
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    // Check if mobile
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      console.log('Mobile detection:', isMobileDevice, 'Width:', window.innerWidth, 'UserAgent:', navigator.userAgent);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
    }
  }, [isOpen, cleanup]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current && activeTab === 'chat') {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, activeTab]);

  // Generate AI response using Azure OpenAI
  const generateResponse = useCallback(async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(AZURE_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_OPENAI_KEY
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a friendly Chunn Thai Rep at Chunn Thai Cuisine, a Thai restaurant opening on August 1st, 2025 at Shop 21, HomeCo Menai Marketplace, 152-194 Allison Crescent, Menai NSW 2234.

IMPORTANT: 
- We are still finalizing our offerings for the grand opening
- We will serve authentic Thai cuisine with fresh ingredients
- Traditional Thai flavors with modern presentation

HOURS: Sun-Thu 11:30am-9pm, Fri-Sat 11:30am-9:30pm
CONTACT: 0432 506 436, cuisine@chunnthai.com.au`
            },
            ...chatHistory.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        throw new Error(`Azure OpenAI error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Azure OpenAI:', error);
      // Fallback to basic responses if API fails
      const lowerMessage = userMessage.toLowerCase();
      
      // Food-related responses
      if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('dish')) {
        return "We're still finalizing our offerings for our grand opening in August 2025. We'll be serving authentic Thai cuisine prepared with fresh ingredients and traditional recipes. Stay tuned for more details!";
      }
      
      // Hours/opening related
      if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close') || lowerMessage.includes('when')) {
      return "We're open Sunday to Thursday from 11:30am to 9:00pm, and Friday to Saturday from 11:30am to 9:30pm. We're opening in August 2025 at HomeCo Menai Marketplace!";
    }
    
    // Location/address related
    if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('find')) {
      return "You'll find us at Shop 21, HomeCo Menai Marketplace, 152-194 Allison Crescent, Menai NSW 2234. We're easily accessible with plenty of parking available.";
    }
    
    // Price related
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive') || lowerMessage.includes('cheap')) {
      return "We're still finalizing our pricing for the grand opening in August 2025. We'll offer authentic Thai cuisine at competitive prices with options for every budget!";
    }
    
    // Booking/reservation related
    if (lowerMessage.includes('book') || lowerMessage.includes('reserv')) {
      return "We're not taking bookings yet as we open in August 2025. Once we're open, you'll be able to call us on 0432 506 436 to make a reservation.";
    }
    
    // Dietary requirements
    if (lowerMessage.includes('vegan') || lowerMessage.includes('vegetarian') || lowerMessage.includes('gluten') || lowerMessage.includes('allerg')) {
      return "We cater to various dietary requirements including vegetarian, vegan, and gluten-free options. Please let us know about any allergies when ordering, and we'll be happy to accommodate your needs.";
    }
    
    // Contact related
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
      return "You can reach us at 0432 506 436 or email us at cuisine@chunnthai.com.au. We're also on Facebook and Instagram @chunn_thai!";
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to Chunn Thai Cuisine. How can I help you today? Feel free to ask about our location, opening hours, or anything else!";
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! Is there anything else you'd like to know about Chunn Thai Cuisine?";
    }
    
      // Default response
      return "I'd be happy to tell you about our authentic Thai cuisine, our location in Menai Marketplace, or our opening in August 2025. What would you like to know?";
    }
  }, [chatHistory]);

  // Stop any ongoing speech
  const stopSpeaking = useCallback(() => {
    if (avatarSynthesizerRef.current) {
      console.log('Stopping current speech...');
      try {
        avatarSynthesizerRef.current.stopSpeakingAsync();
      } catch (err) {
        console.error('Error stopping speech:', err);
      }
      setSpeaking(false);
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    console.log('=== SPEAK FUNCTION CALLED ===');
    console.log('Text to speak:', text);
    console.log('Avatar synthesizer exists:', !!avatarSynthesizerRef.current);
    
    if (!avatarSynthesizerRef.current) {
      console.error('No avatar synthesizer available');
      return;
    }
    
    if (!text || !text.trim()) {
      console.error('No text to speak');
      return;
    }

    try {
      setSpeaking(true);
      console.log('Starting speech synthesis for:', text);

      // Unmute all audio elements
      const avatarContainer = document.getElementById('avatarVideo');
      if (avatarContainer) {
        const allAudioElements = avatarContainer.querySelectorAll('audio');
        allAudioElements.forEach((audio: HTMLAudioElement, index) => {
          console.log(`Unmuting audio element ${index + 1}/${allAudioElements.length}`);
          audio.muted = false;
          audio.volume = 1.0;
          // Force play if paused
          if (audio.paused) {
            audio.play().catch(e => console.log('Audio play failed:', e));
          }
        });
        
        // Also check for video elements that might contain audio
        const videoElements = avatarContainer.querySelectorAll('video');
        videoElements.forEach((video: HTMLVideoElement, index) => {
          console.log(`Checking video element ${index + 1}/${videoElements.length} for audio`);
          video.muted = false;
          video.volume = 1.0;
        });
      }

      const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-AU">
        <voice name="en-AU-AnnetteNeural">
          <mstts:express-as style="friendly">
            ${text.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`)}
          </mstts:express-as>
        </voice>
      </speak>`;

      // Store the current speaking task
      const speakTask = avatarSynthesizerRef.current.speakTextAsync(
        text,
        (result: any) => {
          console.log('SpeakTextAsync completed:', result);
          setSpeaking(false);
          // Ensure audio is unmuted after speaking starts
          setTimeout(() => {
            const avatarDiv = document.getElementById('avatarVideo');
            if (avatarDiv) {
              const mediaElements = avatarDiv.querySelectorAll('audio, video');
              mediaElements.forEach((elem) => {
                const media = elem as HTMLMediaElement;
                console.log(`Media element muted state: ${media.muted}, volume: ${media.volume}`);
                media.muted = false;
                media.volume = 1.0;
                if (media.paused && media.tagName === 'AUDIO') {
                  media.play().catch(e => console.log('Audio play failed:', e));
                }
              });
            }
          }, 100);
        },
        (error: any) => {
          console.error('SpeakTextAsync error:', error);
          setSpeaking(false);
        }
      );
      
      // Store reference to current speaking task
      currentSpeakingTaskRef.current = speakTask;
    } catch (err: any) {
      console.error('Speech error:', err);
      setError('Failed to speak. Please try again.');
      setSpeaking(false);
    }
  }, []);

  // Process user message and generate response
  const processMessage = useCallback(async (userMessage: string) => {
    console.log('=== PROCESS MESSAGE CALLED ===');
    console.log('User message:', userMessage);
    
    if (!userMessage.trim()) {
      console.log('Returning early - no message');
      return;
    }

    // Stop any ongoing speech
    stopSpeaking();

    // Always clear the input immediately
    setMessage('');

    try {
      // Add user message to chat history
      const userMsg: ChatMessage = {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, userMsg]);

      // Generate AI response
      const response = await generateResponse(userMessage);
      
      if (response) {
        // Add assistant response to chat history
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, assistantMsg]);

        // Speak the response (non-blocking)
        console.log('ProcessMessage: About to speak response:', response);
        console.log('ProcessMessage: avatarSynthesizerRef.current exists:', !!avatarSynthesizerRef.current);
        console.log('ProcessMessage: sessionStarted:', sessionStarted);
        
        // Don't await the speak function - let it run in background
        // Try to speak regardless of session state for voice responses
        if (avatarSynthesizerRef.current) {
          console.log('ProcessMessage: Calling speak function (session:', sessionStarted, ')');
          speak(response).catch(err => {
            console.error('ProcessMessage: Speak error:', err);
          });
        } else {
          console.warn('ProcessMessage: NOT speaking - no avatar synthesizer available');
        }
      }
    } catch (error) {
      console.error('Error in processMessage:', error);
      
      // Add error message to chat
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    }
  }, [generateResponse, speak, sessionStarted, stopSpeaking]);

  // Setup speech recognition
  const setupSpeechRecognition = useCallback(() => {
    if (!window.SpeechSDK || recognizerRef.current) return;

    try {
      console.log('Setting up speech recognition...');
      
      const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(
        AZURE_KEY,
        AZURE_REGION
      );
      
      // Set language to Australian English
      speechConfig.speechRecognitionLanguage = 'en-AU';
      
      const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      
      recognizer.recognizing = (s: any, e: any) => {
        console.log('Recognizing:', e.result.text);
        if (e.result.text) {
          setMessage(e.result.text);
        }
      };
      
      recognizer.recognized = (s: any, e: any) => {
        if (e.result.reason === window.SpeechSDK.ResultReason.RecognizedSpeech) {
          console.log('Recognized:', e.result.text);
          if (e.result.text) {
            // Stop listening after user finishes speaking
            recognizer.stopContinuousRecognitionAsync();
            setIsListening(false);
            processMessage(e.result.text);
          }
        }
      };
      
      recognizer.canceled = (s: any, e: any) => {
        console.log('Recognition canceled:', e.reason, e.errorDetails);
        setIsListening(false);
        if (e.reason === window.SpeechSDK.CancellationReason.Error) {
          console.error('Recognition error details:', e.errorDetails);
          setError('Voice recognition error. Please check microphone permissions.');
        }
      };
      
      recognizer.sessionStarted = (s: any, e: any) => {
        console.log('Speech recognition session started');
      };
      
      recognizer.sessionStopped = (s: any, e: any) => {
        console.log('Speech recognition session stopped');
      };
      
      recognizerRef.current = recognizer;
      console.log('Speech recognition setup complete');
    } catch (err) {
      console.error('Failed to setup speech recognition:', err);
      setError('Voice activation unavailable');
    }
  }, [processMessage]);

  // Toggle voice recognition
  const toggleVoiceRecognition = useCallback(async () => {
    // Wait for session to start if it hasn't already
    if (!sessionStarted) {
      console.log('Session not started yet, please wait...');
      setError('Please wait for the assistant to connect.');
      return;
    }

    if (!recognizerRef.current) {
      console.log('Speech recognizer not initialized, setting up...');
      setupSpeechRecognition();
      // Wait a bit for setup to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!recognizerRef.current) {
        console.error('Failed to initialize speech recognizer');
        setError('Voice recognition not available. Please try again.');
        return;
      }
    }
    
    if (isListening) {
      console.log('Stopping voice recognition...');
      try {
        await new Promise((resolve, reject) => {
          recognizerRef.current.stopContinuousRecognitionAsync(
            () => {
              console.log('Voice recognition stopped successfully');
              resolve(undefined);
            },
            (err: any) => {
              console.error('Error stopping recognition:', err);
              reject(err);
            }
          );
        });
        setIsListening(false);
      } catch (err) {
        console.error('Failed to stop recognition:', err);
        setIsListening(false);
      }
    } else {
      console.log('Starting voice recognition...');
      setMessage('');
      setError('');
      
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        await new Promise((resolve, reject) => {
          recognizerRef.current.startContinuousRecognitionAsync(
            () => {
              console.log('Voice recognition started successfully');
              resolve(undefined);
            },
            (err: any) => {
              console.error('Error starting recognition:', err);
              reject(err);
            }
          );
        });
        setIsListening(true);
      } catch (err: any) {
        console.error('Failed to start recognition:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Microphone access denied. Please allow microphone access.');
        } else {
          setError('Failed to start voice recognition. Please try again.');
        }
      }
    }
  }, [isListening, sessionStarted, setupSpeechRecognition, isConnecting]);

  // Test basic WebRTC capabilities
  const testWebRTC = useCallback(async () => {
    console.log('=== TESTING WEBRTC CAPABILITIES ===');
    try {
      // Test 1: Can create peer connection
      const testPc = new RTCPeerConnection();
      console.log('✓ Can create RTCPeerConnection');
      
      // Test 2: Can add transceiver
      testPc.addTransceiver('video', { direction: 'recvonly' });
      console.log('✓ Can add video transceiver');
      
      // Test 3: Can create offer
      const offer = await testPc.createOffer();
      console.log('✓ Can create offer');
      console.log('- Offer type:', offer.type);
      console.log('- SDP length:', offer.sdp?.length);
      
      testPc.close();
      return true;
    } catch (error) {
      console.error('✗ WebRTC test failed:', error);
      return false;
    }
  }, []);

  const setupWebRTC = useCallback(async (iceServerUrl: string, iceServerUsername: string, iceServerCredential: string) => {
    console.log('=== SETUP WEBRTC CALLED ===');
    console.log('Step 8.1: Checking prerequisites');
    
    if (!window.SpeechSDK || !avatarSynthesizerRef.current) {
      console.error('Step 8.1 FAILED: SpeechSDK or avatar synthesizer not ready');
      console.error('- SpeechSDK available:', !!window.SpeechSDK);
      console.error('- Avatar synthesizer available:', !!avatarSynthesizerRef.current);
      return;
    }
    console.log('Step 8.1 SUCCESS: Prerequisites met');

    // Test basic WebRTC first
    if (isMobile) {
      const webrtcOk = await testWebRTC();
      if (!webrtcOk) {
        throw new Error('WebRTC compatibility test failed');
      }
    }

    try {
      console.log('Step 8.2: Configuring WebRTC');
      console.log('- Device type:', isMobile ? 'Mobile' : 'Desktop');
      console.log('- ICE Server URL:', iceServerUrl);
      console.log('- ICE Server type:', iceServerUrl.includes('turn:') ? 'TURN' : 'STUN');
      
      // Enhanced configuration for mobile
      const pcConfig: RTCConfiguration = {
        iceServers: [{
          urls: [iceServerUrl],
          username: iceServerUsername,
          credential: iceServerCredential
        }],
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
        iceCandidatePoolSize: 10
      };
      
      if (isMobile) {
        console.log('- Applying mobile-specific WebRTC optimizations');
        // Mobile optimizations
        pcConfig.iceTransportPolicy = 'all';
        // Try simplified config for mobile
        pcConfig.bundlePolicy = 'balanced'; // Less aggressive bundling
        pcConfig.iceCandidatePoolSize = 0; // Disable candidate pooling
        
        // Add TURN server support for mobile
        pcConfig.iceServers = [
          {
            urls: [iceServerUrl],
            username: iceServerUsername,
            credential: iceServerCredential
          }
        ];
        // Only add STUN as fallback if main server is not TURN
        if (!iceServerUrl.includes('turn:')) {
          pcConfig.iceServers.push({ urls: 'stun:stun.l.google.com:19302' });
        }
        console.log('- Mobile ICE servers configured:', pcConfig.iceServers.length);
      }
      
      const pc = new RTCPeerConnection(pcConfig);

      // Handle incoming media tracks
      pc.ontrack = (event: RTCTrackEvent) => {
        console.log('Received track:', event.track.kind);
        
        const remoteVideoDiv = document.getElementById('avatarVideo');
        if (!remoteVideoDiv) {
          console.error('Video container not found');
          return;
        }

        // Remove existing media elements of the same type
        const existingElement = remoteVideoDiv.querySelector(event.track.kind);
        if (existingElement) {
          existingElement.remove();
        }

        const mediaElement = document.createElement(event.track.kind) as HTMLMediaElement;
        mediaElement.id = event.track.kind;
        mediaElement.srcObject = event.streams[0];
        mediaElement.autoplay = true;
        
        if (event.track.kind === 'video') {
          (mediaElement as HTMLVideoElement).playsInline = true;
          mediaElement.style.width = '100%';
          mediaElement.style.height = '100%';
          mediaElement.style.objectFit = isMobile ? 'contain' : 'cover';
          
          // Mobile video attributes
          mediaElement.setAttribute('playsinline', 'true');
          mediaElement.setAttribute('webkit-playsinline', 'true');
          mediaElement.setAttribute('x5-playsinline', 'true');
          
          if (isMobile) {
            mediaElement.setAttribute('x5-video-player-type', 'h5');
            mediaElement.setAttribute('x5-video-player-fullscreen', 'false');
            // Video muted on mobile for autoplay
            mediaElement.muted = true;
          }
        } else if (event.track.kind === 'audio') {
          console.log('Audio track added');
          mediaElement.volume = 1.0;
          // Don't mute audio by default - let user interaction handle it
          mediaElement.muted = false;
        }
        
        remoteVideoDiv.appendChild(mediaElement);
        
        // Try to play after a short delay
        setTimeout(() => {
          if (mediaElement && mediaElement.paused) {
            mediaElement.play().catch(e => {
              console.log(`Failed to autoplay ${event.track.kind}:`, e);
              if (isMobile) {
                console.log('Mobile autoplay blocked - user interaction required');
              }
            });
          }
        }, 100);
      };

      // Monitor connection state
      pc.oniceconnectionstatechange = () => {
        console.log('ICE Connection State:', pc.iceConnectionState);
        
        if (pc.iceConnectionState === 'connected') {
          console.log('WebRTC connected successfully');
          setSessionStarted(true);
          setIsConnecting(false);
          
          // Setup speech recognition
          setupSpeechRecognition();
        } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
          console.error('WebRTC connection failed');
          setSessionStarted(false);
          setSpeaking(false);
          setIsConnecting(false);
          
          if (isMobile) {
            setError('Connection failed. Please check your internet and try again.');
          } else {
            setError('Connection lost. Please try again.');
          }
        } else if (pc.iceConnectionState === 'checking') {
          console.log('WebRTC connection checking...');
        } else if (pc.iceConnectionState === 'new') {
          console.log('WebRTC connection new state');
        }
      };
      
      // Add ICE candidate logging for debugging
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('ICE candidate:', event.candidate.type, event.candidate.address);
        } else {
          console.log('ICE gathering complete');
        }
      };
      
      // Connection state monitoring
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
      };

      // Store peer connection reference
      peerConnectionRef.current = pc;

      // Add transceivers - use different direction for mobile
      if (isMobile) {
        console.log('- Adding mobile transceivers (recvonly)');
        pc.addTransceiver('video', { direction: 'recvonly' });
        pc.addTransceiver('audio', { direction: 'recvonly' });
      } else {
        console.log('- Adding desktop transceivers (sendrecv)');
        pc.addTransceiver('video', { direction: 'sendrecv' });
        pc.addTransceiver('audio', { direction: 'sendrecv' });
      }

      console.log('Step 8.3: Starting avatar with WebRTC');
      console.log('- Transceivers added');
      console.log('- Peer connection state:', pc.connectionState);
      console.log('- Signaling state:', pc.signalingState);
      
      // Add timeout for mobile
      const avatarStartPromise = new Promise((resolve, reject) => {
        console.log('Step 8.4: Calling startAvatarAsync');
        const startTime = Date.now();
        
        avatarSynthesizerRef.current.startAvatarAsync(
          pc,
          (result: any) => {
            const duration = Date.now() - startTime;
            console.log(`Step 8.4 SUCCESS: Avatar started in ${duration}ms`);
            console.log('- Result:', result);
            console.log('- Result reason:', result.reason);
            console.log('- Result properties:', Object.keys(result));
            resolve(result);
          },
          (error: any) => {
            const duration = Date.now() - startTime;
            console.error(`Step 8.4 FAILED: Avatar start failed after ${duration}ms`);
            console.error('- Error:', error);
            console.error('- Error type:', error.constructor.name);
            console.error('- Error string:', error.toString());
            console.error('- Error properties:', Object.keys(error));
            reject(error);
          }
        );
      });
      
      if (isMobile) {
        console.log('Step 8.5: Mobile timeout monitoring (25 seconds)');
        // Add timeout for mobile connections
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => {
            console.log('Step 8.5 TIMEOUT: Avatar start exceeded 25 seconds on mobile');
            reject(new Error('Avatar start timeout'));
          }, 25000)
        );
        
        await Promise.race([avatarStartPromise, timeoutPromise]);
      } else {
        await avatarStartPromise;
      }
      console.log('Step 8 SUCCESS: WebRTC setup complete');
    } catch (err: any) {
      console.error('WebRTC setup error:', err);
      console.error('Error stack:', err.stack);
      
      if (err.message === 'Avatar start timeout') {
        setError('Connection timeout. Please try again.');
      } else if (isMobile) {
        setError('Unable to connect on mobile. Please check your connection.');
      } else {
        setError('Failed to connect. Please try again.');
      }
      
      setIsConnecting(false);
      cleanup();
    }
  }, [cleanup, speak, setupSpeechRecognition, isMobile, testWebRTC]);

  const startSession = useCallback(async () => {
    console.log('=== START SESSION CALLED ===');
    console.log('Step 1: Checking prerequisites');
    
    if (!window.SpeechSDK) {
      console.error('Step 1 FAILED: SpeechSDK not loaded');
      setError('Loading... Please wait.');
      return;
    }
    console.log('Step 1 SUCCESS: SpeechSDK is loaded');

    if (isConnecting || sessionStarted) {
      console.log('Step 1 SKIPPED: Session already starting or started');
      return;
    }
    
    // Check WebRTC support
    console.log('Step 2: Checking WebRTC support');
    if (!window.RTCPeerConnection) {
      console.error('Step 2 FAILED: WebRTC not supported on this browser');
      setError('Video calls not supported on this browser');
      setIsConnecting(false);
      return;
    }
    console.log('Step 2 SUCCESS: WebRTC is supported');

    setError('');
    setIsConnecting(true);
    
    try {
      console.log('Step 3: Creating speech config');
      console.log('- Region:', AZURE_REGION);
      console.log('- Is mobile device:', isMobile);
      console.log('- User Agent:', navigator.userAgent);
      console.log('- SDK Version:', window.SpeechSDK?.Version || 'Unknown');
      console.log('- Browser:', navigator.vendor, navigator.platform);
      
      // Create speech configuration
      const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(
        AZURE_KEY,
        AZURE_REGION
      );
      console.log('Step 3 SUCCESS: Speech config created');

      // Configure avatar
      console.log('Step 4: Creating avatar configuration');
      let videoFormat;
      
      if (isMobile) {
        console.log('- Creating mobile-optimized video format');
        videoFormat = new window.SpeechSDK.AvatarVideoFormat();
        // Try to set mobile-friendly properties if available
        if (videoFormat.setWidth && videoFormat.setHeight) {
          videoFormat.setWidth(320);
          videoFormat.setHeight(480);
          console.log('- Mobile video format: 320x480');
        }
      } else {
        videoFormat = new window.SpeechSDK.AvatarVideoFormat();
        console.log('- Desktop video format: default');
      }
      
      const avatarConfig = new window.SpeechSDK.AvatarConfig(
        'meg',
        'formal',
        videoFormat
      );
      console.log('- Avatar config created with character: meg, style: formal');
      
      // Use background color matching the website
      avatarConfig.backgroundColor = isDarkMode ? '#18181bFF' : '#fff7edFF';
      console.log('- Background color set');
      console.log('Step 4 SUCCESS: Avatar configuration complete');

      console.log('Step 5: Creating avatar synthesizer');
      let synthesizer;
      try {
        synthesizer = new window.SpeechSDK.AvatarSynthesizer(speechConfig, avatarConfig);
        avatarSynthesizerRef.current = synthesizer;
        console.log('Step 5 SUCCESS: Avatar synthesizer created');
      } catch (synthError: any) {
        console.error('Step 5 FAILED: Avatar synthesizer creation error');
        console.error('- Error type:', synthError?.name);
        console.error('- Error message:', synthError?.message);
        console.error('- Error stack:', synthError?.stack);
        throw new Error(`Avatar initialization failed: ${synthError?.message || 'Unknown error'}`);
      }

      // Add event handlers
      synthesizer.avatarEventReceived = function (s: any, e: any) {
        console.log('Avatar event:', e.description);
      };

      // Add more detailed event handlers
      synthesizer.synthesizing = function (s: any, e: any) {
        console.log('Synthesizing audio...', e);
        // Force unmute during synthesis
        const avatarDiv = document.getElementById('avatarVideo');
        if (avatarDiv) {
          const audios = avatarDiv.querySelectorAll('audio');
          audios.forEach((audio: HTMLAudioElement) => {
            if (audio.muted) {
              console.log('Unmuting audio during synthesis');
              audio.muted = false;
              audio.volume = 1.0;
            }
          });
        }
      };

      synthesizer.synthesisCompleted = function (s: any, e: any) {
        console.log('Synthesis completed', e);
      };

      synthesizer.synthesisStarted = function (s: any, e: any) {
        console.log('Synthesis started', e);
        // Unmute at synthesis start
        const avatarDiv = document.getElementById('avatarVideo');
        if (avatarDiv) {
          const mediaElements = avatarDiv.querySelectorAll('audio, video');
          mediaElements.forEach((elem) => {
            const media = elem as HTMLMediaElement;
            media.muted = false;
            media.volume = 1.0;
          });
        }
      };

      synthesizer.visemeReceived = function (s: any, e: any) {
        // Don't log every viseme as it's too verbose
        // console.log('Viseme received:', e.visemeId);
      };

      // Get ICE server credentials
      console.log('Step 6: Fetching ICE token');
      const tokenUrl = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`;
      console.log('- Token URL:', tokenUrl);
      console.log('- Timeout:', isMobile ? '20 seconds (mobile)' : '10 seconds (desktop)');
      
      // Add timeout for mobile connections
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Step 6 TIMEOUT: ICE token fetch exceeded time limit');
        controller.abort();
      }, isMobile ? 20000 : 10000);
      
      let response;
      try {
        const fetchStart = Date.now();
        response = await fetch(tokenUrl, {
          method: 'GET',
          headers: {
            'Ocp-Apim-Subscription-Key': AZURE_KEY
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const fetchTime = Date.now() - fetchStart;
        console.log(`- Fetch completed in ${fetchTime}ms`);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        console.error('Step 6 FAILED: ICE token fetch error');
        console.error('- Error type:', fetchError?.name);
        console.error('- Error message:', fetchError?.message);
        throw new Error(`Failed to fetch ICE token: ${fetchError?.message || 'Network error'}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Step 6 FAILED: Token fetch HTTP error');
        console.error('- Status:', response.status);
        console.error('- Error text:', errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Azure subscription.');
        } else if (response.status === 403) {
          throw new Error('Avatar service not enabled for this subscription.');
        } else {
          throw new Error(`Authentication failed: ${response.status}`);
        }
      }
      console.log('Step 6 SUCCESS: ICE token response received');

      console.log('Step 7: Parsing ICE token');
      let iceToken;
      try {
        iceToken = await response.json();
        console.log('- ICE token parsed successfully');
        console.log('- Token structure:', {
          hasUrls: !!iceToken?.Urls,
          urlCount: iceToken?.Urls?.length || 0,
          hasUsername: !!iceToken?.Username,
          hasPassword: !!iceToken?.Password
        });
      } catch (parseError) {
        console.error('Step 7 FAILED: ICE token parse error');
        console.error('- Parse error:', parseError);
        const responseText = await response.text();
        console.error('- Response text:', responseText);
        throw new Error('Invalid ICE token response');
      }
      
      if (!iceToken || !iceToken.Urls || !iceToken.Urls[0]) {
        console.error('Step 7 FAILED: Invalid ICE token structure');
        console.error('- Token:', iceToken);
        throw new Error('Invalid ICE server configuration');
      }
      console.log('Step 7 SUCCESS: ICE token validated');
      
      // Setup WebRTC with ICE servers
      console.log('Step 8: Setting up WebRTC connection');
      await setupWebRTC(iceToken.Urls[0], iceToken.Username, iceToken.Password);

    } catch (err: any) {
      console.error('Session start error:', err);
      console.error('Error stack:', err.stack);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      if (err.name === 'AbortError' || err.message?.includes('timeout')) {
        setError('Connection timeout. Please check your internet and try again.');
      } else if (err.message?.includes('ICE')) {
        setError('Network configuration error. Please try again.');
      } else if (err.message?.includes('Avatar initialization')) {
        setError('Avatar service unavailable. Please try again later.');
      } else {
        setError(err.message || 'Unable to connect. Please try again.');
      }
      
      setIsConnecting(false);
      cleanup();
      
      // Auto-retry on mobile with limited attempts
      if (isMobile && connectionAttempts < 2) {
        setConnectionAttempts(prev => prev + 1);
        setTimeout(() => {
          console.log('Retrying connection on mobile...');
          startSession();
        }, 3000);
      } else if (isMobile && connectionAttempts >= 2) {
        // Show error after retries
        console.log('Mobile connection failed after retries');
        localStorage.setItem('avatarMobileFailed', 'true');
        setError('Unable to connect. Use Chat Tab.');
        setIsConnecting(false);
      }
    }
  }, [isConnecting, sessionStarted, setupWebRTC, cleanup, isDarkMode, isMobile, connectionAttempts]);

  // Auto-start session when overlay opens and SDK is loaded
  useEffect(() => {
    if (isOpen && sdkLoaded && !sessionStarted && !avatarSynthesizerRef.current && !isConnecting) {
      console.log('Avatar overlay opened');
      console.log('Current state - isOpen:', isOpen, 'sdkLoaded:', sdkLoaded, 'isMobile:', isMobile);
      // Reset connection attempts when opening
      setConnectionAttempts(0);
      
      // Auto-start for both mobile and desktop
      console.log(`${isMobile ? 'Mobile' : 'Desktop'} - auto-starting avatar session...`);
      startSession();
    }
  }, [isOpen, sdkLoaded, sessionStarted, isConnecting, startSession, isMobile]);

  if (!isMounted) return null;

  return (
    <>
      <Script 
        src="https://aka.ms/csspeech/jsbrowserpackageraw"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Azure Speech SDK loaded successfully');
          console.log('SDK available:', !!window.SpeechSDK);
          setSdkLoaded(true);
        }}
        onError={(e) => {
          console.error('Failed to load Azure Speech SDK:', e);
          setError('Failed to load assistant.');
        }}
      />
      
      {/* Mobile viewport fix */}
      {isMobile && isMounted && (
        <style jsx global>{`
          .pb-safe {
            padding-bottom: env(safe-area-inset-bottom, 0);
          }
        `}</style>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed z-50 ${isDarkMode ? 'bg-zinc-900/95 backdrop-blur-xl' : 'bg-orange-50/95 backdrop-blur-xl'} shadow-2xl overflow-hidden border ${isDarkMode ? 'border-zinc-700/50' : 'border-orange-200/50'} flex flex-col ${isMobile ? 'touch-manipulation' : ''} ${
              isMobile 
                ? 'bottom-0 left-0 right-0 top-0 rounded-none w-full h-full'
                : 'bottom-4 right-4 rounded-2xl w-[380px] h-[480px]'
            }`}
            style={isMobile ? {
              height: '100dvh', // Dynamic viewport height for mobile
              maxHeight: '-webkit-fill-available'
            } : {}}
          >
            {/* Tabs with close button */}
            <div className={`flex items-center border-b ${isDarkMode ? 'bg-zinc-800/50 border-zinc-700/50' : 'bg-white/50 border-orange-200/50'} backdrop-blur-sm px-2 py-1`}>
              <button
                onClick={() => setActiveTab('avatar')}
                className={`flex-1 py-2 px-4 mx-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'avatar'
                    ? isDarkMode
                      ? 'bg-orange-500/20 text-orange-400 shadow-sm'
                      : 'bg-orange-500/20 text-orange-700 shadow-sm'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-zinc-700/30'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                Chunn Chat
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-4 mx-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'chat'
                    ? isDarkMode
                      ? 'bg-orange-500/20 text-orange-400 shadow-sm'
                      : 'bg-orange-500/20 text-orange-700 shadow-sm'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-zinc-700/30'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                Chat History
              </button>
              <button
                onClick={onClose}
                className={`p-2 ml-2 mr-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-label="Close assistant"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Content Area */}
            <div className={`relative flex-1 ${isDarkMode ? 'bg-zinc-900/50' : 'bg-orange-50/50'} ${isMobile ? 'min-h-[50vh]' : ''}`}>
              {activeTab === 'avatar' ? (
                <div 
                  id="avatarVideo" 
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer ${isDarkMode ? 'bg-zinc-900' : 'bg-orange-50'} ${isMobile ? 'touch-manipulation' : ''}`}
                  onClick={() => {
                    // Critical for mobile: unmute and play on user interaction
                    const container = document.getElementById('avatarVideo');
                    if (container) {
                      const mediaElements = container.querySelectorAll('audio, video');
                      let hasUnmuted = false;
                      
                      mediaElements.forEach((elem) => {
                        const media = elem as HTMLMediaElement;
                        if (media.muted || media.paused) {
                          console.log(`Unmuting/playing ${media.tagName} on user interaction`);
                          media.muted = false;
                          media.volume = 1.0;
                          
                          // Force play with promise handling
                          const playPromise = media.play();
                          if (playPromise !== undefined) {
                            playPromise
                              .then(() => {
                                console.log(`${media.tagName} playback started successfully`);
                                hasUnmuted = true;
                                setMediaEnabled(true);
                              })
                              .catch(error => {
                                console.error(`${media.tagName} playback failed:`, error);
                                // Try one more time after a delay
                                setTimeout(() => {
                                  media.play().catch(e => console.log('Retry play failed:', e));
                                }, 500);
                              });
                          }
                        }
                      });
                      
                      // Show feedback on mobile
                      if (isMobile && !hasUnmuted) {
                        console.log('Tap registered - attempting to enable audio/video');
                      }
                    }
                    
                    // Try to speak if avatar is ready
                    if (sessionStarted && avatarSynthesizerRef.current && !speaking) {
                      console.log('Click detected, trying to speak...');
                      
                      // If there's a response in chat, speak the last assistant message
                      const lastAssistantMsg = chatHistory.filter(m => m.role === 'assistant').pop();
                      if (lastAssistantMsg) {
                        console.log('Speaking last assistant message:', lastAssistantMsg.content);
                        speak(lastAssistantMsg.content).catch(err => console.error('Manual speak error:', err));
                      }
                    }
                  }}
                >
                  {!sessionStarted && (
                    <div className="text-center">
                      {error ? (
                        <div className="px-4">
                          <FaUserCircle size={isMobile ? 48 : 64} className="text-red-300 mx-auto mb-2" />
                          <p className={`text-red-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>{error}</p>
                          {isMobile && error.includes('Unable to connect') && (
                            <>
                              <p className="text-red-400 text-xs mt-2">
                                Tip: Check your internet connection
                              </p>
                              {connectionAttempts > 0 && (
                                <p className="text-red-400 text-xs mt-1">
                                  Retry attempt {connectionAttempts}/2
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      ) : (isMobile && !sessionStarted) ? (
                        <div className="text-center px-4">
                          <FaUserCircle size={48} className="text-orange-400 mx-auto mb-2" />
                          <p className="text-orange-600 text-sm mb-1">
                            Loading...
                          </p>
                          <p className="text-gray-500 text-xs">
                            Use Chat Tab if video fails.
                          </p>
                        </div>
                      ) : (
                        <div className="animate-pulse">
                          <FaUserCircle size={isMobile ? 48 : 64} className="text-orange-300 mx-auto mb-2" />
                          <p className={`text-orange-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {!sdkLoaded ? 'Loading assistant...' : 
                             isConnecting ? 'Connecting to avatar...' : 
                             'Initializing...'}
                          </p>
                          {isMobile && isConnecting && (
                            <>
                              <p className="text-orange-500 text-xs mt-2">
                                This may take a moment on mobile...
                              </p>
                              <p className="text-orange-400 text-xs mt-1">
                                Make sure you have a stable internet connection
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Mobile play button overlay - show after connection */}
                  {sessionStarted && isMobile && !mediaEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <motion.div 
                        className="bg-orange-500 rounded-full p-6 shadow-lg cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="text-white text-center">
                          <div className="text-4xl mb-2">▶️</div>
                          <p className="text-sm font-medium">Tap to Start</p>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  ref={chatContainerRef}
                  className="absolute inset-0 overflow-y-auto p-4"
                >
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">
                      No conversation history yet. Start chatting!
                    </div>
                  ) : (
                    chatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                      >
                        <div className={`text-xs mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                          {msg.role === 'user' ? 'You' : 'Chunn Thai Rep'}
                        </div>
                        <div
                          className={`inline-block px-4 py-2.5 rounded-2xl max-w-[85%] shadow-sm ${
                            msg.role === 'user'
                              ? isDarkMode
                                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                              : isDarkMode
                              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/50'
                              : 'bg-white text-gray-900 border border-gray-200/50'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {isProcessing && (
                    <div className="text-left mb-3">
                      <div className="text-xs text-gray-500 mb-1">Chunn Thai Rep</div>
                      <div className={`inline-block px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className={`p-4 border-t ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-orange-50 border-orange-200'} ${isMobile ? 'pb-safe' : ''}`}>
              <div className="space-y-3">
                <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
                  <div className={`flex gap-2 ${isMobile ? 'w-full' : 'flex-1'}`}>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && message.trim()) {
                          e.preventDefault();
                          processMessage(message);
                        }
                      }}
                      onFocus={(e) => {
                        // Prevent zoom on iOS
                        if (isMobile) {
                          e.target.style.fontSize = '16px';
                        }
                      }}
                      className={`flex-1 ${isMobile ? 'px-3 py-2' : 'px-4 py-2.5'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700/50' 
                          : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-200 shadow-sm'
                      } ${isMobile ? 'text-base' : ''}`}
                      style={isMobile ? { fontSize: '16px' } : {}}
                      placeholder={isListening ? "Listening..." : "Type your message..."}
                      inputMode="text"
                      autoComplete="off"
                    />
                    <button
                      onClick={toggleVoiceRecognition}
                      disabled={false}
                      className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-xl transition-all duration-200 shadow-sm ${
                        isListening
                          ? 'bg-red-500 hover:bg-red-600 text-white scale-110'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                      }`}
                      aria-label={isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? <FaMicrophoneSlash size={isMobile ? 18 : 20} /> : <FaMicrophone size={isMobile ? 18 : 20} />}
                    </button>
                  </div>
                  <button 
                    onClick={() => processMessage(message)}
                    className={`${isMobile ? 'w-full px-4 py-2' : 'px-5 py-2.5'} rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-sm hover:shadow-md`}
                  >
                    Send
                  </button>
                </div>
                {!sessionStarted && !error && (
                  <p className="text-xs text-gray-500 text-center">
                    {!sdkLoaded ? 'Loading components...' : 
                     isConnecting ? 'Establishing connection...' : 
                     'Please wait...'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}