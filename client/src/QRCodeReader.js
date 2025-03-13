import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import './css/generalstylesheet.css'
const QRScanner = ({ onScan, onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [error, setError] = useState("");
    const [stream, setStream] = useState(null);

    useEffect(() => {
        let animationFrameId;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const getCameraAccess = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });

                setStream(mediaStream); // Store the stream to handle cleanup

                if (video) {
                    video.srcObject = mediaStream;

                    video.onloadedmetadata = () => {
                        video.play().catch((err) => {
                            console.error("Error playing video: ", err);
                        });
                        animationFrameId = requestAnimationFrame(scanQRCode);
                    };
                }
            } catch (err) {
                setError("Camera access denied. Please enable camera permissions.");
            }
        };

        const scanQRCode = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                    onScan(code.data);
                    onClose(); // Close scanner
                }
            }
            animationFrameId = requestAnimationFrame(scanQRCode);
        };

        getCameraAccess();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [onScan, onClose]);

    return (
        <div className="qr-scanner-overlay">
            <video ref={videoRef} className="qr-video" />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {error && <p className="error-message">{error}</p>}
            <button className="close-btn" onClick={onClose}>
                Close
            </button>
        </div>
    );
};

export default QRScanner;
