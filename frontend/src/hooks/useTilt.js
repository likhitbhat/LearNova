import { useCallback, useRef, useState } from 'react';

const MAX_DEG = 8;

// ponytail: no spring library, just linear rotation from cursor offset — good enough for a hover tilt
const useTilt = () => {
    const ref = useRef(null);
    const [style, setStyle] = useState({});

    const onMouseMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setStyle({
            transform: `perspective(800px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) rotateY(${(px * MAX_DEG).toFixed(2)}deg)`,
        });
    }, []);

    const onMouseLeave = useCallback(() => {
        setStyle({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' });
    }, []);

    return { ref, onMouseMove, onMouseLeave, style };
};

export default useTilt;
