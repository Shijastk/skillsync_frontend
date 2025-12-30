import React, { useEffect, useRef } from 'react';

export const VoiceWaveform = ({ analyser, isRecording }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef();

    useEffect(() => {
        if (!isRecording || !analyser) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        analyser.fftSize = 128; // Smaller fftSize for more aggressive 'spike' sensitivity
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = 3;
            const gutter = 2;
            const barCount = Math.floor(canvas.width / (barWidth + gutter));
            const step = Math.floor(bufferLength / barCount);

            // Indigo Highlighter Accent
            ctx.fillStyle = '#818cf8';

            for (let i = 0; i < barCount; i++) {
                let sum = 0;
                const windowSize = 2;
                for (let j = 0; j < windowSize; j++) {
                    sum += dataArray[i * step + j] || 0;
                }
                const val = sum / windowSize;

                // Dynamic scaling: min height 3px, max height based on container
                const minHeight = 3;
                const barHeight = Math.max(minHeight, (val / 255) * canvas.height * 1.2);

                const x = i * (barWidth + gutter);
                const y = (canvas.height - barHeight) / 2;

                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, 1.5);
                ctx.fill();
            }
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isRecording, analyser]);

    return (
        <canvas
            ref={canvasRef}
            width={160}
            height={28}
            className="bg-transparent max-w-full h-[28px] block"
        />
    );
};
